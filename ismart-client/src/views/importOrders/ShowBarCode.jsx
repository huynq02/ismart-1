import { useEffect, useState } from "react";
import BarCode from "../components/others/BarCode/BarCode"
import { Modal, Button, Col, Row } from "react-bootstrap";

const ModalShowBarCode = ({ isShow, handleClose, barCodeDetail }) => {

    useEffect(() => {
        console.log(isShow);
    }, [barCodeDetail])
    const handleCloseModal = () => {
        handleClose();
    }

    return (<>
        <Modal show={isShow} onHide={handleCloseModal} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>BarCode</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="body-add-new">
                    <Row>
                        <BarCode barCodeDetail={barCodeDetail} />
                    </Row>



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

export default ModalShowBarCode