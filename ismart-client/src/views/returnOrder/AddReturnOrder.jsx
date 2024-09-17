import { useEffect, useState } from "react";
import { Modal, Button, Row, Col, DropdownButton, Dropdown } from "react-bootstrap"
import { fetchAllStorages } from '~/services/StorageServices';
import { CustomToggle, CustomMenu } from '../components/others/Dropdown';
import { fetchAllSuppliers } from "~/services/SupplierServices";
import { formatDateImport, formattedAmount } from "~/validate";
import { fetchAllDelivery } from "~/services/DeliveryServices";
import { addNewReturnOrder, getReturnOrderNewest } from "~/services/ReturnOrderService";
import { createNewReturnOrderDetail } from "~/services/ReturnOrderDetailService";
import AddRowDataReturnOrderManual from "./AddRowDataReturnOrder";
import RowDataReturnOrderManual from "./RowDataReturnOrder";
import { getUserIdWarehouse } from "~/services/UserWarehouseServices";
import ModelAddNote from "./AddNote";
import { toast } from "react-toastify";
import { data } from "autoprefixer";

const ModelAddReturnOrder = ({ isShow, handleClose, updateTable }) => {

    const roleId = parseInt(localStorage.getItem('roleId'), 10);
    const userId = parseInt(localStorage.getItem('userId'), 10);

    const [returnCode, setReturnCode] = useState('');
    const [note, setNote] = useState('');
    const [totalSuppliers, setTotalSuppliers] = useState([]);

    const [totalWarehouse, setTotalWarehouse] = useState([]);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [selectedWarehouseId, setSelectedWarehouseId] = useState(null);

    const [totalDelivery, setTotalDelivery] = useState([]);
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const [selectedDeliveryId, setSelectedDeliveryId] = useState(null);

    const [minDate, setMinDate] = useState();
    const [selectedDate, setSelectedDate] = useState('');
    const [rowsData, setRowsData] = useState([]);

    const [isShowNote, setIsShowNote] = useState(false);
    const [isShowRowDataReturn, setIsShowRowDataReturn] = useState(false);

    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [selectedSupplierId, setSelectedSupplierId] = useState(null);

    const [totalCost, setTotalCost] = useState(0);

    useEffect(() => {
        getAllStorages();
        getAllDelivery();
        getAllSuppliers();
    }, [])

    const getAllStorages = async () => {
        let res = await fetchAllStorages();
        setTotalWarehouse(res);
    }


    const handleStorageClickTotal = () => {
        setSelectedWarehouseId("");
        setSelectedWarehouse("Tất cả kho");
    }

    const handleStorageClick = async (warehouse) => {
        setSelectedWarehouse(warehouse.warehouseName);
        setSelectedWarehouseId(warehouse.warehouseId);
    }

    const getAllDelivery = async () => {
        let res = await fetchAllDelivery();
        setTotalDelivery(res);
    }

    const handleDeliveryClick = (delivery, event) => {
        setSelectedDelivery(delivery.deliveryName);
        setSelectedDeliveryId(delivery.deliveyId);
    }




    // nhận dữ liệu từ addRowDataImport


    const takeRowDataExportOrder = (returnOrderData) => {
        const updateDataExport = [...rowsData];
        for (var i = 0; i < returnOrderData.length; i++) {
            const existingIndex = updateDataExport.findIndex(item => item.importOrderDetailId === returnOrderData[i].importOrderDetailId);

            if (existingIndex !== -1) {
                updateDataExport[existingIndex] = returnOrderData[i];
            } else {
                updateDataExport.push(returnOrderData[i]);
            }
        }
        setRowsData(updateDataExport);
    }


    const updateRowData = (rowUpdate, updateData) => {
        // console.log(updateData);
        const updateDataImport = [...rowsData];
        updateDataImport[rowUpdate] = updateData;
        setRowsData(updateDataImport);
    }


    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    const deleteRowData = (rowdel) => {
        // Loại bỏ bản ghi tại chỉ số rowdel
        const updateDataImport = rowsData.filter((item, index) => index !== rowdel);
        setRowsData(updateDataImport);
    }
    // render rowsData
    const renderReturnData = () => {
        return rowsData.map((data, index) => (
            <RowDataReturnOrderManual key={`rdt${index}`} data={rowsData[index]} index={index}
                deleteRowData={deleteRowData}
                updateRowData={updateRowData}
            />
        ))
    }

    const getAllSuppliers = async () => {
        let res = await fetchAllSuppliers();
        setTotalSuppliers(res);
    }

    const handleSupplierClick = (supplier, event) => {
        setSelectedSupplier(supplier.supplierName);
        setSelectedSupplierId(supplier.supplierId);
    }
    const getWarehouseById = async (userId) => {
        let res = await getUserIdWarehouse(userId);
        return res[0];
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const handleAddReturntOrder = async () => {
        if (!returnCode.trim()) {
            toast.warning("Vui lòng nhập mã đơn hàng");
        } else if (!selectedDate) {
            toast.warning("Vui lòng nhập ngày trả hàng");
        }else if (new Date(selectedDate) < today) {
            toast.warning("Ngày trả hàng không thể nhỏ hơn thời điểm hiện tại");
        }
         else if (!selectedSupplierId) {
            toast.warning("Vui lòng chọn nhà cung cấp");
        } else if (!rowsData || rowsData.length === 0) {
            toast.warning("Phải có ít nhất một chi tiết đơn hàng để tạo đơn hàng xuất.");
        } else {
            const userId = parseInt(localStorage.getItem('userId'), 10);
            let warehouse = await getWarehouseById(userId);
            const warehouseIdToUse = roleId === 1 ? selectedWarehouseId : warehouse.warehouseId;
            if (!warehouseIdToUse) {
                toast.warning("Vui lòng chọn kho hàng");
                return;
            }
            let res = await addNewReturnOrder(
                userId,
                returnCode,
                formatDateImport(selectedDate),
                warehouseIdToUse,
                selectedSupplierId,
                0
            );

            if (res.isSuccess == true) {
                let returnOrderId = await getReturnOrderNewest();
                if (rowsData && rowsData.length > 0) {
                    await Promise.all(rowsData.map(async (data, index) => {

                        createNewReturnOrderDetail(returnOrderId,
                            data.goodsId,
                            data.quantity,
                            data.reason,
                            data.batchCode);
                    })
                    );
                }
                toast.success("Thêm lô hàng xuất thành công");
                updateTable();
                handleCloseModal();
            } else {
                toast.warning("Mã đơn hàng đã tồn tại");
            }


        }
    }
    // mở modal AddRowDataExport
    // const handleAddRowDataReturn = () => {
    //     if (roleId === 1 && selectedWarehouseId) {
    //         setIsShowRowDataReturn(true);
    //     } else {
    //         toast.warning("Vui lòng điền kho")
    //     }
    // }

    const handleAddRowDataReturn = async () => {
        if (roleId === 1) {
            if (selectedWarehouseId) {
                setIsShowRowDataReturn(true);
            } else {
                toast.warning("Vui lòng điền kho")
            }
        } else if (roleId === 3) {
            const userId = parseInt(localStorage.getItem('userId'), 10);
            let warehouse = await getWarehouseById(userId);

            if (warehouse.warehouseId) {
                setIsShowRowDataReturn(true);
            } else {
                toast.info("Không tìm thấy kho cho người dùng này");
            }
        }
    }

    const handleReset = () => {
        setReturnCode('');
        setNote('');
        setSelectedWarehouse(null);
        setSelectedWarehouseId(null);
        setSelectedSupplier(null);
        setSelectedSupplierId(null);
        setSelectedDelivery(null);
        setSelectedDeliveryId(null);
        setSelectedDate('');
        setRowsData([]);
        setTotalCost(0);
    }
    const generateReturnCode = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `MTH${year}${month}${day}${hours}${minutes}${seconds}`;
    };
    const handleCreateReturnCode = () => {

        setReturnCode(generateReturnCode());
    }
    const handleCloseModal = () => {
        handleReset();
        handleClose();
    }

    return (
        <>
            <Modal show={isShow} onHide={handleCloseModal} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Thêm lô trả hàng</Modal.Title>
                </Modal.Header>


                <Modal.Body>
                    <div className="body-add-new">
                        <Row className="align-items-center">
                            {/* <Col md={2}>
                                <div className="form-group ">
                                    <input type="text" className="form-control inputCSS" placeholder="Mã đơn hàng" value={returnCode} onChange={(event) => setReturnCode(event.target.value)} />
                                </div>
                            </Col> */}
                            <Col md={2}>
                                <div className="form-group mb-3">
                                    <label >Mã đơn hàng</label>
                                    <input type="text" className="form-control inputCSS" value={returnCode} disabled />
                                </div>
                            </Col>
                            <Col md={2} className="mb-3">
                                <label >&nbsp;</label>
                                <Button className='form-control ButtonCSS' type='submit' onClick={handleCreateReturnCode} > Tạo mã đơn </Button>
                            </Col>
                            <div></div>
                            {
                                roleId === 1 ?
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
                                    : ''
                            }
                            <Col md={3}>
                                <div className="align-middle text-nowrap" style={{ overflow: 'visible' }}>
                                    <Dropdown style={{}}>
                                        <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                                            <span style={{ color: 'white', fontWeight: 'bold' }}>{selectedSupplier !== null ? selectedSupplier : "Chọn nhà cung cấp"}</span>
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu className="ButtonCSSDropdown" as={CustomMenu} >
                                            {totalSuppliers && totalSuppliers.length > 0 && totalSuppliers.map((s, index) => (
                                                <Dropdown.Item key={`supplier ${index}`} eventKey={s.supplierName} onClick={(e) => handleSupplierClick(s, e)}>
                                                    {s.supplierName}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </Col>

                            {/* <Col md={2}>
                                <div className="col-auto ButtonCSSDropdown">
                                    <button
                                        className="btn btn-success border-left-0 rounded"
                                        type="button"
                                        onClick={() => setIsShowNote(true)}
                                    >
                                        Lí do

                                    </button>
                                    {note}
                                </div>

                            </Col> */}


                            <Col md={2} style={{ width: '220px' }}>
                                <div className="align-middle text-nowrap" style={{ overflow: 'visible' }}>
                                    <Dropdown style={{ position: 'relative' }}>
                                        <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                                            <span style={{ color: 'white', fontWeight: 'bold' }}>{selectedDelivery !== null ? selectedDelivery : "Bên vận chuyển"}</span>
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu className="ButtonCSSDropdown" as={CustomMenu} style={{ position: 'absolute', zIndex: '9999' }}>
                                            {totalDelivery && totalDelivery.length > 0 && totalDelivery.map((s, index) => (
                                                <Dropdown.Item key={`delivery ${index}`} eventKey={s.deliveryName} onClick={(e) => handleDeliveryClick(s, e)}>
                                                    {s.deliveryName}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </Col>

                            <Col md={2}>
                                <div>
                                    <input type="date" className="datepickerCSS" id="datepicker" min={minDate} value={selectedDate} onChange={handleDateChange} />
                                </div>
                            </Col>

                            <Col md={3} className="mt-2">
                                <div className="ButtonCSSDropdown">
                                    <button
                                        className="btn btn-success border-left-0 rounded"
                                        type="button"
                                        onClick={handleAddRowDataReturn}
                                    ><i className="fa-solid fa-plus"></i>
                                        &nbsp;
                                        Thêm sản phẩm
                                    </button>
                                </div>
                            </Col>


                        </Row>

                        <Row style={{ marginTop: '20px' }}>
                            {/* <Col md={2}>
                                <div>
                                    <input
                                        type="file"
                                        accept="image/*" // Chỉ chấp nhận các loại file ảnh
                                        onChange={handleChooseFile} // Hàm xử lý sự kiện khi người dùng chọn file
                                    />
                                </div>
                            </Col> */}
                            {/* <Col md={2}>
                                <div className="flex col-auto ButtonCSSDropdown space-x-2 items-center">
                                    <button
                                        className="btn btn-success border-left-0 rounded"
                                        type="button"
                                        onClick={() => setIsShowNote(true)}
                                    >
                                        Lí do

                                    </button>

                                    <div className={`text-md font-normal text-black ${note ? "block" : "hidden"}`}>{note}</div>

                                </div>

                            </Col> */}

                            <Col md={7}>
                            </Col>
                        </Row>



                        {/* <hr /> */}

                        <Row style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            {renderReturnData()}

                        </Row>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" className="ButtonCSS"
                        onClick={handleAddReturntOrder}
                    >
                        Lưu
                    </Button>
                </Modal.Footer>
            </Modal>

            <ModelAddNote isShow={isShowNote}
                handleClose={() => setIsShowNote(false)}
                onChange={(value) => setNote(value)}
            //updateTable={updateTable}
            />

            <AddRowDataReturnOrderManual isShow={isShowRowDataReturn} selectedStorageId={selectedWarehouseId} selectedSupplierId={selectedSupplierId}
                onChange={(exportData) => takeRowDataExportOrder(exportData)}
                handleClose={() => setIsShowRowDataReturn(false)} />


        </>
    )

};

export default ModelAddReturnOrder;