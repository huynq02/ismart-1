import { useEffect, useState } from "react";
import { Row, Col, Dropdown } from "react-bootstrap";
import EditRowDataExportOrder from "./EditRowDataExportOrder";

const RowDataExportOrderManual = ({ data, index, deleteRowData, updateRowData }) => {

    const [isShowEditRowData, setIsShowEditRowData] = useState(false);

    const [goodsId, setGoodsId] = useState();
    const [goodsCode, setGoodsCode] = useState();
    const [importOrderDetailId, setImportOrderDetail] = useState();
    const [batchCode, setBatchCode] = useState();
    const [quantity, setQuantity] = useState();
    const [costPrice, setCostPrice] = useState();

    useEffect(() => {

        // // Tính tổng số lượng
        // const totalQuantity = data.reduce((total, item) => total + item.quantity, 0);

        // // Thiết lập tổng số lượng
        // setQuantity(totalQuantity);
        setGoodsCode(data.goodsCode);
        setGoodsId(data.goodsId);
        setImportOrderDetail(data.importOrderDetailId);
        setCostPrice(data.costPrice);
        setQuantity(data.quantity);
        setBatchCode(data.batchCode);
    }, [data])

    const handleEditRowData = () => {
        setIsShowEditRowData(true);
    }

    const handleDeleteRowData = () => {
        deleteRowData(index);
    }

    const dataAfterEdit = (data) => {
        setQuantity(data.quantity);
        setCostPrice(data.costPrice);
        updateRowData(index, {
            batchCode: data.batchCode,
            costPrice: 0, quantity: data.quantity,
            goodsId: goodsId,
            goodsCode: goodsCode,
            importOrderDetailId: data.importOrderDetailId
        })
    }



    return (<><Row>

        <Col md={3}>
            <div className="form-group mb-3">
                <label >Mã lô hàng</label>
                <input type="text" className="form-control" defaultValue={batchCode} disabled />
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
                <input type="number" className="form-control" defaultValue={quantity} disabled />
            </div>
        </Col>


        {/* <Col md={1}>
            <div className="form-group mb-3 ButtonCSSDropdown">
                <button
                    className="btn btn-success border-left-0 rounded mt-4"
                    type="button"
                    onClick={() => handleEditRowData(data)}
                >
                    Sửa
                </button>
            </div>
        </Col> */}

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

        <EditRowDataExportOrder isShow={isShowEditRowData} handleClose={() => setIsShowEditRowData(false)} data={data} dataAfterEdit={dataAfterEdit} />
    </>)
}


export default RowDataExportOrderManual