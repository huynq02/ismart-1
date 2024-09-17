import axios from "./axios"


const fetchAllSuppliers = () => {
    return axios.get(`api/supplier/get-all-supplier`);
}

const fetchAllSupplierActive = () => {
    return axios.get(`api/supplier/get-all-supplier-active`);
}

const fetchSuppliersWithKeyword = (page, statusId, keyword) => {
    return axios.get(`api/supplier/get-supplier?page=${page}${statusId ? `&statusId=${statusId}` : ``}${keyword ? `&keyword=${keyword}` : ``}`)
}

const createNewSupplier = (supplierName, supplierPhone, statusId, supplierEmail, note) => {
    return axios.post(`api/supplier/add-supplier`, { supplierName, supplierPhone, statusId, supplierEmail, note })
}

const updateSupplier = (supplierId, supplierName, supplierPhone, statusId, supplierEmail, note) => {
    return axios.put(`api/supplier/update-supplier`, { supplierId, supplierName, supplierPhone, statusId, supplierEmail, note })
}

const updateStatusSupplier = (supplierId) => {
    return axios.put(`api/supplier/update-supplier-status?id=${supplierId}`);
}

export { fetchAllSupplierActive, fetchAllSuppliers, fetchSuppliersWithKeyword, createNewSupplier, updateSupplier, updateStatusSupplier }
