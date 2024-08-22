import axios from 'axios';
import * as fs from 'fs';

async function transcribeAudio(filePath: string) {
    try {
        const fileStream = fs.createReadStream(filePath);

        const response = await axios.post('http://localhost:8000/transcribe/', fileStream, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('Transcription:', response.data.transcription);
    } catch (error) {
        console.error('Error transcribing audio:', error);
    }
}

transcribeAudio('test-files/test-whisper.wav');