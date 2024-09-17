import React, { useEffect, useState } from 'react';
import { Table, Modal, Button, Row, Col, Form, DropdownButton, Dropdown } from "react-bootstrap"
import { useNavigate } from 'react-router-dom';

import SwitchButton from '../components/others/SwitchButton';
import SwitchButtonUser from '../components/others/SwitchButton/SwitchButtonUser';
import ModalChangeStatusUser from '../components/others/Modal/ModalChangeStatusUser';
import { updateUserStatus } from '~/services/UserServices';
import ReactPaginate from 'react-paginate';
import ModalAddAccount from './AddAccount';
import ModalEditAccount from './EditAccount';
import { fetchUserWithFilter } from '~/services/UserServices';
import { fetchAllStorages } from "~/services/StorageServices";
import { set } from 'lodash';
import { getUserIdWarehouse } from '~/services/UserWarehouseServices';

const ListAccount = () => {
    const roleId = parseInt(localStorage.getItem('roleId'), 10);
    const userId = parseInt(localStorage.getItem('userId'), 10);
    const navigate = useNavigate();
    //Check for role ID and redirect if not authorized
    useEffect(() => {
        if (roleId !== 1) {
            navigate('/ban-khong-co-quyen-truy-cap');
            // Không có quyền truy cập vào trang này
            // Chuyển hướng về trang chủ hoặc trang khác
            //  nếu người dùng không được ủy quyền
        }
    }, [roleId, navigate]);

    const [isShowModelAdd, setIsShowModelAdd] = useState(false);

    const [isShowModelEdit, setIsShowModelEdit] = useState(false);
    const [dataUserEdit, setDataUserEdit] = useState([]);

    const [listUser, setListUser] = useState([]);
    const [totalUser, setTotalUser] = useState([]);
    const [totalPage, setTotalPage] = useState(5);

    const [currentPage, setcurrentPage] = useState(0);

    const [keywordSearch, setKeywordSearch] = useState("");
    const [optionRole, setOptionRole] = useState();
    const [optionStatus, setOptionStatus] = useState();


    const [totalWarehouse, setTotalWarehouse] = useState([]);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [selectedWarehouseId, setSelectedWarehouseId] = useState(null);

    const [isShowModalChangeStatus, setIsShowModalChangeStatus] = useState(false);
    const [dataUpdateStatus, setdataUpdateStatus] = useState([]);



    useEffect(() => {
        getUsers(1);
        getAllStorages();
    }, [])

    useEffect(() => {
        getUsers(1);
    }, [optionRole, selectedWarehouseId, optionStatus, keywordSearch])


    const getUsers = async (page) => {
        setcurrentPage(page - 1);
        let res = await fetchUserWithFilter(page, optionRole, selectedWarehouseId, optionStatus, keywordSearch);
        // console.log("res: ", res);
        setTotalUser(res.data);
        setTotalPage(res.totalPages);

    }
    const getAllStorages = async () => {
        let res = await fetchAllStorages();
        setTotalWarehouse(res);
    }

    const handlePageClick = (event) => {
        setcurrentPage(+event.selected);
        getUsers(+event.selected + 1);
    }

    const handleSelectRole = (event) => {
        setOptionRole(event.target.value);
    }

    const handleSelectStatus = (event) => {
        setOptionStatus(event.target.value);
    }
    const handleStorageClickTotal = () => {
        setSelectedWarehouse("Tất cả kho");
        setSelectedWarehouseId("");
    }
    const handleStorageClick = (warehouse) => {
        setSelectedWarehouse(warehouse.warehouseName);
        setSelectedWarehouseId(warehouse.warehouseId);

    }

    const handleSearch = () => {
        getUsers(1);
    }


    const showModelEditAccount = (user) => {
        setDataUserEdit(user);
        setIsShowModelEdit(true);
    }



    const updateTable = () => {
        getUsers(currentPage + 1);
    }

    const handleChangeStatus = async (user) => {
        setdataUpdateStatus(user);
        // console.log("handleChangeStatus: ", user);
        setIsShowModalChangeStatus(true);

    }
    const confirmChangeStatus = async (confirm) => {
        if (confirm) {
            let res = await updateUserStatus(dataUpdateStatus.userId);
            // console.log(res);
            // await updateUserStatus(dataUpdateStatus.userId);
            getUsers(currentPage + 1);
        }
    }
    return (<>


        <div className="container">
            <div className="row justify-content-center">
                <div className="col-sm-12">
                    <h2 style={{ color: '#3b3bf5', marginTop: '20px' }}>Quản lý các tài khoản</h2>
                    <div className="row no-gutters my-3 d-flex justify-content-between">
                        <div className="col-2">
                            <Form.Select className='FormSelectCSS' onChange={handleSelectRole}>
                                <option value="">Vai trò</option>
                                <option value="2">WarehouseManager</option>
                                <option value="3">Staff</option>
                                <option value="4">Accountant</option>
                            </Form.Select>
                        </div>
                        <div className='col-2'>
                            <Form.Select className='FormSelectCSS' onChange={handleSelectStatus}>
                                <option value="">Tình trạng</option>
                                <option value="1">Đang làm việc</option>
                                <option value="2">Ngừng làm việc</option>
                            </Form.Select>

                        </div>
                        <div className='col-4'>
                            <Col md={2}>
                                <DropdownButton
                                    className="DropdownButtonCSS ButtonCSSDropdown"
                                    title={selectedWarehouse !== null ? selectedWarehouse : "Tất cả Kho"}
                                    variant="success"
                                    style={{ zIndex: 999 }}
                                >
                                    <Dropdown.Item eventKey=""
                                        onClick={() => handleStorageClickTotal()}>Tất cả kho</Dropdown.Item>
                                    {totalWarehouse && totalWarehouse.length > 0 && totalWarehouse.map((c, index) => (
                                        <Dropdown.Item
                                            key={`warehouse ${index}`}
                                            eventKey={c.warehouseName}
                                            onClick={(e) => handleStorageClick(c, e)}
                                        >
                                            {c.warehouseName}
                                        </Dropdown.Item>
                                    ))}
                                </DropdownButton>
                            </Col>
                        </div>
                        {/* add account */}
                        <div className='col-2'>
                            <Col md={2}>
                                <Button
                                    className="btn btn-success border-left-3 rounded ButtonCSS"
                                    type="button"
                                    onClick={() => setIsShowModelAdd(true)}
                                    style={{ width: '150px' }}
                                >
                                    &nbsp;Tạo tài khoản
                                </Button>
                            </Col>
                        </div>
                        <div className="col-2">
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
                        {roleId === 1 ? '' :
                            <div className="col-auto ButtonCSSDropdown">
                                <button
                                    className="btn btn-success border-left-0 rounded"
                                    type="button"
                                    onClick={() => setIsShowModelAdd(true)}
                                ><i className="fa-solid fa-plus"></i>
                                    &nbsp;
                                    Tạo tài khoản

                                </button>
                            </div>
                        }


                    </div>
                    <div className=" table-responsive">
                        <Table className="table text-center table-border table-hover  border-primary table-sm">
                            <thead>
                                <tr>
                                    <th className="align-middle  text-nowrap">STT</th>
                                    <th className="align-middle  text-nowrap" style={{ textAlign: 'left' }}>Mã nhân viên</th>
                                    <th className="align-middle  text-nowrap" style={{ textAlign: 'left' }}>Vai trò</th>
                                    <th className="align-middle  text-nowrap" style={{ textAlign: 'left' }}>Tên đầy đủ</th>
                                    <th className="align-middle  text-nowrap" style={{ textAlign: 'left' }}>Email</th>
                                    <th className="align-middle  text-nowrap" >Số điện thoại</th>
                                    <th className="align-middle  text-nowrap" style={{ textAlign: 'left', width: '50%' }}>Địa chỉ</th>
                                    <th className="align-middle  text-nowrap" >Hình ảnh</th>
                                    <th className="align-middle  text-nowrap" >Tình trạng</th>
                                    <th className="align-middle  text-nowrap"></th>

                                </tr>
                            </thead>
                            <tbody>
                                {totalUser && totalUser.length > 0
                                    && totalUser.map((i, index) => (
                                        <tr key={`userAccount${index}`}>
                                            <td className="align-middle text-color-primary">{index + 1}</td>
                                            <td className="align-middle" style={{ textAlign: 'left' }}>{i.userCode}</td>
                                            <td className="align-middle" style={{ textAlign: 'left' }}>{i.roleName}</td>
                                            <td className="align-middle" style={{ textAlign: 'left' }}>{i.fullName}</td>
                                            <td className="align-middle" style={{ textAlign: 'left' }}>{i.email}</td>
                                            <td className="align-middle" >{i.phone}</td>
                                            <td className="align-middle" style={{ textAlign: 'left', width: 'auto' }}>{i.address}</td>
                                            <td className="align-middle" ><img src={i.image} alt="alt" style={{ width: '110px', height: 'auto' }} /></td>

                                            <td className="align-middle" style={{ padding: '20px' }} >
                                                <SwitchButtonUser status={i.statusId} handleChangeStatus={() => handleChangeStatus(i)} />
                                            </td>

                                            {roleId === 1 ?
                                                <td className="align-middle " style={{ padding: '10px' }}>

                                                    <i className="fa-duotone fa-pen-to-square actionButtonCSS" onClick={() => showModelEditAccount(i)}></i>
                                                </td>
                                                : ''}
                                        </tr>
                                    ))}

                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>
        </div >

        <div className="d-flex justify-content-center  mt-3">
            <ReactPaginate
                breakLabel="..."
                nextLabel="Sau >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={totalPage}
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
        <ModalAddAccount isShow={isShowModelAdd}
            handleClose={() => setIsShowModelAdd(false)}
            updateTable={updateTable}
        />
        <ModalChangeStatusUser title="nhân viên"
            statusText1={<span style={{ color: '#2275b7' }}>Đang làm việc</span>}
            statusText2={<span style={{ color: '#ff0000' }}>Ngừng làm việc</span>}
            isShow={isShowModalChangeStatus}
            handleClose={() => setIsShowModalChangeStatus(false)}
            confirmChangeStatus={confirmChangeStatus}
            name={<span style={{ color: 'black' }}>{dataUpdateStatus.supplierName}</span>}
            status={dataUpdateStatus.status}

        />
        <ModalEditAccount isShow={isShowModelEdit}
            handleClose={() => setIsShowModelEdit(false)}
            dataUserEdit={dataUserEdit}
            updateTable={updateTable}
        />
    </>)
}

export default ListAccount;