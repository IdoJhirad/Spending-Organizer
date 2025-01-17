import axios from 'axios';
 
//Create an Axios instance
const apiClient = axios.create({
    baseURL:  import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
});
//  request interceptor to include the token in every request
apiClient.interceptors.request.use(
    (config) => {
        //if exsist send request with header if not logi in and register so it not sent
        const token = sessionStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; // Attach token
        }
        return config;
    },
    (error)=> {
        return Promise.reject(error)
    }
);
export default apiClient;