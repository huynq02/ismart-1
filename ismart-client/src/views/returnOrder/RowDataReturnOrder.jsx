import { useEffect, useState } from "react";
import { Row, Col, Dropdown } from "react-bootstrap";
import EditRowDataReturnOrder from './EditRowDataReturnOrder';


const RowDataReturnOrderManual = ({ data, index, deleteRowData, updateRowData }) => {

    const [isShowEditRowData, setIsShowEditRowData] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(null);
    const [orderData, setOrderData] = useState([]);
    const [odata, setOData] = useState([])

    const [goodsCode, setGoodsCode] = useState();
    const [quantity, setQuantity] = useState();
    const [batchCode, setBatchCode] = useState();
    const [reason, setReason] = useState();


    useEffect(() => {
        setGoodsCode(data.goodsCode);
        setQuantity(data.quantity);
        setBatchCode(data.batchCode);
        setReason(data.reason);
    }, [data])
    // useEffect(() => {
    //     // Kiểm tra và chuyển đổi dữ liệu thành mảng nếu cần thiết
    //     if (Array.isArray(data)) {
    //         setOData(data);
    //     } else {
    //         setOData(Object.values(data));
    //     }
    //     console.log("RowDataReturnOrderManual: ", data);
    // }, [data]);

    const handleEditRowData = (item, index) => {
        setOrderData(item);
        setCurrentIndex(index);
        setIsShowEditRowData(true);
    };

    const handleDeleteRowData = () => {
        deleteRowData(index);
    }

    const dataAfterEdit = (updatedData) => {
        console.log(updatedData);
        const newData = [...odata];
        newData[currentIndex] = {
            ...newData[currentIndex],
            ...updatedData
        };
        setOData(newData);
        updateRowData(index, newData);
        setIsShowEditRowData(false);
    };

    return (
        <>
            <Row>

                {/* {odata && odata.length > 0 && ( */}
                <Row className="mb-3">
                    <Col md={3}>
                        <label>Mã Sản phẩm</label>
                    </Col>
                    <Col md={2}>
                        <label>Số lượng</label>
                    </Col>
                    <Col md={2}>
                        <label>Lô hàng</label>
                    </Col>
                    <Col md={2}>
                        <label>Lý do</label>
                    </Col>
                    <Col md={1}></Col> {/* Cột cho nút Sửa */}
                    <Col md={1}></Col> {/* Cột cho nút Xóa */}
                </Row>
                {/* )} */}
                {/* {odata && odata.length > 0 && odata.map((item, index) => ( */}
                {/* <Row key={index} className="mb-3"> */}
                <Row className="mb-3">
                    <Col md={3}>
                        <div className="form-group mb-3">
                            <input type="text" className="form-control" defaultValue={goodsCode} disabled />
                        </div>
                    </Col>

                    <Col md={2}>
                        <div className="form-group mb-3">
                            <input type="number" className="form-control" value={quantity} disabled />
                        </div>
                    </Col>
                    <Col md={2}>
                        <div className="form-group mb-3">
                            <input type="text" className="form-control" defaultValue={batchCode} disabled />
                        </div>
                    </Col>
                    <Col md={2}>
                        <div className="form-group mb-3">
                            <input type="text" className="form-control" value={reason} disabled />
                        </div>
                    </Col>
                    {/* <Col md={1}>
                        <div className="form-group mb-3 ButtonCSSDropdown">
                            <button
                                className="btn btn-success border-left-0 rounded "
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
                                className="btn btn-danger border-left-0 rounded "
                                type="button"
                                onClick={() => handleDeleteRowData(data)}
                            >
                                Xóa
                            </button>
                        </div>
                    </Col>
                </Row>
                {/* ))} */}





            </Row>
            <EditRowDataReturnOrder isShow={isShowEditRowData} handleClose={() => setIsShowEditRowData(false)} data={orderData} dataAfterEdit={dataAfterEdit} />
        </>
    )
}


export default RowDataReturnOrderManual