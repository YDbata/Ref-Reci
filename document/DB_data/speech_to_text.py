import re
import sys

from google.cloud import speech
import pyaudio
import queue
import time
import threading

RATE = 44100
CHUNK = int(RATE / 10)

class MicrophoneStream(object):
    def __init__(self, rate, chunk):
        self._rate = rate
        self._chunk = chunk

        self._buff = queue.Queue()
        self.closed = True

    def __enter__(self):
        self._audio_interface=pyaudio.PyAudio()
        self._audio_stream = self._audio_interface.open(
                format=pyaudio.paInt16,
                channels=1,
                rate=self._rate,
                input=True,
                frames_per_buffer=self._chunk,
                stream_callback=self._fill_buffer,
            )
        self.closed = False

        return self

    def __exit__(self, type, value, traceback):
        self._audio_stream.stop_stream()
        self._audio_stream.close()
        self.closed=True
        self._buff.put(None)
        self._audio_interface.terminate()

    def _fill_buffer(self, in_data, frame_count, time_info, status_flags):
        self._buff.put(in_data)
        return None, pyaudio.paContinue

    def generator(self):
        while not self.closed:
            chunk=self._buff.get()
            if chunk is None:
                return

            data=[chunk]

            while True:
                try:
                    chunk=self._buff.get(block=False)
                    if chunk is None:
                        return

                    data.append(chunk)
                except queue.Empty:
                    break

            yield b''.join(data)

def listen_print_loop(responses, flag):
    num_chars_printed=0
    start = time.time()
    count = 0

    for response in responses:
        if not response.results:
            continue

        result=response.results[0]
        if not result.alternatives:
            continue
        transcript=result.alternatives[0].transcript

        overwrite_chars=' '*(num_chars_printed - len(transcript))

        if not result.is_final:
            sys.stdout.write(transcript + overwrite_chars + '\r')
            sys.stdout.flush()

            num_chars_printed=len(transcript)
        else:
            print(transcript + overwrite_chars)
#                if len(transcript) >= 2:
#                    print('\n음성인식 끝')
#                    break
#            if re.search(r'\b(명령 끝)\b', transcript, re.I):
#                print('Exiting..')
#                break
            num_chars_printed = 0

        if flag:
            return 0
def time_m(start):
    global flag
    count = 1
    while True:
        print(count, "초\n")
        time.sleep(1)
        if count == 5:
            break

    flag = 1


def main():
    language_code = 'ko-KR'

    client = speech.SpeechClient()
    config = speech.RecognitionConfig(
            encoding='LINEAR16',
            sample_rate_hertz=RATE,
            max_alternatives=1,
            language_code=language_code)
    streaming_config = speech.StreamingRecognitionConfig(
            config=config,
            interim_results=True)
    start = time.time()
    t = threading.Thread(target=time_m, args=(start,))
    t.start()
    flag = 0
    with MicrophoneStream(RATE, CHUNK) as stream:
        audio_generator = stream.generator()
        requests=(
                speech.StreamingRecognizeRequest(audio_content=content)
                for content in audio_generator)
        responses = client.streaming_recognize(streaming_config, requests)

        listen_print_loop(responses, flag)

if __name__=='__main__':
    main()
