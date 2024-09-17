import axios from "./axios";


const fetchReturnOrdersWithFilter = (pageSize, page, warehouseId,
    userId, status,
    sortDate, keyword) => {
    return axios.get(`api/return-order/return-order-filter-paging?pageSize=${pageSize}
        ${page ? `&page=${page}` : ''}
        ${warehouseId ? `&warehouseId=${warehouseId}` : ''}
        ${userId ? `&userId=${userId}` : ''}
        ${status ? `&status=${status}` : ''}
        ${sortDate ? `&sortDate=${sortDate}` : ''}
        ${keyword ? `&keyword=${keyword}` : ''}`);
}

const addNewReturnOrder = (staffId, returnOrderCode, returnedDate, warehouseId, supplierId, approvedBy
) => {
    return axios.post(`api/return-order/create-return-order?staffId=${staffId}`, {
        returnOrderCode, returnedDate, warehouseId, supplierId, approvedBy
    })
}


const updateReturnOrder = (returnOrderId, returnOrderCode, returnedDate, warehouseId, supplierId, statusId, createdBy, approvedBy) => {
    return axios.post(`api/return-order/update-order`, { returnOrderId, returnOrderCode, returnedDate, warehouseId, supplierId, statusId, createdBy, approvedBy })
}

const cancelExportOrder = (exportId) => {
    return axios.post(`api/export-order/cancel-export?exportId=${exportId}`)
}

const confirmReturnOrder = (returnOrderId) => {
    return axios.post(`api/return-order/confirm-return?returnOrderId=${returnOrderId}`)
}

const getReturnOrderNewest = () => {
    return axios.get(`api/return-order/get-return-order-newest`)
}
const getReturnOrderById = (returnOrderId) => {
    return axios.get(`api/return-order/get-export-order-by-id/${returnOrderId}`)
}


export {getReturnOrderById, cancelExportOrder, fetchReturnOrdersWithFilter, addNewReturnOrder, updateReturnOrder, getReturnOrderNewest, confirmReturnOrder }