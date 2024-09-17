import { useEffect, useState } from "react";
import { Modal, Button, Col, Row } from "react-bootstrap";
import { getReturnOrderDetailByOrderId } from "~/services/ReturnOrderDetailService";
import { formattedAmount } from "~/validate";
import { toast } from 'react-toastify';


const ModalDetailReturnOrder = ({ isShow, handleClose, detailOrder }) => {
    const [totalOrderDetail, setTotalOrderDetail] = useState([]);

    useEffect(() => {
        if (detailOrder.returnOrderId) {
            getTotalOrderDetail(detailOrder.returnOrderId);
        }
    }, [detailOrder])

    const handleCloseModal = () => {
        handleClose();
    }

    const getTotalOrderDetail = async (returnOrderId) => {
        let res = await getReturnOrderDetailByOrderId(returnOrderId);
        // console.log(res);
        setTotalOrderDetail(res);
    }
    return (<>
        <Modal show={isShow} onHide={handleCloseModal} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Thông tin chi tiết đơn trả hàng </Modal.Title>
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
                                <Col >
                                    <label >Lí do</label>
                                    <input type="text" className="form-control inputCSS" value={o.reason} readOnly />
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

export default ModalDetailReturnOrder