import { useState, useEffect } from "react";
import { Row, Col, Dropdown, Modal, Button } from "react-bootstrap";
import { fetchGoodsWithStorageAndSupplier } from "~/services/GoodServices";
import { CustomToggle, CustomMenu } from "../components/others/Dropdown";
import { toast } from "react-toastify";

const EditRowDataReturnOrder = ({ isShow, handleClose, data, dataAfterEdit }) => {
    const [goodsId, setGoodsId] = useState();
    const [goodsCode, setGoodsCode] = useState();
    const [quantity, setQuantity] = useState();
    const [reason, setReason] = useState();
    const [batchCode, setBatchCode] = useState();


    useEffect(() => {
        setBatchCode(data.batchCode);
        setGoodsCode(data.goodsCode);
        setGoodsId(data.goodsId);
        setQuantity(data.quantity);
        setReason(data.reason);
    }, [data])
    //console.log("dataEditRowDataOrder: ", data[0]);

    useEffect(() => {
    }, [quantity, reason]);

    const handleChangeQuantity = (event) => {
        setQuantity(event.target.value);
    }

    const handleChangeReason = (event) => {
        setReason(event.target.value);
    }

    const handleReset = () => {
        setBatchCode(data.batchCode);
        setGoodsCode(data.goodsCode);
        setGoodsId(data.goodsId);
        setQuantity(data.quantity);
        setReason(data.reason);
    }
    const handleCloseModal = () => {
        handleReset();
        handleClose();
    }

    const handleEditRowData = () => {
        if (quantity <= 0) {
            toast.warning("Vui lòng nhập số lượng lớn hơn 0");
        } else {
            dataAfterEdit({
                batchCode,
                goodsCode,
                goodsId,
                quantity,
                reason
            });
            handleClose();
        };
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
                <Col md={2}>
                    <div className="form-group mb-3">
                        <label >Lý do</label>
                        <input type="text" className="form-control inputCSS" value={reason} onChange={handleChangeReason} />
                    </div>
                </Col>



            </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" className="ButtonCSS" onClick={handleEditRowData} >
                    Xác nhận
                </Button>
            </Modal.Footer>
        </Modal >
    )
}


export default EditRowDataReturnOrder;