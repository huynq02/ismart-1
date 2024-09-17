import { useEffect, useState } from "react"
import { fetchExportOrdersWithFilter } from "~/services/ExportOrderService";
import { formatDate, formattedAmount } from '~/validate';
import ReactPaginate from 'react-paginate';
import { Table, Form, Modal, Button, Badge } from 'react-bootstrap';
import ModelAddExportOrderInternalAuto from "./AddExportOrderInternalAuto";
import ModelAddExportOrderInternalManual from "./AddExportOrderInternalManual";
import ConfirmExportOrderInternal from "./ConfirmExportOrderInternal";
import ModalZoomImage from "../components/others/Image/ModalZoomImage";
import ModalDetailExportOrderInternal from "./DetailExportOrderInternal";
import ModalEditExportOrderInternal from "./EditExportOrderInternal";
import { cancelExportOrder } from "~/services/ExportOrderService";
import ModalCancel from "../importOrders/ModalCancel";
import { fetchAllStorages } from '~/services/StorageServices';
import { fetchUserByUserId } from "~/services/UserServices";
import { Dropdown, DropdownButton, Col, Row } from 'react-bootstrap';
import { toast } from "react-toastify";
import { getUserIdWarehouse } from '~/services/UserWarehouseServices';

import { format } from 'date-fns';




