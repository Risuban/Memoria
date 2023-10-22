// Dentro de src/utils/uploadVideo.js
import axios from 'axios';

const uploadVideo = (videoBlob, filename) => {
  const formData = new FormData();
  formData.append('video', videoBlob, filename);

  return axios.post('http://localhost:3001/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export default uploadVideo;
