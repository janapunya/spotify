import axios from 'axios';
const baseURL ='https://vibetube-backend-auth.onrender.com'
const instance =axios.create({
    baseURL,
    withCredentials:true    
});
export default instance;
export const URL=baseURL;
export const musicAPI = axios.create({
    baseURL: 'https://vibetube-backend-music.onrender.com',
    withCredentials: true,
  });