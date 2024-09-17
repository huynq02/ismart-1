import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { fetchCategoriesWithKeyword } from '~/services/CategoryServices';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import { removeWhiteSpace } from '~/validate';
import ModelAddCategory from './AddCategory';
import ModelEditCategory from './EditCategory';

function CategoryList() {
    const roleId = parseInt(localStorage.getItem('roleId'), 10);;
    const [isShowModelAddNew, setIsShowModelAddNew] = useState(false);
    const [isShowModelEdit, setIsShowModelEdit] = useState(false);


    const [listCategory, setListCategory] = useState({});
    const [totalPages, setTotalPages] = useState(5);
    const [currentPage, setCurrentPage] = useState(0);
    const [keywordSearch, setKeywordSearch] = useState("");

    const [dataUpdateCategory, setDataUpdateCategory] = useState({});


    useEffect(() => {
        getCategory(1);

    }, [])


    const getCategory = async (page, keyword) => {
        let res = await fetchCategoriesWithKeyword(page, removeWhiteSpace(keyword ? keyword : ""));
        if (res) {
            setListCategory(res.data);
            setTotalPages(res.totalPages);
        }
        return res;

    }

    const handlePageClick = (event) => {
        setCurrentPage(+event.selected);
        getCategory(+event.selected + 1, keywordSearch);
    }

    const updateTableCategory = () => {
        getCategory(currentPage + 1, keywordSearch);
    }

    const showModelEditCategory = (c) => {
        setIsShowModelEdit(true);
        console.log(c);
        setDataUpdateCategory(c);
    }

    const handleSearch = () => {
        setCurrentPage(0);
        const fetchData = async () => {
            let res = await getCategory(1, keywordSearch);
            // console.log(res);
            if (res.data.length == 0) {
                toast.warning("Vui lòng nhập từ khóa tìm kiếm khác");
            }
        };

        fetchData();
    }

    return (
        <>
            <div className="container" >
                <div className="row justify-content-center">
                    <div className="col-sm-12">
                        <h2 style={{ color: '#3b3bf5', marginTop: '20px' }}>Quản lý danh mục</h2>
                        <div className="row no-gutters my-3 d-flex justify-content-between">
                            <div className="col">

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

                            {
                                (roleId == 1 || roleId == 2) ?
                                    <div className="col-auto ButtonCSSDropdown">
                                        <button
                                            className="btn btn-success border-left-0 rounded"
                                            type="button"
                                            onClick={() => setIsShowModelAddNew(true)}
                                        ><i className="fa-solid fa-plus"></i>
                                            &nbsp;
                                            Thêm danh mục

                                        </button>
                                    </div>
                                    : ''
                            }
                        </div>
                        <div className=" table-responsive">
                            <Table className="table text-center table-border table-hover  border-primary table-sm">
                                <thead>
                                    <tr>
                                        <th className="align-middle   text-nowrap" style={{ width: '100px' }}>STT</th>
                                        <th className="align-middle  text-nowrap" style={{ textAlign: 'left', paddingLeft: '10px' }}>Danh mục</th>
                                        {/* <th className="align-middle  text-nowrap">Chi tiết</th> */}


                                    </tr>
                                </thead>
                                <tbody>

                                    {listCategory && listCategory.length > 0 &&
                                        listCategory.map((s, index) => (
                                            <tr key={`storage${index}`}>
                                                <td className="align-middle text-color-primary" style={{ width: '100px' }}>{index + 1}</td>
                                                <td className="align-middle text-truncate" style={{ paddingLeft: '10px', textAlign: 'left' }}>{s.categoryName}</td>
                                                {/* <td className="align-middle " style={{ textAlign: 'left' }} >{s.description}</td> */}
                                                {
                                                    (roleId == 1 || roleId == 2) ?
                                                        <td className="align-middle " style={{ padding: '10px', width: '100px' }}>

                                                            <i className="fa-duotone fa-pen-to-square actionButtonCSS" onClick={() => showModelEditCategory(s)}></i>


                                                        </td>
                                                        : ''
                                                }

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
            <ModelAddCategory isShow={isShowModelAddNew}
                handleClose={() => setIsShowModelAddNew(false)}
                updateTableCategory={updateTableCategory} />
            <ModelEditCategory isShow={isShowModelEdit}
                handleClose={() => setIsShowModelEdit(false)}
                updateTableCategory={updateTableCategory}
                dataUpdateCategory={dataUpdateCategory} />
        </>



    );
}

export default CategoryList;
