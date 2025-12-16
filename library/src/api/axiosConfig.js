import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8081", // Spring Boot backend
});

export default instance;
