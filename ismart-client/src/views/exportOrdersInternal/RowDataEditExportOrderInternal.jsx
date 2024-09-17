
import { useEffect, useState } from "react";
import { Row, Col, Dropdown } from "react-bootstrap";

import EditRowDataOrder from "../importOrders/EditRowData";
import ModalEditExportOrderInternal from "./EditExportOrderInternal";

const RowDataEditExportOrderInternal = ({ data, index, deleteRowData, updateRowData }) => {
    const [isShowEditRowData, setIsShowEditRowData] = useState(false);

    const [goodsId, setGoodsId] = useState();
    const [goodsCode, setGoodsCode] = useState();
    const [quantity, setQuantity] = useState();
    const [costPrice, setCostPrice] = useState();
    const [detailId, setDetailId] = useState();
    const [exportId, setExportId] = useState();

    useEffect(() => {
        setGoodsId(data.goodsId);
        setGoodsCode(data.goodsCode);
        setQuantity(data.quantity);
        setCostPrice(data.price);
        setDetailId(data.detailId);
        setExportId(data.exportId);
    }, [data])

    const handleEditRowData = () => {
        setIsShowEditRowData(true);
    }

    const handleDeleteRowData = () => {
        deleteRowData(index);
    }

    const dataAfterEdit = (data) => {
        console.log(data);
        setQuantity(data.quantity);
        setCostPrice(data.costPrice);
        updateRowData(index, { price: data.costPrice, detailId: detailId, quantity: data.quantity, goodsId: goodsId, goodsCode: goodsCode, exportId: exportId })
    }



    return (<><Row>

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

        {/* <Col md={1}>
            <div className="form-group mb-3 ButtonCSSDropdown red">
                <button
                    className="btn btn-success border-left-0 rounded  mt-4 "
                    type="button"
                    onClick={() => handleDeleteRowData(data)}
                >
                    Xóa
                </button>
            </div>
        </Col> */}



    </Row>

        <ModalEditExportOrderInternal isShow={isShowEditRowData} handleClose={() => setIsShowEditRowData(false)} data={data} dataAfterEdit={dataAfterEdit} />
    </>)
}

export default RowDataEditExportOrderInternal