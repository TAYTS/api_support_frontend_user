import axios from "axios";

const ticketAxios = axios.create({
  baseURL: "https://ticket.chocolatepie.tech",
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true
});

export default ticketAxios;
