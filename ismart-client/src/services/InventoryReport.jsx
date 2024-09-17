import axios from "./axios"

const fetchInventoryImport = (startDate, endDate, warehouseId) => {
    return axios.get(`api/inventory-report/import?startDate=${startDate}&endDate=${endDate}&warehouseId=${warehouseId}`);
}
const fetchInventoryExport = (startDate, endDate, warehouseId) => {
    return axios.get(`api/inventory-report/export?startDate=${startDate}&endDate=${endDate}&warehouseId=${warehouseId}`);
}
const fetchInventoryAll = (startDate, endDate, warehouseId) => {
    return axios.get(`api/inventory-report/inventory?startDate=${startDate}&endDate=${endDate}&warehouseId=${warehouseId}`);
}

export { fetchInventoryImport, fetchInventoryExport, fetchInventoryAll }