import axios from 'axios';
const baseURL ='http://localhost:3000'
const instance =axios.create({
    baseURL,
    withCredentials:true    
});
export default instance;
export const URL=baseURL;
export const musicAPI = axios.create({
    baseURL: 'http://localhost:3001',
    withCredentials: true,
  });