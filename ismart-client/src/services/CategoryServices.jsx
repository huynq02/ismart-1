import axios from "./axios"

const fetchAllCategories = () => {
    return axios.get(`api/category/get-all-category`);
}

const fetchCategoriesWithKeyword = (page, keyword) => {
    return axios.get(`api/category/get-category?page=${page}${keyword ? `&keyword=${keyword}` : ''}`);
}

const createNewCategory = (categoryName, description) => {
    return axios.post(`api/category/add-category`, { categoryName, description });
}

const EditCategory = (categoryId, categoryName, description) => {
    return axios.put(`api/category/update-category`, { categoryId, categoryName, description })
}


export { fetchAllCategories, fetchCategoriesWithKeyword, createNewCategory, EditCategory }