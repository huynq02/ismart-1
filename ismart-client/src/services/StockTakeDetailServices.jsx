import axios from "./axios"

const createNewStockTakeDetail = (stocktakeId, goodsId, currentStock, actualStock, amountDifferential, note) => {
    return axios.post(`api/StocktakeNoteDetail/add-StocktakeNote-detail`,
        { stocktakeId, goodsId, currentStock, actualStock, amountDifferential, note });
}

const getStockTakeDetail = (id) => {
    return axios.get(`api/StocktakeNoteDetail/get-StocktakeNote-details?id=${id}`)
}

const updateStockTakeDetail = (detailId, stocktakeId, goodsId, currentStock, actualStock, amountDifferential, note) => {
    return axios.put(`api/StocktakeNoteDetail/update-StocktakeNote-detail`, { detailId, stocktakeId, goodsId, currentStock, actualStock, amountDifferential, note })
}

export { createNewStockTakeDetail, getStockTakeDetail, updateStockTakeDetail }