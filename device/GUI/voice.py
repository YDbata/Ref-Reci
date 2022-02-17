import re
import sys

from google.cloud import speech
import pyaudio
import queue
import time
import multiprocessing
from multiprocessing import freeze_support, Manager

RATE = 44100
CHUNK = int(RATE / 10)

m = Manager()

ingre = ""
ingre_list = m.list()


class Ingre():
    def __init__(self):
        self.ingre = ""
        self.ingre_list = []


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

def gui_push(string):
    print("결과")
    print(string)
    return 0

def listen_print_loop(responses, ingre, ingre_list):
    global count
    num_chars_printed=0

    for response in responses:
        if not response.results:
            continue

        result=response.results[0]
        if not result.alternatives:
            continue
        transcript=result.alternatives[0].transcript

        overwrite_chars=' '*(num_chars_printed - len(transcript))

        if not result.is_final:
            ingre = transcript + overwrite_chars
            ingre_list.append(ingre)
            num_chars_printed=len(transcript)
        else:
            ingre = transcript + overwrite_chars
            ingre_list.append(ingre)
            num_chars_printed = 0

def main(ingre, ingre_list):
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

    with MicrophoneStream(RATE, CHUNK) as stream:
        audio_generator = stream.generator()
        requests=(
                speech.StreamingRecognizeRequest(audio_content=content)
                for content in audio_generator)
        responses = client.streaming_recognize(streaming_config, requests)

        listen_print_loop(responses, ingre, ingre_list)

def run():
    global count, ingre_list
    flag = 0
    now_t = time.time()
    count = 0
    result = ''
    freeze_support()
    t = multiprocessing.Process(target=main, args=(ingre, ingre_list))
    t.start()
    while True:
        time.sleep(1)
        count += 1
        #print(count, '초')
        #print(ingre)
        if count == 5:
            break
    t.terminate()
    t.join()
    #print("끝")
    #print("검색결과")
    #print(ingre_list)
    if len(ingre_list) != 0:
        return ingre_list[-1]
    else:
        return -1
