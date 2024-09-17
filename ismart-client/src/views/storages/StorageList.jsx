import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import ModelAddStorage from './AddStorage';
import ModelEditStorage from './EditStorage';
import { fetchStoragesWithKeyword } from '~/services/StorageServices';
import { removeWhiteSpace } from '~/validate';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import { getUserIdWarehouse } from '~/services/UserWarehouseServices';
import { updateUserWarehouseToUser } from '~/services/UserWarehouseServices';
import { deleteUserWarehouseToUser } from '~/services/UserWarehouseServices';
import { set } from 'lodash';
import { fetchAllStorages } from '~/services/StorageServices';

function StorageList() {
    const roleId = parseInt(localStorage.getItem('roleId'), 10);
    const userId = parseInt(localStorage.getItem('userId'), 10);

    const [isShowModelAddNew, setIsShowModelAddNew] = useState(false);
    const [isShowModelEdit, setIsShowModelEdit] = useState(false);

    const [listStorage, setListStorage] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [keywordSearch, setKeywordSearch] = useState("");

    const [dataUpdateStorage, setDataUpdateStorage] = useState({});
    const [currentPage, setcurrentPage] = useState(0);




    useEffect(() => {
        if (userId) {
            console.log('User ID:', userId);
            getStorages(1);
        } else {
            console.error('User ID is not defined.');
            toast.error('User ID is not defined.');
        }
        document.title = "danh sách kho";
    }, [userId])



    const getStorages = async (page, keyword) => {

        let res;
        if (roleId === 1) {
            res = await fetchAllStorages(res)
            
            setListStorage(res);
        }
        if (roleId === 4 || roleId === 3 || roleId === 2) {
            // Nhân viên: lấy danh sách kho cụ thể mà họ quản lý
            let res = await getUserIdWarehouse(userId);
            
            setListStorage(res);

        } else {
            // Quản lý và các vai trò khác: lấy danh sách kho với từ khóa tìm kiếm
            res = await fetchStoragesWithKeyword(page, removeWhiteSpace(keyword ? keyword : ""));
        }

    }
    const updateTableStorage = () => {
        getStorages(currentPage + 1);

    }
    const showModelEditStorage = (s) => {
        setIsShowModelEdit(true);
        setDataUpdateStorage(s);

    }
    const handlePageClick = (event) => {
        setcurrentPage(+event.selected);
        getStorages(+event.selected + 1);
    }

    const handleSearch = async () => {
        setcurrentPage(0);

        let res = await getStorages(1, keywordSearch);
        if (res.data.length == 0) {
            toast.warning("Vui lòng nhập từ khóa tìm kiếm khác");
        }

    }

    return (
        <>
            <div className="container" >
                <div className="row justify-content-center">
                    <div className="col-sm-12">
                        <h2 style={{ color: '#3b3bf5', marginTop: '20px' }}>Quản lý kho hàng</h2>
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
                                            onClick={() => handleSearch()}
                                        >
                                            <i className="fa-solid fa-magnifying-glass"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {
                                (roleId === 1 ) ?
                                    // roleId === 4 ? '' :
                                    <div className="col-auto ButtonCSSDropdown">
                                        <button
                                            className="btn btn-success border-left-0 rounded"
                                            type="button"
                                            onClick={() => setIsShowModelAddNew(true)}
                                        ><i className="fa-solid fa-plus"></i>
                                            &nbsp;
                                            Thêm kho hàng

                                        </button>
                                    </div>
                                    : ''
                            }

                        </div>
                        <div className=" table-responsive">
                            <Table className="table text-center table-border table-hover  border-primary table-sm">
                                <thead>
                                    <tr>
                                        <th className="align-middle   text-nowrap" style={{width: '100px'}} >STT</th>
                                        <th className="align-middle  text-nowrap" style={{ textAlign: 'left', width: '150px' }}>Kho hàng</th>

                                        <th className="align-middle  text-nowrap" style={{ textAlign: 'left', paddingLeft: '10px' }}>ĐỊA CHỈ</th>
                                        <th className="align-middle  text-nowrap" style={{ width: '150px' }}>SỐ ĐIỆN THOẠI</th>


                                    </tr>
                                </thead>
                                <tbody>

                                    {listStorage && listStorage.length > 0 &&
                                        listStorage.map((s, index) => (
                                            <tr key={`storage${index}`}>
                                                <td className="align-middle text-color-primary">{index + 1}</td>
                                                <td className="align-middle" style={{ textAlign: 'left' }}>{s.warehouseName}</td>
                                                <td className="align-middle" style={{ textAlign: 'left' }}>{s.warehouseAddress}</td>
                                                <td className="align-middle">{s.warehousePhone}</td>
                                                {
                                                    roleId === 1 ?
                                                        // roleId === 4 ? '' :
                                                        <td className="align-middle " style={{ padding: '10px' }}>

                                                            <i className="fa-duotone fa-pen-to-square actionButtonCSS"
                                                                onClick={() => showModelEditStorage(s)}>

                                                            </i>


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

            <ModelAddStorage isShow={isShowModelAddNew}
                handleClose={() => setIsShowModelAddNew(false)}
                updateTableStorage={updateTableStorage} />
            <ModelEditStorage isShow={isShowModelEdit}
                dataUpdateStorage={dataUpdateStorage}
                handleClose={() => setIsShowModelEdit(false)}
                updateTableStorage={updateTableStorage} />
        </>

    );
}

export default StorageList;
