import { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import EditRowDataReturnOrder from './EditRowDataOrderDetail'

const RowDataEditReturnOrder = ({ data, index, deleteRowData, updateRowData }) => {

    const [isShowEditRowData, setIsShowEditRowData] = useState(false);

    const [goodsId, setGoodsId] = useState();
    const [goodsCode, setGoodsCode] = useState();
    const [quantity, setQuantity] = useState();
    const [batchCode, setBatchCode] = useState();
    const [reason, setReason] = useState();
    const [detailId, setDetailId] = useState();
    const [importId, setImportId] = useState();

    useEffect(() => {
        setGoodsId(data.goodsId);
        setGoodsCode(data.goodsCode);
        setQuantity(data.quantity);
        setBatchCode(data.batchCode);
        setReason(data.reason);
    }, [data])

    const handleEditRowData = () => {
        setIsShowEditRowData(true);
    }

    const handleDeleteRowData = () => {
        deleteRowData(index);
    }

    const dataAfterEdit = (data) => {
        setQuantity(data.quantity);
        updateRowData(index, { goodsCode: data.goodsCode, goodsId: data.goodsId, quantity: data.quantity, reason: data.reason, batchCode: data.batchCode, returnOrderDetailId: data.returnOrderDetailId, returnOrderId: data.returnOrderId })
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
                    <label >Lô hàng</label>
                    <input type="text" className="form-control" defaultValue={batchCode} disabled />
                </div>
            </Col>

            <Col md={2}>
                <div className="form-group mb-3">
                    <label >Lí do</label>
                    <input type="text" className="form-control" defaultValue={reason} disabled />
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

        <EditRowDataReturnOrder isShow={isShowEditRowData} handleClose={() => setIsShowEditRowData(false)} data={data} dataAfterEdit={dataAfterEdit} />
    </>)
}


export default RowDataEditReturnOrder