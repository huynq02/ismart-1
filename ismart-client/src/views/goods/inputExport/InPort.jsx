import { set } from 'lodash';
import React, { useEffect, useState } from 'react';
import { fetchAllStorages } from '~/services/StorageServices';
import { Modal, Button, Form, Col, DropdownButton, Dropdown } from 'react-bootstrap';
import { uploadExcel } from '~/services/ExcelService';
import 'react-toastify/dist/ReactToastify.css';

import { toast } from 'react-toastify';
import * as XLSX from "xlsx";

function InportGoodsListModal({ isShow, handleClose, updateTable }) {
    const roleId = parseInt(localStorage.getItem('roleId'), 10);
    const userId = parseInt(localStorage.getItem('userId'), 10);
    const [file, setFile] = useState(null);
    const [overwriteProductInfo, setOverwriteProductInfo] = useState(false);
    const [overwriteQuantity, setOverwriteQuantity] = useState(false);

    const [totalWarehouse, setTotalWarehouse] = useState([]);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [selectedWarehouseId, setSelectedWarehouseId] = useState(null);

    useEffect(() => {
        getAllStorages();
    }, []);

    const getAllStorages = async () => {
        let res = await fetchAllStorages();
        setTotalWarehouse(res);
    }

    const handleStorageTotalClick = () => {
        setSelectedWarehouse("Tất cả Kho");
        setSelectedWarehouseId("");
    }

    const handleStorageClick = (warehouse) => {
        setSelectedWarehouse(warehouse.warehouseName);
        setSelectedWarehouseId(warehouse.warehouseId);
    }

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleOverwriteProductInfoChange = (event) => {
        setOverwriteProductInfo(event.target.checked);
    };

    const handleOverwriteQuantityChange = (event) => {
        setOverwriteQuantity(event.target.checked);
    };

    const handleSave = async (event) => {
        event.preventDefault();
        if (!selectedWarehouseId && roleId === 1) {
            toast.warning("Chưa chọn kho!");
            return;
        }
        if (!file) {
            toast.warning("Chưa có file nào được chọn!");
            return;
        }


        // Đọc file và kiểm tra tiêu đề
        const fileReader = new FileReader();
        fileReader.onload = async (e) => {
            const arrayBuffer = e.target.result;
            const data = new Uint8Array(arrayBuffer);
            const workbook = XLSX.read(data, { type: "array" });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const sheetData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });


            if (!sheetData || sheetData.length === 0) {
                toast.error("Chưa có tiêu đề");
                return;
            }


            const header = sheetData[0];
            const dataRows = sheetData.slice(1);


            if (header.length === 0) {
                toast.error("Chưa có tiêu đề");
                return;
            }


            if (dataRows.length === 0) {
                toast.error("File chưa có dữ liệu");
                return;
            }


            let res;
            if (roleId === 1) {
                res = await uploadExcel(file, selectedWarehouseId, overwriteProductInfo, overwriteQuantity);
            } else {
                res = await uploadExcel(file, userId, overwriteProductInfo, overwriteQuantity);
            }


            if (res && res.results) {
                res.results.forEach(result => {
                    if (result.includes("Lỗi")) {
                        toast.error(result);
                    } else {
                        toast.success(result);
                    }
                });
            } else {
                toast.error("File lỗi! Hãy kiểm tra lại");
            }


            updateTable();
            handleClose();
        };


        fileReader.readAsArrayBuffer(file);
    };








    return (
        <Modal show={isShow} onHide={handleClose} size="md">
            <Modal.Header closeButton>
                <Modal.Title>Nhập danh sách sản phẩm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Tải file mẫu nhập danh sách sản phẩm <a href="https://localhost:7033/api/excel/download-template">tại đây</a></Form.Label>
                        {
                            roleId === 1 &&
                            <Col md={2}>
                                <label>Kho</label>
                                <DropdownButton
                                    className="DropdownButtonCSS ButtonCSSDropdown"
                                    title={selectedWarehouse !== null ? selectedWarehouse : "Tất cả Kho"}
                                    variant="success"
                                    style={{ zIndex: 999 }}
                                >
                                    <Dropdown.Item eventKey="Tất cả Kho" onClick={handleStorageTotalClick}>Tất cả Kho</Dropdown.Item>
                                    {totalWarehouse && totalWarehouse.length > 0 && totalWarehouse.map((c, index) => (
                                        <Dropdown.Item
                                            key={`warehouse ${index}`}
                                            eventKey={c.warehouseName}
                                            onClick={() => handleStorageClick(c)}
                                        >
                                            {c.warehouseName}
                                        </Dropdown.Item>
                                    ))}
                                </DropdownButton>
                            </Col>
                        }
                        <br />
                        <Form.Control type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
                    </Form.Group>

                    <Form.Group controlId="formOverwriteProductInfo">
                        <Form.Check
                            type="checkbox"
                            label="Không ghi đè thông tin các sản phẩm đã có"
                            checked={overwriteProductInfo}
                            onChange={handleOverwriteProductInfoChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formOverwriteQuantity">
                        <Form.Check
                            type="checkbox"
                            label="Không ghi đè số lượng sản phẩm vào các kho hàng đã có"
                            checked={overwriteQuantity}
                            onChange={handleOverwriteQuantityChange}
                        />
                    </Form.Group>
                    <Form.Text className="text-muted">
                        {/* <p>- Việc ghi đè sẽ xóa hết các thông tin cũ của sản phẩm bị ghi đè để lưu thông tin mới.</p> */}
                        <p>- Tính năng này không dùng để cập nhật hàng loạt sản phẩm.</p>
                    </Form.Text>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Đóng
                </Button>
                <Button variant="primary" className="ButtonCSS" onClick={handleSave}>
                    Nhập danh sách
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default InportGoodsListModal;