import React, { useEffect, useState } from 'react';
import { Table, Form } from 'react-bootstrap';
import { fetchDeliveriesWithKeyword, updateStatusDelivery } from '~/services/DeliveryServices';
import { removeWhiteSpace } from '~/validate';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import ModelAddDelivery from './AddDelivery';
import ModelEditDelivery from './EditDelivery';
import ModalConfirm from '../components/others/Modal/ModalConfirm';
import SwitchButton from '../components/others/SwitchButton';

function DeliveryList() {
    const roleId = parseInt(localStorage.getItem('roleId'), 10);;
    const [isShowModelAddNew, setIsShowModelAddNew] = useState(false);
    const [isShowModelEdit, setIsShowModelEdit] = useState(false);
    const [isShowModalConfirm, setIsShowModalConfirm] = useState(false);

    const [listDeliveries, setListDeliveries] = useState([]);
    const [totalPages, setTotalPages] = useState(5);
    const [currentPage, setcurrentPage] = useState(0);

    const [keywordSearch, setKeywordSearch] = useState("");
    const [selectOption, setSelectOption] = useState();


    const [dataUpdateSupplier, setDataUpdateSupplier] = useState({});

    const [dataUpdateStatus, setDataUpdateStatus] = useState({});

    useEffect(() => {
        getDeliveries(1);

    }, [])




    const getDeliveries = async (page, keyword) => {

        let res = await fetchDeliveriesWithKeyword(page, removeWhiteSpace(keyword ? keyword : ""));
        if (res) {
            // console.log("res.data: ", res.data);
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

    const ShowModelEditSupplier = (delivery) => {
        setIsShowModelEdit(true);
        setDataUpdateSupplier(delivery);
    }

    // const handleFilterStatus = (event) => {
    //     const selectOption = event.target.value;
    //     setSelectOption(selectOption);
    // }

    const handleChangeStatus = async (delivery) => {
        setDataUpdateStatus(delivery);
        setIsShowModalConfirm(true);
    }

    const confirmChangeStatus = async (confirm) => {
        if (confirm) {
            await updateStatusDelivery(dataUpdateStatus.deliveyId);
            getDeliveries(currentPage + 1, keywordSearch);


        }
    }


    const handleSearch = () => {
        setcurrentPage(0);
        const fetchData = async () => {
            let res = await getDeliveries(1, keywordSearch);
            // console.log("res: ", res);

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
                        <h2 style={{ color: '#3b3bf5', marginTop: '20px' }}>Quản lý bên vận chuyển</h2>
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
                            {
                                (roleId == 1) ?
                                    <div className="col-auto ButtonCSSDropdown">
                                        <button
                                            className="btn btn-success border-left-0 rounded"
                                            type="button"
                                            onClick={() => setIsShowModelAddNew(true)}
                                        ><i className="fa-solid fa-plus"></i>
                                            &nbsp;
                                            Thêm bên vận chuyển

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
                                        <th className="align-middle  text-nowrap" style={{ textAlign: 'left', paddingLeft: '10px' }}>Bên vận chuyển</th>
                                        {
                                            (roleId == 1) ?
                                                <th className="align-middle  text-nowrap" style={{ width: '250px' }}>Tình trạng</th>
                                                : ''
                                        }
                                        {
                                            (roleId == 1) ?
                                                <th className="align-middle  text-nowrap"></th>
                                                : ''
                                        }
                                    </tr>
                                </thead>
                                <tbody>

                                    {listDeliveries && listDeliveries.length > 0 &&
                                        listDeliveries.map((s, index) => (
                                            <tr key={`supplier${index}`}>
                                                <td className="align-middle text-color-primary">{index + 1}</td>
                                                <td className="align-middle" style={{ textAlign: 'left', paddingLeft: '10px' }}>{s.deliveryName}</td>
                                                {
                                                    (roleId == 1) ?
                                                        <td className="align-middle">
                                                            <SwitchButton status={s.statusId} handleChangeStatus={() => handleChangeStatus(s)} />

                                                        </td>
                                                        : ''
                                                }
                                                {
                                                    (roleId == 1) ?
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

            <ModelAddDelivery isShow={isShowModelAddNew} handleClose={() => setIsShowModelAddNew(false)} updateTableSupplier={updateTableSupplier} />
            <ModelEditDelivery isShow={isShowModelEdit} handleClose={() => setIsShowModelEdit(false)}
                dataUpdateSupplier={dataUpdateSupplier}
                updateTableSupplier={updateTableSupplier} />

            <ModalConfirm title="bên vận chuyển"
                statusText1={<span style={{ color: '#2275b7' }}>Đang hợp tác</span>}
                statusText2={<span style={{ color: '#ff0000' }}>Ngừng hợp tác</span>} isShow={isShowModalConfirm}
                handleClose={() => setIsShowModalConfirm(false)}
                confirmChangeStatus={confirmChangeStatus}
                name={<span style={{ color: 'black' }}>{dataUpdateStatus.deliveryName}</span>}
                status={dataUpdateStatus.status}

            />
        </>

    );
}

export default DeliveryList;
