import React, { useRef, useEffect, useState } from 'react';
import uploadVideo from '../services/uploadVideo';


function CameraCapture({ viewName}) {
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const recordedChunks = useRef([]);
    const [recording, setRecording] = useState(false);

    useEffect(() => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ 
                video: {
                    width: {ideal: 1280},
                    height:{ideal: 720},
                    frameRate:{ideal: 30, max: 30}
                }, 
                audio:false })
                .then((stream) => {
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                })
                .catch((err) => {
                    console.log("An error occurred: " + err);
                });
        }
    }, []);

    const startRecording = () => {
        mediaRecorderRef.current = new MediaRecorder(videoRef.current.srcObject);
        mediaRecorderRef.current.ondataavailable = event => {
            if (event.data.size > 0) {
                recordedChunks.current.push(event.data);
            }
        };
        mediaRecorderRef.current.onstop = handleStopRecording;
        mediaRecorderRef.current.start();
        setRecording(true);
    };
    
    const stopRecording = () => {
        mediaRecorderRef.current.stop();
        setRecording(false);
    };
    
    const handleStopRecording = () => {
        const blob = new Blob(recordedChunks.current, { type: 'video/webm' });
    
        // Llamada a la función de utilidad para subir el video
        uploadVideo(blob, `${viewName}.webm`)
          .then(response => {
            console.log('Video subido con éxito', response);
            
            // Restablecer recordedChunks para la próxima grabación.
            recordedChunks.current = [];
          })
          .catch(error => {
            console.error('Hubo un error al subir el archivo', error);
            
            // Podrías optar por restablecer recordedChunks aquí también, dependiendo de si quieres
            // permitir que el usuario intente volver a enviar el mismo video o no.
          });
    };
    

    return (
        <div>
            <h2>{viewName.replace(/([A-Z])/g, ' $1').trim()}</h2>
            <video ref={videoRef} width="640" height="480" autoPlay></video>
            {recording ? (
                <button onClick={stopRecording}>Stop Recording</button>
            ) : (
                <button onClick={startRecording}>Start Recording</button>
            )}
        </div>
    );
}

export default CameraCapture;
