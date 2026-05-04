import axios from "axios";

const API = "http://127.0.0.1:8000";

export const predictAPI = (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return axios.post(`${API}/predict`, formData);
};

export const trainAPI = (file: File, label: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("label", label);

    return axios.post(`${API}/train/upload`, formData);
};