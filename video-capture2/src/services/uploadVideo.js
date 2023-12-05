// Dentro de src/utils/uploadVideo.js
import axios from 'axios';
import { json } from 'react-router-dom';

const uploadVideo = (videoBlob, filename, formData) => {
  const uploadData = new FormData();
  uploadData.append('userInfo', JSON.stringify(formData));
  uploadData.append('video', videoBlob, filename);
  
  console.log(videoBlob);  // Deberías ver el objeto Blob del video
  console.log(filename);   // Deberías ver el nombre del archivo que esperas
  console.log(formData);  // Deberías ver el objeto con la información del usuario
  const formDataString = JSON.stringify(formData);
  console.log(formDataString);  // Deberías ver la representación en cadena de la información del usuario
  uploadData.forEach((value, key) => {
    console.log(key, value);
  });
    
      // Aquí pasamos formData como userInfo

  return axios.post(`${process.env.REACT_APP_API_URL}/upload`, uploadData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export default uploadVideo;
