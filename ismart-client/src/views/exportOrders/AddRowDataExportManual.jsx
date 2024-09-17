import { useState, useEffect } from "react";
import { Row, Col, Dropdown, Modal, Button, Table } from "react-bootstrap";
import { CustomToggle, CustomMenu } from "../components/others/Dropdown";
import { toast } from "react-toastify";
import { fetchAllGoodsInWarehouse } from "~/services/GoodServices";
import { fetchGoodinWarehouseById } from "~/services/GoodServices";
import { getBatchInventoryForExportgoods } from "~/services/ImportOrderDetailServices";
import { getAvailableBatch } from "~/services/ImportOrderDetailServices";
import { getUserIdWarehouse } from "~/services/UserWarehouseServices";



const AddRowDataExportOrderManual = ({ selectedStorageId, isShow, handleClose, onChange }) => {
    const [costPrice, setCostPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);

    const roleId = parseInt(localStorage.getItem('roleId'), 10);
    const userId = parseInt(localStorage.getItem('userId'), 10);


    const [quantityInStock, setQuantityInStock] = useState(0);




    const [totalGoods, setTotalGoods] = useState([]);
    const [selectedGoodCode, setSelectedGoodCode] = useState(null);
    const [selectedGoodId, setSelectedGoodId] = useState(null);
    const [dataMethod, setDataMethod] = useState(null);
    const [selectedMethod, setSelectedMethod] = useState('');
    const [selectImportOrderDetailId, setSelectImportOrderDetailId] = useState(null);
    const [inputQuantities, setInputQuantities] = useState({});




    const [isManualClick, setIsManualClick] = useState(false); // theo dõi chọn phương thức xuất kho
    useEffect(() => {
        getAllGoods();
    }, [selectedStorageId])


    useEffect(() => {
        setDataMethod();
    }, [selectedMethod])

    // useEffect(() => {
    //     setDataMethod(null);
    // }, [selectedGoodId])

    const getAllGoods = async () => {
        if (roleId === 1) {
            if (selectedStorageId !== null) {
                let res = await fetchAllGoodsInWarehouse(selectedStorageId);
                setTotalGoods(res);
            }
        } else if (roleId === 4 || roleId === 3 || roleId === 2) {
            let rs = await getUserIdWarehouse(userId);
            if (rs !== null) {
                let res = await fetchAllGoodsInWarehouse(rs[0].warehouseId);
                setTotalGoods(res);
            }
        }
    }


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
            if (!selectedGoodCode) {
                toast.warning("Vui lòng chọn sản phẩm");
            }
            else {
                setIsManualClick(true);


                let m = await getAvailableBatch(selectedStorageId, selectedGoodId);
                if (m.length === 0) {
                    // Nếu không có lô hàng nào, hiển thị thông báo
                    toast.warning("Không có lô hàng nào");
                } else {
                    setDataMethod(m);
                    // const importOrderDetailIds = m.map(item => item.importOrderDetailId);

                    const importOrderDetailIds = m.map(item => ({
                        importOrderDetailId: item.importOrderDetailId,
                        batchCode: item.batchCode
                    }));

                    setSelectImportOrderDetailId(importOrderDetailIds);


                    const initialInputQuantities = {};
                    importOrderDetailIds.forEach((data, index) => {
                        initialInputQuantities[index] = {
                            quantity: 0,
                            importOrderDetailId: data.importOrderDetailId,
                            batchCode: data.batchCode
                        };
                    });
                    setInputQuantities(initialInputQuantities);
                }
            }
        }
        else if (roleId === 4 || roleId === 3 || roleId === 2) {
            if (!selectedGoodCode) {
                toast.warning("Vui lòng chọn sản phẩm");
            }
            else {
                setIsManualClick(true);
                let rs = await getUserIdWarehouse(userId);
                let m = await getAvailableBatch(rs[0].warehouseId, selectedGoodId);
                if (m.length === 0) {
                    // Nếu không có lô hàng nào, hiển thị thông báo
                    toast.warning("Không có lô hàng nào");
                } else {
                    setDataMethod(m);
                    // const importOrderDetailIds = m.map(item => item.importOrderDetailId);

                    const importOrderDetailIds = m.map(item => ({
                        importOrderDetailId: item.importOrderDetailId,
                        batchCode: item.batchCode
                    }));

                    setSelectImportOrderDetailId(importOrderDetailIds);


                    const initialInputQuantities = {};
                    importOrderDetailIds.forEach((data, index) => {
                        initialInputQuantities[index] = {
                            quantity: 0,
                            importOrderDetailId: data.importOrderDetailId,
                            batchCode: data.batchCode
                        };
                    });
                    setInputQuantities(initialInputQuantities);
                }
            }
        }
    }
    const handleInputQuantityChange = (index, value) => {
        const importOrderDetailId = selectImportOrderDetailId[index].importOrderDetailId;
        const batchCode = selectImportOrderDetailId[index].batchCode;

        // Kiểm tra và điều chỉnh giá trị nếu vượt quá d.quantity
        const adjustedValue = Math.min(Number(value), dataMethod[index].actualQuantity);


        // Cập nhật inputQuantities với key là index, và value là object chứa quantity và importOrderDetailId
        const newInputQuantities = {
            ...inputQuantities,
            [index]: {
                quantity: adjustedValue,
                importOrderDetailId: importOrderDetailId,
                batchCode: batchCode
            }
        };
        setInputQuantities(newInputQuantities);
        // console.log("newInputQuantities: ", newInputQuantities);

        // Hiển thị thông báo nếu giá trị nhập vào lớn hơn d.quantity
        if (Number(value) > dataMethod[index].actualQuantity) {
            toast.warning("Phải nhập số lượng nhỏ hơn hoặc bằng số lượng hiện có!");
        }
    }


    // mới
    const handleConfirmRowData = () => {
        if (!selectedGoodCode) {
            toast.warning("Vui lòng chọn sản phẩm");
        } else if (!isManualClick) {
            toast.warning("Vui lòng chọn phương thức xuất kho");
        } else if (!Array.isArray(dataMethod) || dataMethod.length === 0) {
            toast.warning("Vui lòng chọn phương thức xuất kho");
        } else {
            // Lọc các lô hàng có số lượng lớn hơn 0
            const validQuantities = Object.values(inputQuantities).filter(item => item.quantity > 0);

            // Kiểm tra nếu không có lô hàng nào có số lượng lớn hơn 0
            if (validQuantities.length === 0) {
                toast.warning("Số lượng nhập vào phải lớn hơn 0");
                return;
            }

            // Tạo mảng từ validQuantities để gửi đi
            const inputQuantitiesArray = validQuantities.map(item => ({
                importOrderDetailId: item.importOrderDetailId,
                quantity: item.quantity,
                batchCode: item.batchCode
            }));

            // Tạo mảng mới với thông tin sản phẩm cho mỗi importOrderDetailId
            const exportDataArray = inputQuantitiesArray.map(item => ({
                costPrice: 0,
                goodsId: selectedGoodId,
                goodsCode: selectedGoodCode,
                quantity: item.quantity,
                importOrderDetailId: item.importOrderDetailId,
                batchCode: item.batchCode
            }));

            onChange(exportDataArray);
            handleCloseModal();
        }
    };

    const handleCloseModal = () => {
        handleReset();
        handleClose();

    }

    const handleReset = () => {
        setSelectedMethod(null);
        setDataMethod(null);
        setSelectedGoodCode(null);
        setSelectedGoodId(null);
        setQuantityInStock(0);
        setQuantity(0);
        setCostPrice(0);
        setInputQuantities({});

        setIsManualClick(false); // mặc định phương thức xuất kho
    }
    // const isSaveButtonDisabled = () => {
    //     return Object.values(inputQuantities).some(item => item.quantity === 0);
    // };
    return (

        <Modal show={isShow} onHide={handleCloseModal} size="xl">
            <Modal.Header closeButton>
                <Modal.Title>Chọn sản phẩm</Modal.Title>
            </Modal.Header>
            <Modal.Body><Row>

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

                                {/* {totalGoods.length === 0 && (
                                    <Dropdown.Item key="empty" disabled>
                                        Không có mặt hàng
                                    </Dropdown.Item>
                                )} */}
                            </Dropdown.Menu>
                        </Dropdown>

                    </div>
                </Col>




                <Col md={3}>
                    <div className="form-group mb-3">
                        <label>Phương thức xuất kho</label>
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








            </Row >
                <Row style={{ marginTop: "20px" }}>




                    <Col md={2}>
                        <div className="form-group mb-3">
                            <label >Số lượng trong kho</label>
                            <input type="number" className="form-control inputCSS" value={quantityInStock} disabled />
                        </div>
                    </Col>




                    {/* <Col md={2}>
                        <div className="form-group mb-3">
                            <label >Số lượng</label>
                            <input type="number" className="form-control inputCSS" value={quantity} onChange={handleChangeTotalQuantity} readOnly />
                        </div>
                    </Col> */}


                </Row>
            </Modal.Body>
            <Table >
                <thead>
                    <tr>
                        <th>Mã Lô Hàng</th>
                        <th>Ngày Sản Xuất</th>
                        <th>Ngày Hết Hạn</th>
                        <th>Số Lượng</th>
                        <th>Vị Trí Trong Kho</th>
                        <th>Nhập Số Lượng</th>
                    </tr>
                </thead>
                <tbody>
                    {dataMethod && dataMethod.map((d, index) => (
                        <tr key={index}>
                            <td>{d.batchCode}</td>
                            <td>{new Date(d.manufactureDate).toLocaleDateString()}</td>
                            <td>{new Date(d.expiryDate).toLocaleDateString()}</td>
                            <td>{d.actualQuantity}</td>
                            <td>{d.location || 'N/A'}</td>
                            <td>
                                <input
                                    type="number"
                                    min={0}
                                    max={d.actualQuantity}
                                    className="form-control"
                                    value={inputQuantities[index]?.quantity || 0}
                                    onChange={(e) => handleInputQuantityChange(index, e.target.value)}
                                />
                            </td>
                        </tr>
                    ))}

                </tbody>
            </Table>
            <Modal.Footer>
                <Button variant="primary" className="ButtonCSS" onClick={handleConfirmRowData}
                // disabled={isSaveButtonDisabled()}
                >
                    Xác nhận xuất kho
                </Button>
            </Modal.Footer>
        </Modal >
    )
}




export default AddRowDataExportOrderManual











