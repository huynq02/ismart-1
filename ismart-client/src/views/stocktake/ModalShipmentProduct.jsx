import { useEffect, useState } from "react";
import { Modal, Button, Col, Row } from "react-bootstrap";
import { formatDate, formattedAmount } from '~/validate';
import { toast } from 'react-toastify';
import { getAvailableBatch } from "~/services/ImportOrderDetailServices";
import { getBatchByBatchCode } from "~/services/StockTakeServices";

const ModalShipmentProduct = ({ isShow, handleClose, detailShipment, warehouseId }) => {

    const [totalShipment, setTotalShipment] = useState([]);
    const [batch, setBatch] = useState([]);

    useEffect(() => {
        if (detailShipment && detailShipment.batchDetails) {
            getTotalShipment();
        }
    }, [detailShipment]);

    useEffect(() => {
        setTotalShipment(detailShipment);
    }, [])


    const getTotalShipment = async () => {
        // let res = await fetchAllGoodsInWarehouse(detailData.warehouseId);
        // if (detailData && Array.isArray(detailData.inventoryCheckDetails)) {
        //     // Nhóm các đối tượng có cùng goodCode và gộp lại
        //     const groupedDetails = detailData.inventoryCheckDetails.reduce((acc, item) => {
        //         if (!acc[item.goodCode]) {
        //             acc[item.goodCode] = { ...item, quantity: item.quantity || 0 };
        //         } else {
        //             acc[item.goodCode].quantity += item.quantity || 0;
        //         }
        //         return acc;
        //     }, {});

        //     const mergedDetails = Object.values(groupedDetails);
        //     const goodCodes = mergedDetails.map(detail => detail.goodCode);

        //     const goodIds = res
        //         .filter(item => goodCodes.includes(item.goodsCode)) // Lọc các đối tượng có goodCode trùng khớp
        //         .map(item => item.goodsId);

        //     const promises = goodIds.map(goodId => getAvailableBatch(detailData.warehouseId, goodId));
        //     const results = await Promise.all(promises);
        //     console.log("getAvailableBatch", results);

        //     // Tạo bản đồ để tra cứu totalsActualPerArray theo goodCode
        //     const totalsActualPerMap = goodCodes.reduce((acc, code, index) => {
        //         acc[code] = results[index].reduce((total, item) => total + (item.actualQuantity || 0), 0);
        //         return acc;
        //     }, {});

        const updatedStockTakePromises = detailShipment.batchDetails.map(async (batch) => {
            // Lấy batchCode từ batch
            const batchCode = batch.batchCode;
            // Gọi API getBatchByBatchCode để lấy actualQuantity
            const response = await getBatchByBatchCode(batchCode);
            const oldActualQuantity = response.actualQuantity;

            return {
                ...batch,
                batchCode: batchCode,
                oldActualQuantity: oldActualQuantity || 0
            };
        });

        const updatedStockTake = await Promise.all(updatedStockTakePromises);
        setBatch(updatedStockTake);
        console.log("updatedStockTake", updatedStockTake);
        // }
    }

    const handleCloseModal = () => {
        handleClose();
    }
    return (<>
        <Modal show={isShow} onHide={handleCloseModal} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Thông tin chi tiết lô hàng của sản phẩm {detailShipment.goodCode}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="body-add-new">
                    {/* <Row>
                        <Col md={2}>
                            <div className="form-group mb-3">
                                <label >Kho hàng</label>
                                <button type="button" className="btn btn-success border-left-0 rounded ButtonCSS" >{detailData.warehouseId}</button>
                            </div>
                        </Col>

                        <Col md={2}>
                            <div className="form-group mb-3">
                                <label >Ngày kiểm tra</label>
                                <button type="button" className="btn btn-success border-left-0 rounded ButtonCSS" >{detailData.checkDate}</button>
                            </div>
                        </Col>

                        <Col md={2}>

                        </Col>

                        <Col md={3}>
                            <div className="form-group mb-3">
                                <label >Tình trạng</label>
                                <button type="button" className="btn btn-success border-left-0 rounded ButtonCSS" >{detailData.status == "On Progress" ? "Đang tiến hành" : detailData.statusType == "Completed" ? "Đã hoàn thành" : "Đã hủy"}</button>
                            </div>
                        </Col>
                    </Row> */}


                    {batch && batch.length > 0
                        && batch.map((o, index) => (

                            <Row key={`shipment${index}`}>
                                <Col >

                                    <label >Mã lô hàng</label>
                                    <input type="text" className="form-control inputCSS" value={o.batchCode} readOnly />

                                </Col>
                                <Col >

                                    <label >SL trên hệ thống</label>
                                    <input type="number" className="form-control inputCSS" value={o.oldActualQuantity} readOnly />

                                </Col>

                                <Col > <label >Số lượng thực tế</label>
                                    <input type="text" className="form-control inputCSS" value={o.actualQuantity} readOnly />
                                </Col>
                                <Col > <label >Ghi chú</label>  
                                    <input type="text" className="form-control inputCSS" value={o.note} readOnly />
                                </Col>

                                {/* <Col > <label >Ngày sản xuất</label>
                                    <input type="text" className="form-control inputCSS" value={o.manufactureDate} readOnly />
                                </Col>

                                <Col > <label >Ngày hết hạn</label>
                                    <input type="text" className="form-control inputCSS" value={o.expiryDate} readOnly />
                                </Col> */}

                            </Row>
                        ))
                    }

                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" className=" ButtonRed" onClick={handleCloseModal}>
                    Đóng
                </Button>
            </Modal.Footer>
        </Modal >
    </>)
}

export default ModalShipmentProduct;