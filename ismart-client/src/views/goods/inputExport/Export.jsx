import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import downloadExcel from '~/services/ExcelService';

function ExportGoodsListModal({ isShow, handleClose }) {
    const [selectedOptions, setSelectedOptions] = useState({
        IdSảnphẩm: true,
        productName: true,
        price: true,
        quantity: true,

        // ... other fields as per the image
    });

    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setSelectedOptions({
            ...selectedOptions,
            [name]: checked,
        });
    };

    const handleSelectAll = (event) => {
        const { checked } = event.target;
        const allOptions = Object.keys(selectedOptions).reduce((acc, option) => {
            acc[option] = checked;
            return acc;
        }, {});
        setSelectedOptions(allOptions);
    };

    const handleExport = () => {
        // Implement the export functionality here
        console.log("Selected options for export:", selectedOptions);
        handleClose();
    };

    return (
        <Modal show={isShow} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Xuất danh sách sản phẩm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row>
                        {Object.keys(selectedOptions).map((option, index) => (
                            <Col md={4} key={index}>
                                <Form.Group controlId={`form${option}`}>
                                    <Form.Check
                                        type="checkbox"
                                        label={option}
                                        name={option}
                                        checked={selectedOptions[option]}
                                        onChange={handleCheckboxChange}
                                    />
                                </Form.Group>
                            </Col>
                        ))}
                    </Row>
                    <Form.Group controlId="formSelectAll">
                        <Form.Check
                            type="checkbox"
                            label="Chọn Tất Cả"
                            onChange={handleSelectAll}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Đóng
                </Button>
                <Button variant="primary" className="ButtonCSS" onClick={handleExport}>
                    Xuất dữ liệu
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ExportGoodsListModal;
