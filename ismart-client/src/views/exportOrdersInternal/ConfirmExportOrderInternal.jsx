import { useEffect, useState } from "react";
import { Modal, Button, Col, Row } from "react-bootstrap";
import { fetchGoodById } from "~/services/GoodServices";
import { toast } from 'react-toastify';
import { getExportOrderDetailByExportId } from "~/services/ExportOrderDetailService";
import { addSuccessFullExportOrder } from "~/services/ExportOrderService";
import { formattedAmount } from "~/validate";
import { updateExportOrder } from "~/services/ExportOrderService";

const ConfirmExportOrderInternal = ({ isShow, handleClose, dataImportOrder, updateTable }) => {
    const [totalOrderDetail, setTotalOrderDetail] = useState([]);

    const userId = parseInt(localStorage.getItem('userId'), 10);


    useEffect(() => {
        if (dataImportOrder.exportId) {
            getTotalOrderDetail(dataImportOrder.exportId);
        }
    }, [dataImportOrder])

    const handleCloseModal = () => {
        handleClose();
    }

    const getTotalOrderDetail = async (exportId) => {
        let res = await getExportOrderDetailByExportId(exportId);
        setTotalOrderDetail(res);
    }

    const SaveAddImportOrder = async () => {
        let resSuccessImportOrder = await updateExportOrder(dataImportOrder.exportId,
            dataImportOrder.userId,
            dataImportOrder.projectId,
            dataImportOrder.totalPrice,
            "",
            dataImportOrder.createdDate,
            dataImportOrder.exportedDate,
            3,
            dataImportOrder.exportCode,
            dataImportOrder.storageId,
            dataImportOrder.deliveryId,
            dataImportOrder.image,
            userId)
        let res = await addSuccessFullExportOrder(dataImportOrder.exportId);
        if (res.status === 400) {
            toast.warning("Số lượng của mặt hàng lớn hơn số lượng trong kho");

        } else {
            toast.success("Xác nhận xuất kho thành công");
            updateTable();
            handleClose();
        }


    }


    return (<>
        <Modal show={isShow} onHide={handleCloseModal} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Xác nhận lô hàng xuất kho</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="body-add-new">
                    <Row>
                        <Col md={3}>
                            <div className="form-group mb-3">
                                <label >Kho nhập hàng</label>
                                <button type="button" className="btn btn-success border-left-0 rounded ButtonCSS" >{dataImportOrder.warehouseDestinationName}</button>
                            </div>
                        </Col>

                        <Col md={3}>
                            <div className="form-group mb-3">
                                <label >Kho xuất hàng</label>
                                <button type="button" className="btn btn-success border-left-0 rounded ButtonCSS" >{dataImportOrder.warehouseName}</button>
                            </div>
                        </Col>
                        <Col md={3}>
                            <div className="form-group mb-3">
                                <label >Khách hàng</label>
                                <button type="button" className="btn btn-success border-left-0 rounded ButtonCSS" >{dataImportOrder.customerName}</button>
                            </div>
                        </Col>
                        <Col md={3}>
                            <div className="form-group mb-3">

                                <label >Giao hàng</label>
                                <button type="button" className="btn btn-success border-left-0 rounded ButtonCSS" >{dataImportOrder.deliveryName}</button>
                            </div>
                        </Col>

                    </Row>


                    {totalOrderDetail && totalOrderDetail.length > 0
                        && totalOrderDetail.map((o, index) => (

                            <Row key={`orderDetail${index}`}>
                                <Col md={2}>
                                    <div className="form-group mb-3">
                                        <label >Mã hàng hóa</label>
                                        <input type="text" className="form-control inputCSS" value={o.goodsCode} readOnly />
                                    </div>
                                </Col>

                                <Col md={2}>
                                    <div className="form-group mb-3">
                                        <label >Số lượng</label>
                                        <input type="number" className="form-control inputCSS" value={o.quantity} readOnly />
                                    </div>
                                </Col>

                            </Row>
                        ))
                    }

                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" className="ButtonCSS" onClick={SaveAddImportOrder}>
                    Xác nhận xuất kho
                </Button>
            </Modal.Footer>
        </Modal >
    </>)
}


export default ConfirmExportOrderInternal