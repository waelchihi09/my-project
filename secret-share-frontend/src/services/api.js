import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001/api",
});

export const fetchSecrets = () => API.get("/secrets");
export const addSecret = (secret) => API.post("/secrets", secret);

export default API;