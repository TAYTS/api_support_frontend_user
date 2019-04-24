import axios from "axios";

const messageAxios = axios.create({
  baseURL: "https://message.chocolatepie.tech",
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true
});

export default messageAxios;
