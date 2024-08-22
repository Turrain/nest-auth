from fastapi import FastAPI, UploadFile, File
import whisper
import numpy
import os
import torch
print(numpy.__version__)

app = FastAPI()
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = whisper.load_model("tiny", device=device)

@app.post("/transcribe/")
async def transcribe(file: UploadFile = File(...)):
    audio_file_path = f"/tmp/{file.filename}"
    
    # Save the uploaded file locally
    with open(audio_file_path, "wb") as buffer:
        buffer.write(await file.read())

    # Transcribe the audio file
    result = model.transcribe(audio_file_path)
    return {"transcription": result["text"]}


@app.get("/transcribe_from_file/")
async def transcribe_from_file():
  

    if not os.path.isfile("main.ogg"):
        raise HTTPException(status_code=404, detail="File not found")

    result = model.transcribe("main.ogg", fp16=torch.cuda.is_available())
    return {"transcription": result["text"]}
