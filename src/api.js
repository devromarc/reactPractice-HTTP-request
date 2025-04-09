import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/", // Your backend API URL
  // You can also configure other default settings here, like headers or timeouts
});

export default api;
