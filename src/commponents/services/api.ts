import axios from "axios";

const api = axios.create({
  baseURL: "https://elkamal.runasp.net/api",
});

export default api;