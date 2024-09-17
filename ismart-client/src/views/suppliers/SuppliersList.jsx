import React, { useEffect, useState } from 'react';
import { Table, Form } from 'react-bootstrap';
import ModelAddSupplier from './AddSupplier';
import ModelEditSupplier from './EditSupplier';
import ModalConfirm from '../components/others/Modal/ModalConfirm';
import SwitchButton from '../components/others/SwitchButton';
import { fetchSuppliersWithKeyword, updateStatusSupplier } from '~/services/SupplierServices';
import { removeWhiteSpace } from '~/validate';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';


function SupplierList() {
    const roleId = parseInt(localStorage.getItem('roleId'), 10);

    const [isShowModelAddNew, setIsShowModelAddNew] = useState(false);
    const [isShowModelEdit, setIsShowModelEdit] = useState(false);
    const [isShowModalConfirm, setIsShowModalConfirm] = useState(false);

    const [listSuppliers, setListSuppliers] = useState([]);
    const [totalPages, setTotalPages] = useState(5);
    const [currentPage, setcurrentPage] = useState(0);

    const [keywordSearch, setKeywordSearch] = useState("");
    const [selectOption, setSelectOption] = useState();

    const [dataUpdateSupplier, setDataUpdateSupplier] = useState({});
    const [dataUpdateStatus, setdataUpdateStatus] = useState({});


    useEffect(() => {
        getSuppliers(1);

    }, [])



    useEffect(() => {
        setcurrentPage(0);
        const fetchData = async () => {
            let res = await getSuppliers(1, selectOption, keywordSearch);
            console.log(res);

            if (res.data.length == 0) {
                toast.warning("Vui lòng nhập từ khóa tìm kiếm khác");
            }
        };

        fetchData();
    }, [selectOption]);

    const getSuppliers = async (page, statusId, keyword) => {
        let res = await fetchSuppliersWithKeyword(page, statusId, removeWhiteSpace(keyword ? keyword : ""));
        if (res) {
            setListSuppliers(res.data);
            setTotalPages(res.totalPages);
        }
        return res;

    }

    const handlePageClick = (event) => {
        setcurrentPage(+event.selected);
        if (keywordSearch) {
            getSuppliers(+event.selected + 1, selectOption, keywordSearch);
        } else {
            getSuppliers(+event.selected + 1, selectOption);
        }
    }

    const handleFilterStatus = (event) => {
        const selectOption = event.target.value;
        setSelectOption(selectOption);
    }


    const handleChangeStatus = async (supplier) => {
        setdataUpdateStatus(supplier);
        setIsShowModalConfirm(true);
    }

    const updateTableSupplier = async () => {
        await getSuppliers(currentPage + 1, selectOption, keywordSearch);
    }

    const ShowModelEditSupplier = (supplier) => {
        setIsShowModelEdit(true);
        setDataUpdateSupplier(supplier);
    }


    const confirmChangeStatus = async (confirm) => {
        if (confirm) {
            await updateStatusSupplier(dataUpdateStatus.supplierId);
            getSuppliers(currentPage + 1, selectOption, keywordSearch);
        }
    }

    const handleSearch = () => {
        setcurrentPage(0);
        const fetchData = async () => {
            let res = await getSuppliers(1, selectOption, keywordSearch);
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
                        <h2 style={{ color: '#3b3bf5', marginTop: '20px' }}>Quản lý nhà cung cấp</h2>
                        <div className="row no-gutters my-3 d-flex justify-content-between">
                            <div className="col-2">
                                <Form.Select aria-label="Default select example" className='formSelectCSS' onChange={(event) => handleFilterStatus(event)} value={selectOption}>
                                    <option value="">Tất cả</option>
                                    <option value="1">Đang hợp tác</option>
                                    <option value="2">Ngừng hợp tác</option>
                                </Form.Select>
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
                            {
                                (roleId == 1 || roleId == 2) ?
                                    <div className="col-auto ButtonCSSDropdown">
                                        <button
                                            className="btn btn-success border-left-0 rounded"
                                            type="button"
                                            onClick={() => setIsShowModelAddNew(true)}
                                        ><i className="fa-solid fa-plus"></i>
                                            &nbsp;
                                            Thêm nhà cung cấp

                                        </button>
                                    </div>
                                    : ''
                            }

                        </div>
                        <div className=" table-responsive">
                            <Table className="table text-center table-border table-hover  border-primary table-sm">
                                <thead>
                                    <tr>
                                        <th className="align-middle   text-nowrap">STT</th>
                                        <th className="align-middle  text-nowrap" style={{ textAlign: 'left', paddingLeft: '10px' }}>NHÀ CUNG CẤP</th>

                                        <th className="align-middle  text-nowrap" style={{ textAlign: 'left', paddingLeft: '10px' }}>EMAIL</th>
                                        <th className="align-middle  text-nowrap">SỐ ĐIỆN THOẠI</th>
                                        {
                                            (roleId == 1 || roleId == 2) ?
                                                <th className="align-middle  text-nowrap">Tình trạng</th>
                                                : ''
                                        }




                                    </tr>
                                </thead>
                                <tbody>

                                    {listSuppliers && listSuppliers.length > 0 &&
                                        listSuppliers.map((s, index) => (
                                            <tr key={`supplier${index}`} >
                                                <td className="align-middle text-color-primary">{index + 1}</td>
                                                <td className="align-middle" style={{ textAlign: 'left', paddingLeft: '10px' }}>{s.supplierName}</td>
                                                <td className="align-middle" style={{ textAlign: 'left', paddingLeft: '10px' }}>{s.supplierEmail}</td>
                                                <td className="align-middle">{s.supplierPhone}</td>
                                                {
                                                    (roleId == 1 || roleId == 2) ?
                                                        <td className="align-middle">
                                                            <SwitchButton status={s.statusId} handleChangeStatus={() => handleChangeStatus(s)} />
                                                        </td>
                                                        : ''
                                                }


                                                {
                                                    (roleId == 1 || roleId == 2) ?
                                                        <td className="align-middle " style={{ padding: '10px' }}>

                                                            <i className="fa-duotone fa-pen-to-square actionButtonCSS" onClick={() => ShowModelEditSupplier(s)}></i>
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

            <ModelAddSupplier isShow={isShowModelAddNew} handleClose={() => setIsShowModelAddNew(false)} updateTableSupplier={updateTableSupplier} />
            <ModelEditSupplier isShow={isShowModelEdit} handleClose={() => setIsShowModelEdit(false)} dataUpdateSupplier={dataUpdateSupplier}
                updateTableSupplier={updateTableSupplier} />
            <ModalConfirm title="nhà cung cấp"
                statusText1={<span style={{ color: '#2275b7' }}>Đang hợp tác</span>}
                statusText2={<span style={{ color: '#ff0000' }}>Ngừng hợp tác</span>} isShow={isShowModalConfirm}
                handleClose={() => setIsShowModalConfirm(false)}
                confirmChangeStatus={confirmChangeStatus}
                name={<span style={{ color: 'black' }}>{dataUpdateStatus.supplierName}</span>} status={dataUpdateStatus.status}

            />
        </>

    );
}

export default SupplierList;
