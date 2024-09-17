import { useEffect, useState } from "react";
import { Modal, Button, Col, Row } from "react-bootstrap";
import { addSuccessFullImportOrder } from "~/services/ImportOrderServices";
import { updateImportOrder } from "~/services/ImportOrderServices";
import { getImportOrderDetailByImportId } from "~/services/ImportOrderDetailServices";
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

const ConfirmImportOrder = ({ isShow, handleClose, dataImportOrder, updateTable }) => {
    const [totalOrderDetail, setTotalOrderDetail] = useState([]);
    const userId = parseInt(localStorage.getItem('userId'), 10);
    const importOrderId = localStorage.getItem('importOrderId'); // Lấy importOrderId từ localStorage
    
    useEffect(() => {
        if (dataImportOrder.importId) {
            // console.log("dataImportOrder.importId:", dataImportOrder.importId);
            getTotalOrderDetail(dataImportOrder.importId);
        }
    }, [dataImportOrder])

    useEffect(() => {
        if (importOrderId) {
            getTotalOrderDetail(importOrderId);
        }
    }, [importOrderId]);

    const handleCloseModal = () => {
        handleClose();
    }

    const getTotalOrderDetail = async (importId) => {
        let res = await getImportOrderDetailByImportId(importId);
        // console.log("r1: ", res);

        setTotalOrderDetail(res);
    }

    const SaveAddImportOrder = async () => {
        let resSuccessImportOrder = await updateImportOrder(dataImportOrder.importId, dataImportOrder.userId, dataImportOrder.supplierId, dataImportOrder.totalCost, "", dataImportOrder.createdDate, dataImportOrder.importedDate, 3, dataImportOrder.importCode, dataImportOrder.storageId, dataImportOrder.deliveryId, dataImportOrder.image, userId);
        let res = await addSuccessFullImportOrder(dataImportOrder.importId);
        // console.log("dataImportOrder.importId:", dataImportOrder.importId);
        toast.success("Xác nhận nhập kho thành công");
        updateTable();
        handleClose();
    }


    return (<>
        <Modal show={isShow} onHide={handleCloseModal} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Xác nhận lô hàng nhập kho</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="body-add-new">
                    <Row>
                        <Col md={2}>
                            <div className="form-group mb-3">
                                <label >Kho hàng</label>
                                <button type="button" className="btn btn-success border-left-0 rounded ButtonCSS" >{dataImportOrder.storageName}</button>
                            </div>
                        </Col>

                        <Col md={2}>
                            <div className="form-group mb-3">
                                <label >Nhà cung cấp</label>
                                <button type="button" className="btn btn-success border-left-0 rounded ButtonCSS" >{dataImportOrder.supplierName}</button>
                            </div>
                        </Col>

                        {/* <Col md={3}>
                            <div className="form-group mb-3">
                                <label >Tổng giá trị đơn hàng</label>
                                <button type="button" className="btn btn-success border-left-0 rounded ButtonCSS" >{dataImportOrder.totalCost}</button>
                            </div>
                        </Col> */}
                    </Row>


                    {totalOrderDetail && totalOrderDetail.length > 0
                        && totalOrderDetail.map((o, index) => (

                            <Row key={`orderDetail${index}`}>
                                <Col >

                                    <label >Mã hàng hóa</label>
                                    <input type="text" className="form-control inputCSS" value={o.goodsCode} readOnly />

                                </Col>
                                <Col >

                                    <label >Số lượng</label>
                                    <input type="number" className="form-control inputCSS" value={o.quantity} readOnly />

                                </Col>

                            </Row>
                        ))
                    }

                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" className=" ButtonRed" onClick={SaveAddImportOrder}>
                    Xác nhận nhập kho
                </Button>
            </Modal.Footer>
        </Modal >
    </>)
}


export default ConfirmImportOrder