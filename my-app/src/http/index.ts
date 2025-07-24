import axios from "axios";


const http = axios.create(
    {
        baseURL: 'http://localhost:5173/'
    }
)


export default http