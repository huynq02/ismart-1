import { useEffect, useState } from "react";
import { Row, Col, Dropdown } from "react-bootstrap";
import EditRowDataOrder from "./EditRowData";
import { formatDate } from "date-fns";

const RowDataEditImportOrder = ({ data, index, deleteRowData, updateRowData, detailId }) => {

    const [isShowEditRowData, setIsShowEditRowData] = useState(false);

    const [goodsId, setGoodsId] = useState();
    const [goodsCode, setGoodsCode] = useState();
    const [quantity, setQuantity] = useState();
    const [costPrice, setCostPrice] = useState();
    const [importId, setImportId] = useState();
    const [batchCode, setBatchCode] = useState();
    const [expiryDate, setExpiryDate] = useState();
    const [manufactureDate, setManufactureDate] = useState();

    useEffect(() => {
        // console.log("RowDataEditImportOrder", data.expiryDate);
        setGoodsId(data.goodsId);
        setGoodsCode(data.goodsCode);
        setQuantity(data.quantity);
        setCostPrice(data.costPrice);
        setImportId(data.importId);
        setBatchCode(data.batchCode);
        setExpiryDate(data.expiryDate);
        setManufactureDate(data.manufactureDate);
        if (data.expiryDate) {
            const formattedExpiryDate = formatDate(new Date(data.expiryDate), 'yyyy-MM-dd');
            setExpiryDate(formattedExpiryDate);
        }
        if (data.manufactureDate) {
            const formattedManufactureDate = formatDate(new Date(data.manufactureDate), 'yyyy-MM-dd');
            setManufactureDate(formattedManufactureDate);
        }
        console.log("detailId: ", data.detailId);
    }, [data])

    const handleEditRowData = () => {
        setIsShowEditRowData(true);
        console.log(data.detailId)
    }

    const handleDeleteRowData = () => {
        deleteRowData(index);
    }

    const dataAfterEdit = (newData) => {
        console.log("dataAfterEdit: ", newData.batchCode,
            newData.costPrice, newData.expiryDate, newData.goodsCode,
            newData.goodsId, newData.manufactureDate, newData.quantity);

        setBatchCode(newData.batchCode);
        setCostPrice(0);
        setExpiryDate(newData.expiryDate);
        setGoodsCode(newData.goodsCode);
        setGoodsId(newData.goodsId);
        setQuantity(newData.quantity);
        setManufactureDate(newData.manufactureDate);

        updateRowData(index, {
            detailId: detailId,
            costPrice: newData.costPrice,
            goodsId: newData.goodsId,
            goodsCode: newData.goodsCode,
            quantity: newData.quantity,
            manufactureDate: newData.manufactureDate,
            expiryDate: newData.expiryDate,
            batchCode: newData.batchCode,
        })
        console.log("dataAfterEdit: ", newData.costPrice, newData.goodsId,
            newData.goodsCode, newData.quantity,
            newData.manufactureDate, newData.expiryDate, newData.batchCode);
    }



    return (<>
        <Row>

            <Col md={3}>
                <div className="form-group mb-3">
                    <label >Mã Sản phẩm</label>
                    <input type="text" className="form-control" defaultValue={goodsCode} disabled />
                </div>
            </Col>

            <Col md={2}>
                <div className="form-group mb-3">
                    <label >Số lượng</label>
                    <input type="number" className="form-control" defaultValue={quantity} disabled />
                </div>
            </Col>
            <Col md={2}>
                <div className="form-group mb-3">
                    <label >Mã lô hàng</label>
                    <input type="text" className="form-control" defaultValue={batchCode} disabled />
                </div>
            </Col>
            <Col md={3}>
                <div className="form-group mb-3">
                    <label >Ngày sản xuất</label>
                    <input type="date" className="form-control" defaultValue={manufactureDate} disabled />
                </div>
            </Col>
            <Col md={3}>
                <div className="form-group mb-3">
                    <label >Ngày hết hạn</label>
                    <input type="date" className="form-control" defaultValue={expiryDate} disabled />
                </div>
            </Col>



            <Col md={1}>
                <div className="form-group mb-3 ButtonCSSDropdown">
                    <button
                        className="btn btn-success border-left-0 rounded mt-4"
                        type="button"
                        onClick={() => handleEditRowData(data)}
                    >
                        Sửa
                    </button>
                </div>
            </Col>

            <Col md={1}>
                <div className="form-group mb-3 ButtonCSSDropdown red">
                    <button
                        className="btn btn-success border-left-0 rounded  mt-4 "
                        type="button"
                        onClick={() => handleDeleteRowData(data)}
                    >
                        Xóa
                    </button>
                </div>
            </Col>



        </Row>

        <EditRowDataOrder isShow={isShowEditRowData} handleClose={() => setIsShowEditRowData(false)} data={data} dataAfterEdit={dataAfterEdit} />
    </>)
}


export default RowDataEditImportOrder