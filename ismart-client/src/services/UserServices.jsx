import axios from "./axios"


const fetchUserByUserId = (id) => {
    return axios.get(`api/user/get-user-by-id?id=${id}`)
}

const fetchUserWithFilter = (pageNum, role, warehouseId, statusId, keyword) => {
    return axios.get(`api/user/get-users?pageNum=${pageNum}
    ${role ? `&role=${role}` : ``}
    ${warehouseId ? `&warehouseId=${warehouseId}` : ``}
    ${statusId ? `&statusId=${statusId}` : ``}
    ${keyword ? `&keyword=${keyword}` : ``}`)
}

const updateUser = (
    userId,
    email,
    phone,
    roleId,
    statusId,
    userName,
    userCode,
    address,
    image,
    fullName) => {
    return axios.put(`api/user/update-user`,
        {
            userId,
            email,
            phone,
            roleId,
            statusId,
            userName,
            userCode,
            address,
            image,
            fullName
        })
}

const addUser = (warehouseId,
    email,
    phone,
    roleId,
    userName,
    address,
    image,
    fullName) => {
    return axios.post(`api/user/add-user?warehouseId=${warehouseId}`, {
        email,
        phone,
        roleId,
        userName,
        address,
        image,
        fullName
    })
}
const updateUserStatus = (id) => {
    return axios.put(`api/user/update-user-status?id=${id}`)
}

const fetchAllRole = () => {
    return axios.get(`api/user/get-all-user-roles`)
}

export { updateUserStatus, fetchUserByUserId, updateUser, fetchUserWithFilter, addUser, fetchAllRole }