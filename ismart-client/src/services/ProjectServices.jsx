import axios from "./axios"

const fetchAllProjects = () => {
    return axios.get(`api/project/get-all-project`);
}

const fetchProjectsWithKeyword = (page, keyword) => {
    return axios.get(`api/project/get-all-project-filter?page=${page}${keyword ? `&keyword=${keyword}` : ``}`)
}

const addProject = (projectName) => {
    return axios.post(`api/project/add-project`, { projectName });
}

const editProject = (projectId, projectName) => {
    return axios.put(`api/project/update-project`, { projectId, projectName })
}


export { addProject, editProject, fetchProjectsWithKeyword, fetchAllProjects }