import { get } from "lodash";
import axios from "./axios";

const addNewImportOrder = (isInternalTransfer, staffId, userId, supplierId, totalCost,
    note, createdDate, importedDate,
    statusId, importCode, warehouseId,
    deliveryId, image, warehouseDestinationId) => {
    return axios.post(`api/import-order/add-import-order?isInternalTransfer=${isInternalTransfer}&staffId=${staffId}`, {
        userId, supplierId, totalCost,
        note, createdDate, importedDate,
        statusId, importCode, warehouseId,
        deliveryId, image, warehouseDestinationId
    })
}

const updateImportOrder = (importId, userId, supplierId,
    totalCost, note, createdDate,
    importedDate, statusId, importCode,
    storageId, deliveryId, image, stokekeeperId) => {
    return axios.put(`api/import-order/update-import-order`, {
        importId, userId, supplierId,
        totalCost, note, createdDate,
        importedDate, statusId, importCode,
        storageId, deliveryId, image, stokekeeperId
    })
}

const fetchAllImportOrders = () => {
    return axios.get(`api/import-order/get-all-import-orders`);
}

const fetchImportOrderNewest = () => {
    return axios.get(`api/import-order/get-newest-import-order`);
}

const fetchImportOrdersWithfilter = (pageSize, page, warehouseId,
    status, sortDate, keyword) => {
    return axios.get(`api/import-order/get-import-orders?pageSize=${pageSize}
    ${page ? `&page=${page}` : ''}
    ${warehouseId ? `&warehouseId=${warehouseId}` : ''}
    ${status ? `&status=${status}` : ''}
    ${sortDate ? `&sortDate=${sortDate}` : ''}
    ${keyword ? `&keyword=${keyword}` : ''}`);
}

const addSuccessFullImportOrder = (importId) => {
    return axios.post(`api/import-order/import/${importId}`)
}

const cancelImport = (importId) => {
    return axios.post(`api/import-order/cancel-import?importId=${importId}`)
}

const getImportOrderByImportId = (importId) => {
    return axios.get(`api/import-order/get-import-order-by-id/${importId}`)
}
export { addNewImportOrder, updateImportOrder, fetchImportOrderNewest, fetchAllImportOrders, fetchImportOrdersWithfilter, addSuccessFullImportOrder, cancelImport, getImportOrderByImportId }