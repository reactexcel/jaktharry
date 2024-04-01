import axios from "axios";
const baseURL = process.env.NODE_ENV === "development" ? process.env.REACT_APP_DEV_API_URL : process.env.REACT_APP_API_URL;

const instance = axios.create({
	baseURL
})

instance.interceptors.request.use((config) => {
	const token = localStorage.getItem('accessToken');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
}, function (error) {
	return Promise.reject(error);
});

export default instance;