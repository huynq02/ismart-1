import axios from "./axios"

const fetchGoodsWithFilter = (pageSize, page, warehouseId, categoryId, supplierId, sortPrice, keyword) => {
    return axios.get(`api/goods/get-goods?pageSize=${pageSize}
        ${page ? `&page=${page}` : ''}
        ${warehouseId ? `&warehouseId=${warehouseId}` : ''}
        ${categoryId ? `&categoryId=${categoryId}` : ''}
    ${supplierId ? `&supplierId=${supplierId}` : ''}
    ${sortPrice ? `&sortPrice=${sortPrice}` : ''}
    ${keyword ? `&keyword=${keyword}` : ''}`);
}

const fetchAllGoodsInWareAndSup = (warehouseId, supplierId) => {
    return axios.get(`api/goods/get-goods-with-warehouse-supplier?warehouseId=${warehouseId}&supplierId=${supplierId}`)
}
const fetchGoodById = (id) => {
    return axios.get(`api/goods/get-good-by-id?id=${id}`)
}

const fetchAllGoods = () => {
    return axios.get(`api/goods/get-all-goods`);
}

const fetchGoodsWithStorageAndSupplier = (warehouseId, supplierId) => {
    return axios.get(`api/goods/get-goods-with-warehouse-supplier?warehouseId=${warehouseId}&supplierId=${supplierId}`)
}

const fetchGoodsWithSupplier = (supplierId) => {
    return axios.get(`api/goods/get-goods-of-supplier?supplierId=${supplierId}`)
}
const addGood = (userId,
    goodsName, goodsCode, categoryId,
    description, supplierId, measuredUnit,
    image, statusId, stockPrice,
    createdDate, warrantyTime, barcode,
    maxStock, minStock) => {
    return axios.post(`api/goods/add-goods?userId=${userId}`, {
        goodsName, goodsCode, categoryId,
        description, supplierId, measuredUnit,
        image, statusId, stockPrice,
        createdDate, warrantyTime, barcode,
        maxStock, minStock
    });
}

const addGoodinAdmin = (warehouseId,
    goodsName, goodsCode, categoryId,
    description, supplierId, measuredUnit,
    image, statusId, stockPrice,
    createdDate, warrantyTime, barcode,
    maxStock, minStock) => {

    return axios.post(`api/goods/add-goods-by-admin?warehouseId=${warehouseId}`, {
        goodsName, goodsCode, categoryId,
        description, supplierId, measuredUnit,
        image, statusId, stockPrice,
        createdDate, warrantyTime, barcode,
        maxStock, minStock
    });
}
const updateGood = (goodsId, goodsName, goodsCode,
    categoryId, description, supplierId,
    measuredUnit, inStock, image,
    statusId, stockPrice, warrantyTime, barcode,
     maxStock, minStock) => {
    return axios.put(`api/goods/update-goods`, {
        goodsId, goodsName, goodsCode,
        categoryId, description, supplierId,
        measuredUnit, inStock, image,
        statusId, stockPrice, warrantyTime, barcode,
        maxStock, minStock
    });
}


const fetchHistoryGood = (id) => {
    return axios.get(`api/goods/get-good-by-id?id=${id}`);
}

const fetchAllGoodsInWarehouse = (id) => {
    return axios.get(`api/goods/get-goods-in-warehouse?warehouseId=${id}`)
}

const fetchGoodinWarehouseById = (warehouseId, goodId) => {
    return axios.get(`api/goods/get-good-in-warehouse-by-id?warehouseId=${warehouseId}&goodId=${goodId}`)
}

const fetchAlertsinGoods = (warehouseId) => {
    return axios.get(`api/goods/alerts?warehouseId=${warehouseId}`)
}
export {
    updateGood, addGood, addGoodinAdmin, fetchGoodsWithFilter, fetchGoodsWithSupplier,
    fetchAllGoods, fetchGoodsWithStorageAndSupplier, fetchGoodById,
    fetchHistoryGood, fetchAllGoodsInWarehouse, fetchGoodinWarehouseById, fetchAlertsinGoods, fetchAllGoodsInWareAndSup
}
