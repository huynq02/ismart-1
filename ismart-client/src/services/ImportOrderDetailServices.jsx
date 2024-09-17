import axios from "./axios"


const getAllImportOrderDetails = () => {
    return axios.get(`api/import-order-detail/get-all-import-order-details`)
}

const createNewImportOrderDetail = (importId, costPrice, batchCode, manufactureDate, expiryDate, goodsId, quantity) => {
    return axios.post(`api/import-order-detail/add-order-detail`, { importId, costPrice, batchCode, manufactureDate, expiryDate, goodsId, quantity })
}

const updateImportOrderDetail = (importId, costPrice, detailId, goodsId, quantity, manufactureDate, expiryDate, batchCode) => {
    return axios.put(`api/import-order-detail/update-import-order-detail`, { importId, costPrice, detailId, goodsId, quantity, manufactureDate, expiryDate, batchCode })
}

const deleteImportOrderDetail = (id) => {
    return axios.delete(`api/import-order-detail/delete-import-order-detail/${id}`)
}
const getImportOrderDetailByImportId = (oid) => {
    return axios.get(`api/import-order-detail/get-import-order-details?oid=${oid}`)
}
const getBatchInventoryForExportgoods = (warehouseId, goodsId, quantity, method) => {
    return axios.get(`api/import-order-detail/get-batch-inventory-for-export-goods?warehouseId=${warehouseId}&goodId=${goodsId}&quantity=${quantity}&method=${method}`)
}

const getAvailableBatch = (warehouseId, goodId) => {
    return axios.get(`api/import-order-detail/get-available-batch?warehouseId=${warehouseId}&goodId=${goodId}`)
}
const getBatchByReturnOrder = (warehouseId, goodId) => {
    return axios.get(`api/import-order-detail/get-batch-for-return?warehouseId=${warehouseId}&goodId=${goodId}`)
}
const getBatchForReturn = (warehouseId, goodId) => {
    return axios.get(`api/import-order-detail/get-batch-for-return?warehouseId=${warehouseId}&goodId=${goodId}`)
}
export { getAllImportOrderDetails, getBatchByReturnOrder, createNewImportOrderDetail, updateImportOrderDetail, deleteImportOrderDetail, getImportOrderDetailByImportId, getBatchInventoryForExportgoods, getAvailableBatch, getBatchForReturn }