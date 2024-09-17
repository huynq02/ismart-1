import { useState, useEffect } from "react";
import { Row, Col, Dropdown, Modal, Button } from "react-bootstrap";
import { fetchGoodsWithStorageAndSupplier } from "~/services/GoodServices";
import { CustomToggle, CustomMenu } from "../components/others/Dropdown";
import { toast } from "react-toastify";
import { formatDate } from "date-fns";

const EditRowDataStock = ({ isShow, handleClose, data, dataAfterEdit }) => {

    const [batchCode, setBatchCode] = useState();
    const [actualQuantity, setActualQuantity] = useState();
    const [note, setNote] = useState();

    useEffect(() => {
        if (data) {
            setBatchCode(data.batchDetails[0].batchCode);
            setActualQuantity(data.batchDetails[0].actualQuantity);
            setNote(data.batchDetails[0].note);
        }
    }, [data]);

    const handleChangeQuantity = (event) => {
        setActualQuantity(event.target.value);
    }
    const handleChangeNote = (event) => {
        setNote(event.target.value);
    }

    const handleCloseModal = () => {
        handleClose();
    }

    const handleEditRowData = () => {
        if (actualQuantity <= 0) {
            toast.warning("Số lượng phải lớn hơn 0");
        }
        else {
            toast.info("Sửa số lượng thực tế và ghi chú thành công");
            dataAfterEdit({ actualQuantity: actualQuantity, note: note });
            handleClose();
        }

    }
    return (
        <Modal show={isShow} onHide={handleCloseModal} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Sửa lô hàng kiểm kê</Modal.Title>
            </Modal.Header>
            <Modal.Body><Row>

                <Col md={3}>
                    <div className="form-group mb-3">
                        <label >Mã lô hàng</label>
                        <input type="text" className="form-control" defaultValue={batchCode} disabled />
                    </div>
                </Col>

                <Col md={3}>

                    <div className="form-group mb-3">
                        <label >Số lượng thực tế</label>
                        <input type="number" className="form-control inputCSS" value={actualQuantity} onChange={handleChangeQuantity} />
                    </div>
                </Col>
                <Col md={3}>

                    <div className="form-group mb-3">
                        <label >Ghi chú</label>
                        <input type="text" className="form-control inputCSS" value={note} onChange={handleChangeNote} />
                    </div>
                </Col>



            </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" className="ButtonCSS" onClick={handleEditRowData}>
                    Sửa
                </Button>
            </Modal.Footer>
        </Modal >)
}


export default EditRowDataStock;