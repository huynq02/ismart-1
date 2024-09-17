import { useState, useEffect } from "react";
import { Row, Col, Dropdown, Modal, Button } from "react-bootstrap";
import { fetchGoodsWithStorageAndSupplier } from "~/services/GoodServices";
import { CustomToggle, CustomMenu } from "../components/others/Dropdown";
import { toast } from "react-toastify";

const EditRowDataOrderN = ({ isShow, handleClose, data, dataAfterEdit }) => {
    const [goodsId, setGoodsId] = useState();
    const [goodsCode, setGoodsCode] = useState();
    const [quantity, setQuantity] = useState();
    const [costPrice, setCostPrice] = useState();
    const [expiryDate, setExpiryDate] = useState();
    const [manufactureDate, setManufactureDate] = useState();
    const [batchCode, setBatchCode] = useState();
    const [selectedImportId, setSelectedImportId] = useState(null);
    const [totalOneGoodPrice, setTotalOneGoodPrice] = useState(0);
    const [supplierId, setSupplierId] = useState();
    const [supplierName, setSupplierName] = useState();

    useEffect(() => {
        setBatchCode(data.batchCode);
        setCostPrice(data.costPrice);
        setExpiryDate(data.expiryDate);
        setGoodsCode(data.goodsCode);
        setGoodsId(data.goodsId);
        setSelectedImportId(data.importId);
        setManufactureDate(data.manufactureDate);
        setQuantity(data.quantity);
        setSupplierId(data.supplierId);
        setSupplierName(data.supplierName);
        setTotalOneGoodPrice(data.totalOneGoodPrice);

    }, [data])
    // console.log("dataEditRowDataOrder: ", data);

    useEffect(() => {
        setTotalOneGoodPrice(quantity * costPrice);
    }, [quantity, costPrice]);
    // console.log("dataEdit: ", data);
    const handleChangeQuantity = (event) => {
        setQuantity(event.target.value);
        setTotalOneGoodPrice(event.target.value * costPrice);
    }
    const handleChangeBatchCode = (event) => {
        setBatchCode(event.target.value);

    }
    const handleChangemMnufactureDate = (event) => {
        setManufactureDate(event.target.value);
    }
    const handleChangeExpiryDate = (event) => {
        setExpiryDate(event.target.value);
    }
    const handleReset = () => {
        setBatchCode(data.batchCode);
        setCostPrice(data.costPrice);
        setExpiryDate(data.expiryDate);
        setGoodsCode(data.goodsCode);
        setGoodsId(data.goodsId);
        setSelectedImportId(data.importId);
        setManufactureDate(data.manufactureDate);
        setQuantity(data.quantity);
        setSupplierId(data.supplierId);
        setSupplierName(data.supplierName);
        setTotalOneGoodPrice(data.totalOneGoodPrice);
    }
    const handleCloseModal = () => {
        handleReset();
        handleClose();
    }

    const handleEditRowData = () => {
        if (quantity <= 0) {
            toast.warning("Vui lòng nhập số lượng lớn hơn 0");
        // } else if (costPrice <= 0) {
        //     toast.warning("Vui lòng nhập giá tiền lớn hơn 0")
         } else {
            dataAfterEdit({
                // ...data,
                batchCode: batchCode,
                costPrice: costPrice,
                expiryDate: expiryDate,
                goodsCode: goodsCode,
                goodsId: goodsId,
                importId: selectedImportId,
                manufactureDate: manufactureDate,
                quantity: quantity,
                supplierId: supplierId,
                supplierName: supplierName,
                totalOneGoodPrice: totalOneGoodPrice

            });
            console.log("dataAfterEdit: ", quantity);
            handleClose();
        };
    }

    return (
        <Modal show={isShow} onHide={handleCloseModal} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Xác nhận lô hàng nhập kho</Modal.Title>
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
                        <label >Mã lô hàng</label>
                        <input type="text" className="form-control" value={batchCode} onChange={handleChangeBatchCode} />
                    </div>
                </Col>
                {/* <Col md={3}>
                    <div className="form-group mb-3">
                        <label >Nhà cung cấp</label>
                        <input type="text" className="form-control" value={supplierName} disabled />
                    </div>
                </Col> */}
                <Col md={3}>
                    <div className="form-group mb-3">
                        <label >Ngày sản xuất</label>
                        <input type="date" className="form-control" value={manufactureDate} onChange={handleChangemMnufactureDate} />
                    </div>
                </Col>
                <Col md={3}>
                    <div className="form-group mb-3">
                        <label >Ngày hết hạn</label>
                        <input type="date" className="form-control" value={expiryDate} on onChange={handleChangeExpiryDate} />
                    </div>
                </Col>


            </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" className="ButtonCSS" onClick={handleEditRowData} >
                    Xác nhận nhập kho
                </Button>
            </Modal.Footer>
        </Modal >
    )
}


export default EditRowDataOrderN;