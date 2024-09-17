import axios from "./axios";

const addNewExportOrder = (isInternalTransfer, staffId, exportCode, totalPrice,
    note, exportedDate, warehouseId,
    cancelDate, deliveryId, image, customerId, warehouseDestinationId) => {
    return axios.post(`api/export-order/add-export-order?isInternalTransfer=${isInternalTransfer}&staffId=${staffId}`, {
        exportCode, totalPrice,
        note, exportedDate, warehouseId,
        cancelDate, deliveryId, image, customerId, warehouseDestinationId
    })
}

const fetchExportOrderNewest = () => {
    return axios.get(`api/export-order/get-newest-export-order`);
}

const fetchAllExportOrders = () => {
    return axios.get(`api/ExportOrder/get-all-export-orders`);
}

const fetchExportOrdersWithFilter = (pageSize, page, warehouseId,
    userId, managerId, status,
    sortDate, keyword) => {
    return axios.get(`api/export-order/get-export-orders?pageSize=${pageSize}
        ${page ? `&page=${page}` : ''}
        ${warehouseId ? `&warehouseId=${warehouseId}` : ''}
        ${userId ? `&userId=${userId}` : ''}
        ${managerId ? `&managerId=${managerId}` : ''}
        ${status ? `&status=${status}` : ''}
        ${sortDate ? `&sortDate=${sortDate}` : ''}
        ${keyword ? `&keyword=${keyword}` : ''}`);
}

const addSuccessFullExportOrder = (exportId) => {
    return axios.post(`api/export-order/export?exportId=${exportId}`)
}


const updateExportOrder = (exportId, userId, totalPrice, note, createdDate, exportedDate, statusId, exportCode, warehouseId, deliveryId, image, managerId, customerId) => {
    return axios.put(`api/export-order/update-export-order`, { exportId, userId, totalPrice, note, createdDate, exportedDate, statusId, exportCode, warehouseId, deliveryId, image, managerId, customerId })
}

const cancelExportOrder = (exportId) => {
    return axios.post(`api/export-order/cancel-export?exportId=${exportId}`)
}

const fetchExportOrderByExportId = (exportId) => {
    return axios.get(`api/export-order/get-export-order-by-id/${exportId}`)

}
export {fetchExportOrderByExportId, cancelExportOrder, addNewExportOrder, fetchAllExportOrders, fetchExportOrdersWithFilter, fetchExportOrderNewest, addSuccessFullExportOrder, updateExportOrder }