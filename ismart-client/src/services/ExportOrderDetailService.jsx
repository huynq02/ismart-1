import axios from "./axios"

const createNewExportOrderDetail = (exportId, price, goodsId, quantity, importOrderDetailId) => {
    return axios.post(`api/export-order-detail/add-export-order-detail`, { exportId, price, goodsId, quantity, importOrderDetailId })
}

const getExportOrderDetailByExportId = (oid) => {
    return axios.get(`api/export-order-detail/get-export-order-details?oid=${oid}`)
}

const updateExportOrderDetail = (exportId, price, detailId, goodsId, quantity) => {
    return axios.put(`api/ExportOrderDetail/update-export-order-detail`, { exportId, price, detailId, goodsId, quantity })
}

export { createNewExportOrderDetail, getExportOrderDetailByExportId, updateExportOrderDetail }