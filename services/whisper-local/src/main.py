import pyaudio
import tempfile
import wave
import time
from faster_whisper import WhisperModel

# Initialize the Whisper Model
model_size = "base"
model = WhisperModel(model_size, device="cuda", compute_type="int8")

# Audio Configuration
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 16000
CHUNK = 1024

# Initialize PyAudio
audio_interface = pyaudio.PyAudio()

# Stream Open
stream = audio_interface.open(format=FORMAT,
                              channels=CHANNELS,
                              rate=RATE,
                              input=True,
                              frames_per_buffer=CHUNK)

print("Recording...")

try:
    while True:
        # Read data from the microphone
        audio_frames = []
        for _ in range(0, int(RATE / CHUNK * 5)):  # Capture 5 seconds of audio
            data = stream.read(CHUNK)
            audio_frames.append(data)

        # Write audio data to a temporary file
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_audio:
            temp_file_name = temp_audio.name
            wave_file = wave.open(temp_audio, 'wb')
            wave_file.setnchannels(CHANNELS)
            wave_file.setsampwidth(audio_interface.get_sample_size(FORMAT))
            wave_file.setframerate(RATE)
            wave_file.writeframes(b''.join(audio_frames))
            wave_file.close()

            # Transcribe the temporary WAV file
            segments, info = model.transcribe(temp_file_name, beam_size=5, language="ru",
                                              condition_on_previous_text=False)
            for segment in segments:
                print("[%.2fs -> %.2fs] %s" % (segment.start, segment.end, segment.text))

finally:
    # Stop and close the stream
    stream.stop_stream()
    stream.close()
    audio_interface.terminate()