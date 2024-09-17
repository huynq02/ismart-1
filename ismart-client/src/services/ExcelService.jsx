import axios from "./axios"


const uploadExcel = (filePath, id) => {
    const formData = new FormData();
    formData.append('file', filePath);


    return axios.post(`https://localhost:7033/api/excel/upload-excel/${id}`, formData, {
        filePath,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}




const downloadExcel = () => {
    return axios.get(`https://localhost:7033/api/excel/download-template`, {
        responseType: 'blob',
    });
}


export { uploadExcel, downloadExcel };