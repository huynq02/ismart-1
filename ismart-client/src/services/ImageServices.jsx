import axios from "./axios"

const uploadImage = (fileUpload) => {
    const formData = new FormData();
    formData.append('file', fileUpload);

    return axios.post('https://localhost:7033/api/images/upload', formData, {
        fileUpload,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

export default uploadImage;