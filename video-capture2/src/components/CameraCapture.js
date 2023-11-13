import React, { useRef, useEffect, useState } from 'react';
import uploadVideo from '../services/uploadVideo';
import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom';


function CameraCapture({ viewName}) {
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const recordedChunks = useRef([]);
    const [recording, setRecording] = useState(false);
    const { formData } = useUser();
    const navigate = useNavigate();
    const [playbackUrl, setPlaybackUrl] = useState(null);

    

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
        if (videoRef.current) {
            videoRef.current.style.display = 'none'; // Oculta el video
        }
    };
    
    const stopRecording = () => {
        mediaRecorderRef.current.stop();
        setRecording(false);
        if (videoRef.current) {
            videoRef.current.style.display = 'block'; // Muestra el video
        }
    };


    const exampleVideoUrl = getExampleVideoUrl(viewName);


    function getExampleVideoUrl(viewName) {
        switch(viewName) {
            case 'MoveUpDown':
                return '/path/to/move-up-down-example.mp4'; // Cambia esto por la URL real
            case 'MoveSides':
                return '/path/to/move-sides-example.mp4'; // Cambia esto por la URL real
            // ... casos adicionales para otros viewNames
            default:
                return ''; // URL por defecto o dejar vacío
        }
    }

    const handleBackToMenu = () => {
        navigate('/recording-menu'); // Asegúrate de que esta ruta coincida con la ruta de tu menú de selección
    };

    const handleStopRecording = () => {
        const blob = new Blob(recordedChunks.current, { type: 'video/mp4' });
        const url = URL.createObjectURL(blob);
        setPlaybackUrl(url);
        
    
        const userName = `${formData.firstName}${formData.lastName}`; // o como estés generando el userName
        const action = viewName; // si viewName es lo que estás utilizando para indicar la acción
        const timestamp = Date.now(); // timestamp actual
        
        // Llamada a la función de utilidad para subir el video
        uploadVideo(blob, `${viewName}.mp4`, formData)
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
        <div className="container mt-3">
            <div className="card">
            <div className="card-body">
                    <h5 className="card-title">{viewName.replace(/([A-Z])/g, ' $1').trim()}</h5>
                    
                    {/* Video de ejemplo */}
                    <div className="example-video">
                        <h6>Video de Ejemplo</h6>
                        <video width="320" height="240" controls>
                            <source src={exampleVideoUrl} type="video/mp4" />
                            Tu navegador no soporta videos.
                        </video>
                    </div>

                    {/* Video de grabación */}
                    <video ref={videoRef}  style={{ display: 'block' }} width="640" height="480" autoPlay className="card-img-top"></video>
                    <div className="card-text">
                        {recording ? (
                            <button className="btn btn-danger" onClick={stopRecording}>Stop Recording</button>
                        ) : (
                            <button className="btn btn-primary" onClick={startRecording}>Start Recording</button>
                        )}
                    </div>
                            {/* Playback del video grabado */}
        {playbackUrl && (
            <div className="playback-video">
                <h6>Playback del Video Grabado</h6>
                <video src={playbackUrl} width="320" height="240" controls></video>
            </div>
        )}
                </div>
                <div className="card-footer">
                    <button className="btn btn-secondary" onClick={handleBackToMenu}>Volver al Menú</button>
                </div>
            </div>
        </div>
    );
}

export default CameraCapture;
