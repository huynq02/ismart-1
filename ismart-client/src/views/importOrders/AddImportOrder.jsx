import { useEffect, useState } from "react";
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
import AddRowDataImportOrder from "./AddRowDataImport";
import { format, addDays } from 'date-fns';
import RowDataImportOrder from "./RowDataImport";
import { toast } from "react-toastify";


import uploadImage from "~/services/ImageServices";
import { data } from "autoprefixer";
import { getUserIdWarehouse } from "~/services/UserWarehouseServices";


const ModelAddImportOrder = ({ isShow, handleClose, updateTable }) => {
    const roleId = parseInt(localStorage.getItem('roleId'), 10);
    const userId = parseInt(localStorage.getItem('userId'), 10);


    const [importCode, setImportCode] = useState('');

    const [totalWarehouse, setTotalWarehouse] = useState([]);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [selectedWarehouseId, setSelectedWarehouseId] = useState(null);

    const [totalSuppliers, setTotalSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState(null);


    const [suppliersData, setSuppliersData] = useState([]);




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




    useEffect(() => {
        getAllStorages();
        getAllSuppliers();
        getAllDelivery();
    }, [])


    useEffect(() => {
        const currentDate = new Date();
        const formattedDate = format(currentDate, 'yyyy-MM-dd');
        setMinDate(formattedDate);
    }, [])


    useEffect(() => {
    }, [importCode]);




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


    const getAllSuppliers = async () => {
        let res = await fetchAllSupplierActive();
        setTotalSuppliers(res);
    }


    const handleSupplierClick = (supplier, event) => {
        setSelectedSupplier(supplier.supplierName);
        setSelectedSupplierId(supplier.supplierId);
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






    const handleReset = () => {
        setRowsData([]);
        setSelectedWarehouse(null);
        setSelectedWarehouseId(null);
        setSelectedSupplier(null);
        setSelectedSupplierId(null);
        setSelectedDelivery(null);
        setSelectedDeliveryId(null);
        setSelectedDate('');
        setTotalCost(0);
        setImportCode(null);
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
            // setTotalCost(prevTotalCost => prevTotalCost + importData.totalOneGoodPrice);
        }
    }


    // mở addRowDataImport
    const handleAddRowDataImport = async () => {
        if (roleId === 1 ) {
            if (selectedWarehouseId && selectedSupplierId) {
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
            <RowDataImportOrder key={index} data={rowsData[index]} index={index}
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


    const handleAddImportOrder = async () => {
        if (!selectedDate) {
            toast.warning("Vui lòng nhập ngày nhập hàng!");
        }

        else if (!selectedSupplier) {
            toast.warning("Vui lòng chọn nhà cung cấp!");
        }
        else if (!selectedDeliveryId) {
            toast.warning("Vui lòng chọn nhà vận chuyển!");
        }
        // else if (selectedDate > currentDate) {
        //     toast.warning("Ngày nhập hàng phải lớn hơn ngày hiện tại!");
        // }
        else if (rowsData.length === 0) {
            toast.warning("Hãy thêm lô hàng");
        }
        else {
            const newImportCode = generateImportCode();
            const userId = parseInt(localStorage.getItem('userId'), 10);
            let warehouse = await getWarehouseById(userId);
            const warehouseIdToUse = roleId === 1 ? selectedWarehouseId : warehouse.warehouseId;
            if (!warehouseIdToUse) {
                toast.warning("Vui lòng chọn kho hàng!");
            }
            let isInternalTransfer = false;
            let res = await addNewImportOrder(isInternalTransfer,
                userId,
                1,
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


            );
            console.log("res",res);
             console.log("isInternalTransfer: ", isInternalTransfer);
            if (res.isSuccess == true) {
                let resImportId = await fetchImportOrderNewest();
                console.log("ResImportID :", resImportId);


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
                        console.log("data1:", data);
                    }));
                }
                toast.success("Thêm lô hàng nhập thành công");
                updateTable();
                handleCloseModal();
            } else {
                toast.warning("Mã đơn hàng đã tồn tại");
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

                        <Col md={3} className="mt-3">
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


        <AddRowDataImportOrder isShow={isShowRowDataImport}
            selectedSupplierId={selectedSupplierId} selectedStorageId={selectedWarehouseId}
            onChange={(importData) => takeRowDataImportOrder(importData)}
            handleClose={() => setIsShowRowDataImport(false)} />
    </>)
}


export default ModelAddImportOrder;



