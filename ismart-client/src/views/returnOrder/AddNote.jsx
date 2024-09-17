import React, { useEffect, useState } from 'react';
import { Modal, Button, Row } from "react-bootstrap"
import { Form } from 'react-bootstrap';

const ModelAddNote = ({ isShow, handleClose, onChange }) => {
    const [isreason, setIsReason] = useState('');

    const handleReset = () => {
        // reset form
    }
    const handleCloseModal = () => {
        handleReset();
        handleClose();
    }

    const handleClick = () => {
        onChange(isreason);
        handleClose();
    }

    const handleChane = (event) => {

        setIsReason(event.target.value)
    }

    return (
        <>
            <Modal show={isShow} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Thêm Lý do</Modal.Title>
                </Modal.Header>

                <Modal.Body>

                    <Row >
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Lý do</Form.Label>
                            <Form.Control as="textarea" rows={6} onChange={handleChane} />
                        </Form.Group>
                    </Row>

                </Modal.Body>


                <Modal.Footer>
                    <Button variant="primary" className="ButtonCSS"
                        onClick={handleClick}
                    >
                        Lưu
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModelAddNote;