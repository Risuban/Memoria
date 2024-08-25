import React, { useRef, useEffect, useState } from 'react';
import uploadVideo from '../services/uploadVideo';
import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom';

function CameraCapture({ viewName }) {
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const recordedChunks = useRef([]);
    const [recording, setRecording] = useState(false);
    const { formData } = useUser();
    const navigate = useNavigate();
    const [playbackUrl, setPlaybackUrl] = useState(null);
    const [countdown, setCountdown] = useState(3); // Estado para la cuenta regresiva
    const [showCountdown, setShowCountdown] = useState(false); // Mostrar u ocultar la cuenta regresiva
    const [showRecordingMessage, setShowRecordingMessage] = useState(false); // Mostrar u ocultar el mensaje de grabación

    useEffect(() => {
        startCameraFeed();
    }, []);

    const startCameraFeed = () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    frameRate: { ideal: 30, max: 30 }
                },
                audio: false
            })
                .then((stream) => {
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        videoRef.current.style.display = 'block'; // Mostrar el video de la cámara
                    }
                })
                .catch((err) => {
                    console.log("An error occurred: " + err);
                });
        }
    };

    const startRecording = () => {
        mediaRecorderRef.current = new MediaRecorder(videoRef.current.srcObject);
        mediaRecorderRef.current.ondataavailable = event => {
            if (event.data.size > 0) {
                recordedChunks.current.push(event.data);
            }
        };
        mediaRecorderRef.current.onstop = handleStopRecording;

        setShowCountdown(true);
        let countdownTimer = 3;
        const countdownInterval = setInterval(() => {
            setCountdown(countdownTimer);
            countdownTimer -= 1;
            if (countdownTimer < 0) {
                clearInterval(countdownInterval);
                setShowCountdown(false);
                setShowRecordingMessage(true);
                mediaRecorderRef.current.start();
                setRecording(true);
            }
        }, 1000);
    };

    const stopRecording = () => {
        mediaRecorderRef.current.stop();
        setRecording(false);
        setShowRecordingMessage(false);
        startCameraFeed(); // Reiniciar la previsualización de la cámara después de detener la grabación
    };

    const exampleVideoUrl = getExampleVideoUrl(viewName);

    function getExampleVideoUrl(viewName) {
        switch (viewName) {
            case 'MoveUpDown':
                return '/videos/move-up-down.mp4';
            case 'MoveSides':
                return '/videos/move-sides.mp4';
            case 'RaiseEyebrows':
                return '/videos/raise-eyebrows.mp4';
            case 'OpenCloseMouth':
                return '/videos/open-close-mouth.mp4';
            case 'LipCornerMovements':
                return '/videos/lip-corner-movements.mp4';
            case 'Blinking':
                return '/videos/blinking.mp4';
            case 'HeadPosition':
                return '/videos/head-position.mp4';
            case 'LookAround':
                return '/videos/look-around.mp4';
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
                recordedChunks.current = [];
            })
            .catch(error => {
                console.error('Hubo un error al subir el archivo', error);
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
                        <video width="320" height="240" controls muted disableRemotePlayback controlsList="nodownload noaudio">
                            <source src={exampleVideoUrl} type="video/mp4" />
                            Tu navegador no soporta videos.
                        </video>
                    </div>

                    {/* Mensaje de cuenta regresiva */}
                    {showCountdown && (
                        <div className="countdown" style={{ fontSize: '48px', textAlign: 'center', marginBottom: '20px' }}>
                            {countdown}
                        </div>
                    )}

                    {/* Video de grabación o mensaje de grabación */}
                    {showRecordingMessage ? (
                        <div className="recording-message" style={{ fontSize: '48px', color: 'red', textAlign: 'center', marginBottom: '20px' }}>
                            Grabación en progreso
                        </div>
                    ) : (
                        <video ref={videoRef} style={{ width: '640px', height: '480px', display: recording || showCountdown ? 'none' : 'block' }} autoPlay className="card-img-top"></video>
                    )}

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
