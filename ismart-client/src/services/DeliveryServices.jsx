import axios from "./axios"

const fetchAllDelivery = () => {
    return axios.get(`api/delivery/get-all-delivery`);
}
const fetchDeliveriesWithKeyword = (page, keyword) => {
    return axios.get(`api/delivery/get-delivery-with-filter?page=${page}${keyword ? `&keyword=${keyword}` : ``}`)
}

const fetchDeliveryActive = () => {
    return axios.get(`api/delivery/get-all-active-delivery`);
}
const createNewDelivery = (deliveryName) => {
    return axios.post(`api/delivery/add-delivery`, { deliveryName })
}

const updateDelivery = (deliveryId, deliveryName) => {
    return axios.put(`api/delivery/update-delivery`, { deliveryId, deliveryName })
}

const updateStatusDelivery = (deliveyId) => {
    return axios.put(`api/delivery/update-delivery-status?id=${deliveyId}`);
}

export { fetchAllDelivery, fetchDeliveriesWithKeyword, createNewDelivery, updateDelivery, updateStatusDelivery,fetchDeliveryActive }