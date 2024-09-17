import axios from "./axios"

const fetchAllCustomer = () => {
    return axios.get(`api/customer`);
}

const createNewCustomer = (customerName, customerAddress, customerPhone, customerEmail) => {
    return axios.post(`api/customer`, { customerName, customerAddress, customerPhone, customerEmail });
}
const getCustomerById = (id) => {
    return axios.get(`api/customer/${id}`);
}
const fetchCustomerwithKeyword = (page, keyword) => {
    return axios.get(`api/customer/search?page=${page}
        ${keyword ? `&keyword=${keyword}` : ``}`
    )
}
const updateCustomer = (customerId, customerName, customerAddress, customerPhone, customerEmail) => {
    return axios.put(`api/customer`, { customerId, customerName, customerAddress, customerPhone, customerEmail });
}
const getCustomerTransaction = (customerId) => {
    return axios.get(`api/customer/get-customer-transaction?customerId=${customerId}`);
}
export { fetchAllCustomer, createNewCustomer, getCustomerById, fetchCustomerwithKeyword, updateCustomer, getCustomerTransaction}