import { useEffect, useState } from "react";
import React from 'react';
import { Modal, Button, Row, Col, DropdownButton, Dropdown } from "react-bootstrap"
import { CustomToggle, CustomMenu } from '../components/others/Dropdown';
import { fetchAllStorages } from '~/services/StorageServices';
import { fetchDeliveryActive } from "~/services/DeliveryServices";
// import { fetchAllCustomer } from "~/services/CustomerServices";
import { addNewExportOrder, fetchExportOrderNewest } from "~/services/ExportOrderService";
import { createNewExportOrderDetail } from "~/services/ExportOrderDetailService";
import { format, addDays } from 'date-fns';
import { formatDateImport, formattedAmount } from "~/validate";
import { toast } from "react-toastify";
import uploadImage from "~/services/ImageServices";
import { getUserIdWarehouse } from "~/services/UserWarehouseServices";
import AddRowDataExportOrderInternal from "./AddRowDataExportInternal";
import RowDataExportOrderInternal from "./RowDataExportInternal";
import { assign, set } from "lodash";

const ModelAddExportOrderInternalAuto = ({ isShow, handleClose, updateTable }) => {

    const roleId = parseInt(localStorage.getItem('roleId'), 10);
    const userId = parseInt(localStorage.getItem('userId'), 10);

    const [exportCode, setExportCode] = useState('');

    const [totalDelivery, setTotalDelivery] = useState([]);
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const [selectedDeliveryId, setSelectedDeliveryId] = useState(null);

    // const [totalCustomer, setTotalCustomer] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);

    const [minDate, setMinDate] = useState();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const [isShowRowDataExport, setIsShowRowDataExport] = useState(false);

    const [rowsData, setRowsData] = useState([]);

    const [totalPrice, setTotalPrice] = useState(0);

    const [imageExportOrder, setImageExportOrder] = useState(null);

    const [totalWarehouse1, setTotalWarehouse1] = useState([]);
    const [totalWarehouse2, setTotalWarehouse2] = useState([]);

    // Trạng thái cho kho nhập (Import)
    const [selectedWarehouseImport, setSelectedWarehouseImport] = useState(null);
    const [selectedWarehouseImportId, setSelectedWarehouseImportId] = useState(null);

    // Trạng thái cho kho xuất (Export)
    const [selectedWarehouseExport, setSelectedWarehouseExport] = useState(null);
    const [selectedWarehouseExportId, setSelectedWarehouseExportId] = useState(null);



    useEffect(() => {
        getAllStorages1();
        getAllStorages2();
        // getAllCustomer();
        getAllDelivery();
    }, [])

    useEffect(() => {
        const currentDate = new Date();
        const formattedDate = format(currentDate, 'yyyy-MM-dd');
        setMinDate(formattedDate);
    }, [])

    useEffect(() => {
        wh();
    }, [userId]);

    const getAllDelivery = async () => {
        let res = await fetchDeliveryActive();
        setTotalDelivery(res);
    }

    const handleDeliveryClick = (delivery, event) => {
        setSelectedDelivery(delivery.deliveryName);
        setSelectedDeliveryId(delivery.deliveyId);
    }


    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    // mở modal AddRowDataExport
    const handleAddRowDataExport = async () => {

        if (roleId === 3 || selectedWarehouseExportId) {
            setIsShowRowDataExport(true);
        } else {
            toast.warning("Vui lòng điền kho")
        }
    }
    // else if (roleId === 3) {
    //     const userId = parseInt(localStorage.getItem('userId'), 10);
    //     let warehouse = await getWarehouseById(userId);
    //     if (warehouse) {
    //         setIsShowRowDataExport(true);
    //     } else {
    //         toast.warning("Vui lòng điền kho")
    //     }
    // }

    // xóa rowdata ở rowdataImport
    const deleteRowData = (rowdel) => {
        const updateDataExport = rowsData.filter((item, index) => index !== rowdel);
        setRowsData(updateDataExport);
    }


    // nhận data từ AddRowDataExport
    const takeRowDataExportOrder = (exportData) => {

        const updateDataExport = [...rowsData];

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
        const updateDataImport = [...rowsData];
        updateDataImport[rowUpdate] = updateData;
        setTotalPrice(x => x - rowsData[rowUpdate].totalOneGoodPrice + updateData.totalOneGoodPrice);
        setRowsData(updateDataImport);
    }

    // render rowsData
    const renderExportData = () => {
        return rowsData.map((data, index) => (
            <RowDataExportOrderInternal key={`rdt${index}`} data={rowsData[index]} index={index}
                updateRowData={updateRowData} deleteRowData={deleteRowData}
            />
        ))


    }

    const wh = async () => {
        if (roleId === 1) {
            getAllStorages1();
        } else if (roleId === 3) {
            const uwh = await getWarehouseById(userId);
            let allwh = await fetchAllStorages();
            // Lọc danh sách kho hàng để loại bỏ kho hàng của người dùng hiện tại
            if (uwh && uwh.warehouseId) {
                allwh = allwh.filter(storage => storage.warehouseId !== uwh.warehouseId);
            }

            setTotalWarehouse2(allwh); // Giả sử setTotalWarehouse là hàm setState đã được định nghĩa ở nơi khác
        };
    }
    const getAllStorages1 = async () => {
        let res = await fetchAllStorages();
        setTotalWarehouse1(res);
    }

    const getAllStorages2 = async () => {
        let res = await fetchAllStorages();
        setTotalWarehouse2(res);
    }

    // Xử lý chọn "Tất cả kho Nhập"
    const handleStorageClickTotalImport = async () => {
        await getAllStorages2(); //QH
        setSelectedWarehouseImportId("");
        setSelectedWarehouseImport("Tất cả kho Nhập");
    }


    const handleStorageClickImport = async (warehouse) => {
        await getAllStorages2(); //QH
        setSelectedWarehouseImport(warehouse.warehouseName);
        setSelectedWarehouseImportId(warehouse.warehouseId);
        setTotalWarehouse2(x => x.filter(w => w.warehouseId !== warehouse.warehouseId));
    }

    // Xử lý chọn "Tất cả kho Xuất"
    const handleStorageClickTotalExport = async () => {
        await getAllStorages1(); //QH
        setSelectedWarehouseExportId("");
        setSelectedWarehouseExport("Tất cả kho Xuất");
    }


    const handleStorageClickExport = async (warehouse) => {

        await getAllStorages1(); //QH
        setSelectedWarehouseExport(warehouse.warehouseName);
        setSelectedWarehouseExportId(warehouse.warehouseId);
        setTotalWarehouse1(x => x.filter(w => w.warehouseId !== warehouse.warehouseId)); //QH  

    }
    const getWarehouseById = async (userId) => {
        let res = await getUserIdWarehouse(userId);
        return res[0];
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
        // if (!exportCode.trim()) {
        //     toast.warning("Vui lòng nhập mã đơn hàng");

        // } else
        if (!selectedDate) {
            toast.warning("Vui lòng nhập ngày xuất hàng");
            // } else if (totalPrice === 0) {
            //     toast.warning("Vui lòng nhập mặt hàng xuất");
        } else if (rowsData.length === 0) {
            toast.warning("Hãy thêm lô hàng");
        }
        else if (!selectedDelivery) {
            toast.warning("Vui lòng chọn bên giao hàng");
        } else {
            const userId = parseInt(localStorage.getItem('userId'), 10);
            let warehouse = await getWarehouseById(userId);
            const warehouseIdToUse = roleId === 1 ? selectedWarehouseExportId : warehouse.warehouseId;
            if (!warehouseIdToUse) {
                toast.warning("Vui lòng chọn kho nhập hàng");
            }
            let isInternalTransfer = true;
            let res = await addNewExportOrder(isInternalTransfer,
                userId,
                generateExportCode(),
                0,
                "",
                formatDateImport(selectedDate),
                warehouseIdToUse,
                "2024-07-03T16:51:26.339Z",
                selectedDeliveryId,
                imageExportOrder,
                selectedCustomerId,
                selectedWarehouseImportId
            );
            console.log("handleAddExportOrder: ", res);
            if (res.isSuccess == true) {
                let resExportId = await fetchExportOrderNewest();
                if (rowsData && rowsData.length > 0) {
                    await Promise.all(rowsData.map(async (data, index) => {
                        await createNewExportOrderDetail(resExportId,
                            data.costPrice, data.goodsId, data.quantity, data.importOrderDetailId);
                    }));
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
        setSelectedDelivery(null);
        setSelectedDeliveryId(null);
        // setSelectedCustomer(null);
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
                <Modal.Title>Thêm lô hàng xuất nội bộ tự động</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="body-add-new">
                    <Row className="align-items-center">
                        {/* <Col md={2}>
                            <div className="form-group ">
                                <input type="text" className="form-control inputCSS" placeholder="Mã đơn hàng" value={exportCode} onChange={(event) => setExportCode(event.target.value)} />
                            </div>
                        </Col> */}

                        <Col md={2}>
                            <DropdownButton
                                className="DropdownButtonCSS ButtonCSSDropdown"
                                title={selectedWarehouseImport !== null ? selectedWarehouseImport : "Tất cả Kho Nhập"}
                                variant="success"
                                style={{ zIndex: 999 }}
                            >
                                <Dropdown.Item eventKey=""
                                    onClick={() => handleStorageClickTotalImport()}>Tất cả kho Nhập</Dropdown.Item>

                                {totalWarehouse1 && totalWarehouse1.length > 0 && totalWarehouse1.map((c, index) => (
                                    <Dropdown.Item
                                        key={`warehouse ${index}`}
                                        eventKey={c.warehouseName}
                                        onClick={(e) => handleStorageClickImport(c, e)}
                                    >
                                        {c.warehouseName}
                                    </Dropdown.Item>
                                ))}
                            </DropdownButton>
                        </Col>


                        {roleId === 1 ?
                            <Col md={2}>
                                <DropdownButton
                                    className="DropdownButtonCSS ButtonCSSDropdown"
                                    title={selectedWarehouseExport !== null ? selectedWarehouseExport : "Tất cả Kho Xuất"}
                                    variant="success"
                                    style={{ zIndex: 999 }}
                                >
                                    <Dropdown.Item eventKey="" onClick={() => handleStorageClickTotalExport()}>Tất cả kho Xuất</Dropdown.Item>
                                    {totalWarehouse2 && totalWarehouse2.length > 0 && totalWarehouse2.map((c, index) => (
                                        <Dropdown.Item
                                            key={`warehouse ${index}`}
                                            eventKey={c.warehouseName}
                                            onClick={(e) => handleStorageClickExport(c, e)}
                                        >
                                            {c.warehouseName}
                                        </Dropdown.Item>
                                    ))}
                                </DropdownButton>
                            </Col>
                            : ''
                        }

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

        <AddRowDataExportOrderInternal isShow={isShowRowDataExport} selectedStorageId={selectedWarehouseExportId}
            onChange={(exportData) => takeRowDataExportOrder(exportData)}
            handleClose={() => setIsShowRowDataExport(false)} />
    </>)

}

export default ModelAddExportOrderInternalAuto