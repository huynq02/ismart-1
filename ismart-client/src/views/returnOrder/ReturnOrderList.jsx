import React, { useEffect, useState } from 'react';
import { Table, Dropdown, DropdownButton, Col, Row, Badge } from 'react-bootstrap';
import { formatDate } from '~/validate';
import ReactPaginate from 'react-paginate';
import { format } from 'date-fns';
import { fetchReturnOrdersWithFilter, confirmReturnOrder, updateReturnOrder } from '~/services/ReturnOrderService';
import { fetchAllStorages } from '~/services/StorageServices';
import ModelAddReturnOrder from "./AddReturnOrder";
import ModalDetailReturnOrder from "./DetailReturnOrder";
import ModalConfirm from "./ModalConfirm";
import ModalEditReturnOrder from "./EditDataReturnOrder";
import { getUserIdWarehouse } from '~/services/UserWarehouseServices';
import { data } from 'autoprefixer';
import { toast } from 'react-toastify';


function ReturnOrderList() {
    const roleId = parseInt(localStorage.getItem('roleId'), 10);
    const userId = parseInt(localStorage.getItem('userId'), 10);

    const [totalWarehouse, setTotalWarehouse] = useState([]);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [selectedWarehouseId, setSelectedWarehouseId] = useState(null);

    const [pageSize, setPageSize] = useState(15);
    const [totalPages, setTotalPages] = useState(5);
    const [currentPage, setcurrentPage] = useState(0);


    const [sortedByStatusId, setSortedByStatusId] = useState();
    const [sortedByStatusName, setSortedByStatusName] = useState("");
    const [sortStatusOptions, setSortStatusOptions] = useState([]);

    const [sortedByDateId, setSortedByDateId] = useState();
    const [sortedByDateName, setSortedByDateName] = useState("");
    const [sortDateOptions, setSortDateOptions] = useState([]);
    const [listReturnOrder, setListReturnOrder] = useState([]);

    const [keywordSearch, setKeywordSearch] = useState("");
    const [currentDate, setCurrentDate] = useState();
    const [isShowDetailOrder, setIsShowDetailOrder] = useState(false);
    const [update, setUpdate] = useState(false);
    const [dataDetailOrder, setDataDetailOrder] = useState([]);

    const [isShowReturnOrderModelAdd, setIsShowReturnOrderModelAdd] = useState(false);
    const [isShowModalCancelImport, setIsShowModalCancelImport] = useState(false);
    const [isShowEditOrder, setIsShowEditOrder] = useState(false);
    const [isShowModalCancelOrder, setIsShowModalCancelOrder] = useState(false);
    const [dataEditOrder, setDataEditOrder] = useState([]);

    const [completed, setCompleted] = useState();
    useEffect(() => {
        getAllStorages();

        setSortStatusOptions([{ idSort: null, nameSort: "Tình trạng" },
        { idSort: 3, nameSort: "Đang tiến hành" },
        { idSort: 4, nameSort: "Đã hoàn thành" },
        { idSort: 5, nameSort: "Đã hủy" }]);

        setSortDateOptions([{ idSort: null, nameSort: "Tất cả ngày" },
        { idSort: 1, nameSort: "Gần nhất" },
        ]);
        setCurrentDate(format(new Date(), 'dd/MM/yyyy'));
    }, []);

    useEffect(() => {
        // Đảm bảo rằng getReturnOrders được gọi mỗi khi có sự thay đổi cần thiết
        getReturnOrders(1, pageSize, sortedByStatusId, sortedByDateId, keywordSearch, selectedWarehouseId);
    }, [pageSize, selectedWarehouseId, sortedByStatusId, sortedByDateId, keywordSearch, update]);

    const getAllStorages = async () => {
        let res = await fetchAllStorages();
        setTotalWarehouse(res);
    }

    const ShowModelConfirm = async (i) => {
        setIsShowModalCancelImport(true);
        setCompleted(i);
    }

    const openModalCancel = (i) => {
        if (i.statusType == "Completed" || i.statusType == "Cancel") {

            toast.warning("Không thể hủy đơn hàng đã nhập hoặc đã hủy");
        }
        else {
            setIsShowModalCancelOrder(true);
            setCompleted(i);
        }
    }

    const CancelOrder = async () => {
        if (completed) {
            await updateReturnOrder(completed.returnOrderId, completed.returnOrderCode, completed.returnedDate, completed.warehouseId
                , completed.supplierId, 5, completed.createdBy, completed.approvedBy)
                .then((data) => {
                    // console.log(data);
                    toast.success("Hủy đơn hàng thành công");
                    setUpdate(!update);
                })
                .catch((error) => {
                    toast.error(data.message);
                })
                .finally(() => {
                    setIsShowModalCancelOrder(false);
                })
        }
    }

    const ConfirmCancelImport = async () => {
        if (completed) {
            await confirmReturnOrder(completed.returnOrderId)
                .then((data) => {
                    toast.success("Xác nhận đơn hàng thành công");
                    setUpdate(!update);
                })
                .catch((error) => {
                    toast.error(data.message);
                })
                .finally(() => {
                    setIsShowModalCancelImport(false);
                })
        }
    }

    const getReturnOrders = async (page, pageSize = 15, sortedByStatusId, sortedByDateId, keywordSearch) => {
        if (roleId === 1) {
            setcurrentPage(page - 1);
            let res = await fetchReturnOrdersWithFilter(
                pageSize, page, selectedWarehouseId,
                "",
                sortedByStatusId,
                sortedByDateId, keywordSearch);
            setListReturnOrder(res.data);
            setTotalPages(res.totalPages);
        } else if (roleId === 2 || roleId === 3 || roleId === 4) {
            let warehouse = await getUserIdWarehouse(userId);

            setcurrentPage(page - 1);
            let res = await fetchReturnOrdersWithFilter(
                pageSize, page, warehouse[0].warehouseId,
                "",
                sortedByStatusId,
                sortedByDateId, keywordSearch);
            setListReturnOrder(res.data);
            setTotalPages(res.totalPages);
        }
    }

    const ShowDetailOrder = (oid) => {
        setDataDetailOrder(oid);
        setIsShowDetailOrder(true);
    }

    const handleStorageClickTotal = () => {
        setSelectedWarehouse("Tất cả kho");
        setSelectedWarehouseId(null);
    }

    const handleStorageClick = async (warehouse) => {

        setSelectedWarehouse(warehouse.warehouseName);
        setSelectedWarehouseId(warehouse.warehouseId);
        // getImportOrders(1, pageSize);
    }

    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
    }

    const handleSortStatusClick = (sort) => {
        setSortedByStatusId(sort.idSort);
        setSortedByStatusName(sort.nameSort);
        // getImportOrders(1, pageSize);

    }

    const ShowEditDetailOrder = (order) => {
        if (order.statusType == "Completed" || order.statusType == "Cancel") {

            toast.warning("Không thể sửa đơn hàng đã nhập hoặc đã hủy");
        } else {
            setIsShowEditOrder(true);
            // console.log(order);
            setDataEditOrder(order);
        }
    }

    const handleSortDateClick = (sort) => {
        setSortedByDateId(sort.idSort);
        setSortedByDateName(sort.nameSort);
        // getImportOrders(1, pageSize, selectedWarehouseId, sortedByStatusId, sort.idSort); // Gọi lại hàm lấy dữ liệu với tham số mới
    }

    const handlePageClick = (event) => {
        getReturnOrders(+event.selected + 1, pageSize, selectedWarehouseId, sortedByStatusId, sortedByDateId);
    }

    const handleSearch = () => {
        getReturnOrders(1, pageSize, selectedWarehouseId, sortedByStatusId, sortedByDateId, keywordSearch);
    }

    const updateTable = () => {
        getReturnOrders(currentPage + 1, pageSize, selectedWarehouseId, sortedByStatusId, sortedByDateId);
    }

    return (
        <>
            <div className="container" style={{ maxWidth: "1600px" }}>
                <div className="row justify-content-center">
                    <div className="col-sm-12">

                        <h2 style={{ color: '#3b3bf5', marginTop: '20px' }}>Quản lý đơn hàng trả lại</h2>
                        <div className="row no-gutters my-3 d-flex justify-content-between">
                            <Row>
                                {roleId == 1 ?
                                    <Col md={2}>
                                        <DropdownButton
                                            className="DropdownButtonCSS ButtonCSSDropdown"
                                            title={selectedWarehouse ? selectedWarehouse : "Tất cả Kho"}
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
                                    </Col> :
                                    <Col md={2}>
                                        <input type="text" className="form-control inputCSS"
                                            aria-describedby="emailHelp" value={selectedWarehouse} disabled />
                                    </Col>
                                }

                                <Col md={1}>
                                    <div className="input-group mb-3">
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Nhập pageSize"
                                            value={pageSize}
                                            onChange={handlePageSizeChange}
                                        />
                                    </div>
                                </Col>
                                {/* lọc tình trạng và sắp xếp theo ngày */}
                                <Col md={2}>
                                    <DropdownButton className="DropdownButtonCSS ButtonCSSDropdown" title={sortedByStatusName ? sortedByStatusName : "Tình trạng"} variant="success" style={{ zIndex: 999 }}>
                                        {sortStatusOptions.map((s, index) => (
                                            <Dropdown.Item key={`sort ${index}`} eventKey={s.nameSort} onClick={(e) => handleSortStatusClick(s, e)}>{s.nameSort}</Dropdown.Item>
                                        ))}
                                    </DropdownButton>
                                </Col>
                                <Col md={2}>
                                    <DropdownButton className="DropdownButtonCSS ButtonCSSDropdown" title={sortedByDateName ? sortedByDateName : "Sắp xếp theo ngày"} variant="success" style={{ zIndex: 999 }}>
                                        {sortDateOptions.map((s, index) => (
                                            <Dropdown.Item key={`sortDate ${index}`} eventKey={s.nameSort} onClick={(e) => handleSortDateClick(s, e)}>{s.nameSort}</Dropdown.Item>
                                        ))}
                                    </DropdownButton>
                                </Col>

                                <Col md={3}>
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

                                </Col>
                                {(roleId === 1 || roleId === 3) ?

                                    <Col md={2}>
                                        <div className="col-auto ButtonCSSDropdown">
                                            <button
                                                className="btn btn-success border-left-0 rounded"
                                                type="button"
                                                onClick={() => setIsShowReturnOrderModelAdd(true)}
                                            ><i className="fa-solid fa-plus"></i>
                                                &nbsp;
                                                Thêm lô trả hàng

                                            </button>
                                        </div>

                                    </Col>
                                    : ''
                                }
                            </Row>



                        </div>
                        <div className=" table-responsive" style={{ overflowY: 'auto', overflowX: 'auto' }}>
                            <Table className="table text-center table-border table-hover  border-primary table-sm">
                                <thead>
                                    <tr>
                                        <th className="align-middle  text-nowrap position-sticky" style={{ left: 0 }}>STT</th>
                                        <th className="align-middle  text-nowrap">Mã<br />đơn hàng</th>
                                        <th className="align-middle  text-nowrap">Người <br />tạo đơn hàng</th>
                                        <th className="align-middle  text-nowrap">Nhà <br />cung cấp</th>
                                        {/* <th className="align-middle  text-nowrap">Tổng <br />đơn hàng</th> */}
                                        <th className="align-middle  text-nowrap">Ngày <br />tạo đơn</th>
                                        <th className="align-middle  text-nowrap">Tình trạng</th>

                                        <th className="align-middle  text-nowrap">Người <br />xác nhận</th>
                                        <th className="align-middle  text-nowrap">Tuỳ chọn</th>
                                        {/* <th className="align-middle  text-nowrap">Xem <br />chi tiết</th>
                                        {roleId === 2 || roleId === 1 ? <th className="align-middle  text-nowrap">Hủy</th> : ''}
                                        {roleId === 2 || roleId === 1 ? <th className="align-middle  text-nowrap">Chỉnh sửa</th> : ''} */}
                                        {/* {roleId === 2 ? <th className="align-middle  text-nowrap">Hủy <br />đơn hàng</th> : ''}

                                        {roleId === 3 ? <th className="align-middle  text-nowrap">Tạo BarCode</th> : ''} */}

                                        {roleId === 2 || roleId === 1 ? <th className="align-middle  text-nowrap position-sticky" style={{ right: 0 }}>Hành động</th> : ''}
                                    </tr>
                                </thead>
                                <tbody>
                                    {listReturnOrder && listReturnOrder.length > 0
                                        && listReturnOrder.map((i, index) => (
                                            <tr key={`returnOrder${index}`}>
                                                <td className="align-middle position-sticky" style={{ left: 0 }}>{index + 1}</td>
                                                <td className="align-middle">{i.returnOrderCode}</td>
                                                <td className="align-middle">{i.createdByName}</td>
                                                {/* <td className="align-middle">{formattedAmount(i.totalPrice)}</td> */}
                                                <td className="align-middle">{(i.supplierName)}</td>
                                                <td className="align-middle">{formatDate(i.returnedDate)}</td>
                                                {/* <td className="align-middle">{i.warehouseName}</td>
                                                <td className="align-middle">{i.deliveryName}</td> */}


                                                <td className="align-middle">
                                                    {i.statusType === "On Progress" ?
                                                        <Badge style={{ backgroundColor: "#0c7a42" }}>Đang tiến hành</Badge> :
                                                        i.statusType === "Completed" ?
                                                            <Badge bg="success">Đã hoàn thành</Badge> :
                                                            <Badge bg="danger">Đã huỷ</Badge>}
                                                </td>


                                                <td className="align-middle">{i.approvedByName}</td>

                                                {/* {roleId === 2 && i.statusType === "On Progress" ?
                                                    <td className="align-middle"> <i className="fa-solid fa-ban actionButtonCSS"
                                                        onClick={() => ShowModalCancelExport(i)}></i></td>
                                                    : ''
                                                } */}

                                                {/* {roleId === 2 && i.statusType === "On Progress" ? <td className="align-middle " style={{ padding: '10px' }}>

                                                    <i className="fa-duotone fa-pen-to-square actionButtonCSS" onClick={() => ShowEditDetailOrder(i)}></i>
                                                </td> : <td></td>} */}
                                                <td className="align-middle">
                                                    <i className="fa-solid fa-circle-info actionButtonCSS" title="Chi tiết" onClick={() => ShowDetailOrder(i)}></i>
                                                    {(roleId === 1 || roleId === 2) ?
                                                        <i className="fa-solid fa-pen-to-square actionButtonCSS" title="Chỉnh sửa" onClick={() => ShowEditDetailOrder(i)}></i>
                                                        : ''}
                                                    {(roleId === 1 || roleId === 2) ?
                                                        <i className="fa-solid fa-ban actionButtonCSS" title="Huỷ đơn hàng"
                                                            onClick={() => openModalCancel(i)}></i> : ''}
                                                </td>


                                                {(roleId === 1 || roleId === 2) ? <td className='position-sticky ' style={{ right: 0, minWidth: '150px' }}> <button
                                                    className="btn btn-success "
                                                    type="button"
                                                    onClick={() => ShowModelConfirm(i)}
                                                    style={{ backgroundColor: i.statusType === "Completed" ? "#0c7a42" : i.statusType === "On Progress" ? "#2275b7" : "#ea5455", fontWeight: 'bold' }}
                                                    disabled={i.statusType === "Cancel" || i.statusType === "Completed" || i.statusType === "Active" || (roleId !== 1 && roleId !== 2)}
                                                >{i.statusType === "Completed" ? "Đã trả hàng" : i.statusType === "On Progress" ? "Trả hàng" : "Đã huỷ"}
                                                </button></td> : ''}
                                            </tr>
                                        ))}
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
                    pageRangeDisplayed={5}
                    forcePage={currentPage}
                    onPageChange={handlePageClick}
                    pageCount={totalPages}
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

            < ModelAddReturnOrder isShow={isShowReturnOrderModelAdd}
                handleClose={() => setIsShowReturnOrderModelAdd(false)}
                updateTable={updateTable}
            />
            <ModalConfirm isShow={isShowModalCancelImport} handleClose={() => setIsShowModalCancelImport(false)}
                title="Xác nhận đơn trả hàng" ConfirmCancel={ConfirmCancelImport} />
            <ModalConfirm isShow={isShowModalCancelOrder} handleClose={() => setIsShowModalCancelOrder(false)}
                title="Hủy đơn trả hàng" ConfirmCancel={CancelOrder} />
            <ModalDetailReturnOrder isShow={isShowDetailOrder} handleClose={() => setIsShowDetailOrder(false)} detailOrder={dataDetailOrder} />
            <ModalEditReturnOrder isShow={isShowEditOrder} handleClose={() => setIsShowEditOrder(false)} detailOrderEdit={dataEditOrder} updateTable={updateTable} />
        </>
    )




}


export default ReturnOrderList;