import { useEffect, useState } from "react";
import React from 'react';
import { Modal, Button, Row, Col, DropdownButton, Dropdown } from "react-bootstrap"
import { updateImportOrder } from "~/services/ImportOrderServices";
import { deleteImportOrderDetail,getImportOrderDetailByImportId, updateImportOrderDetail } from "~/services/ImportOrderDetailServices";
import { formatDateImport, formattedAmount } from "~/validate";

import { CustomToggle, CustomMenu } from '../components/others/Dropdown';
// import AddRowDataImportOrderN from "./AddRowDataImportOrderN";
import RowDataEditImportOrder from './RowDataEditImportOrderN';
import { format, addDays } from 'date-fns';

// import RowDataImportOrderN from "./RowDataImportOrderN";
import { toast } from "react-toastify";




const ModalEditImportOrderN = ({ isShow, handleClose, detailOrderEdit, updateTable }) => {



    const [rowsData, setRowsData] = useState([]);

    const [selectedStorage, setSelectedStorage] = useState(null);
    const [selectedStorageId, setSelectedStorageId] = useState(null);

    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [selectedSupplierId, setSelectedSupplierId] = useState(null);

    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const [selectedDeliveryId, setSelectedDeliveryId] = useState(null);

    const [importCode, setImportCode] = useState(null);

    const [selectedDate, setSelectedDate] = useState(null);


    const [deleteData, setDeleteData] = useState([]);

    const userId = parseInt(localStorage.getItem('userId'), 10);


    useEffect(() => {
        if (detailOrderEdit.importId) {
            getTotalOrderDetail(detailOrderEdit.importId);

            setSelectedStorage(detailOrderEdit.storageName);
            setSelectedStorageId(detailOrderEdit.storageId);

            setSelectedSupplier(detailOrderEdit.supplierName);
            setSelectedSupplierId(detailOrderEdit.supplierId);

            setSelectedDelivery(detailOrderEdit.deliveryName);
            setSelectedDeliveryId(detailOrderEdit.deliveryId);

            setImportCode(detailOrderEdit.importCode);

            setSelectedDate(formatDateImport(detailOrderEdit.importedDate));
        }
        console.log(rowsData);
        console.log(detailOrderEdit);

    }, [detailOrderEdit])

    const getTotalOrderDetail = async (importId) => {
        let res = await getImportOrderDetailByImportId(importId);
        console.log(res);
        setRowsData(res);
    }

    const takeRowDataImportOrder = (importData) => {
        const updateDataImport = [...rowsData, importData];
        // updateDataImport[rowsData.length - 1] = importData;
        setRowsData(updateDataImport);

        // setTotalPrice(x => x + importData.totalOneGoodPrice);

    }


    // render rowsData
    const renderImportData = () => {
        return rowsData.map((data, index) => (
            <>
                <RowDataEditImportOrder key={index} data={rowsData[index]} index={index}
                    deleteRowData={deleteRowData} updateRowData={updateRowData} />
            </>

        ))


    }

    // xóa 1 row của rowsData ở RowDataImport
    const deleteRowData = (rowdel) => {
        const updateDataImport = rowsData.filter((item, index) => index !== rowdel);
        setRowsData(updateDataImport);

        const deleteDataImport = rowsData[rowdel];
        setDeleteData([...deleteData, deleteDataImport]);
    }

    // update 1 row data từ RowDataImport
    const updateRowData = (rowUpdate, updateData) => {
        console.log(updateData);
        const updateDataImport = [...rowsData];
        updateDataImport[rowUpdate] = updateData;

        setRowsData(updateDataImport);
    }

    const handleUpdateImportOrder = async () => {
        // if (totalPrice === 0) {
        //     toast.warning("Vui lòng nhập mặt hàng nhập");
        // } else {
        console.log(detailOrderEdit.importId);
        let res = await updateImportOrder(detailOrderEdit.importId, userId, selectedSupplierId, 0, "", detailOrderEdit.createdDate, detailOrderEdit.importedDate, 3, importCode, selectedStorageId, selectedDeliveryId, detailOrderEdit.image, null);
        console.log(res);
        if (rowsData && rowsData.length > 0) {
            await Promise.all(rowsData.map(async (data, index) => {
                await updateImportOrderDetail(
                    detailOrderEdit.importId,
                    data.costPrice,
                    data.detailId,
                    data.goodsId,
                    data.quantity,
                    data.manufactureDate,
                    data.expiryDate,
                    data.batchCode
                );
            }));
        }

        if (deleteData && deleteData.length > 0) {
            await Promise.all(deleteData.map(async (data, index) => {
                let result = await deleteImportOrderDetail(data.detailId);
                console.log(result);
            }))
        }
        toast.success("Sửa lô hàng nhập thành công");
        updateTable();
        handleReset();
        handleClose();
        // }

    }
    const handleCloseModal = () => {
        handleReset();
        handleClose();
        getTotalOrderDetail(detailOrderEdit.importId);
    }

    const handleReset = () => {
        setDeleteData([]);
    }


    return (<>
        <Modal show={isShow} onHide={handleCloseModal} size="xl">
            <Modal.Header closeButton>
                <Modal.Title>Sửa lô hàng nhập</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="body-add-new">
                    <Row style={{ display: 'flex', alignItems: 'center' }} >
                        <Col md={2}>

                            <input type="text" className="form-control inputCSS" aria-describedby="emailHelp" placeholder="Mã đơn hàng" value={importCode} disabled />

                        </Col>
                        <Col md={2}>
                            <DropdownButton className="ButtonCSSDropdown" title={selectedStorage} variant="success" disabled>
                            </DropdownButton>
                        </Col>

                        <Col md={3}>
                            <DropdownButton className="ButtonCSSDropdown" title={selectedSupplier} variant="success" disabled>
                            </DropdownButton>
                        </Col>



                        <Col md={2}>
                            <div>
                                <input type="date" className="datepickerCSS" id="datepicker" value={selectedDate} disabled />
                            </div>
                        </Col>



                        <Col >
                            <DropdownButton className="ButtonCSSDropdown" title={selectedDelivery} variant="success" disabled>
                            </DropdownButton>
                        </Col>






                    </Row>

                    <Row style={{ marginTop: '20px' }}>
                        <Col md={7}></Col>

                    </Row>



                    <hr />
                    <Row style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {renderImportData()}

                    </Row>

                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" className="ButtonCSS" onClick={handleUpdateImportOrder}>
                    Lưu
                </Button>
            </Modal.Footer>
        </Modal >

    </>)
}

export default ModalEditImportOrderN