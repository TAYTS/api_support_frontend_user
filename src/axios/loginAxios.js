import axios from "axios";

const loginAxios = axios.create({
  baseURL: "https://authenticate.chocolatepie.tech",
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true
});

export default loginAxios;
