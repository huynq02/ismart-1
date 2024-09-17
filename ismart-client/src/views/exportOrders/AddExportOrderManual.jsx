import { useEffect, useState } from "react";
import React from 'react';
import { Modal, Button, Row, Col, DropdownButton, Dropdown } from "react-bootstrap"
import { CustomToggle, CustomMenu } from '../components/others/Dropdown';
import { fetchAllStorages } from '~/services/StorageServices';
import { fetchDeliveryActive } from "~/services/DeliveryServices";
import { fetchAllCustomer } from "~/services/CustomerServices";
import { addNewExportOrder, fetchExportOrderNewest } from "~/services/ExportOrderService";
import { createNewExportOrderDetail } from "~/services/ExportOrderDetailService";
import { format, addDays } from 'date-fns';
import { formatDateImport, formattedAmount } from "~/validate";
import { toast } from "react-toastify";
import uploadImage from "~/services/ImageServices";
import { getUserIdWarehouse } from "~/services/UserWarehouseServices";
import AddRowDataExportOrderManual from "./AddRowDataExportManual";
import RowDataExportOrderManual from "./RowDataExportManual";
import { forEach, set } from "lodash";

const ModelAddExportOrderManual = ({ isShow, handleClose, updateTable }) => {
    const roleId = parseInt(localStorage.getItem('roleId'), 10);
    const userId = parseInt(localStorage.getItem('userId'), 10);

    const [exportCode, setExportCode] = useState('');
    const [totalWarehouse, setTotalWarehouse] = useState([]);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [selectedWarehouseId, setSelectedWarehouseId] = useState(null);

    const [totalDelivery, setTotalDelivery] = useState([]);
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const [selectedDeliveryId, setSelectedDeliveryId] = useState(null);

    const [totalCustomer, setTotalCustomer] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);

    const [minDate, setMinDate] = useState();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const [isShowRowDataExport, setIsShowRowDataExport] = useState(false);

    const [rowsData, setRowsData] = useState([]);

    const [totalPrice, setTotalPrice] = useState(0);

    const [imageExportOrder, setImageExportOrder] = useState(null);




    useEffect(() => {
        getAllStorages();
        getAllCustomer();
        getAllDelivery();
    }, [])

    useEffect(() => {
        const currentDate = new Date();
        const formattedDate = format(currentDate, 'yyyy-MM-dd');
        setMinDate(formattedDate);
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
        let res = await fetchDeliveryActive();
        setTotalDelivery(res);
    }

    const handleDeliveryClick = (delivery, event) => {
        setSelectedDelivery(delivery.deliveryName);
        setSelectedDeliveryId(delivery.deliveyId);
        console.log(delivery);
    }

    const getAllCustomer = async () => {
        let res = await fetchAllCustomer();
        setTotalCustomer(res);
    }


    const handleCustomerClick = (c, event) => {
        setSelectedCustomer(c.customerName);
        setSelectedCustomerId(c.customerId);
    }

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };
    const getWarehouseById = async (userId) => {
        let res = await getUserIdWarehouse(userId);
        return res[0];
    }

    // mở modal AddRowDataExport
    const handleAddRowDataExport = async () => {
        if (roleId === 1) {
            if (selectedWarehouseId) {
                setIsShowRowDataExport(true);
            } else {
                toast.warning("Vui lòng điền kho")
            }
        } else if (roleId === 3) {
            const userId = parseInt(localStorage.getItem('userId'), 10);
            let warehouse = await getWarehouseById(userId);

            if (warehouse.warehouseId) {
                console.log("warehouse:  ", warehouse.warehouseId);
                setIsShowRowDataExport(true);
            } else {
                toast.info("Không tìm thấy kho cho người dùng này");
            }
        }
    }
    // xóa rowdata ở rowdataImport
    const deleteRowData = (rowdel) => {
        const updateDataExport = rowsData.filter((item, index) => index !== rowdel);
        const deletePrice = rowsData[rowdel].totalOneGoodPrice;
        setRowsData(updateDataExport);
    }


    // nhận data từ AddRowDataExport
    const takeRowDataExportOrder = (exportData) => {

        const updateDataExport = [...rowsData];

        console.log(exportData);

        for (var i = 0; i < exportData.length; i++) {
            const existingIndex = updateDataExport.findIndex(item => item.importOrderDetailId === exportData[i].importOrderDetailId);

            if (existingIndex !== -1) {
                updateDataExport[existingIndex] = exportData[i];
            } else {
                updateDataExport.push(exportData[i]);
            }
        }
        setRowsData(updateDataExport);

    }

    // update 1 row data từ RowDataImport
    const updateRowData = (rowUpdate, updateData) => {
        console.log(updateData);
        const updateDataImport = [...rowsData];
        updateDataImport[rowUpdate] = updateData;
        setRowsData(updateDataImport);
    }

    // render rowsData
    const renderExportData = () => {
        return rowsData.map((data, index) => (
            <>
                <RowDataExportOrderManual key={`rdt${index}`} data={rowsData[index]} index={index}
                    updateRowData={updateRowData} deleteRowData={deleteRowData}

                />
            </>

        ))


    }

    const handleChooseFile = async (event) => {
        const file = event.target.files[0];
        let res = await uploadImage(file);
        const urlImage = res.url;
        setImageExportOrder(urlImage);
    }
    const generateExportCode = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}${month}${day}${hours}${minutes}${seconds}`;
    };
    const handleAddExportOrder = async () => {
        if (!selectedDate) {
            toast.warning("Vui lòng nhập ngày xuất hàng");
        } else if (!selectedDelivery) {
            toast.warning("Vui lòng chọn bên giao hàng");
        } else if (!selectedCustomer) {
            toast.warning("Vui lòng chọn khách hàng");
        } else if (rowsData.length === 0) {
            toast.warning("Hãy thêm lô hàng");
        }
        else {
            const newExportCode = generateExportCode();
            const userId = parseInt(localStorage.getItem('userId'), 10);
            let warehouse = await getWarehouseById(userId);
            const warehouseIdToUse = roleId === 1 ? selectedWarehouseId : warehouse.warehouseId;
            if (!warehouseIdToUse) {
                toast.warning("Vui lòng chọn kho hàng!");
            }
            let isInternalTransfer = false;
            let res = await addNewExportOrder(isInternalTransfer,
                userId,
                newExportCode,
                0,
                "",
                formatDateImport(selectedDate),
                warehouseIdToUse,
                "2024-07-03T16:51:26.339Z",
                selectedDeliveryId,
                imageExportOrder,
                selectedCustomerId,
                0
            );
            if (res.isSuccess == true) {
                let resExportId = await fetchExportOrderNewest();
                if (rowsData && rowsData.length > 0) {
                    await Promise.all(rowsData.map(async (data, index) => {

                        createNewExportOrderDetail(resExportId,
                            data.costPrice,
                            data.goodsId,
                            data.quantity,
                            data.importOrderDetailId);

                    }))

                }
                toast.success("Thêm lô hàng xuất thành công");
                updateTable();
                handleCloseModal();
            } else {
                toast.warning("Mã đơn hàng đã tồn tại");
            }

        }
    }

    const handleReset = () => {
        setRowsData([]);
        setExportCode(null);
        setSelectedWarehouse(null);
        setSelectedWarehouseId(null);
        setSelectedDelivery(null);
        setSelectedDeliveryId(null);
        setSelectedCustomer(null);
        setSelectedCustomerId(null);
        // setSelectedProject(null);
        // setSelectedProjectId(null);
        setSelectedDate('');
        setTotalPrice(0);
    }

    const handleCloseModal = () => {
        handleReset();
        handleClose();
    }





    return (<>
        <Modal show={isShow} onHide={handleCloseModal} size="xl">
            <Modal.Header closeButton>
                <Modal.Title>Thêm lô hàng xuất thủ công</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="body-add-new">
                    <Row className="align-items-center">
                        {(roleId == 1) ?
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




                        <Col md={3} >
                            <div className="align-middle text-nowrap" style={{ overflow: 'visible' }}>
                                <Dropdown style={{ position: 'relative' }}>
                                    <Dropdown.Toggle className="ButtonCSSDropdown" as={CustomToggle} id="dropdown-custom-components">
                                        <span style={{ color: 'white', fontWeight: 'bold' }}>{selectedCustomer !== null ? selectedCustomer : "Khách hàng"}</span>
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu className="ButtonCSSDropdown" as={CustomMenu} style={{ position: 'absolute', zIndex: '9999' }}>
                                        {totalCustomer && totalCustomer.length > 0 && totalCustomer.map((s, index) => (
                                            <Dropdown.Item key={`delivery ${index}`} eventKey={s.customerName} onClick={(e) => handleCustomerClick(s, e)}>
                                                {s.customerName}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </Col>

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


                    </Row>
                    <Row style={{ marginTop: '15px' }}>
                        <Col md={2}>
                            <div>
                                <input
                                    type="file"
                                    accept="image/*" // Chỉ chấp nhận các loại file ảnh
                                    onChange={handleChooseFile} // Hàm xử lý sự kiện khi người dùng chọn file
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row>

                        <Col md={3} className="mt-3">
                            <div className="ButtonCSSDropdown">
                                <button
                                    className="btn btn-success border-left-0 rounded"
                                    type="button"
                                    onClick={handleAddRowDataExport}
                                ><i className="fa-solid fa-plus"></i>
                                    &nbsp;
                                    Thêm sản phẩm
                                </button>
                            </div>
                        </Col>
                    </Row>



                    <Row style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {renderExportData()}

                    </Row>


                </div>
            </Modal.Body>

            <Modal.Footer>

                <Button variant="primary" className="ButtonCSS" onClick={handleAddExportOrder}>
                    Lưu
                </Button>
            </Modal.Footer>
        </Modal >

        <AddRowDataExportOrderManual isShow={isShowRowDataExport} selectedStorageId={selectedWarehouseId}
            onChange={(exportData) => takeRowDataExportOrder(exportData)}
            handleClose={() => setIsShowRowDataExport(false)} />
    </>)

}

export default ModelAddExportOrderManual