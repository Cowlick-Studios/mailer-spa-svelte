import axios from 'axios';
import cookies from 'browser-cookies';

// Base axios instance with default configuration.
let axiosInstance = axios.create({
	baseURL: 'http://localhost',
	timeout: 1000,
	headers: {
		Accept: 'application/json'
	},
  withCredentials: true,
  withXSRFToken: true
});

// Run function on request object every request.
axiosInstance.interceptors.request.use((request) => {
	// Preprocess request here ...
  request.headers['X-XSRF-TOKEN'] = cookies.get('XSRF-TOKEN');
	return request;
});

// Run function on response object every response.
axiosInstance.interceptors.response.use(
	(response) => {
		// Handle 200 level response here ...
		return response;
	},
	(error) => {
		// handle error level response here ...
		return error;
	}
);

export { axiosInstance as http };