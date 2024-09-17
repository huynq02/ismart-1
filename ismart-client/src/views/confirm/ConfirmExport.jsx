import { useEffect, useState } from "react";
import { Modal, Button, Col, Row } from "react-bootstrap";
import { toast } from 'react-toastify';
import { addSuccessFullExportOrder } from "~/services/ExportOrderService";
import { formatDate } from '~/validate';
import { fetchExportOrderByExportId } from "~/services/ExportOrderService";

const ConfirmExport = ({ isShow, handleClose, dataEmportOrder }) => {
    const [totalOrder, setTotalOrder] = useState([]);

    const userId = parseInt(localStorage.getItem('userId'), 10);


    useEffect(() => {
        if (dataEmportOrder && dataEmportOrder.exportId) {
            getTotalOrderDetail(dataEmportOrder.exportId);
        }
    }, [dataEmportOrder]);


    const handleCloseModal = () => {
        handleClose();
    }

    const getTotalOrderDetail = async (exportId) => {
        let res = await fetchExportOrderByExportId(exportId);
        setTotalOrder(res);
    }

    const SaveAddImportOrder = async () => {
        let res = await addSuccessFullExportOrder(dataEmportOrder.exportId);
        console.log(res);
        if (res.status === 400) {
            toast.warning("Số lượng của mặt hàng lớn hơn số lượng trong kho");

        } else {
            toast.success("Xác nhận xuất kho thành công");
            handleClose();
        }


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
                                                {totalOrder.warehouseName}
                                            </button>
                                        </div>
                                    </Col>
                                    <Col md={2}>
                                        <div className="form-group mb-3">
                                            <label>Nhà cung cấp</label>
                                            <button type="button" className="btn btn-success border-left-0 rounded ButtonCSS">
                                                {totalOrder.customerName}
                                            </button>
                                        </div>
                                    </Col>
                                </Row>
                                {totalOrder.exportOrderDetails && totalOrder.exportOrderDetails.map((detail, index) => (
                                    <Row key={index}>
                                        <Col >
                                            <label>Mã hàng hóa</label>
                                            <input type="text" className="form-control inputCSS" value={detail.goodsCode} readOnly />
                                        </Col>
                                        <Col >
                                            <label>Số lượng</label>
                                            <input type="number" className="form-control inputCSS" value={detail.quantity} readOnly />
                                        </Col>
                                        {/* <Col md={4}> <label >Mã đơn hàng</label>
                                            <input type="text" className="form-control inputCSS" value={detail.batchCode} readOnly />
                                        </Col>

                                        <Col md={3}> <label >Ngày sản xuất</label>
                                            <input type="text" className="form-control inputCSS" value={formatDate(detail.manufactureDate)} readOnly />
                                        </Col>


                                        <Col md={3}> <label >Ngày hết hạn </label>
                                            <input type="text" className="form-control inputCSS" value={formatDate(detail.expiryDate)} readOnly />
                                        </Col> */}
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


export default ConfirmExport;