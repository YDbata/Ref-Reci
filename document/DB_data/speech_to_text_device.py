from google.cloud import speech
import io

# set GOOGLE_APPLICATION_CREDENTIALS="C:/Ddrive/2021/ssafy2/common/git/ssafy-common-pjt-ef68f0e5ff35.json"

local_file_path = "./data/test.wav"

client = speech.SpeechClient()

config = speech.RecognitionConfig(
    encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
    sample_rate_hertz=44100,
    language_code="ko-KR",
)

with io.open(local_file_path, "rb") as f:
    content = f.read()

audio = speech.RecognitionAudio(content=content)

response = client.recognize(config=config, audio=audio)
for result in response.results:
    print(f"Transcript: {result.alternatives[0].transcript}")
