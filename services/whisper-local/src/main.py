from fastapi import FastAPI, UploadFile, File
import whisper
import numpy
print(numpy.__version__)

app = FastAPI()
model = whisper.load_model("base")

@app.post("/transcribe/")
async def transcribe(file: UploadFile = File(...)):
    audio_file_path = f"/tmp/{file.filename}"
    
    # Save the uploaded file locally
    with open(audio_file_path, "wb") as buffer:
        buffer.write(await file.read())

    # Transcribe the audio file
    result = model.transcribe(audio_file_path)
    return {"transcription": result["text"]}