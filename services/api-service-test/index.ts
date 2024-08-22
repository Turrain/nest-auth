import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';


async function sendOggFileToServer(filePath: string) {
    try {
        // Create a readable stream of the file
        const absolutePath = path.resolve(filePath);
        const fileStream = fs.createReadStream(absolutePath);

        // Send the file to the server
        const response = await axios.post('http://localhost:8000/transcribe/', fileStream, {
            headers: {
                'Content-Type': 'audio/ogg', // Ensure appropriate content-type
            },
        });

        console.log('Response:', response.data);
    } catch (error) {
   //     console.error('Error sending OGG file:', error);
    }
}

sendOggFileToServer('./test-files/main.ogg');