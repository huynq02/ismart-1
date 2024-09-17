import { useEffect, useState } from "react";
import { Modal, Button, Col, Row } from "react-bootstrap";
import { addSuccessFullImportOrder } from "~/services/ImportOrderServices";
import { updateImportOrder } from "~/services/ImportOrderServices";
import { getImportOrderByImportId } from "~/services/ImportOrderServices";
import { toast } from 'react-toastify';
import { formatDate } from '~/validate';

const ConfirmImport = ({ isShow, handleClose, dataImportOrder }) => {
    const [totalOrder, setTotalOrder] = useState(null);
    const userId = parseInt(localStorage.getItem('userId'), 10);

    useEffect(() => {
        getTotalOrderDetail(dataImportOrder.importId);
    }, [dataImportOrder.importId]);



    const handleCloseModal = () => {
        handleClose();
    }

    const getTotalOrderDetail = async (importId) => {
        let res = await getImportOrderByImportId(importId);
        setTotalOrder(res);
    }

    const SaveAddImportOrder = async () => {
        let res = await addSuccessFullImportOrder(dataImportOrder.importId);
        toast.success("Xác nhận nhập kho thành công");
        handleClose();
    }

    return (
        <>
            <Modal show={isShow} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận lô hàng nhập kho</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="body-add-new">
                        {totalOrder && (
                            <Row>
                                <Row>
                                    <Col md={2}>
                                        <div className="form-group mb-3">
                                            <label>Kho hàng</label>
                                            <button type="button" className="btn btn-success border-left-0 rounded ButtonCSS">
                                                {totalOrder.storageName}
                                            </button>
                                        </div>
                                    </Col>
                                    <Col md={2}>
                                        <div className="form-group mb-3">
                                            <label>Nhà cung cấp</label>
                                            <button type="button" className="btn btn-success border-left-0 rounded ButtonCSS">
                                                {totalOrder.supplierName}
                                            </button>
                                        </div>
                                    </Col>
                                </Row>
                                {totalOrder.importOrderDetails && totalOrder.importOrderDetails.map((detail, index) => (
                                    <Row key={index}>
                                        <Col md={3}>
                                            <label>Mã hàng hóa</label>
                                            <input type="text" className="form-control inputCSS" value={detail.goodsCode} readOnly />
                                        </Col>
                                        <Col md={2}>
                                            <label>Số lượng</label>
                                            <input type="number" className="form-control inputCSS" value={detail.quantity} readOnly />
                                        </Col>
                                        <Col md={4}> <label >Mã đơn hàng</label>
                                            <input type="text" className="form-control inputCSS" value={detail.batchCode} readOnly />
                                        </Col>

                                        <Col md={3}> <label >Ngày sản xuất</label>
                                            <input type="text" className="form-control inputCSS" value={formatDate(detail.manufactureDate)} readOnly />
                                        </Col>


                                        <Col md={3}> <label >Ngày hết hạn </label>
                                            <input type="text" className="form-control inputCSS" value={formatDate(detail.expiryDate)} readOnly />
                                        </Col>
                                    </Row>
                                ))}
                            </Row>
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" className="ButtonRed" onClick={SaveAddImportOrder}>
                        Xác nhận nhập kho
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ConfirmImport;