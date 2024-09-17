import { useEffect, useState } from "react";
import { Row, Col, Dropdown } from "react-bootstrap";
import EditRowDataOrderN from "./EditRowDataN";
import { set } from "lodash";

const RowDataImportOrderN = ({ data, index, deleteRowData, updateRowData }) => {

    const [isShowEditRowData, setIsShowEditRowData] = useState(false);

    const [goodsId, setGoodsId] = useState();
    const [goodsCode, setGoodsCode] = useState();
    const [quantity, setQuantity] = useState();
    const [costPrice, setCostPrice] = useState();
    const [batchCode, setBatchCode] = useState();
    const [expiryDate, setExpiryDate] = useState();
    const [manufactureDate, setManufactureDate] = useState();
    const [totalOneGoodPrice, setTotalOneGoodPrice] = useState(0);

    useEffect(() => {
        setGoodsId(data.goodsId);
        setGoodsCode(data.goodsCode);
        setQuantity(data.quantity);
        setCostPrice(data.costPrice);
        setBatchCode(data.batchCode);
        setExpiryDate(data.expiryDate);
        setManufactureDate(data.manufactureDate);
        // setSelectImportId(data.importId);
        setTotalOneGoodPrice(data.quantity * data.costPrice);
    }, [data])
    // console.log("data: ", data);

    useEffect(() => {
        setTotalOneGoodPrice(quantity * costPrice);
    }, [quantity, costPrice]);
    const handleEditRowData = () => {
        setIsShowEditRowData(true);
    }

    const handleDeleteRowData = () => {
        deleteRowData(index);
    }

    const dataAfterEdit = (newData) => {
        setGoodsId(newData.goodsId);
        setGoodsCode(newData.goodsCode);
        setQuantity(newData.quantity);
        setCostPrice(newData.costPrice);
        setBatchCode(newData.batchCode);
        setExpiryDate(newData.expiryDate);
        setManufactureDate(newData.manufactureDate);
        setTotalOneGoodPrice(newData.quantity * newData.costPrice);


        // setTotalOneGoodPrice(data.totalOneGoodPrice);
        updateRowData(index, {

            batchCode: newData.batchCode,
            costPrice: newData.costPrice,
            expiryDate: newData.expiryDate,
            goodsCode: newData.goodsCode,
            goodsId: newData.goodsId,
            manufactureDate: newData.manufactureDate,
            quantity: newData.quantity,
            totalOneGoodPrice: newData.quantity * newData.costPrice
        })
        // console.log("dataAfterEdit: ", SelecttotalOneGoodPrice);
    }

    // console.log("dataAfterEdit: ", data);

    return (<>
        <Row>
            <Col md={3}>
                <div className="form-group mb-3">
                    <label>Nhà cung cấp</label>
                    <input type="text" className="form-control" defaultValue={data.supplierName} disabled />
                </div>
            </Col>
            <Col md={3}>
                <div className="form-group mb-3">
                    <label >Mã Sản phẩm</label>
                    <input type="text" className="form-control" defaultValue={goodsCode} disabled />
                </div>
            </Col>

            <Col md={2}>
                <div className="form-group mb-3">
                    <label >Số lượng</label>
                    <input type="number" className="form-control" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} disabled />
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

        <EditRowDataOrderN isShow={isShowEditRowData} handleClose={() => setIsShowEditRowData(false)} data={data} dataAfterEdit={dataAfterEdit} />
    </>)
}


export default RowDataImportOrderN