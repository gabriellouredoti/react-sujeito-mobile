import axios from "axios";

const api = axios.create({
	baseURL: "http://192.168.0.35:8081/api/v1",
});

export { api };