const ExportOrderListInternal = () => {
    const roleId = parseInt(localStorage.getItem('roleId'), 10);
    const userId = parseInt(localStorage.getItem('userId'), 10);




    const [totalExportOrder, setTotalExportOrder] = useState([]);
    const [currentPage, setcurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(5);


    const [totalWarehouse, setTotalWarehouse] = useState([]);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [selectedWarehouseId, setSelectedWarehouseId] = useState(null);


    const [isShowExportModelAddAuto, setIsShowExportModelAddAuto] = useState(false);
    const [isShowExportModelAddManual, setIsShowExportModelAddManual] = useState(false);
    const [isShowModelConfirm, setIsShowModelConfirm] = useState(false);
    const [dataImportOrder, setDataImportOrder] = useState({});


    const [isShowModalZoomImage, setIsShowModalZoomImage] = useState(false);
    const [imageUrl, setImageUrl] = useState("");


    const [isShowDetailOrder, setIsShowDetailOrder] = useState(false);
    const [dataDetailOrder, setDataDetailOrder] = useState([]);


    const [isShowEditOrder, setIsShowEditOrder] = useState(false);
    const [dataEditOrder, setDataEditOrder] = useState([]);


    const [isShowModalCancelExport, setIsShowModalCancelExport] = useState(false);
    const [dataCancelExport, setDataCancelExport] = useState([]);


    const [sortedByStatusId, setSortedByStatusId] = useState();
    const [sortedByStatusName, setSortedByStatusName] = useState("");
    const [sortStatusOptions, setSortStatusOptions] = useState([]);


    const [sortedByDateId, setSortedByDateId] = useState();
    const [sortedByDateName, setSortedByDateName] = useState("");
    const [sortDateOptions, setSortDateOptions] = useState([]);


    const [keywordSearch, setKeywordSearch] = useState("");
    const [currentDate, setCurrentDate] = useState();


    const [pageSize, setPageSize] = useState(15);
    const [showDropdown, setShowDropdown] = useState(false);


    const handleShowDropdown = () => setShowDropdown(!showDropdown);


    useEffect(() => {
        getExportOrders(1);
        if (roleId !== 2 || roleId !== 4) {
            getStorageIdByUser();
        }
        setSortStatusOptions([{ idSort: null, nameSort: "Tình trạng" },
        { idSort: 3, nameSort: "Đang tiến hành" },
        { idSort: 4, nameSort: "Đã hoàn thành" },
        { idSort: 5, nameSort: "Đã hủy" }]);


        setSortDateOptions([{ idSort: null, nameSort: "Tất cả ngày" },
        { idSort: 1, nameSort: "Gần nhất" },
        ]);
        getAllStorages();
        setCurrentDate(format(new Date(), 'dd/MM/yyyy'));


    }, [])


    useEffect(() => {
        // Đảm bảo rằng getExportOrders được gọi mỗi khi có sự thay đổi cần thiết
        getExportOrders(1, pageSize, sortedByStatusId, sortedByDateId, keywordSearch);
    }, [pageSize, selectedWarehouseId, sortedByStatusId, sortedByDateId, keywordSearch]);


    const getAllStorages = async () => {
        let res = await fetchAllStorages();
        setTotalWarehouse(res);
        // console.log("fetchAllStorages: ", res);
    }


    const handleStorageClickTotal = () => {
        setSelectedWarehouse("Tất cả kho");
        setSelectedWarehouseId(null);
    }


    const handleStorageClick = async (warehouse) => {
        setSelectedWarehouse(warehouse.warehouseName);
        setSelectedWarehouseId(warehouse.warehouseId);
    }




    const getStorageIdByUser = async () => {
        let res = await fetchUserByUserId(userId);
        // console.log("fetchUserByUserId: ", res);
        setSelectedWarehouseId(res.warehouseId);
        setSelectedWarehouse(res.warehouseName);
    }


    const getExportOrders = async (page, pageSize = 15, sortedByStatusId, sortedByDateId, keywordSearch) => {
        if (roleId === 1) {
            setcurrentPage(page - 1);

            let res = await fetchExportOrdersWithFilter(
                pageSize, page, selectedWarehouseId,
                "", "",
                sortedByStatusId,
                sortedByDateId, keywordSearch);


            setTotalExportOrder(res.data);
            setTotalPages(res.totalPages);
            console.log("getExportOrders: ", res.data);
        }
        if (roleId === 2 || roleId === 3 || roleId === 4) {
            setcurrentPage(page - 1);
            let wh = await getUserIdWarehouse(userId);
            let res = await fetchExportOrdersWithFilter(
                pageSize, page, wh[0].warehouseId,
                "", "",
                sortedByStatusId,
                sortedByDateId, keywordSearch);
            setTotalExportOrder(res.data);
            setTotalPages(res.totalPages);
            console.log("getExportOrders: ", res);
        }
    }


    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
    }
    const handleSortStatusClick = (sort) => {
        setSortedByStatusId(sort.idSort);
        setSortedByStatusName(sort.nameSort);


    }


    const handleSortDateClick = (sort) => {
        setSortedByDateId(sort.idSort);
        setSortedByDateName(sort.nameSort);
    }


    const handlePageClick = (event) => {
        getExportOrders(+event.selected + 1, pageSize, sortedByStatusId, sortedByDateId, keywordSearch);
    }


    const handleSearch = () => {
        getExportOrders(1, pageSize, sortedByStatusId, sortedByDateId, keywordSearch);
    }


    const updateTable = () => {
        getExportOrders(currentPage + 1);
    }


    const ShowModelConfirm = (i) => {
        console.log("ShowModelConfirm", i);
        if (currentDate <= formatDate(i.exportedDate)) {
            // Điều kiện này kiểm tra nếu ngày hiện tại nhỏ hơn hoặc bằng ngày xuất hàng
            // Nếu đúng, cho phép thực hiện hành động xuất hàng
            setIsShowModelConfirm(true);
            setDataImportOrder(i);
        } else {
            // Nếu ngày hiện tại lớn hơn ngày xuất hàng, hiển thị cảnh báo
            toast.warning("Chưa đến ngày xuất hàng trong hợp đồng bàn giao");
        }
    }


    const handleZoomImage = (image) => {
        setIsShowModalZoomImage(true);
        setImageUrl(image);
    }


    const ShowDetailOrder = (order) => {
        setDataDetailOrder(order);
        setIsShowDetailOrder(true);
    }


    const ShowEditDetailOrder = (order) => {
        setIsShowEditOrder(true);
        console.log(order);
        setDataEditOrder(order);
    }


    const ShowModalCancelExport = (data) => {
        setIsShowModalCancelExport(true);
        setDataCancelExport(data);
    }


    const ConfirmCancelExport = async (confirm) => {
        if (confirm) {
            await cancelExportOrder(dataCancelExport.exportId);
            getExportOrders(currentPage + 1);
        }
    }




    return (
        <>
            <div className="container" style={{ maxWidth: "1600px" }}>
                <div className="row justify-content-center">
                    <div className="col-sm-12">
                        <h2 style={{ color: '#3b3bf5', marginTop: '20px' }}>Quản lý lô hàng xuất giữa các kho</h2>
                        <div className="row no-gutters my-3 d-flex justify-content-between">
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
                            <Col md={2}>
                                <DropdownButton className="DropdownButtonCSS ButtonCSSDropdown" title={sortedByStatusName ? sortedByStatusName : "Tình trạng"} variant="success" style={{ zIndex: 999 }}>
                                    {sortStatusOptions.map((s, index) => (
                                        <Dropdown.Item key={`sort ${index}`} eventKey={s.nameSort} onClick={(e) => handleSortStatusClick(s, e)}>{s.nameSort}</Dropdown.Item>
                                    ))}
                                </DropdownButton>
                            </Col>
                            <Col md={3}>
                                <DropdownButton className="DropdownButtonCSS ButtonCSSDropdown" title={sortedByDateName ? sortedByDateName : "Sắp xếp theo ngày"} variant="success" style={{ zIndex: 999 }}>
                                    {sortDateOptions.map((s, index) => (
                                        <Dropdown.Item key={`sortDate ${index}`} eventKey={s.nameSort} onClick={(e) => handleSortDateClick(s, e)}>{s.nameSort}</Dropdown.Item>
                                    ))}
                                </DropdownButton>
                            </Col>
                            <div className="col-2">
                                <div className="input-group">
                                    <input
                                        className="form-control border-secondary inputCSS"
                                        type="search"
                                        placeholder='Tìm kiếm...'
                                        id="example-search-input4"
                                        onChange={(event) => setKeywordSearch(event.target.value)}
                                        readOnly={false}
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
                            {roleId === 3 || roleId === 1 ?


                                <div className="col-auto ButtonCSSDropdown">
                                    <DropdownButton
                                        id="dropdown-basic-button"
                                        title={
                                            <><i>
                                            </i> &nbsp; Thêm lô hàng xuất</>
                                        }
                                        show={showDropdown}
                                        onClick={handleShowDropdown}
                                        className="DropdownButtonCSS ButtonCSSDropdown"
                                        variant="success"
                                        style={{ zIndex: 999 }}
                                    >
                                        <Dropdown.Item
                                            onClick={() => setIsShowExportModelAddManual(true)}
                                        >Thủ công</Dropdown.Item>
                                        <Dropdown.Item
                                            onClick={() => setIsShowExportModelAddAuto(true)}
                                        >Tự động</Dropdown.Item>
                                    </DropdownButton>
                                </div>
                                : ''}






                        </div>
                        <div className=" table-responsive" style={{ overflowY: 'auto', overflowX: 'auto' }}>
                            <Table className="table text-center table-border table-hover  border-primary table-sm">
                                <thead>
                                    <tr>
                                        <th className="align-middle  text-nowrap position-sticky" style={{ left: 0 }}>STT</th>
                                        <th className="align-middle  text-nowrap">Mã <br />Đơn hàng</th>
                                        <th className="align-middle  text-nowrap">Người tạo<br />đơn hàng</th>
                                        {/* <th className="align-middle  text-nowrap">Tổng <br />đơn hàng</th> */}
                                        <th className="align-middle  text-nowrap">Ngày <br />tạo đơn</th>
                                        <th className="align-middle  text-nowrap">Ngày <br />xuất hàng</th>
                                        <th className="align-middle  text-nowrap">Kho<br />nhập hàng</th>
                                        <th className="align-middle  text-nowrap">Kho<br /> xuất hàng</th>

                                        <th className="align-middle  text-nowrap">Bên <br />giao hàng</th>
                                        <th className="align-middle  text-nowrap">Hình ảnh</th>
                                        <th className="align-middle  text-nowrap">Tình trạng</th>
                                        <th className="align-middle  text-nowrap">Người <br />nhận hàng</th>
                                        <th className="align-middle  text-nowrap">Xem <br />chi tiết</th>
                                        {(roleId === 1 || roleId === 2) ? <th className="align-middle  text-nowrap">Hủy bỏ<br />đơn hàng</th> : ''}
                                        {/* {(roleId === 1 || roleId === 2) ? <th className="align-middle  text-nowrap">Chỉnh sửa</th> : ''} */}
                                        {(roleId === 1 || roleId === 2) ? <th className="align-middle  text-nowrap position-sticky" style={{ right: 0, minWidth: '150px' }}>Hành động</th> : ''}




                                    </tr>
                                </thead>
                                <tbody>


                                    {totalExportOrder && totalExportOrder.length > 0
                                        && totalExportOrder.map((i, index) => (
                                            <tr key={`exportOrder${index}`}>
                                                <td className="align-middle position-sticky" style={{ left: 0 }}>{index + 1}</td>
                                                <td className="align-middle">{i.exportCode}</td>
                                                <td className="align-middle">{i.userName}</td>
                                                {/* <td className="align-middle">{formattedAmount(i.totalPrice)}</td> */}
                                                <td className="align-middle">{formatDate(i.createdDate)}</td>
                                                <td className="align-middle">{i.exportedDate ? formatDate(i.exportedDate) : ""}</td>
                                                <td className="align-middle">{i.warehouseDestinationName}</td>
                                                <td className="align-middle">{i.warehouseName}</td>
                                                <td className="align-middle">{i.deliveryName}</td>


                                                <td className="align-middle" onClick={() => handleZoomImage(i.image)}>
                                                    <img src={i.image} alt="Image" style={{ width: '50px', height: '50px' }} />
                                                </td>
                                                <td className="align-middle" style={{ color: i.statusType === "Cancel" ? "#ea5455" : "#2275b7" }}>
                                                    {i.statusType === "On Progress" ?
                                                        <Badge style={{ backgroundColor: "#0c7a42" }}>Đang tiến hành</Badge> :
                                                        i.statusType === "Completed" ?
                                                            <Badge bg="success">Đã hoàn thành</Badge> :
                                                            <Badge bg="danger">Đã huỷ</Badge>}                                                </td>
                                                <td className="align-middle">{i.storekeeperName}</td>
                                                <td className="align-middle " style={{ padding: '10px' }}>


                                                    <i className="fa-duotone fa-circle-info actionButtonCSS" onClick={() => ShowDetailOrder(i)}></i>
                                                </td>
                                                {/* {roleId === 2 && i.statusType === "On Progress" ? <td className="align-middle"> <i className="fa-solid fa-ban actionButtonCSS" onClick={() => ShowModalCancelExport(i)}></i></td> : <td></td>}
                                                {roleId === 2 && i.statusType === "On Progress" ? <td className="align-middle " style={{ padding: '10px' }}>


                                                    <i className="fa-duotone fa-pen-to-square actionButtonCSS" onClick={() => ShowEditDetailOrder(i)}></i>
                                                </td> : <td></td>}
                                                {(roleId === 1 || roleId === 2) ? <td className='position-sticky ButtonCSSDropdown' style={{ right: 0, minWidth: '150px' }}> <button
                                                    className="btn btn-success border-left-0 rounded "
                                                    type="button"
                                                    onClick={() => ShowModelConfirm(i)}
                                                    disabled={i.statusType === "Completed" || i.statusType === "Cancel" || (roleId !== 1 && roleId !== 2)}
                                                >{i.statusType === "Completed" ? "Đã xuất hàng" : i.statusType === "On Progress" ? "Tiến hành xuất hàng" : "Đã hủy"}
                                                </button></td> : ''} */}
                                                {(roleId === 1 || roleId === 2) ? (
                                                    i.statusType !== "On Progress" ? (
                                                        <td className="align-middle">
                                                            <i
                                                                className="fa-solid fa-ban"
                                                                style={{ color: 'red' }}
                                                            ></i>
                                                        </td>
                                                    ) : (
                                                        <td className="align-middle">
                                                            <i
                                                                className="fa-solid fa-ban actionButtonCSS"
                                                                onClick={() => ShowModalCancelExport(i)}
                                                            ></i>
                                                        </td>
                                                    )
                                                ) : ''}
                                                {/* {(roleId === 1 || roleId === 2) ? <td className="align-middle " style={{ padding: '10px' }}>


                                                    <i className="fa-duotone fa-pen-to-square actionButtonCSS" onClick={() => ShowEditDetailOrder(i)}></i>
                                                </td> : ''} */}

                                                {(roleId === 1 || roleId === 2) ? <td className='position-sticky ' style={{ right: 0, minWidth: '150px' }}> <button
                                                    className="btn btn-success "
                                                    type="button"
                                                    onClick={() => ShowModelConfirm(i)}
                                                    style={{ backgroundColor: i.statusType === "Completed" ? "#0c7a42" : i.statusType === "On Progress" ? "#2275b7" : "#ea5455", fontWeight: 'bold' }}
                                                    disabled={i.statusType === "Completed" || i.statusType === "Cancel" || (roleId !== 1 && roleId !== 2)}
                                                >{i.statusType === "Completed" ? "Đã xuất hàng" : i.statusType === "On Progress" ? "Xuất hàng" : "Đã huỷ"}
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
            <ModalCancel isShow={isShowModalCancelExport} handleClose={() => setIsShowModalCancelExport(false)}
                title="Hủy đơn hàng xuất" ConfirmCancel={ConfirmCancelExport} />
            <ModalEditExportOrderInternal isShow={isShowEditOrder} handleClose={() => setIsShowEditOrder(false)} detailOrderEdit={dataEditOrder} updateTable={updateTable} />
            <ModalDetailExportOrderInternal isShow={isShowDetailOrder} handleClose={() => setIsShowDetailOrder(false)} detailOrder={dataDetailOrder} />
            <ModalZoomImage isShow={isShowModalZoomImage} handleClose={() => setIsShowModalZoomImage(false)} imageUrl={imageUrl} />
            <ConfirmExportOrderInternal isShow={isShowModelConfirm} handleClose={() => setIsShowModelConfirm(false)} dataImportOrder={dataImportOrder} updateTable={updateTable} />
            <ModelAddExportOrderInternalAuto isShow={isShowExportModelAddAuto} handleClose={() => setIsShowExportModelAddAuto(false)} updateTable={updateTable} />
            <ModelAddExportOrderInternalManual isShow={isShowExportModelAddManual} handleClose={() => setIsShowExportModelAddManual(false)} updateTable={updateTable} />
        </>
    )
}


export default ExportOrderListInternal



