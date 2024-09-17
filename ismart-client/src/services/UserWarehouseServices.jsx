import axios from "./axios"


const getUserIdWarehouse = (userId) => {
        return axios.get(`/api/users/${userId}/warehouses`);
}

const updateUserWarehouseToUser = (userId, warehouseId) => {
    return axios.put(`/api/users/${userId}/warehouses/${warehouseId}`);
}

const deleteUserWarehouseToUser = (userId, warehouseId) => {
    return axios.delete(`/api/users/${userId}/warehouses/${warehouseId}`);
}

export { getUserIdWarehouse, updateUserWarehouseToUser, deleteUserWarehouseToUser };