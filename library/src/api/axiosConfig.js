import axios from "axios";

const api = axios.create({
  baseURL:import.meta.env.VITE_API_URL, // Spring Boot backend
});

export default api;
