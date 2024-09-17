import { useEffect, useState } from "react";
import React from 'react';
import { Modal, Button, Row, Col, DropdownButton, Dropdown } from "react-bootstrap"
import { updateImportOrder } from "~/services/ImportOrderServices";
import { getImportOrderDetailByImportId, updateImportOrderDetail, deleteImportOrderDetail } from "~/services/ImportOrderDetailServices";
import { formatDateImport, formattedAmount } from "~/validate";
import { CustomToggle, CustomMenu } from '../components/others/Dropdown';
import AddRowDataImportOrder from "./AddRowDataImport";
import RowDataEditImportOrder from './RowDataEditImportOrder';
import { format, addDays } from 'date-fns';

import RowDataImportOrder from "./RowDataImport";
import { toast } from "react-toastify";
import { createNewImportOrderDetail } from "~/services/ImportOrderDetailServices";

const ModalEditImportOrder = ({ isShow, handleClose, detailOrderEdit, updateTable }) => {



    const [rowsData, setRowsData] = useState([]);
    const [deleteData, setDeleteData] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const [selectedStorage, setSelectedStorage] = useState(null);
    const [selectedStorageId, setSelectedStorageId] = useState(null);

    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [selectedSupplierId, setSelectedSupplierId] = useState(null);

    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const [selectedDeliveryId, setSelectedDeliveryId] = useState(null);

    const [importCode, setImportCode] = useState(null);

    const [selectedDate, setSelectedDate] = useState(null);

    const [isShowRowDataImport, setIsShowRowDataImport] = useState(false);

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
        // console.log("rowsData: ",rowsData);
        console.log("detailOrderEdit: ", detailOrderEdit);

    }, [detailOrderEdit])

    const getTotalOrderDetail = async (importId) => {
        let res = await getImportOrderDetailByImportId(importId);
        // console.log(res);
        setRowsData(res);
        setTotalPrice(detailOrderEdit.totalCost);
    }

    // const takeRowDataImportOrder = (importData) => {
    //     importData.supplierId = selectedSupplierId;
    //     importData.supplierName = selectedSupplier;

    //     // Kiểm tra xem sản phẩm đã tồn tại trong danh sách hay chưa
    //     const existingProductIndex = rowsData.findIndex(row => row.goodsId === importData.goodsId);

    //     if (existingProductIndex !== -1) {
    //         // Nếu sản phẩm đã tồn tại, cập nhật số lượng và các giá trị mới
    //         const updatedRowsData = [...rowsData];

    //         updatedRowsData[existingProductIndex].quantity += importData.quantity; // Cập nhật số lượng
    //         updatedRowsData[existingProductIndex] = { ...updatedRowsData[existingProductIndex], ...importData }; // Cập nhật các giá trị mới

    //         setRowsData(updatedRowsData);

    //         //setTotalCost(prevTotalCost => prevTotalCost + importData.totalOneGoodPrice); // Cập nhật tổng chi phí
    //         toast.info("Sản phẩm đã tồn tại trong danh sách, số lượng và thông tin đã được cập nhật.");
    //     } else {
    //         // Nếu sản phẩm chưa tồn tại, thêm vào danh sách và cập nhật tổng chi phí
    //         const updateDataImport = [...rowsData, importData];
    //         setRowsData(updateDataImport);

    //     }

    // }


    // render rowsData
    const renderImportData = () => {

        return rowsData.map((data, index) => (
            <>
                <RowDataEditImportOrder key={`rowsdata${index}`} detailId={rowsData[index].detailId} data={rowsData[index]} index={index}
                    deleteRowData={deleteRowData} updateRowData={updateRowData} />
            </>

        ))


    }

    // xóa 1 row của rowsData ở RowDataImport
    const deleteRowData = (rowdel) => {
        const updateDataImport = rowsData.filter((item, index) => index !== rowdel);
        const deleteDataImport = rowsData[rowdel];
        setDeleteData([...deleteData, deleteDataImport]);

        setRowsData(updateDataImport);
    }

    // update 1 row data từ RowDataImport
    const updateRowData = (rowUpdate, updateData) => {
        // console.log(updateData);
        const updateDataImport = [...rowsData];
        console.log(rowsData)
        updateDataImport[rowUpdate] = updateData;
        // setTotalPrice(x => x - rowsData[rowUpdate].costPrice * rowsData[rowUpdate].quantity + updateData.costPrice * updateData.quantity);
        setRowsData(updateDataImport);
    }

    const handleUpdateImportOrder = async () => {

        console.log(detailOrderEdit.importId);
        let res = await updateImportOrder(detailOrderEdit.importId,
            userId,
            selectedSupplierId,
            0,
            "",
            detailOrderEdit.createdDate,
            detailOrderEdit.importedDate,
            3,
            importCode,
            selectedStorageId,
            selectedDeliveryId,
            detailOrderEdit.image,
            null);
        console.log("handleUpdateImportOrder: ", res);
        console.log("rowdata", rowsData);

        if (rowsData && rowsData.length > 0) {
            await Promise.all(rowsData.map(async (data, index) => {
                let res = await updateImportOrderDetail(
                    detailOrderEdit.importId,
                    data.costPrice,
                    data.detailId,
                    data.goodsId,
                    data.quantity,
                    data.manufactureDate,
                    data.expiryDate,
                    data.batchCode
                );
                console.log("data1:", res);
                console.log("detailOrderEdit.importId:", detailOrderEdit.importId);
                console.log("data.detailId:", data.detailId);

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
    const handleAddRowDataImport = () => {

        setIsShowRowDataImport(true);

    }

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

    return (<>
        <Modal show={isShow} onHide={handleCloseModal} size="xl">
            <Modal.Header closeButton>
                <Modal.Title>Sửa đơn hàng nhập </Modal.Title>
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

                        {/* <Col md={3} >
                            <div className="ButtonCSSDropdown mt-3">
                                <button
                                    className="btn btn-success border-left-0 rounded"
                                    type="button"
                                    onClick={handleAddRowDataImport}
                                ><i className="fa-solid fa-plus"></i>
                                    &nbsp;
                                    Thêm lô hàng
                                </button>
                            </div>
                        </Col> */}




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
        <AddRowDataImportOrder isShow={isShowRowDataImport}
            selectedSupplierId={selectedSupplierId} selectedStorageId={selectedStorageId}
            onChange={(importData) => takeRowDataImportOrder(importData)}
            handleClose={() => setIsShowRowDataImport(false)} />
    </>)
}

export default ModalEditImportOrder