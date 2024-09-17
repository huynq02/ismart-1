import { useEffect, useState } from "react";
import { Modal, Button, Row, Col, DropdownButton, Dropdown } from "react-bootstrap";
import { toast } from 'react-toastify';
import { fetchAllStorages } from '~/services/StorageServices';
import { format } from 'date-fns';
import AddRowDataStock from "./AddRowDataStock";
import RowDataStock from "./RowDataStock";
import { createInventoryCheck } from "~/services/StockTakeServices";
import { getUserIdWarehouse } from "~/services/UserWarehouseServices";

const ModalAddStockTake = ({ isShow, handleClose, updateTableStock }) => {
    const roleId = parseInt(localStorage.getItem('roleId'), 10);
    const userId = parseInt(localStorage.getItem('userId'), 10);
    const warehouseId = parseInt(localStorage.getItem('warehouseId'), 10);

    const [totalWarehouse, setTotalWarehouse] = useState([]);
    const [selectedWarehouse, setSelectedWarehouse] = useState('');
    const [selectedWarehouseId, setSelectedWarehouseId] = useState(null);

    const [minDate, setMinDate] = useState();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const [isShowRowDataStock, setIsShowRowDataStock] = useState(false);

    const [rowsData, setRowsData] = useState([]);

    useEffect(() => {
        getAllStorages();
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

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };
    const getWarehouseById = async (userId) => {
        let res = await getUserIdWarehouse(userId);
        return res[0];
    }
    const handleAddRowDataStock = async () => {
        if (roleId === 1) {
            if (selectedWarehouseId) {
                setIsShowRowDataStock(true);
            } else {
                toast.warning("Vui lòng điền kho")
            }
        } else if (roleId === 4) {
            const userId = parseInt(localStorage.getItem('userId'), 10);
            let warehouse = await getWarehouseById(userId);
            if (warehouse) {
                setIsShowRowDataStock(true);
            } else {
                toast.info("Không tìm thấy kho cho người dùng này");
            }
        }
    }



    const handleSave = async () => {
        if (!selectedDate) {
            toast.warning("Vui lòng nhập ngày");
        } else if (rowsData.length === 0) {
            toast.warning("Hãy thêm sản phẩm");
        }
        else {
            const userId = parseInt(localStorage.getItem('userId'), 10);

            if (rowsData && rowsData.length > 0) {
                const inventoryCheckDetailsArray = rowsData.map((data) => {
                    return {
                        goodCode: data.goodsCode,
                        expectedQuantity: data.expectedQuantity,
                        actualQuantity: data.totalActualQuantity,
                        note: data.batchDetails[0].note,
                        batchDetails: [
                            {
                                batchCode: data.batchDetails[0].batchCode,
                                expectedQuantity: data.batchDetails[0].oldActualQuantity,
                                actualQuantity: data.batchDetails[0].actualQuantity,
                                note: data.batchDetails[0].note
                            }
                        ]
                    };
                });
                let warehouse = await getWarehouseById(userId);
                console.log("warehouse", warehouse);
                const warehouseIdToUse = roleId === 1 ? selectedWarehouseId : warehouse.warehouseId;
                if (!warehouseIdToUse) {
                    toast.warning("Vui lòng chọn kho hàng");
                    return;
                }
                await createInventoryCheck(warehouseIdToUse, selectedDate, "", inventoryCheckDetailsArray);

                toast.success("Thêm đơn kiểm kê thành công");
                updateTableStock(selectedWarehouseId, selectedWarehouse);
                handleCloseModal();
            }
        }
    };

    const handleCloseModal = () => {
        handleReset();
        handleClose();
    }

    const handleReset = () => {
        setRowsData([]);
        setSelectedWarehouse('');
        setSelectedWarehouseId(null);
        setSelectedDate('');
    }


    const takeRowDataStock = (stockData) => {
        // // Tạo một bản sao mới của rowsData
        // const updatedRows = rowsData.map(row => {
        //     // Kiểm tra nếu batchCode trùng
        //     if (row.batchDetails[0].batchCode === stockData.batchDetails[0].batchCode) {
        //         // Tạo một bản sao mới của batchDetails với actualQuantity mới
        //         toast.info("Sản phẩm đã tồn tại trong danh sách, số lượng và thông tin đã được cập nhật.");
        //         return {
        //             ...row,
        //             batchDetails: [
        //                 {
        //                     ...row.batchDetails[0],
        //                     actualQuantity: stockData.batchDetails[0].actualQuantity,
        //                     note: stockData.batchDetails[0].expectedQuantity < stockData.batchDetails[0].actualQuantity
        //                         ? "Thừa hàng"
        //                         : stockData.batchDetails[0].expectedQuantity > stockData.batchDetails[0].actualQuantity
        //                             ? "Thiếu hàng"
        //                             : "Đã đủ"
        //                 }
        //             ]
        //         };
        //     }
        //     return row;
        // });

        // // Nếu không tìm thấy batchCode trùng, thêm mới
        // const batchCodeExists = updatedRows.some(row => row.batchDetails[0].batchCode === stockData.batchDetails[0].batchCode);
        // if (!batchCodeExists) {
        //     updatedRows.push(stockData);
        // }

        // // Cập nhật trạng thái với bản sao mới
        // setRowsData(updatedRows);

        const updateDataStock = [...rowsData];
        for (var i = 0; i < stockData.length; i++) {
            const existingIndex = updateDataStock.findIndex(item => item.batchDetails[0].batchCode === stockData[i].batchDetails[0].batchCode);
            if (existingIndex !== -1) {
                updateDataStock[existingIndex] = stockData[i];
                toast.info("Sản phẩm đã tồn tại trong danh sách, số lượng và thông tin đã được cập nhật.");
            } else {
                updateDataStock.push(stockData[i]);
            }
        }
        console.log("stockData", stockData);
        setRowsData(updateDataStock);
    };




    const updateRowData = (rowUpdate, updateData) => {
        console.log("updateData", updateData);
        const updateDataImport = [...rowsData];
        updateDataImport[rowUpdate] = updateData;
        setRowsData(updateDataImport);
    }

    const deleteRowData = (rowdel) => {
        const updateDataExport = rowsData.filter((item, index) => index !== rowdel);
        setRowsData(updateDataExport);
    }

    const renderStockData = () => {
        return rowsData.map((data, index) => (
            <>
                <RowDataStock key={`rdt${index}`}
                    data={rowsData[index]} index={index}
                    updateRowData={updateRowData}
                    deleteRowData={deleteRowData}
                />
            </>

        ))
    }

    return (
        <>
            <Modal show={isShow} onHide={handleCloseModal} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Thêm đơn kiểm kê</Modal.Title>
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
                                <div>
                                    <input type="date" className="datepickerCSS" id="datepicker" min={minDate} value={selectedDate} onChange={handleDateChange} />
                                </div>
                            </Col>
                            {(roleId == 1) ?
                                <Col md={2}>
                                    <DropdownButton
                                        className="DropdownButtonCSS ButtonCSSDropdown"
                                        title={selectedWarehouse !== '' ? selectedWarehouse : "Tất cả Kho"}
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
                                :
                                <Col md={2}>
                                    <input type="text" className="form-control inputCSS"
                                        aria-describedby="emailHelp"
                                        value={selectedWarehouse} hidden />
                                </Col>
                            }
                        </Row>

                        <Row>

                            <Col md={3} className="mt-3">
                                <div className="ButtonCSSDropdown">
                                    <button
                                        className="btn btn-success border-left-0 rounded"
                                        type="button"
                                        onClick={handleAddRowDataStock}
                                    ><i className="fa-solid fa-plus"></i>
                                        &nbsp;
                                        Thêm sản phẩm
                                    </button>
                                </div>
                            </Col>
                        </Row>



                        <Row style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            {renderStockData()}
                        </Row>


                    </div>
                </Modal.Body>

                <Modal.Footer>

                    <Button variant="primary" className="ButtonCSS" onClick={handleSave}>
                        Lưu
                    </Button>
                </Modal.Footer>
            </Modal >

            <AddRowDataStock isShow={isShowRowDataStock} selectedStorageId={selectedWarehouseId}
                onChange={(exportData) => takeRowDataStock(exportData)}
                handleClose={() => setIsShowRowDataStock(false)} />
        </>)
}

export default ModalAddStockTake;