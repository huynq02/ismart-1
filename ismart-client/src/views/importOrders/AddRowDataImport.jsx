import { useState, useEffect } from "react";
import { Row, Col, Dropdown, Modal, Button } from "react-bootstrap";
import { fetchGoodsWithStorageAndSupplier } from "~/services/GoodServices";
import { CustomToggle, CustomMenu } from "../components/others/Dropdown";
import { toast } from "react-toastify";
import { getUserIdWarehouse } from "~/services/UserWarehouseServices";
import { set } from "lodash";
import { fetchGoodsWithSupplier } from "~/services/GoodServices";

const AddRowDataImportOrder = ({ selectedSupplierId, selectedStorageId, isShow, handleClose, onChange }) => {

    const roleId = parseInt(localStorage.getItem('roleId'), 10);
    const userId = parseInt(localStorage.getItem('userId'), 10);

    const [selectedImportId, setSelectedImportId] = useState(null);
    const [selectedBatchCode, setSelectedbatchCode] = useState(null);
    const [manufactureDate, setManufactureDate] = useState(null);
    const [expiryDate, setExpiryDate] = useState(null);
    const [costPrice, setCostPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);

    const [totalGoods, setTotalGoods] = useState([]);
    const [selectedGoodCode, setSelectedGoodCode] = useState(null);
    const [selectedGoodId, setSelectedGoodId] = useState(0);



    useEffect(() => {
        getAllGoods();
    }, [selectedStorageId, selectedSupplierId])

    // useEffect(() => {
    //     console.log("setbatchCode:", setbatchCode);
    // }, [setbatchCode]);
    const getAllGoods = async () => {
        if (roleId === 1) {
            if (selectedStorageId && selectedSupplierId) {
                let res = await fetchGoodsWithStorageAndSupplier(
                    selectedStorageId,
                    selectedSupplierId
                );

                setTotalGoods(res);
            }
        } else if (roleId === 4 || roleId === 3 || roleId === 2) {
            // Nhân viên: lấy danh sách kho cụ thể mà họ quản lý
            let rs = await getUserIdWarehouse(userId);
            // Lấy ra tất cả mã sản phẩm của kho và nhà cung cấp
            if (selectedSupplierId !== null) {
                let res = await fetchGoodsWithStorageAndSupplier(
                    rs[0].warehouseId,
                    selectedSupplierId

                );
                setTotalGoods(res);
            }
        }
    }
    const generateBatchCode = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `MLH${year}${month}${day}${hours}${minutes}${seconds}`;
    };

    const handleConfirmRowData = () => {
        const currentDate = new Date().toISOString().slice(0, 10); // Lấy ngày hiện tại với định dạng YYYY-MM-DD
        if (!selectedGoodCode) {
            toast.warning("Vui lòng chọn sản phẩm");
        } else if (quantity <= 0 || !quantity) {
            toast.warning("Vui lòng nhập số lượng lớn hơn 0");
        } else if (!selectedBatchCode) {
            toast.warning("Vui lòng tạo mã lô hàng!");
        } else if (!manufactureDate || !expiryDate) {
            toast.warning("Vui lòng nhập đầy đủ ngày sản xuất và ngày hết hạn");
        } else if (manufactureDate >= expiryDate) {
            toast.warning("Ngày sản xuất phải nhỏ hơn ngày hết hạn");
        } else if (manufactureDate >= currentDate) {
            toast.warning("Ngày sản xuất phải nhỏ hơn ngày tạo đơn");
        }

        else {
            onChange({
                batchCode: selectedBatchCode,
                costPrice: 0,
                expiryDate: expiryDate,
                goodsCode: selectedGoodCode,
                goodsId: selectedGoodId,
                importId: selectedImportId,
                manufactureDate: manufactureDate,
                quantity: quantity,
                totalOneGoodPrice: 0
            });
            handleCloseModal();
        }
    }


    const handleGoodClick = (good, event) => {
        setSelectedGoodCode(good.goodsCode);
        setSelectedGoodId(good.goodsId);
        // console.log("selectedGoodCode: ", good.goodsId);
    }

    const handleChangeQuantity = (event) => {
        const inputValue = parseInt(event.target.value, 10);
        if (inputValue >= 1) {
            setQuantity(inputValue);
        } else {
            // Optionally, you can set it to 0 or leave the value unchanged
            setQuantity(1);
        }
    }


    const handleCloseModal = () => {
        handleReset();
        handleClose();

    }

    const handleReset = () => {
        setSelectedGoodCode(null);
        setQuantity(0);

        setSelectedbatchCode(null);
        setManufactureDate(null);
        setExpiryDate(null);
    }
    const handleCreateBatchCode = () => {
        
            setSelectedbatchCode(generateBatchCode());       
    }

    return (
        <Modal show={isShow} onHide={handleCloseModal} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Chọn sản phẩm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>

                    <Col md={3}>
                        <label>Mã sản phẩm</label>
                        <div>
                            <Dropdown style={{ position: 'relative' }}>
                                <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                                    <span style={{ color: 'white' }}>{selectedGoodCode !== null ? selectedGoodCode : "Mã Sản phẩm"}</span>
                                </Dropdown.Toggle>

                                <Dropdown.Menu as={CustomMenu} style={{ position: 'absolute', zIndex: '9999' }}>
                                    {totalGoods && totalGoods.length > 0 && totalGoods.map((g, index) => (
                                        <Dropdown.Item key={`good ${index}`} eventKey={g.goodsCode} onClick={(e) => handleGoodClick(g, e)}>
                                            {g.goodsCode}
                                        </Dropdown.Item>
                                    ))}

                                    {totalGoods.length === 0 && (
                                        <Dropdown.Item key="empty" disabled>
                                            Không có mặt hàng
                                        </Dropdown.Item>
                                    )}
                                </Dropdown.Menu>
                            </Dropdown>

                        </div>
                    </Col>

                    <Col md={2}>
                        <div className="form-group mb-3">
                            <label >Số lượng</label>
                            <input type="number" className="form-control inputCSS" value={quantity} onChange={handleChangeQuantity} />
                        </div>
                    </Col>


                    <Col md={4}>
                        <div className="form-group mb-3">
                            <label >Mã lô hàng</label>
                            <input type="text" className="form-control inputCSS" value={selectedBatchCode} disabled />
                        </div>
                    </Col>
                    <Col md={2}>
                        <label >&nbsp;</label>
                        <Button className='form-control ButtonCSS' type='submit' onClick={handleCreateBatchCode} > Tạo mã lô </Button>
                    </Col>
                    <div></div>
                    <Col md={3}>
                        <div className="form-group mb-3">
                            <label >Ngày sản xuất</label>
                            <input type="date" className="form-control inputCSS" value={manufactureDate} onChange={(e) => setManufactureDate(e.target.value)} />
                        </div>
                    </Col>

                    <Col md={3}>
                        <div className="form-group mb-3">
                            <label >Ngày hết hạn</label>
                            <input type="date" className="form-control inputCSS" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
                        </div>
                    </Col>



                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" className="ButtonCSS" onClick={handleConfirmRowData}>
                    Xác nhận nhập kho
                </Button>
            </Modal.Footer>
        </Modal >
    )
}


export default AddRowDataImportOrder