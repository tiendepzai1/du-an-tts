import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://du-an-tts-fe.onrender.com",
  withCredentials: true, 
});

export default API;
