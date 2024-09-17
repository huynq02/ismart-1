import { useEffect, useState } from "react";
import { Modal, Button, Col, Row } from "react-bootstrap";
import { getExportOrderDetailByExportId } from "~/services/ExportOrderDetailService";
import { formattedAmount } from "~/validate";
import { toast } from 'react-toastify';


const ModalDetailExportOrder = ({ isShow, handleClose, detailOrder }) => {
    const [totalOrderDetail, setTotalOrderDetail] = useState([]);

    useEffect(() => {
        if (detailOrder.exportId) {
            getTotalOrderDetail(detailOrder.exportId);
        }
        console.log("detailOrder:", detailOrder);

    }, [detailOrder])

    const handleCloseModal = () => {
        handleClose();
    }

    const getTotalOrderDetail = async (exportId) => {
        let res = await getExportOrderDetailByExportId(exportId);
        console.log(res);
        setTotalOrderDetail(res);
    }
    return (<>
        <Modal show={isShow} onHide={handleCloseModal} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Thông tin chi tiết đơn hàng xuất kho</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="body-add-new">
                    <Row>
                        <Col md={2}>
                            <div className="form-group mb-3">
                                <label >Kho hàng</label>
                                <button type="button" className="btn btn-success border-left-0 rounded ButtonCSS" >{detailOrder.warehouseName}</button>
                            </div>
                        </Col>
                        <Col md={2}>
                            <div className="form-group mb-3">
                                <label >Tình trạng</label>
                                <button type="button" className="btn btn-success border-left-0 rounded ButtonCSS" >{detailOrder.statusType == "On Progress" ? "Đang tiến hành" : detailOrder.statusType == "Completed" ? "Đã hoàn thành" : "Đã hủy"}</button>
                            </div>
                        </Col>
                        <Col md={2}>
                            <div className="form-group mb-3">
                                <label >Khách hàng</label>
                                <button type="button" className="btn btn-success border-left-0 rounded ButtonCSS" >{detailOrder.customerName}</button>
                            </div>
                        </Col>
                        <Col md={2}>
                            <div className="form-group mb-3">

                                <label >Giao hàng</label>
                                <button type="button" className="btn btn-success border-left-0 rounded ButtonCSS" >{detailOrder.deliveryName}</button>
                            </div>
                        </Col>
                    </Row>



                    {totalOrderDetail && totalOrderDetail.length > 0
                        && totalOrderDetail.map((o, index) => (

                            <Row key={`orderDetail${index}`}>
                                <Col >

                                    <label >Mã lô hàng</label>
                                    <input type="text" className="form-control inputCSS" value={o.batchCode} readOnly />

                                </Col>
                                <Col >

                                    <label >Mã hàng hóa</label>
                                    <input type="text" className="form-control inputCSS" value={o.goodsCode} readOnly />

                                </Col>
                                <Col >

                                    <label >Số lượng</label>
                                    <input type="number" className="form-control inputCSS" value={o.quantity} readOnly />

                                </Col>

                            </Row>
                        ))
                    }

                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" className=" ButtonRed" onClick={handleCloseModal}>
                    Đóng
                </Button>
            </Modal.Footer>
        </Modal >
    </>)
}

export default ModalDetailExportOrder