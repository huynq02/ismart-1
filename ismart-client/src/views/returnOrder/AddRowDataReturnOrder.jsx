import { useState, useEffect } from "react";
import { Row, Col, Dropdown, Modal, Button, Table } from "react-bootstrap";
import { CustomToggle, CustomMenu } from "../components/others/Dropdown";
import { toast } from "react-toastify";
import { fetchAllGoodsInWareAndSup } from "~/services/GoodServices";
import { fetchGoodinWarehouseById } from "~/services/GoodServices";
import { getBatchByReturnOrder } from "~/services/ImportOrderDetailServices";
import { getUserIdWarehouse } from "~/services/UserWarehouseServices";

const AddRowDataReturnOrderManual = ({ selectedStorageId, selectedSupplierId, isShow, handleClose, onChange }) => {
    const roleId = parseInt(localStorage.getItem('roleId'), 10);
    const userId = parseInt(localStorage.getItem('userId'), 10);

    const [costPrice, setCostPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [quantityInStock, setQuantityInStock] = useState(0);
    const [totalGoods, setTotalGoods] = useState([]);
    const [selectedGoodCode, setSelectedGoodCode] = useState(null);
    const [selectedGoodId, setSelectedGoodId] = useState(null);
    const [dataMethod, setDataMethod] = useState(null);
    const [selectedMethod, setSelectedMethod] = useState('');
    const [selectImportOrderDetailId, setSelectImportOrderDetailId] = useState(null);
    const [inputQuantities, setInputQuantities] = useState({});
    const [inputReasons, setInputReasons] = useState({}); // Thêm trạng thái lý do

    useEffect(() => {
        getAllGoods();
    }, [selectedStorageId, selectedSupplierId]);


    useEffect(() => {
        setDataMethod(null);
    }, [selectedMethod]);

    const getWarehouseById = async (userId) => {
        let res = await getUserIdWarehouse(userId);
        return res[0];
    }

    const getAllGoods = async () => {
        if (roleId === 1) {
            if (selectedStorageId !== null && selectedSupplierId != null) {
                let res = await fetchAllGoodsInWareAndSup(selectedStorageId, selectedSupplierId);
                setTotalGoods(res);
            }
        }
        else if (roleId === 3) {
            const userId = parseInt(localStorage.getItem('userId'), 10);
            let warehouse = await getWarehouseById(userId);
            if (warehouse.warehouseId !== null && selectedSupplierId != null) {
                let res = await fetchAllGoodsInWareAndSup(warehouse.warehouseId, selectedSupplierId);
                setTotalGoods(res);
            }
        }
    };

    const handleGoodClick = async (good, event) => {
        handleReset();
        if (roleId === 1) {
            setSelectedGoodCode(good.goodsCode);
            setSelectedGoodId(good.goodsId);
            let res = await fetchGoodinWarehouseById(selectedStorageId, good.goodsId);
            setQuantityInStock(res.inStock);
        }
        else if (roleId === 4 || roleId === 3 || roleId === 2) {
            setSelectedGoodCode(good.goodsCode);
            setSelectedGoodId(good.goodsId);
            let rs = await getUserIdWarehouse(userId);
            let res = await fetchGoodinWarehouseById(rs[0].warehouseId, good.goodsId);
            setQuantityInStock(res.inStock);
        }
    }

    const handleManualClick = async () => {
        if (roleId === 1) {
            let m = await getBatchByReturnOrder(selectedStorageId, selectedGoodId);
            if (!Array.isArray(m) || m.length === 0) {
                toast.warning("Không có lô hàng nào");
                setDataMethod([]); // Đảm bảo dataMethod là một mảng rỗng
            } else {
                setDataMethod(m);
                const importOrderDetailIds = m.map(item => item.importOrderDetailId);
                setSelectImportOrderDetailId(importOrderDetailIds);
            }
        } else if (roleId === 4 || roleId === 3 || roleId === 2) {
            let rs = await getUserIdWarehouse(userId);
            let m = await getBatchByReturnOrder(rs[0].warehouseId, selectedGoodId);
            if (!Array.isArray(m) || m.length === 0) {
                toast.warning("Không có lô hàng nào");
                setDataMethod([]); // Đảm bảo dataMethod là một mảng rỗng
            } else {
                setDataMethod(m);
                const importOrderDetailIds = m.map(item => item.importOrderDetailId);
                setSelectImportOrderDetailId(importOrderDetailIds);
            }
        }
    };

    const handleInputQuantityChange = (index, value) => {
        const importOrderDetailId = selectImportOrderDetailId[index];
        let quantity = Number(value);

        // Ensure the quantity is within the allowed range
        if (quantity > dataMethod[index].quantity) {
            quantity = dataMethod[index].quantity;
        } else if (quantity < 0) {
            quantity = 0;
        }

        const newInputQuantities = {
            ...inputQuantities,
            [index]: {
                quantity: quantity,
                importOrderDetailId: importOrderDetailId
            }
        };

        setInputQuantities(newInputQuantities);
    };


    const handleInputReasonChange = (index, value) => {
        const importOrderDetailId = selectImportOrderDetailId[index];
        const newInputReasons = {
            ...inputReasons,
            [index]: value
        };
        setInputReasons(newInputReasons);
    };

    const handleConfirmRowData = () => {
        if (!selectedGoodCode) {
            toast.warning("Vui lòng chọn sản phẩm");
        } else {
            const inputQuantitiesArray = Object.keys(inputQuantities)
                .filter(key => inputQuantities[key].quantity > 0) // Lọc chỉ các mục có số lượng lớn hơn 0
                .map(key => {
                    const dataItem = dataMethod[key];
                    return {
                        importOrderDetailId: inputQuantities[key].importOrderDetailId,
                        quantity: inputQuantities[key].quantity,
                        batchCode: dataItem.batchCode,
                        reason: inputReasons[key] || '' // Thêm lý do vào dữ liệu
                    };
                });

            const returnOrderDataArray = inputQuantitiesArray.map(item => ({
                batchCode: item.batchCode,
                goodsId: selectedGoodId,
                goodsCode: selectedGoodCode,
                quantity: item.quantity,
                importOrderDetailId: item.importOrderDetailId,
                reason: item.reason // Thêm lý do vào dữ liệu
            }));

            onChange(returnOrderDataArray);
            handleCloseModal();
        }
    };

    const handleCloseModal = () => {
        handleReset();
        handleClose();
    };

    const handleReset = () => {
        setSelectedMethod(null);
        setDataMethod(null);
        setSelectedGoodCode(null);
        setSelectedGoodId(null);
        setQuantityInStock(0);
        setQuantity(0);
        setCostPrice(0);
        setInputQuantities({});
        setInputReasons({}); // Đặt lại trạng thái lý do
    };

    return (
        <Modal show={isShow} onHide={handleCloseModal} size="xl">
            <Modal.Header closeButton>
                <Modal.Title>Chọn sản phẩm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col md={3}>
                        <label>Mã sản phẩm</label>
                        <Dropdown style={{ position: 'relative' }}>
                            <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                                <span style={{ color: 'white' }}>{selectedGoodCode || "Mã Sản phẩm"}</span>
                            </Dropdown.Toggle>

                            <Dropdown.Menu as={CustomMenu} style={{ position: 'absolute', zIndex: '9999' }}>
                                {totalGoods && totalGoods.length > 0 && totalGoods.map((g, index) => (
                                    <Dropdown.Item key={`good ${index}`} eventKey={g.goodsCode} onClick={(e) => handleGoodClick(g, e)}>
                                        {g.goodsCode}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>

                    <Col md={3}>
                        <div className="form-group mb-3">
                            <label></label>
                            <Dropdown style={{ position: 'relative' }}>
                                <Dropdown.Toggle as={CustomToggle}
                                    className="DropdownButtonCSS ButtonCSSDropdown"
                                    onClick={handleManualClick}
                                >
                                    <span style={{ color: 'white' }}>{"Chọn lô hàng"}</span>
                                </Dropdown.Toggle>
                            </Dropdown>
                        </div>
                    </Col>
                </Row>
                <Row style={{ marginTop: "20px" }}>
                    <Col md={2}>
                        <div className="form-group mb-3">
                            <label>Số lượng trong kho</label>
                            <input type="number" className="form-control inputCSS" value={quantityInStock} disabled />
                        </div>
                    </Col>
                </Row>
            </Modal.Body>
            <Table>
                <thead>
                    <tr>
                        <th>Mã lô hàng</th>
                        <th>Ngày sản xuất</th>
                        <th>Ngày hết hạn</th>
                        <th>Số lượng</th>
                        <th>Vị trí</th>
                        <th>Nhập số lượng</th>
                        <th>Lý do</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(dataMethod) && dataMethod.map((d, index) => (
                        <tr key={index}>
                            <td>{d.batchCode}</td>
                            <td>{new Date(d.manufactureDate).toLocaleDateString()}</td>
                            <td>{new Date(d.expiryDate).toLocaleDateString()}</td>
                            <td>{d.quantity}</td>
                            <td>{d.location || 'N/A'}</td>
                            <td>
                                <input
                                    type="number"
                                    className="form-control"
                                    min={0}
                                    max={d.quantity}
                                    value={inputQuantities[index]?.quantity || 0}
                                    onChange={(e) => handleInputQuantityChange(index, e.target.value)}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={inputReasons[index] || ''}
                                    onChange={(e) => handleInputReasonChange(index, e.target.value)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Modal.Footer>
                <Button variant="primary" className="ButtonCSS" onClick={handleConfirmRowData}>
                    Xác nhận trả hàng
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddRowDataReturnOrderManual;
