import axios from "./axios"



const fetchDataStatisticalImportOrder = (pageSize, page, warehouseId,
    status, sortDate, keyword) => {
    return axios.get(`api/import-order/get-import-orders?pageSize=100
    ${warehouseId ? `&warehouseId=${warehouseId}` : ''}
    ${`&status=4`}`);
}


const fetchDataAddChart = (warehouseId, goodCode, year) => {
    return axios.get(`api/inventory-report/inventory-by-month?warehouseId=${warehouseId}
        ${`&goodCode=${goodCode}`}
        ${`&year=${year}`}`);
}


const fetchDataStatisticalExortOrder = (minDate, maxDate, storageId) => {
    let url = 'api/Dashboard/get-data-export-by-date';
    if (minDate || maxDate || storageId) {
        url += '?';
        if (minDate) {
            url += `mindate=${minDate}`;
            if (maxDate) {
                url += `&maxdate=${maxDate}`;
                if (storageId) {
                    url += `&storageId=${storageId}`
                }
            }
        } else if (!minDate) {
            if (maxDate) {
                url += `maxdate=${maxDate}`;
                if (storageId) {
                    url += `&storageId=${storageId}`
                }
            } else {
                if (storageId) {
                    url += `storageId=${storageId}`
                }
            }


        }
    }
    return axios.get(url);
}


export { fetchDataStatisticalImportOrder, fetchDataStatisticalExortOrder, fetchDataAddChart }



