import React, { useEffect, useState } from 'react';
import { Table, Form } from 'react-bootstrap';

// import SwitchButton from '../components/others/SwitchButton';
import { removeWhiteSpace } from '~/validate';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import { fetchCustomerwithKeyword } from '~/services/CustomerServices';
import ModelAddCustomer from './AddCustomer';
import ModelEditCustomer from './EditCustomer';
import ModelCustomerTransaction from './CustomerTransaction';
import { forEach, get } from 'lodash';
import { getCustomerById } from '~/services/CustomerServices';

function CustomerList() {
    const roleId = parseInt(localStorage.getItem('roleId'), 10);

    const [isShowModelAddNew, setIsShowModelAddNew] = useState(false);
    const [isShowModelEdit, setIsShowModelEdit] = useState(false);
    const [listCustomer, setListCustomer] = useState([]);

    const [dataUpdateCustomer, setDataUpdateCustomer] = useState({});
    const [totalPages, setTotalPages] = useState(5);
    const [currentPage, setcurrentPage] = useState(0);

    const [keywordSearch, setKeywordSearch] = useState("");

    const [dataTransactions, setDataTransactions] = useState({});
    const [isShowModelTransactions, setIsShowModelTransactions] = useState(false);

    const [customerName, setCustomerName] = useState('');
    useEffect(() => {
        getListCustomer(1);
    }, []);


    useEffect(() => {
        setcurrentPage(0);
        const fetchData = async () => {
            let res = await getListCustomer(1, keywordSearch);

        };

        fetchData();
    }, []);



    const ShowModelEditCustomer = (customer) => {
        setDataUpdateCustomer(customer);
        setIsShowModelEdit(true);
    }

    const getListCustomer = async (page, keyword) => {
        let res = await fetchCustomerwithKeyword(page, removeWhiteSpace(keyword ? keyword : ""));
        if (res) {
            setListCustomer(res.data);
            setTotalPages(res.totalPages);
        }
    }

    const ShowModelCustomerTransactions = (customerId) => {
        setIsShowModelTransactions(true);
        setDataTransactions(customerId);
    }

    const handleSearch = () => {
        setcurrentPage(0);
        const fetchData = async () => {
            let res = await getListCustomer(1, keywordSearch);
            // console.log("fetchData: ", res);
        };

        fetchData();
    }
    const updateTableCustomer = async () => {
        await getListCustomer(currentPage + 1, keywordSearch);
    }

    const handlePageClick = (event) => {
        setcurrentPage(+event.selected);
        getListCustomer(+event.selected + 1, keywordSearch);
    }
    return (
        <>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-sm-12">
                        <h2 style={{ color: '#3b3bf5', marginTop: '20px' }}>Quản lý khách hàng</h2>
                        <div className="row no-gutters my-3 d-flex justify-content-between">

                            {/* <div className="col-2">
                                <Form.Select aria-label="Default select example" className='formSelectCSS' onChange={(event) => handleFilterStatus(event)} value={selectOption}>
                                    <option value="">Tất cả</option>
                                    <option value="1">Đang hợp tác</option>
                                    <option value="2">Ngừng hợp tác</option>
                                </Form.Select>
                            </div> */}

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
                                        >
                                            {/* <i className="fa-solid fa-plus"></i> */}
                                            &nbsp;
                                            Thêm khách hàng

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
                                        <th className="align-middle  text-nowrap" style={{ textAlign: 'left', paddingLeft: '10px' }}>KHÁCH HÀNG</th>
                                        <th className="align-middle  text-nowrap" style={{ textAlign: 'left', paddingLeft: '10px' }}>ĐỊA CHỈ</th>
                                        <th className="align-middle  text-nowrap" style={{ textAlign: 'left', paddingLeft: '10px' }}>EMAIL</th>
                                        <th className="align-middle  text-nowrap">SỐ ĐIỆN THOẠI</th>
                                        <th className="align-middle  text-nowrap">LỊCH SỬ <br />GIAO DỊCH</th>

                                        {/* {
                                            (roleId == 1 || roleId == 2) ?
                                                <th className="align-middle  text-nowrap">Tình trạng</th>
                                                : ''
                                        } */}




                                    </tr>
                                </thead>
                                <tbody>

                                    {listCustomer && listCustomer.length > 0 &&
                                        listCustomer.map((c, index) => (
                                            <tr key={`cumtomer${index}`} >
                                                <td className="align-middle text-color-primary">{index + 1}</td>
                                                <td className="align-middle" style={{ textAlign: 'left', paddingLeft: '10px' }}>{c.customerName}</td>
                                                <td className="align-middle" style={{ textAlign: 'left', paddingLeft: '10px' }}>{c.customerAddress}</td>
                                                <td className="align-middle" style={{ textAlign: 'left', paddingLeft: '10px' }}>{c.customerEmail}</td>
                                                <td className="align-middle">{c.customerPhone}</td>

                                                {/* {
                                                    (roleId == 1 || roleId == 2) ?
                                                        <td className="align-middle">
                                                            <SwitchButton status={s.statusId} handleChangeStatus={() => handleChangeStatus(s)} />
                                                        </td>
                                                        : ''
                                                } */}
                                                <td className="align-middle " style={{ padding: '10px' }}>

                                                    <i className="fa-solid fa-clock-rotate-left actionButtonCSS"
                                                        onClick={() => ShowModelCustomerTransactions(c)}
                                                    >

                                                    </i>
                                                </td>

                                                {
                                                    (roleId == 1 || roleId == 2) ?
                                                        <td className="align-middle " style={{ padding: '10px' }}>

                                                            <i className="fa-duotone fa-pen-to-square actionButtonCSS" onClick={() => ShowModelEditCustomer(c)}></i>
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

            <ModelAddCustomer isShow={isShowModelAddNew}
                handleClose={() => setIsShowModelAddNew(false)}
                updateTableCustomer={updateTableCustomer}
            />

            <ModelEditCustomer isShow={isShowModelEdit}
                handleClose={() => setIsShowModelEdit(false)}
                dataUpdateCustomer={dataUpdateCustomer}
                updateTableCustomer={updateTableCustomer}
            />

            <ModelCustomerTransaction isShow={isShowModelTransactions}
                handleClose={() => setIsShowModelTransactions(false)}
                dataTransaction={dataTransactions}
                
            />
        </>
    );
}

export default CustomerList;