import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { fetchDeliveriesWithKeyword } from '~/services/DeliveryServices';
import { removeWhiteSpace } from '~/validate';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import { fetchAllProjects, fetchProjectsWithKeyword } from '~/services/ProjectServices';
import ModelAddProject from './AddProject';
import ModelEditProject from './EditProject';



function ProjectList() {
    const roleId = parseInt(localStorage.getItem('roleId'), 10);;
    const [isShowModelAddNew, setIsShowModelAddNew] = useState(false);
    const [isShowModelEdit, setIsShowModelEdit] = useState(false);

    const [listDeliveries, setListDeliveries] = useState([]);
    const [totalPages, setTotalPages] = useState(5);
    const [currentPage, setcurrentPage] = useState(0);

    const [keywordSearch, setKeywordSearch] = useState("");

    const [dataUpdateSupplier, setDataUpdateSupplier] = useState({});


    useEffect(() => {
        getDeliveries(1);

    }, [])




    const getDeliveries = async (page, keyword) => {
        let res = await fetchProjectsWithKeyword(page, removeWhiteSpace(keyword ? keyword : ""));
        if (res) {
            setListDeliveries(res.data);
            setTotalPages(res.totalPages);
        }
        return res;

    }

    const handlePageClick = (event) => {
        setcurrentPage(+event.selected);
        if (keywordSearch) {
            getDeliveries(+event.selected + 1, keywordSearch);
        } else {
            getDeliveries(+event.selected + 1);
        }
    }


    const updateTableSupplier = async () => {
        await getDeliveries(currentPage + 1, keywordSearch);
    }

    const ShowModelEditSupplier = (supplier) => {
        setIsShowModelEdit(true);
        setDataUpdateSupplier(supplier);
    }

    const handleSearch = () => {
        setcurrentPage(0);
        const fetchData = async () => {
            let res = await getDeliveries(1, keywordSearch);
            console.log(res);

            if (res.data.length == 0) {
                toast.warning("Vui lòng nhập từ khóa tìm kiếm khác");
            }
        };

        fetchData();
    }

    return (
        <>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-sm-12">
                        <h5 style={{ color: '#a5a2ad' }}>Quản lý các dự án</h5>
                        <div className="row no-gutters my-3 d-flex justify-content-between">
                            <div className="col-2">

                            </div>
                            <div className='col'>


                            </div>
                            <div className="col">
                                <div className="input-group">
                                    <input
                                        className="form-control border-secondary inputCSS"
                                        type="search"
                                        placeholder='Tìm kiếm...'
                                        id="example-search-input4"
                                        readOnly={false}
                                        onChange={(event) => setKeywordSearch(event.target.value)}
                                    />
                                    <div className="input-group-append">
                                        <button
                                            className="btn btn-outline-secondary border-left-0 rounded-0 rounded-right"
                                            type="button"
                                            onClick={handleSearch}
                                        >
                                            <i className="fa-solid fa-magnifying-glass"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {roleId === 4 ? '' : <div className="col-auto ButtonCSSDropdown">
                                <button
                                    className="btn btn-success border-left-0 rounded"
                                    type="button"
                                    onClick={() => setIsShowModelAddNew(true)}
                                ><i className="fa-solid fa-plus"></i>
                                    &nbsp;
                                    Thêm dự án mới

                                </button>
                            </div>}

                        </div>
                        <div className=" table-responsive">
                            <Table className="table text-center table-border table-hover  border-primary table-sm">
                                <thead>
                                    <tr>
                                        <th className="align-middle   text-nowrap">STT</th>
                                        <th className="align-middle  text-nowrap">Dự án</th>

                                    </tr>
                                </thead>
                                <tbody>

                                    {listDeliveries && listDeliveries.length > 0 &&
                                        listDeliveries.map((s, index) => (
                                            <tr key={`project${index}`}>
                                                <td className="align-middle text-color-primary">{index + 1}</td>
                                                <td className="align-middle">{s.projectName}</td>

                                                {roleId === 4 ? '' : <td className="align-middle " style={{ padding: '10px' }}>

                                                    <i className="fa-duotone fa-pen-to-square actionButtonCSS" onClick={() => ShowModelEditSupplier(s)}></i>
                                                </td>}

                                            </tr>
                                        ))


                                    }



                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-center  mt-3">
                <ReactPaginate
                    breakLabel="..."
                    nextLabel="Sau >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={totalPages}
                    forcePage={currentPage}
                    previousLabel="< Trước"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    containerClassName="pagination"
                    activeClassName="active"
                />
            </div>

            <ModelAddProject isShow={isShowModelAddNew} handleClose={() => setIsShowModelAddNew(false)} updateTableSupplier={updateTableSupplier} />
            <ModelEditProject isShow={isShowModelEdit} handleClose={() => setIsShowModelEdit(false)}
                dataUpdateSupplier={dataUpdateSupplier}
                updateTableSupplier={updateTableSupplier} />

        </>

    );
}

export default ProjectList;
