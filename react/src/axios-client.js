import axios from "axios";


//create the axios client with base url
const axiosClient=axios.create({
    baseURL:import.meta.env.VITE_API_URL
})

//an interceptor to send the token at any request to the server
axiosClient.interceptors.request.use((config)=>{
    const token=localStorage.getItem('TOKEN')
    config.headers.Authorization=`Bearer ${token}`
    return config;
})

//a response interceptor
axiosClient.interceptors.response.use((response)=>{
    return response;
},(error)=>{
    const {response}=error;
    //if the response is unauthorized, remove token
    if (response.status===401) {
        localStorage.removeItem('TOKEN')
    }
    //throw all the other errors
    throw error;
})

export default axiosClient;

