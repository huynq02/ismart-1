import React, { useEffect, useState } from 'react';
import { Table, Form, Col, DropdownButton, Dropdown, Badge } from 'react-bootstrap';
import { removeWhiteSpace } from '~/validate';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import { fetchUserByUserId } from '~/services/UserServices';
import { fetchAllStorages } from '~/services/StorageServices';
import { cancelInventoryCheck, fetchInventoryByWarehouseId } from '~/services/StockTakeServices';
import StockTakeDetail from './StockTakeDetail';
import ModalAddStockTake from './ModalAddStockTake';
import ConfirmStockTake from './ConfirmStockTake';
import ModalCancelStockTake from './ModalCancelStockTake';
import { downloadInventoryCheck } from '~/services/StockTakeServices';
import { formatDate } from '~/validate';
import { format } from 'date-fns';
import { getUserIdWarehouse } from "~/services/UserWarehouseServices";

const StockTakeList = () => {
    const roleId = parseInt(localStorage.getItem('roleId'), 10);
    const userId = parseInt(localStorage.getItem('userId'), 10);
    const warehouseId = parseInt(localStorage.getItem('warehouseId'), 10);


    const [listStockTake, setListStockTake] = useState([]);
    const [totalPages, setTotalPages] = useState(5);
    const [currentPage, setcurrentPage] = useState(0);

    const [totalWarehouse, setTotalWarehouse] = useState([]);

    const [selectedWarehouseId, setSelectedWarehouseId] = useState(1);
    const [selectedWarehouse, setSelectedWarehouse] = useState();

    const [isShowModalAddStock, setIsShowModalAddStock] = useState(false);

    const [isShowModalDetail, setIsShowModalDetail] = useState(false);
    const [detailData, setDetailData] = useState({});

    const [isShowModelConfirm, setIsShowModelConfirm] = useState(false);
    const [dataStock, setDataStock] = useState({});

    const [isShowModalCancelStock, setIsShowModalCancelStock] = useState(false);
    const [dataCancelStock, setDataCancelStock] = useState([]);

    const [currentDate, setCurrentDate] = useState();

    const formattedDate = (dateStr) => {
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }

    useEffect(() => {
        getStorageIdByUser(userId);
        getAllStorages();
        getAllStockTake(warehouseId);
        setCurrentDate(format(new Date(), 'dd/MM/yyyy'));
    }, [])

    const getStorageIdByUser = async () => {
        let res = await fetchUserByUserId(userId);
        setSelectedWarehouseId(warehouseId);
        setSelectedWarehouse(res.warehouseName);
    }

    const getAllStockTake = async (warehouseId) => {
        if (roleId === 1) {
            let res = await fetchInventoryByWarehouseId(warehouseId);
            setListStockTake(res);
        } else if (roleId === 2 || roleId === 4) {
            let warehouse = await getWarehouseById(userId);
            let res = await fetchInventoryByWarehouseId(warehouse.warehouseId);
            setListStockTake(res);
        }
    }
    const getWarehouseById = async (userId) => {
        let res = await getUserIdWarehouse(userId);
        return res[0];
    }
    const getAllStorages = async () => {
        let res = await fetchAllStorages();
        setTotalWarehouse(res);
    }

    const updateTableStock = (id, warehouseName) => {
        getAllStockTake(id);
        setSelectedWarehouseId(id);
        setSelectedWarehouse(warehouseName);
    }

    const handleStorageClick = async (warehouse) => {
        setSelectedWarehouse(warehouse.warehouseName);
        setSelectedWarehouseId(warehouse.warehouseId);
        updateTableStock(warehouse.warehouseId, warehouse.warehouseName);
    }

    const handleShowModalDetail = (detail) => {
        setIsShowModalDetail(true);
        setDetailData(detail);
    }

    const handlePrintStock = (detail) => {
        window.location.href = `https://localhost:7033/api/inventory-check/export-inventory-check/${detail.inventoryCheckId}`;
    }

    const ShowModelConfirm = (s) => {
        if (currentDate <= formatDate(s.checkDate)) {
            setIsShowModelConfirm(true);
            setDataStock(s);
        } else {
            toast.warning("Chưa đến ngày xác nhận");
        }
    }

    const ShowModalCancelStock = (data) => {
        setIsShowModalCancelStock(true);
        setDataCancelStock(data);
    }

    const ConfirmCancel = async (confirm) => {
        if (confirm) {
            await cancelInventoryCheck(dataCancelStock.inventoryCheckId);
            getAllStockTake(selectedWarehouseId);
        }
    }

    return (<>
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-sm-12">
                    <h2 style={{ color: '#3b3bf5', marginTop: '20px' }}>Quản lý kiểm kê</h2>
                    <div className="row no-gutters my-3 d-flex justify-content-between">
                        <Col md={2}>
                            {(roleId == 1) ?
                                <div className="col-2">
                                    <DropdownButton
                                        className="DropdownButtonCSS ButtonCSSDropdown"
                                        title={selectedWarehouse ? selectedWarehouse : "Hải Phòng"}
                                        variant="success"
                                        style={{ zIndex: 999 }}
                                    >
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
                                </div>
                                :
                                <Col md={2}>
                                    <input type="text" className="form-control inputCSS"
                                        aria-describedby="emailHelp"
                                        value={selectedWarehouse} disabled />
                                </Col>
                            }
                        </Col>
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
                                // onChange={(event) => setKeywordSearch(event.target.value)}
                                />
                                <div className="input-group-append">
                                    <button
                                        className="btn btn-outline-secondary border-left-0 rounded-0 rounded-right"
                                        type="button"
                                    // onClick={handleSearch}
                                    >
                                        <i className="fa-solid fa-magnifying-glass"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        {
                            ((roleId == 1) || (roleId === 4)) ?
                                <div className="col-auto ButtonCSSDropdown">
                                    <button
                                        className="btn btn-success border-left-0 rounded"
                                        type="button"
                                        onClick={() => setIsShowModalAddStock(true)}
                                    ><i className="fa-solid fa-plus"></i>
                                        &nbsp;
                                        Thêm đơn kiểm kê
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
                                    <th className="align-middle  text-nowrap" style={{ textAlign: 'left', paddingLeft: '10px' }}>Ngày kiểm hàng</th>
                                    <th className="align-middle  text-nowrap" style={{ width: '250px' }}>Tình trạng</th>
                                    <th className="align-middle  text-nowrap" style={{ width: '250px' }}>Tuỳ chọn</th>
                                    {(roleId === 1) ? <th className="align-middle  text-nowrap position-sticky" style={{ right: 0, minWidth: '150px' }}>Hành động</th> : ''}
                                </tr>
                            </thead>
                            <tbody>
                                {listStockTake && listStockTake.length > 0 &&
                                    listStockTake.map((s, index) => (
                                        <tr key={`supplier${index}`}>
                                            <td className="align-middle text-color-primary">{index + 1}</td>
                                            <td className="align-middle" style={{ textAlign: 'left', paddingLeft: '10px' }}>{formattedDate(s.checkDate)}</td>
                                            <td className="align-middle" style={{ color: s.status === "Cancel" ? "#ea5455" : "#2275b7" }}>
                                                {s.status === "On Progress" ?
                                                    <Badge style={{ backgroundColor: "#0c7a42" }}>Đang tiến hành</Badge> :
                                                    s.status === "Completed" ?
                                                        <Badge bg="success">Đã hoàn thành</Badge> :
                                                        <Badge bg="danger">Đã huỷ</Badge>}                                                </td>

                                            <td className="align-middle" style={{ textAlign: 'center', paddingLeft: '10px' }}>
                                                <i className="fa-solid fa-circle-info actionButtonCSS" title="Chi tiết" onClick={() => handleShowModalDetail(s)}></i>
                                                {(roleId === 1 || roleId === 4) ? (
                                                    s.status !== "On Progress" ? (
                                                        <i
                                                            className="fa-solid fa-ban"
                                                            style={{ color: 'red', padding: '5px' }}
                                                        ></i>
                                                    ) : (
                                                        <i
                                                            className="fa-solid fa-ban actionButtonCSS"
                                                            onClick={() => ShowModalCancelStock(s)}
                                                        ></i>
                                                    )
                                                ) : ''}
                                                <i className="fa-solid fa-download actionButtonCSS" title="Tải file về máy" onClick={() => handlePrintStock(s)}></i>
                                            </td>
                                            {(roleId === 1) ? <td className='position-sticky ' style={{ right: 0, minWidth: '150px' }}> <button
                                                className="btn btn-success "
                                                type="button"
                                                onClick={() => ShowModelConfirm(s)}
                                                style={{ backgroundColor: s.status === "Completed" ? "#0c7a42" : s.status === "On Progress" ? "#2275b7" : "#ea5455", fontWeight: 'bold' }}
                                                disabled={s.status === "Completed" || s.status === "Cancel" || (roleId !== 1 && roleId !== 3)}
                                            >
                                                {s.status === "Completed" ? "Đã xác nhận" : s.status === "On Progress" ? "Xác nhận" : "Đã huỷ"}
                                            </button></td> : ''}
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>

        {/* <div className="d-flex justify-content-center  mt-3">
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
        </div> */}

        <StockTakeDetail isShow={isShowModalDetail} handleClose={() => setIsShowModalDetail(false)}
            detailData={detailData} />
        <ModalAddStockTake isShow={isShowModalAddStock} handleClose={() => setIsShowModalAddStock(false)} updateTableStock={updateTableStock} />
        <ConfirmStockTake isShow={isShowModelConfirm} handleClose={() => setIsShowModelConfirm(false)} dataStock={dataStock} updateTableStock={updateTableStock} />
        <ModalCancelStockTake isShow={isShowModalCancelStock} handleClose={() => setIsShowModalCancelStock(false)}
            title="Hủy đơn kiểm kê" ConfirmCancel={ConfirmCancel} />
    </>)
}

export default StockTakeList