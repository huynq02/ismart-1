
import { useEffect, useState } from "react";
import { Modal, Button, Col, Row } from "react-bootstrap";
import { addSuccessFullImportOrder } from "~/services/ImportOrderServices";
import { fetchGoodById } from "~/services/GoodServices";
import { getImportOrderDetailByImportId } from "~/services/ImportOrderDetailServices";
import { formatDate, formattedAmount } from "~/validate";
import { toast } from 'react-toastify';

const ModalDetailOrderN = ({ isShow, handleClose, detailOrder }) => {
    const [totalOrderDetail, setTotalOrderDetail] = useState([]);

    useEffect(() => {
        if (detailOrder.importId) {
            getTotalOrderDetail(detailOrder.importId);
        }

    }, [detailOrder])

    const handleCloseModal = () => {
        handleClose();
    }

    const getTotalOrderDetail = async (importId) => {
        let res = await getImportOrderDetailByImportId(importId);
        console.log("getTotalOrderDetail: ", res);
        setTotalOrderDetail(res);
    }
    return (<>
        <Modal show={isShow} onHide={handleCloseModal} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Thông tin chi tiết đơn hàng nhập kho</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="body-add-new">
                    <Row>
                        <Col md={3}>
                            <div className="form-group mb-3">
                                <label >Kho nhập hàng</label>
                                <button type="button" className="btn btn-success border-left-0 rounded ButtonCSS" >{detailOrder.warehouseDestinationName}</button>
                            </div>
                        </Col>


                        {/* <Col md={3}>
                            <div className="form-group mb-3">
                                <label >Nhà cung cấp</label>
                                <button type="button" className="btn btn-success border-left-0 rounded ButtonCSS" >{detailOrder.supplierName}</button>
                            </div>
                        </Col> */}

                        <Col md={3}>
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

                                    <label >Mã hàng hóa</label>
                                    <input type="text" className="form-control inputCSS" value={o.goodsCode} readOnly />

                                </Col>
                                <Col >

                                    <label >Số lượng</label>
                                    <input type="number" className="form-control inputCSS" value={o.quantity} readOnly />

                                </Col>

                                <Col > <label >Mã đơn hàng</label>
                                    <input type="text" className="form-control inputCSS" value={o.batchCode} readOnly />
                                </Col>

                                <Col> <label >Ngày sản xuất</label>
                                    <input type="text" className="form-control inputCSS" value={formatDate(o.manufactureDate)} readOnly />
                                </Col>


                                <Col > <label >Ngày hết hạn </label>
                                    <input type="text" className="form-control inputCSS" value={formatDate(o.expiryDate)} readOnly />
                                </Col>
                                <Col > <label >Kho xuất hàng </label>
                                    <input type="text" className="form-control inputCSS" value={o.warehouseName} readOnly />
                                </Col>
                            </Row>
                        ))
                    }

                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" className=" ButtonRed" onClick={handleClose}>
                    Đóng
                </Button>
            </Modal.Footer>
        </Modal >
    </>)
}

export default ModalDetailOrderN