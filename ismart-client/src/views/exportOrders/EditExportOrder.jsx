import { useEffect, useState } from "react";
import React from 'react';
import { Modal, Button, Row, Col, DropdownButton, Dropdown } from "react-bootstrap"
import { getExportOrderDetailByExportId } from "~/services/ExportOrderDetailService";
import { updateExportOrder } from "~/services/ExportOrderService";
import { getImportOrderDetailByImportId, updateImportOrderDetail } from "~/services/ImportOrderDetailServices";
import { formatDateImport, formattedAmount } from "~/validate";
import { CustomToggle, CustomMenu } from '../components/others/Dropdown';
import RowDataEditExportOrder from "./RowDataEditExportOrder";
import { updateExportOrderDetail } from "~/services/ExportOrderDetailService";
import { format, addDays } from 'date-fns';

import { toast } from "react-toastify";

const ModalEditExportOrder = ({ isShow, handleClose, detailOrderEdit, updateTable }) => {

    const userId = parseInt(localStorage.getItem('userId'), 10);


    const [rowsData, setRowsData] = useState([]);
    const [dataDetailOrderEdit, setDataDetailOrderEdit] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const [selectedStorage, setSelectedStorage] = useState(null);
    const [selectedStorageId, setSelectedStorageId] = useState(null);




    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedProjectId, setSelectedCustomerId] = useState(null);

    const [exportCode, setExportCode] = useState(null);

    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        if (detailOrderEdit.exportId) {
            getTotalOrderDetail(detailOrderEdit.exportId);

            setSelectedStorage(detailOrderEdit.warehouseName);
            setSelectedStorageId(detailOrderEdit.warehouseId);

            setSelectedCustomer(detailOrderEdit.customerName);
            setSelectedCustomerId(detailOrderEdit.customerId);

            setExportCode(detailOrderEdit.exportCode);

            setSelectedDate(formatDateImport(detailOrderEdit.exportedDate));
        }
        console.log(detailOrderEdit.CustomerName);

    }, [detailOrderEdit])

    const getTotalOrderDetail = async (exportId) => {
        let res = await getExportOrderDetailByExportId(exportId);
        console.log(res);
        setRowsData(res);
        setDataDetailOrderEdit(res);
        setTotalPrice(detailOrderEdit.totalPrice);
    }


    // render rowsData
    const renderExportData = () => {
        return rowsData.map((data, index) => (
            <RowDataEditExportOrder key={index} data={rowsData[index]} index={index}
                deleteRowData={deleteRowData} updateRowData={updateRowData} />
        ))


    }

    // xóa 1 row của rowsData ở RowDataImport
    const deleteRowData = (rowdel) => {
        const updateDataImport = rowsData.filter((item, index) => index !== rowdel);
        const deletePrice = rowsData[rowdel].price * rowsData[rowdel].quantity;
        setRowsData(updateDataImport);
        setTotalPrice(x => x - deletePrice ? x - deletePrice : 0);
    }

    // update 1 row data từ RowDataImport
    const updateRowData = (rowUpdate, updateData) => {
        console.log(updateData);
        const updateDataImport = [...rowsData];
        updateDataImport[rowUpdate] = updateData;
        setTotalPrice(x => x - rowsData[rowUpdate].price * rowsData[rowUpdate].quantity + updateData.price * updateData.quantity);
        setRowsData(updateDataImport);
    }

    const handleUpdateExportOrder = async () => {
        if (totalPrice === 0) {
            toast.warning("Vui lòng nhập mặt hàng xuất");
        } else {
            console.log(detailOrderEdit.exportId);
            let res = await updateExportOrder(detailOrderEdit.exportId, userId, selectedProjectId, 0, "", detailOrderEdit.createdDate, detailOrderEdit.exportedDate, 3, exportCode, selectedStorageId, "", detailOrderEdit.image, null);
            console.log(res);
            if (rowsData && rowsData.length > 0) {
                await Promise.all(rowsData.map(async (data, index) => {
                    await updateExportOrderDetail(detailOrderEdit.exportId, data.price, data.detailId, data.goodsId, data.quantity);
                }));
            }
            toast.success("Sửa lô hàng xuất thành công");
            updateTable();
            handleClose();
        }

    }
    const handleCloseModal = () => {
        handleReset();
        handleClose();
    }

    const handleReset = () => {
        // setRowsData([]);
        setTotalPrice(detailOrderEdit.totalPrice);
        setRowsData(dataDetailOrderEdit);

    }

    return (<>
        <Modal show={isShow} onHide={handleCloseModal} size="xl">
            <Modal.Header closeButton>
                <Modal.Title>Sửa lô hàng xuất</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="body-add-new">
                    <Row style={{ display: 'flex', alignItems: 'center' }} >
                        <Col md={2}>

                            <input type="text" className="form-control inputCSS" aria-describedby="emailHelp" placeholder="Mã đơn hàng" value={exportCode} disabled />

                        </Col>
                        <Col md={2}>
                            <DropdownButton className="ButtonCSSDropdown" title={selectedStorage} variant="success" disabled>
                            </DropdownButton>
                        </Col>

                        <Col md={2}>
                            <DropdownButton className="ButtonCSSDropdown" title={selectedCustomer} variant="success" disabled>
                            </DropdownButton>
                        </Col>



                        <Col md={2}>
                            <div>
                                <input type="date" className="datepickerCSS" id="datepicker" value={selectedDate} disabled />
                            </div>
                        </Col>



                        {/* <Col >
                            <DropdownButton className="ButtonCSSDropdown" title={selectedDelivery} variant="success" disabled>
                            </DropdownButton>
                        </Col> */}






                    </Row>

                    <Row style={{ marginTop: '20px' }}>
                        <Col md={7}></Col>
                    </Row>



                    <hr />
                    <Row style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {renderExportData()}

                    </Row>

                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" className="ButtonCSS" onClick={handleUpdateExportOrder}>
                    Lưu
                </Button>
            </Modal.Footer>
        </Modal >

    </>)
}

export default ModalEditExportOrder