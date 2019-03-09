import axios from "axios";

const loginAxios = axios.create({
  baseURL: "http://login.chocolatepie.tech",
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true
});

export default loginAxios;
