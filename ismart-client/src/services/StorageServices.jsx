import axios from "./axios"

const fetchAllStorages = () => {
    return axios.get(`api/warehouse/get-all-warehouses`);
}

const fetchStoragesWithKeyword = (page, keyword) => {
    return axios.get(`api/warehouse/get-warehouse?page=${page}${keyword ? `&keyword=${keyword}` : ''}`);
}

const createNewStorage = (storageName, storageAddress, storagePhone) => {
    return axios.post(`api/warehouse/add-warehouse`, { storageName, storageAddress, storagePhone });
}

const EditStorage = (storageId, storageName, storageAddress, storagePhone) => {
    return axios.put(`api/warehouse/update-warehouse`, { storageId, storageName, storageAddress, storagePhone });
}


export { fetchAllStorages, fetchStoragesWithKeyword, createNewStorage, EditStorage }