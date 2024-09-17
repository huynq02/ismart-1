import { useEffect, useState } from "react";
import { Modal, Button, Col, Row } from "react-bootstrap";
import { toast } from 'react-toastify';
import { getBatchByBatchCode, updateInventoryCheck } from "~/services/StockTakeServices";
import { fetchAllStorages } from "~/services/StorageServices";
import axios from 'axios'; // import axios nếu chưa được import


const ConfirmStockTake = ({ isShow, handleClose, dataStock, updateTableStock }) => {
    const [totalStockTake, setTotalStockTake] = useState([]);
    const [totalWarehouse, setTotalWarehouse] = useState([]);
    const [isShowDetailProduct, setIsShowDetailProduct] = useState(false);
    const [detailShipment, setDetailShipment] = useState([]);

    const date = new Date(dataStock.checkDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

    useEffect(() => {
        setTotalStockTake(dataStock.inventoryCheckDetails);
        getAllStorages();
        if (dataStock.inventoryCheckDetails) {
            fetchOldActualQuantities(dataStock.inventoryCheckDetails);
        }
    }, [dataStock]);

    const getAllStorages = async () => {
        let res = await fetchAllStorages();
        setTotalWarehouse(res);
    }

    const fetchOldActualQuantities = async (inventoryCheckDetails) => {
        const updatedDetails = await Promise.all(
            inventoryCheckDetails.map(async (detail) => {
                const batchCode = detail.batchDetails[0].batchCode;
                const response = await getBatchByBatchCode(batchCode);
                console.log("response.actualQuantity", response.actualQuantity)
                const oldActualQuantity = response.actualQuantity; // Giả định cấu trúc trả về từ API
                return {
                    ...detail,
                    batchDetails: [{
                        ...detail.batchDetails[0],
                        oldActualQuantity: oldActualQuantity
                    }]
                };
            })
        );
        console.log("updatedDetails", updatedDetails);
        const groupedUpdatedStockTake = updatedDetails.reduce((acc, item) => {
            if (!acc[item.goodCode]) {
                acc[item.goodCode] = {
                    ...item,
                    oldActualQuantity: 0,
                    totalActualQuantity: 0,
                    batchDetails: []
                };
            }

            acc[item.goodCode].oldActualQuantity += item.batchDetails[0].oldActualQuantity;
            acc[item.goodCode].totalActualQuantity += item.actualQuantity;
            acc[item.goodCode].batchDetails.push(...item.batchDetails);

            return acc;
        }, {});
        const finalStockTake = Object.values(groupedUpdatedStockTake);
        console.log("finalStockTake", finalStockTake)
        setTotalStockTake(finalStockTake);
    };

    const handleCloseModal = () => {
        handleClose();
    }

    const warehouse = totalWarehouse.find(wh => wh.warehouseId === dataStock.warehouseId);

    const SaveAddStockTake = async () => {
        const convertTotalStockTake = (totalStockTake) => {
            const convertedData = {};
        
            totalStockTake.forEach(item => {
                item.batchDetails.forEach(batch => {
                    convertedData[batch.batchCode] = batch.actualQuantity;
                });
            });
        
            return convertedData;
        };
        
        
        const convertedBatchData = convertTotalStockTake(totalStockTake);
        console.log("totalStockTake",totalStockTake);
        console.log("id",dataStock.inventoryCheckId);
        console.log("convertedbatchdata",convertedBatchData);
        const res = await updateInventoryCheck(dataStock.inventoryCheckId, convertedBatchData);

        if (res.message === 'Cập nhật số lượng batch thành công.') {
            toast.success("Xác nhận kiểm kê thành công");
            updateTableStock(dataStock.warehouseId);
            handleClose();
        } else {
            toast.warning("Xác nhận kiểm kê thất bại");
        }
    }

    return (<>
        <Modal show={isShow} onHide={handleCloseModal} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Xác nhận kiểm kê</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="body-add-new">
                    <Row>
                        <Col md={3}>
                            <div className="form-group mb-3">
                                <label >Kho hàng</label>
                                <br />
                                <button type="button" className="btn btn-success border-left-0 rounded ButtonCSS" >{warehouse ? warehouse.warehouseName : "Kho không tồn tại"}</button>
                            </div>
                        </Col>

                        <Col md={3}>
                            <div className="form-group mb-3">
                                <label >Ngày kiểm tra</label>
                                <button type="button" className="btn btn-success border-left-0 rounded ButtonCSS" >{formattedDate}</button>
                            </div>
                        </Col><Col md={3}>
                            <div className="form-group mb-3">
                                <label >Tình trạng</label>
                                <button type="button" className="btn btn-success border-left-0 rounded ButtonCSS" >{dataStock.status == "On Progress" ? "Đang tiến hành" : dataStock.status == "Completed" ? "Đã hoàn thành" : "Đã hủy"}</button>
                            </div>
                        </Col>
                    </Row>
                    {totalStockTake && totalStockTake.length > 0
                        && totalStockTake.map((o, index) => (

                            <Row key={`stockTake${index}`}>
                                <Col >
                                    <label >Mã hàng hóa</label>
                                    <input type="text" className="form-control inputCSS" value={o.goodCode} readOnly />
                                </Col>
                                {/* <Col >
                                    <label >Mã lô hàng</label>
                                    <input type="text" className="form-control inputCSS" value={o.batchDetails[0].batchCode} readOnly />
                                </Col> */}
                                <Col >
                                    <label >SL trên hệ thống</label>
                                    <input type="number" className="form-control inputCSS" value={o.oldActualQuantity} readOnly />

                                </Col>
                                <Col > <label >Số lượng thực tế</label>
                                    <input type="text" className="form-control inputCSS" value={o.totalActualQuantity} readOnly />
                                </Col>
                                {/* <Col> <label >Ghi chú</label>
                                    <input type="text" className="form-control inputCSS" value={o.note} readOnly />
                                </Col> */}
                            </Row>
                        ))
                    }
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" className="ButtonCSS" onClick={SaveAddStockTake}>
                    Xác nhận
                </Button>
            </Modal.Footer>
        </Modal >
    </>)
}

export default ConfirmStockTake;
