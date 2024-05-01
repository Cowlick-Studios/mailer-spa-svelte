import axios from 'axios';
import Cookies from 'js-cookie';

// Base axios instance with default configuration.
let axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_ENDPOINT,
	timeout: 1000,
	headers: {
		Accept: 'application/json'
	},
  withCredentials: true,
  withXSRFToken: true,
	xsrfCookieName: "XSRF-TOKEN",
	xsrfHeaderName: "X-XSRF-TOKEN",
});

// Run function on request object every request.
axiosInstance.interceptors.request.use((request) => {
	// Preprocess request here ...

	// console.log(Cookies.get('XSRF-TOKEN'));
  // request.headers['X-XSRF-TOKEN'] = Cookies.get('XSRF-TOKEN');

	// request.xsrfCookieName = "XSRF-TOKEN";
	// request.xsrfHeaderName = "X-XSRF-TOKEN";
	
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
    // TODO: handle 401, 419 for unauthenticated token
		return error;
	}
);

export { axiosInstance as http };