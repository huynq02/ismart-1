import React, { useEffect, useState } from 'react';
import { CustomToggle, CustomMenu } from '../components/others/Dropdown';
import { Button, Modal, Row, Col, Dropdown, DropdownButton } from 'react-bootstrap';
import { fetchAllSupplierActive } from "~/services/SupplierServices";
import { fetchAllCategories } from '~/services/CategoryServices';
import { fetchAllStorages } from '~/services/StorageServices';
import uploadImage from '~/services/ImageServices';
import { addGood, addGoodinAdmin } from '~/services/GoodServices';
import { toast } from 'react-toastify';




function ModalAddGood({ isShow, handleClose, updateTable }) {
    const roleId = parseInt(localStorage.getItem('roleId'), 10);
    const userId = parseInt(localStorage.getItem('userId'), 10); // Lấy userId từ local storage


    const [totalCategories, setTotalCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);


    const [totalSuppliers, setTotalSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [selectedSupplierId, setSelectedSupplierId] = useState(null);


    const [totalWarehouse, setTotalWarehouse] = useState([]);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [selectedWarehouseId, setSelectedWarehouseId] = useState(null);


    const [goodName, setGoodName] = useState("");
    const [goodCode, setGoodCode] = useState('');


    const [warrantyTime, setWarrantyTime] = useState(0);
    const [description, setDescription] = useState(null);
    const [measuredUnit, setMeasuredUnit] = useState(null);
    const [imageGood, setImageGood] = useState(null);
    const [stockPrice, setStockPrice] = useState(0);
    const [maxStock, setMaxStock] = useState(0);
    const [minStock, setMinStock] = useState(0);
    const [createdDate, setCreatedDate] = useState(new Date().toISOString().split('T')[0]);
    const [barCode, setBarCode] = useState('');

    useEffect(() => {
        getAllStorages();
        getAllCategories();
        getAllSuppliers();
    }, [])

    const getAllStorages = async () => {
        let res = await fetchAllStorages();
        setTotalWarehouse(res);
    }

    const getAllCategories = async () => {
        let res = await fetchAllCategories();
        setTotalCategories(res);
    }


    const handleCategoryClick = (category, event) => {
        setSelectedCategory(category.categoryName);
        setSelectedCategoryId(category.categoryId)
    }


    const getAllSuppliers = async () => {
        let res = await fetchAllSupplierActive();
        setTotalSuppliers(res);
    }


    const handleSupplierClick = (supplier, event) => {
        setSelectedSupplier(supplier.supplierName);
        setSelectedSupplierId(supplier.supplierId)
    }


    const handleChooseFile = async (event) => {
        const file = event.target.files[0];
        let res = await uploadImage(file)
        const urlImage = res.url;
        setImageGood(urlImage);
    }


    const handleStorageTotalClick = () => {
        setSelectedWarehouse("Tất cả Kho");
        setSelectedWarehouseId("");
    }


    const handleStorageClick = (warehouse) => {
        setSelectedWarehouse(warehouse.warehouseName);
        setSelectedWarehouseId(warehouse.warehouseId);
    }


    const handleGoodName = (event) => {
        setGoodName(event.target.value);
    }


    const handleGoodCode = (event) => {
        setGoodCode(event.target.value);
    }


    const handleChangeWarranty = (event) => {
        setWarrantyTime(event.target.value);
    }


    const handleChangeDescription = (event) => {
        setDescription(event.target.value);
    }

    const handleUnitClick = (unit) => {
        setMeasuredUnit(unit);
    }

    const handleChangeCreatedDate = (event) => {
        setCreatedDate(event.target.value);
    }

    const handleCloseModal = () => {
        handleReset();
        handleClose();
    }

    const handleReset = () => {
        setSelectedCategoryId(null);
        setSelectedCategory(null);
        setMeasuredUnit(null);
        setSelectedWarehouse(null);
        setSelectedWarehouseId(null);
        setCreatedDate(null);
        setSelectedSupplier(null);
        setSelectedSupplierId(null);
        setMaxStock(0);
        setMinStock(0);
        setBarCode(null);
        setGoodCode('');
        setGoodName(null);
        setDescription(null);
        setWarrantyTime(0);
        setImageGood(null);
    }

    const generateBarcode = () => {
        const countryCode = "893";
        const year = new Date().getFullYear().toString().slice(2);
        const paddedProductCode = goodCode.toString();
        return `${countryCode}-${year}-${paddedProductCode}`;
    };

    const handleCreateBarcode = () => {
        const trimmedGoodCode = goodCode ? goodCode.trim() : '';
        if (!trimmedGoodCode) {
            toast.warning("Vui lòng nhập mã mặt hàng");
        }
        else {
            setBarCode(generateBarcode());

        }
    }


    const handleSave = async () => {
        const trimmedGoodName = goodName ? goodName.trim() : '';
        const trimmedGoodCode = goodCode ? goodCode.trim() : '';
        const trimmedDescription = description ? description.trim() : '';
        const maxStockNumber = Number(maxStock);
        const minStockNumber = Number(minStock);
        if (!measuredUnit) {
            toast.warning("Vui lòng chọn đơn vị");
        }
        else if (!trimmedGoodName) {
            toast.warning("Vui lòng nhập tên mặt hàng");
        } else if (!trimmedGoodCode) {
            toast.warning("Vui lòng nhập mã mặt hàng");
        }
        else if (!selectedCategoryId) {
            toast.warning("Vui lòng chọn danh mục");
        } else if (!selectedSupplierId) {
            toast.warning("Vui lòng chọn nhà cung cấp");
        }
        else if (!imageGood) {
            toast.warning("Vui lòng chọn hình ảnh");
        }
        else if (warrantyTime <= 0) {
            toast.warning("Vui lòng chọn thời gian bảo hành lớn hơn 0");
        }
        else if (!imageGood) {
            toast.warning("Vui lòng chọn file ảnh");
        }
        else if (warrantyTime <= 0) {
            toast.warning("Vui lòng chọn thời gian bảo hành lớn hơn 0");
        }
        else if (maxStockNumber <= 0) {
            toast.warning("Vui lòng nhập số lượng tối đa lớn hơn 0");
        } else if (minStockNumber <= 0) {
            toast.warning("Vui lòng nhập số lượng tối thiểu lớn hơn 0");
        } else if (!trimmedDescription.trim()) {
            toast.warning("Vui lòng nhập mô tả chi tiết không được để trống");
        } else if (maxStockNumber <= minStockNumber) {
            toast.warning("Vui lòng nhập số lượng tối đa lớn hơn số lượng tối thiểu");
        }
        else {
            let res;
            if (roleId === 1) {
                if (!selectedWarehouseId) {
                    toast.warning("Vui lòng chọn kho");
                }
                res = await addGoodinAdmin(selectedWarehouseId,
                    goodName, goodCode, selectedCategoryId,
                    description,
                    selectedSupplierId,
                    measuredUnit,
                    imageGood,
                    1,
                    0,
                    createdDate,
                    warrantyTime,
                    barCode,
                    maxStock,
                    minStock
                );
            } else {
                res = await addGood(userId,
                    goodName, goodCode, selectedCategoryId,
                    description,
                    selectedSupplierId,
                    measuredUnit,
                    imageGood,
                    1,
                    0,
                    createdDate,
                    warrantyTime,
                    barCode,
                    maxStock,
                    minStock
                );
            }
            if (res.isSuccess) {
                toast.success("Thêm mặt hàng mới thành công");
                handleCloseModal();
                updateTable();
            } else {
                toast.error(res.message || "Mã hàng đã tồn tại");
            }
        }
    }


    return (
        <Modal show={isShow} onHide={handleCloseModal} size="xs">
            <Modal.Header closeButton>
                <Modal.Title>Thêm hàng hóa mới</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="body-add-new">
                    <Row style={{ display: 'flex', alignItems: 'center' }}>
                        {
                            roleId === 1 ?
                                <Col md={6}>
                                    <label >Kho</label>
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
                                                onClick={(e) => handleStorageClick(c, e)}
                                            >
                                                {c.warehouseName}
                                            </Dropdown.Item>
                                        ))}
                                    </DropdownButton>
                                </Col>
                                : ''
                        }
                        <Col md={6}>
                            <label >Đơn vị </label>
                            <DropdownButton
                                className="DropdownButtonCSS ButtonCSSDropdown"
                                title={measuredUnit !== null ? measuredUnit : "Chọn đơn vị"}
                                variant="success"
                                style={{ zIndex: 999 }}
                            >




                                <Dropdown.Item eventKey="Kilogram" onClick={(e) => handleUnitClick("Kg", e)}>Kilogram</Dropdown.Item>
                                <Dropdown.Item eventKey="Thùng" onClick={(e) => handleUnitClick("Thùng", e)}>Thùng</Dropdown.Item>
                            </DropdownButton>
                        </Col>


                    </Row>


                    <Row style={{ marginTop: '15px' }}>
                        <Col md={6}>
                            <label >Tên hàng </label>
                            <input type="text" className="form-control inputCSS" aria-describedby="emailHelp" value={goodName} onChange={handleGoodName} />
                        </Col>


                        <Col md={6}>
                            <label >Mã hàng </label>
                            <input type="text" className="form-control inputCSS" aria-describedby="emailHelp" value={goodCode} onChange={handleGoodCode} />
                        </Col>
                    </Row>


                    <Row style={{ marginTop: '15px' }}>
                        <Col md={6}>
                            <label >Danh mục</label>


                            <Dropdown style={{ position: 'relative' }}>
                                <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                                    <span style={{ color: 'white', fontWeight: 'bold' }}>{selectedCategory !== null ? selectedCategory : "Danh mục"}</span>
                                </Dropdown.Toggle>


                                <Dropdown.Menu className="ButtonCSSDropdown" as={CustomMenu} style={{ position: 'absolute', zIndex: '9999' }}>
                                    {totalCategories && totalCategories.length > 0 && totalCategories.map((c, index) => (
                                        <Dropdown.Item key={`category ${index}`} eventKey={c.categoryName} onClick={(e) => handleCategoryClick(c, e)}>
                                            {c.categoryName}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>


                        <Col md={6}>
                            <label >Nhà cung cấp </label>
                            <Dropdown style={{ position: 'relative' }}>
                                <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                                    <span style={{ color: 'white', fontWeight: 'bold' }}>{selectedSupplier !== null ? selectedSupplier : "Nhà cung cấp"}</span>
                                </Dropdown.Toggle>


                                <Dropdown.Menu className="ButtonCSSDropdown" as={CustomMenu} style={{ position: 'absolute', zIndex: '9999' }}>
                                    {totalSuppliers && totalSuppliers.length > 0 && totalSuppliers.map((s, index) => (
                                        <Dropdown.Item key={`supplier ${index}`} eventKey={s.supplierName} onClick={(e) => handleSupplierClick(s, e)}>
                                            {s.supplierName}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>


                    </Row>
                    <Row style={{ marginTop: '15px' }}>
                        <Col md={6}>
                            <label >Mã vạch </label>
                            <input type="text" className="form-control inputCSS" aria-describedby="emailHelp" value={barCode} readOnly />
                        </Col>
                        <Col md={4}>
                            <label >&nbsp;</label>
                            <Button className='form-control ButtonCSS' type='submit' onClick={handleCreateBarcode}> Tạo mã vạch</Button>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '15px' }}>
                        <Col md={6}>
                            <label >Ngày tạo </label>
                            <input type="date" className="form-control inputCSS" aria-describedby="emailHelp" value={createdDate} onChange={handleChangeCreatedDate} />
                        </Col>
                        <Col md={6}>
                            <label >Hạn bảo hành (tháng) </label>
                            <input type="number" className="form-control inputCSS" aria-describedby="emailHelp" value={warrantyTime} onChange={handleChangeWarranty} />
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '15px' }}>
                        <Col md={12}>
                            <label >Thông tin chi tiết </label>
                            <textarea type="text" className="form-control inputCSS" aria-describedby="emailHelp" value={description} onChange={handleChangeDescription} />
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '15px' }}>
                        <Col md={6}>
                            <label >Tồn kho tối đa </label>
                            <input type="number" className="form-control inputCSS" aria-describedby="emailHelp" value={maxStock} onChange={(e) => setMaxStock(e.target.value)} />
                        </Col>
                        <Col md={6}>
                            <label > Tồn kho tối thiểu </label>
                            <input type="number" className="form-control inputCSS" aria-describedby="emailHelp" value={minStock} onChange={(e) => setMinStock(e.target.value)} />
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '15px' }}>
                        <label >Hình ảnh </label>


                        <Col md={12}>
                            <div>
                                <input
                                    className='form-control'
                                    type="file"
                                    accept="image/*"
                                    onChange={handleChooseFile}
                                />
                            </div>
                        </Col>
                    </Row>


                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                    Đóng
                </Button>
                <Button variant="primary" className="ButtonCSS" onClick={handleSave}>
                    Thêm hàng hóa mới
                </Button>
            </Modal.Footer>
        </Modal>
    );
}


export default ModalAddGood;



