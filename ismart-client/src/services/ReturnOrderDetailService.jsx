import axios from "./axios"

const createNewReturnOrderDetail = (returnOrderId, goodsId, quantity, reason, batchCode) => {
    return axios.post(`api/return-order-detail/add-return-order-detail`, { returnOrderId, goodsId, quantity, reason, batchCode })
}

const getReturnOrderDetailByOrderId = (oid) => {
    return axios.get(`api/return-order-detail/get-return-order-details?oid=${oid}`)
}

const deleteReturnOrderDetaiById = (oid) => {
    return axios.delete(`api/return-order-detail/delete-return-order-detail/${oid}`)
}

const updateReturnOrderDetail = (returnOrderDetailId, returnOrderId, goodsId, quantity, reason, batchCode) => {
    return axios.put(`api/return-order-detail/update-return-order-detail`, { returnOrderDetailId, returnOrderId, goodsId, quantity, reason, batchCode })
}

export { createNewReturnOrderDetail, getReturnOrderDetailByOrderId, updateReturnOrderDetail, deleteReturnOrderDetaiById }