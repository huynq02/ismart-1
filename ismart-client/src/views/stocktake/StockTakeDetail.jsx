
import { useEffect, useState } from "react";
import { Modal, Button, Col, Row } from "react-bootstrap";
import { formatDate, formattedAmount } from '~/validate';
import { toast } from 'react-toastify';
import { fetchAllStorages } from "~/services/StorageServices";

import ModalShipmentProduct from "./ModalShipmentProduct";
import { getAvailableBatch } from "~/services/ImportOrderDetailServices";
import { fetchAllGoodsInWarehouse } from "~/services/GoodServices";
import { getBatchByBatchCode } from "~/services/StockTakeServices";


const StockTakeDetail = ({ handleClose, isShow, detailData }) => {
    const [totalStockTake, setTotalStockTake] = useState([]);
    const [totalWarehouse, setTotalWarehouse] = useState([]);
    const [isShowDetailProduct, setIsShowDetailProduct] = useState(false);
    const [detailShipment, setDetailShipment] = useState([]);

    const [totalGoods, setTotalGoods] = useState([]);
    const [totalActualQuantity, setTotalActualQuantity] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState('');

    const date = new Date(detailData.checkDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

    useEffect(() => {
        setTotalStockTake(detailData.inventoryCheckDetails);
        //getAllGoods();
        getAllStorages();
        getAllBatch();
    }, [detailData])

    const getAllStorages = async () => {
        let res = await fetchAllStorages();
        setTotalWarehouse(res);
    }

    const getAllBatch = async () => {
        if (detailData.warehouseId !== null) {
            let res = await fetchAllGoodsInWarehouse(detailData.warehouseId);
            if (detailData && Array.isArray(detailData.inventoryCheckDetails)) {
                // Nhóm các đối tượng có cùng goodCode và gộp lại
                const groupedDetails = detailData.inventoryCheckDetails.reduce((acc, item) => {
                    if (!acc[item.goodCode]) {
                        acc[item.goodCode] = { ...item, quantity: item.quantity || 0 };
                    } else {
                        acc[item.goodCode].quantity += item.quantity || 0;
                    }
                    return acc;
                }, {});

                const mergedDetails = Object.values(groupedDetails);
                const goodCodes = mergedDetails.map(detail => detail.goodCode);

                const goodIds = res
                    .filter(item => goodCodes.includes(item.goodsCode)) // Lọc các đối tượng có goodCode trùng khớp
                    .map(item => item.goodsId);

                const promises = goodIds.map(goodId => getAvailableBatch(detailData.warehouseId, goodId));
                const results = await Promise.all(promises);
                console.log("getAvailableBatch", results);

                // Tạo bản đồ để tra cứu totalsActualPerArray theo goodCode
                const totalsActualPerMap = goodCodes.reduce((acc, code, index) => {
                    acc[code] = results[index].reduce((total, item) => total + (item.actualQuantity || 0), 0);
                    return acc;
                }, {});

                // Tạo updatedStockTake với totalActualQuantity từ totalsActualPerMap
                const updatedStockTakePromises = detailData.inventoryCheckDetails.map(async (item) => {
                    const totalActualQuantity = totalsActualPerMap[item.goodCode] || 0;

                    // Lấy batchCode từ item
                    const batchCode = item.batchDetails[0].batchCode;

                    // Gọi API getBatchByBatchCode để lấy actualQuantity
                    const response = await getBatchByBatchCode(batchCode);
                    const oldActualQuantity = response.actualQuantity;
                    return {
                        ...item,
                        totalActualQuantity,
                        oldActualQuantity: oldActualQuantity || 0
                    };
                });

                const updatedStockTake = await Promise.all(updatedStockTakePromises);
                console.log("updatedStockTake", updatedStockTake);

                const groupedUpdatedStockTake = updatedStockTake.reduce((acc, item) => {
                    if (!acc[item.goodCode]) {
                        acc[item.goodCode] = {
                            ...item,
                            oldActualQuantity: 0,
                            totalActualQuantity: 0,
                            batchDetails: []
                        };
                    }

                    acc[item.goodCode].oldActualQuantity += item.oldActualQuantity;
                    acc[item.goodCode].totalActualQuantity += item.actualQuantity;
                    acc[item.goodCode].batchDetails.push(...item.batchDetails);

                    return acc;
                }, {});
                const finalStockTake = Object.values(groupedUpdatedStockTake);
                setTotalStockTake(finalStockTake);
                console.log("finalStockTake", finalStockTake)
                // Lấy totalsActualPerArray từ updatedStockTake
                const totalsActualPerArray = updatedStockTake.map(item => item.totalActualQuantity);
                setTotalActualQuantity(totalsActualPerArray);
            }
        }
    }


    const handleCloseModal = () => {
        handleClose();
    }

    const warehouse = totalWarehouse.find(wh => wh.warehouseId === detailData.warehouseId);

    const handleShowDetail = (data) => {
        setIsShowDetailProduct(true);
        console.log("datadatadatadata", data);
        setDetailShipment(data);
    }

    return (<>
        <Modal show={isShow} onHide={handleCloseModal} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Thông tin chi tiết đơn kiểm kê</Modal.Title>
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
                                    <label >SL hệ thống</label>
                                    <input type="number" className="form-control inputCSS" value={o.oldActualQuantity} readOnly />
                                </Col>
                                <Col >
                                    <label >SLTT thay đổi</label>
                                    <input type="text" className="form-control inputCSS" value={o.totalActualQuantity} readOnly />
                                </Col>
                                {/* 
                                <Col> <label >Ghi chú</label>
                                    <input type="text" className="form-control inputCSS" value={o.note} readOnly />
                                </Col> */}

                                <Col md={2}>
                                    <label ></label><br />
                                    <button type="button" className="btn btn-success border-left-0 rounded ButtonCSS" onClick={() => handleShowDetail(o)}>
                                        <i className="fa-solid fa-circle-info actionButtonCSS" title="Chi tiết"></i>
                                    </button>
                                </Col>
                            </Row>
                        ))
                    }
                    <br />
                    <label >*SLTT: Số lượng thực tế</label><br />
                    <label >*SL: Số lượng</label>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" className=" ButtonRed" onClick={handleClose}>
                    Đóng
                </Button>
            </Modal.Footer>
        </Modal >

        <ModalShipmentProduct isShow={isShowDetailProduct} handleClose={() => setIsShowDetailProduct(false)}
            detailShipment={detailShipment} warehouseId={detailData.warehouseId} />
    </>)
}

export default StockTakeDetail