import { useState, useEffect } from "react";
import { Row, Col, Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";

const EditRowDataReturnOrder = ({ isShow, handleClose, data, dataAfterEdit }) => {
    const [goodsId, setGoodsId] = useState();
    const [goodsCode, setGoodsCode] = useState();
    const [quantity, setQuantity] = useState();
    const [costPrice, setCostPrice] = useState();
    const [reason, setReason] = useState();


    useEffect(() => {
        setGoodsId(data.goodsId);
        setGoodsCode(data.goodsCode);
        setQuantity(data.quantity);
        setCostPrice(data.price);
        setReason(data.reason);
    }, [data])

    const handleChangeQuantity = (event) => {
        setQuantity(event.target.value);
    }

    const handleChangeReason = (event) => {
        setReason(event.target.value);
    }

    const handleCloseModal = () => {
        handleClose();
    }

    const handleEditRowData = () => {
        if (quantity <= 0) {
            toast.warning("Số lượng phải lớn hơn 0");
        }
        else {
            dataAfterEdit({ goodsCode: data.goodsCode, quantity: quantity, reason: reason, goodsId: data.goodsId, batchCode: data.batchCode, returnOrderDetailId: data.returnOrderDetailId, returnOrderId: data.returnOrderId });
            handleClose();
        }
    }

    return (
        <Modal show={isShow} onHide={handleCloseModal} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Xác nhận lô hàng trả</Modal.Title>
            </Modal.Header>
            <Modal.Body><Row>

                <Col md={3}>
                    <div className="form-group mb-3">
                        <label >Mã Sản phẩm</label>
                        <input type="text" className="form-control" defaultValue={goodsCode} disabled />
                    </div>
                </Col>

                <Col md={2}>

                    <div className="form-group mb-3">
                        <label >Số lượng</label>
                        <input type="number" className="form-control inputCSS" value={quantity} onChange={handleChangeQuantity} />
                    </div>
                </Col>
                <Col md={3}>
                    <div className="form-group mb-3 ">
                        <label >Lí do</label>
                        <input type="text" className="form-control inputCSS " value={reason} onChange={handleChangeReason} />
                    </div>
                </Col>

              



            </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" className="ButtonCSS" onClick={handleEditRowData}>
                    Xác nhận
                </Button>
            </Modal.Footer>
        </Modal >)
}


export default EditRowDataReturnOrder