import { useEffect, useState, useRef } from "react";
import React from 'react';
import { Modal, Button, Row, Col, DropdownButton, Dropdown } from "react-bootstrap"
import { CustomToggle, CustomMenu } from '../components/others/Dropdown';
import { fetchAllSuppliers } from '~/services/SupplierServices';
import { fetchAllSupplierActive } from "~/services/SupplierServices";
import { fetchAllStorages } from '~/services/StorageServices';
import { fetchDeliveryActive } from "~/services/DeliveryServices";
import { addNewImportOrder, fetchImportOrderNewest } from "~/services/ImportOrderServices";
import { createNewImportOrderDetail } from "~/services/ImportOrderDetailServices";
import { formatDateImport, formattedAmount } from "~/validate";
import AddRowDataImportOrderN from "./AddRowDataImportN";
import { format, addDays } from 'date-fns';

import RowDataImportOrderN from "./RowDataImportN";
import { toast } from "react-toastify";
import uploadImage from "~/services/ImageServices";
import { data } from "autoprefixer";
import { getUserIdWarehouse } from "~/services/UserWarehouseServices";
import { set } from "lodash";

const ModelAddImportOrderN = ({ isShow, handleClose, updateTable }) => {
    const roleId = parseInt(localStorage.getItem('roleId'), 10);
    const userId = parseInt(localStorage.getItem('userId'), 10);
    const warehouseId = parseInt(localStorage.getItem('warehouseId'), 10);

    const [importCode, setImportCode] = useState('');


    const [totalWarehouse1, setTotalWarehouse1] = useState([]);
    const [totalWarehouse2, setTotalWarehouse2] = useState([]);

    // Trạng thái cho kho nhập (Import)
    const [selectedWarehouseImport, setSelectedWarehouseImport] = useState(null);
    const [selectedWarehouseImportId, setSelectedWarehouseImportId] = useState(null);

    // Trạng thái cho kho xuất (Export)
    const [selectedWarehouseExport, setSelectedWarehouseExport] = useState(null);
    const [selectedWarehouseExportId, setSelectedWarehouseExportId] = useState(null);

    const [totalSuppliers, setTotalSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [selectedSupplierId, setSelectedSupplierId] = useState(null);

    const [totalDelivery, setTotalDelivery] = useState([]);
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const [selectedDeliveryId, setSelectedDeliveryId] = useState(null);

    const [rowsData, setRowsData] = useState([]);

    const [totalCost, setTotalCost] = useState(0);

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const [isShowRowDataImport, setIsShowRowDataImport] = useState(false);

    const [minDate, setMinDate] = useState();

    const [imageImportOrder, setImageImportOrder] = useState(null);

    const generateImportCode = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}${month}${day}${hours}${minutes}${seconds}`;
    };


    useEffect(() => {
        getAllStorages1();
        getAllStorages2();
        getAllSuppliers();
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

    const getAllStorages1 = async () => {
        let res = await fetchAllStorages();
        setTotalWarehouse1(res);
    }

    const getAllStorages2 = async () => {
        let res = await fetchAllStorages();
        setTotalWarehouse2(res);
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
    // Xử lý chọn "Tất cả kho Nhập"
    const handleStorageClickTotalImport = async () => {
        await getAllStorages2(); //QH
        setSelectedWarehouseImportId("");
        setSelectedWarehouseImport("Nhập Vào Kho");
    }


    const handleStorageClickImport = async (warehouse) => {
        await getAllStorages2(); //QH
        setSelectedWarehouseImport(warehouse.warehouseName);
        setSelectedWarehouseImportId(warehouse.warehouseId);
        setTotalWarehouse2(x => x.filter(w => w.warehouseId !== warehouse.warehouseId)); //QH
    }

    // Xử lý chọn "Tất cả kho Xuất"
    const handleStorageClickTotalExport = async () => {
        await getAllStorages1(); //QH
        setSelectedWarehouseExportId("");
        setSelectedWarehouseExport("Xuất Từ Kho");
    }


    const handleStorageClickExport = async (warehouse) => {
        await getAllStorages1(); //QH
        setSelectedWarehouseExport(warehouse.warehouseName);
        setSelectedWarehouseExportId(warehouse.warehouseId);
        setTotalWarehouse1(x => x.filter(w => w.warehouseId !== warehouse.warehouseId)); //QH
    }


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

    const getAllSuppliers = async () => {
        let res = await fetchAllSuppliers();
        setTotalSuppliers(res);
    }

    const handleSupplierClick = (supplier, event) => {
        setSelectedSupplier(supplier.supplierName);
        setSelectedSupplierId(supplier.supplierId);
    }



    const handleReset = () => {
        setRowsData([]);
        setSelectedWarehouseImport(null);
        setSelectedWarehouseExport(null);
        setSelectedDelivery(null);
        setSelectedDeliveryId(null);
        setSelectedDate('');
        setTotalCost(0);
        setImportCode(null);
        setSelectedSupplier(null);
        setSelectedSupplierId(null);
    }

    const handleCloseModal = () => {
        handleReset();
        handleClose();
    }

    // nhận dữ liệu từ addRowDataImport


    const takeRowDataImportOrder = (importData) => {

        importData.supplierId = selectedSupplierId;
        importData.supplierName = selectedSupplier;

        // Kiểm tra xem sản phẩm đã tồn tại trong danh sách hay chưa
        const existingProductIndex = rowsData.findIndex(row => row.goodsId === importData.goodsId);

        if (existingProductIndex !== -1) {

            // Nếu sản phẩm đã tồn tại, cập nhật số lượng và các giá trị mới
            const updatedRowsData = [...rowsData];

            updatedRowsData[existingProductIndex].quantity += importData.quantity; // Cập nhật số lượng
            updatedRowsData[existingProductIndex] = { ...updatedRowsData[existingProductIndex], ...importData }; // Cập nhật các giá trị mới

            setRowsData(updatedRowsData);

            //setTotalCost(prevTotalCost => prevTotalCost + importData.totalOneGoodPrice); // Cập nhật tổng chi phí
            toast.info("Sản phẩm đã tồn tại trong danh sách, số lượng và thông tin đã được cập nhật.");
        } else {
            // Nếu sản phẩm chưa tồn tại, thêm vào danh sách và cập nhật tổng chi phí
            const updateDataImport = [...rowsData, importData];
            setRowsData(updateDataImport);
            setTotalCost(prevTotalCost => prevTotalCost + importData.totalOneGoodPrice);
        }
    }



    // mở addRowDataImport

    const handleAddRowDataImport = async () => {
        if (roleId === 1) {
            if (selectedWarehouseExportId && selectedSupplierId) {
                setIsShowRowDataImport(true);
            } else {
                toast.info("Vui lòng điền kho hoặc nhà cung cấp");
            }
        } else if (roleId === 3 && selectedSupplierId) {
            const userId = parseInt(localStorage.getItem('userId'), 10);
            let warehouse = await getWarehouseById(userId);
            if (warehouse) {
                setIsShowRowDataImport(true);
            } else {
                toast.info("Không tìm thấy kho cho người dùng này");
            }
        }
    };

    //render rowsData

    const renderImportData = () => {
        return rowsData.map((data, index) => (
            // console.log("data: ", data),
            <RowDataImportOrderN key={index} data={rowsData[index]} index={index}
                deleteRowData={deleteRowData} updateRowData={updateRowData} />
        ))
    }

    // Xóa 1 row của rowsData ở RowDataImport
    const deleteRowData = (rowdel) => {
        const updateDataImport = rowsData.filter((item, index) => index !== rowdel);
        const deletePrice = rowsData[rowdel].totalOneGoodPrice;
        setRowsData(updateDataImport);
        setTotalCost(x => x - deletePrice ? x - deletePrice : 0);
    }


    // cập nhật 1 row của rowsData ở RowDataImport

    const updateRowData = (rowUpdate, updateData) => {

        // console.log(updateData);
        const updateDataImport = [...rowsData];
        updateDataImport[rowUpdate] = updateData;
        setTotalCost(x => x - rowsData[rowUpdate].totalOneGoodPrice + updateData.totalOneGoodPrice);
        setRowsData(updateDataImport);
    }


    const handleChooseFile = async (event) => {
        const file = event.target.files[0];
        let res = await uploadImage(file);
        const urlImage = res.url;
        setImageImportOrder(urlImage);
    }
    const getWarehouseById = async (userId) => {
        let res = await getUserIdWarehouse(userId);
        return res[0];
    }
    // Thêm 1 lô hàng 
    const handleAddImportOrder = async () => {
        if (!selectedDate) {
            toast.warning("Vui lòng nhập ngày nhập hàng");
        } else if (!selectedWarehouseExportId) {
            toast.warning("Vui lòng chọn kho xuất hàng");
        } else if (!selectedSupplierId) {
            toast.warning("Vui lòng chọn nhà cung cấp");
        } else if (!selectedDeliveryId) {
            toast.warning("Vui lòng chọn nhà vận chuyển");
        } else if (rowsData.length === 0) {
            toast.warning("Vui lòng thêm lô hàng");
        } else {
            const newImportCode = generateImportCode();
            const userId = parseInt(localStorage.getItem('userId'), 10);
            let warehouse = await getWarehouseById(userId);
            const warehouseIdToUse = roleId === 1 ? selectedWarehouseImportId : warehouse.warehouseId;
            if (!warehouseIdToUse) {
                toast.warning("Vui lòng chọn kho nhập hàng");
                return;
            }
            let isInternalTransfer = true;
            let r = await addNewImportOrder(
                isInternalTransfer,
                userId,
                userId,
                selectedSupplierId,
                totalCost,
                "",
                "2024-06-20T16:10:19.498Z",
                formatDateImport(selectedDate),
                1,
                newImportCode,
                warehouseIdToUse,
                selectedDeliveryId,
                imageImportOrder,
                selectedWarehouseExportId
            );
            // console.log("res warehouseDestinationId: ", selectedWarehouseExportId);
            // console.log("res warehouseIdToUse: ", r);
            if (r.isSuccess == true) {
                let resImportId = await fetchImportOrderNewest();
                // console.log("ResImportID :", resImportId);

                if (rowsData && rowsData.length > 0) {
                    await Promise.all(rowsData.map(async (data, index) => {
                        await createNewImportOrderDetail(
                            resImportId,
                            data.costPrice,
                            data.batchCode,
                            data.manufactureDate,
                            data.expiryDate,
                            data.goodsId,
                            data.quantity
                        );
                    }));
                }
                // console.log("rowsData: ", resImportId);
                toast.success("Thêm lô hàng nhập thành công");


                updateTable();
                handleCloseModal();
            } else {
                toast.warning("Thêm lô hàng nhập thất bại");
            }

        }

    }



    return (<>
        <Modal show={isShow} onHide={handleCloseModal} size="xl">
            <Modal.Header closeButton>
                <Modal.Title>Thêm đơn hàng nhập</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="body-add-new">
                    <Row style={{ display: 'flex', alignItems: 'center' }} >
                        {/* <Col md={2}>

                            <input type="text" className="form-control inputCSS" aria-describedby="emailHelp" placeholder="Mã đơn hàng" value={importCode} onChange={(event) => setImportCode(event.target.value)} />

                        </Col> */}
                        {
                            (roleId === 1) ?
                                <Col md={2}>
                                    <DropdownButton
                                        className="DropdownButtonCSS ButtonCSSDropdown"
                                        title={selectedWarehouseImport !== null ? selectedWarehouseImport : "Nhập Vào Kho"}
                                        variant="success"
                                        style={{ zIndex: 999 }}
                                    >
                                        <Dropdown.Item eventKey=""
                                            onClick={() => handleStorageClickTotalImport()}>Nhập Vào Kho</Dropdown.Item>

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
                                : ''
                        }
                        <Col md={2}>
                            <DropdownButton
                                className="DropdownButtonCSS ButtonCSSDropdown"
                                title={selectedWarehouseExport !== null ? selectedWarehouseExport : "Xuất Từ Kho"}
                                variant="success"
                                style={{ zIndex: 999 }}
                            >
                                <Dropdown.Item eventKey="" onClick={() => handleStorageClickTotalExport()}>Xuất Từ Kho</Dropdown.Item>
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

                        <Col md={2}>
                            <div>
                                <input type="date" className="datepickerCSS" id="datepicker" min={minDate} value={selectedDate} onChange={handleDateChange} />
                            </div>
                        </Col>



                        <Col >
                            <div className="align-middle text-nowrap" style={{ overflow: 'visible' }}>
                                <Dropdown style={{ position: 'relative' }}>
                                    <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                                        <span style={{ color: 'white', fontWeight: 'bold' }}>{selectedDelivery !== null ? selectedDelivery : "Chọn nhà vận chuyển"}</span>
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






                    </Row>

                    <Row style={{ marginTop: '20px' }}>
                        <Col md={2}>
                            <div>
                                <input
                                    type="file"
                                    accept="image/*" // Chỉ chấp nhận các loại file ảnh
                                    onChange={handleChooseFile} // Hàm xử lý sự kiện khi người dùng chọn file
                                />
                            </div>
                        </Col>
                        <Col md={7}></Col>
                        <Col md={3}>
                            <div className="ButtonCSSDropdown">
                                <button
                                    className="btn btn-success border-left-0 rounded"
                                    type="button"
                                    onClick={handleAddRowDataImport}
                                ><i className="fa-solid fa-plus"></i>
                                    &nbsp;
                                    Thêm lô hàng
                                </button>
                            </div>
                        </Col>
                    </Row>



                    <hr />
                    <Row style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {renderImportData()}

                    </Row>

                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" className="ButtonCSS" onClick={handleAddImportOrder}>
                    Lưu
                </Button>
            </Modal.Footer>
        </Modal >

        <AddRowDataImportOrderN isShow={isShowRowDataImport}
            selectedSupplierId={selectedSupplierId}
            selectedStorageId={selectedWarehouseExportId}

            onChange={(importData) => takeRowDataImportOrder(importData)}
            handleClose={() => setIsShowRowDataImport(false)} />
    </>)
}

export default ModelAddImportOrderN;