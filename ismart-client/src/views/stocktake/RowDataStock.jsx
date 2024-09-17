import { useState, useEffect } from "react";
import { Row, Col, Dropdown, Modal, Button, Table } from "react-bootstrap";
import { CustomToggle, CustomMenu } from "../components/others/Dropdown";
import { toast } from "react-toastify";
import EditRowDataStock from "./EditRowDataStock";



const RowDataStock = ({ data, index, deleteRowData, updateRowData }) => {
    const [isShowEditRowData, setIsShowEditRowData] = useState(false);

    const [goodsId, setGoodsId] = useState();
    const [goodsCode, setGoodsCode] = useState();
    const [importOrderDetailId, setImportOrderDetail] = useState();
    const [batchCode, setBatchCode] = useState();
    const [quantity, setQuantity] = useState();
    const [actualQuantity, setActualQuantity] = useState();
    const [oldActualQuantity, setOldActualQuantity] = useState();
    const [note, setNote] = useState();
    const [odata, setOData] = useState([])


    useEffect(() => {
        console.log("rowdata", data)
        setGoodsCode(data.goodsCode);
        setGoodsId(data.goodsId);
        setImportOrderDetail(data.importOrderDetailId);
        setBatchCode(data.batchDetails[0].batchCode);
        setActualQuantity(data.batchDetails[0].actualQuantity);
        setOldActualQuantity(data.batchDetails[0].oldActualQuantity);
        setNote(data.batchDetails[0].note);
        // if (Array.isArray(data)) {
        //     setOData(data);
        // } else {
        //     setOData(Object.values(data));
        // }
        console.log("data: ", data);
    }, [data])

    const handleEditRowData = () => {
        setIsShowEditRowData(true);
    }

    const handleDeleteRowData = () => {
        deleteRowData(index);
    }

    const dataAfterEdit = (editedData) => {
        console.log("editedData", editedData)
        setActualQuantity(editedData.actualQuantity);
        setNote(editedData.note)
        updateRowData(index, {
            ...data,
            batchDetails: [
                {
                    batchCode: batchCode,
                    oldActualQuantity: oldActualQuantity,
                    actualQuantity: editedData.actualQuantity || actualQuantity,
                    note: editedData.note || note
                }
            ]
        });
    };


    return (<>
        <Row>
            <Col md={3}>
                <div className="form-group mb-3">
                    <label >Mã lô hàng</label>
                    <input type="text" className="form-control" defaultValue={batchCode} disabled />
                </div>
            </Col>

            <Col md={3}>
                <div className="form-group mb-3">
                    <label >SL trên hệ thống</label>
                    <input type="number" className="form-control" defaultValue={oldActualQuantity} disabled />
                </div>
            </Col>

            <Col md={2}>
                <div className="form-group mb-3">
                    <label >SL thực tế</label>
                    <input type="number" className="form-control" defaultValue={actualQuantity} disabled />
                </div>
            </Col>

            <Col md={2}>
                <div className="form-group mb-3">
                    <label >Ghi chú</label>
                    <input type="text" className="form-control" defaultValue={note} disabled />
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
        <EditRowDataStock isShow={isShowEditRowData} handleClose={() => setIsShowEditRowData(false)} data={data} dataAfterEdit={dataAfterEdit} />
    </>)
}




export default RowDataStock











