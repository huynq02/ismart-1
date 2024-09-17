import { useEffect, useState } from "react";
import React from 'react';
import { Modal, Button, Row, Col, DropdownButton } from "react-bootstrap"
import RowDataEditReturnOrder from "./RowDataEdit";
import { formatDateImport } from "~/validate";
import { updateReturnOrderDetail, deleteReturnOrderDetaiById, getReturnOrderDetailByOrderId } from "~/services/ReturnOrderDetailService"
import { toast } from "react-toastify";

const ModalEditReturnOrder = ({ isShow, handleClose, detailOrderEdit, updateTable }) => {

    const userId = parseInt(localStorage.getItem('userId'), 10);


    const [rowsData, setRowsData] = useState([]);
    const [dataDetailOrderEdit, setDataDetailOrderEdit] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const [selectedStorage, setSelectedStorage] = useState(null);
    const [selectedStorageId, setSelectedStorageId] = useState(null);


    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [suplierId, setSuplierId] = useState(null);

    const [exportCode, setExportCode] = useState(null);

    const [selectedDate, setSelectedDate] = useState(null);
    const [batchCode, setBatchCode] = useState(null);

    useEffect(() => {
        console.log(detailOrderEdit);
        if (detailOrderEdit.returnOrderId) {
            getTotalOrderDetail(detailOrderEdit.returnOrderId);
            setSelectedCustomer(detailOrderEdit.approvedByName);
            setSelectedStorage(detailOrderEdit.warehouseName);
            setSelectedStorageId(detailOrderEdit.warehouseId);
            setSuplierId(detailOrderEdit.supplierId);
            setExportCode(detailOrderEdit.returnOrderCode);
            setSelectedDate(formatDateImport(detailOrderEdit.returnedDate));
        }
    }, [detailOrderEdit])

    const getTotalOrderDetail = async (returnOrderId) => {
        let res = await getReturnOrderDetailByOrderId(returnOrderId);
        setRowsData(res);
        setDataDetailOrderEdit(res);
    }


    // render rowsData
    const renderExportData = () => {
        return rowsData.map((data, index) => (
            <RowDataEditReturnOrder key={index} data={rowsData[index]} index={index}
                deleteRowData={deleteRowData} updateRowData={updateRowData} />
        ))
    }

    // xóa 1 row của rowsData ở RowDataImport
    const deleteRowData = async (rowdel) => {
        const updateDataImport = rowsData.filter((item, index) => index !== rowdel);
        if (updateDataImport.length >= 1) {
            const order = updateDataImport[0].returnOrderDetailId;
            await deleteReturnOrderDetaiById(order)
                .then(() => {
                    toast.success("Xóa thành công");
                })
                .catch(() => {
                    toast.error("Xóa thất bại");
                }).finally(() => {
                    setRowsData(updateDataImport);
                })
        } else {
            toast.warning("Cần ít nhất 1 lô hàng trong mỗi đơn hàng trả lại");
        }
        console.log(updateDataImport, "after");

    }

    // update 1 row data từ RowDataImport
    const updateRowData = (rowUpdate, updateData) => {
        const updateDataImport = [...rowsData];
        updateDataImport[rowUpdate] = updateData;
        setTotalPrice(x => x - rowsData[rowUpdate].price * rowsData[rowUpdate].quantity + updateData.price * updateData.quantity);
        setRowsData(updateDataImport);
    }

    const handleUpdateExportOrder = async () => {
        //let res = await updateReturnOrder(detailOrderEdit.returnOrderId, exportCode, selectedDate, selectedStorageId, suplierId, detailOrderEdit.statusId, detailOrderEdit.createdBy, detailOrderEdit.approvedBy);
        if (rowsData && rowsData.length > 0) {
            await Promise.all(rowsData.map(async (data, index) => {
                await updateReturnOrderDetail(data.returnOrderDetailId, detailOrderEdit.returnOrderId, data.goodsId, data.quantity, data.reason, data.batchCode);
            }));
        }
        toast.success("Sửa lô hàng trả thành công");
        updateTable();
        handleClose();
    }

    const handleCloseModal = () => {
        handleReset();
        handleClose();
    }

    const handleReset = () => {
        setTotalPrice(detailOrderEdit.totalPrice);
        setRowsData(dataDetailOrderEdit);

    }

    return (<>
        <Modal show={isShow} onHide={handleCloseModal} size="xl">
            <Modal.Header closeButton>
                <Modal.Title>Sửa lô hàng trả</Modal.Title>
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
                                <input type="date" className="datepickerCSS ml-10" id="datepicker" value={selectedDate} disabled />
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

export default ModalEditReturnOrder