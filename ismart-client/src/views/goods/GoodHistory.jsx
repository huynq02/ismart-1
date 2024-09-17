import { useEffect, useState } from "react";
import { Modal, Button, Table } from "react-bootstrap"
import { fetchHistoryGood } from "~/services/GoodServices";
import { formatDate } from "~/validate";
import { getAvailableBatch } from "~/services/ImportOrderDetailServices";
import { getUserIdWarehouse } from '~/services/UserWarehouseServices';



const ModalGoodHistory = ({ isShow, dataGood, handleClose, warehouseId }) => {
    const userId = parseInt(localStorage.getItem('userId'), 10);
    const roleId = parseInt(localStorage.getItem('roleId'), 10);
    const [goodHistory, setGoodHistory] = useState([]);


    useEffect(() => {
        getHistoryGood();
    }, [warehouseId, dataGood.goodsId])

    const getWarehouseById = async (userId) => {
        let res = await getUserIdWarehouse(userId);
        return res[0];
    }
    const getHistoryGood = async () => {
        if (roleId === 1) {
            let res = await getAvailableBatch(warehouseId, dataGood.goodsId);

            setGoodHistory(res);
        } else if (roleId === 2 || roleId === 3 || roleId === 4) {
            let warehouse = await getWarehouseById(userId);

            let res = await getAvailableBatch(warehouse.warehouseId, dataGood.goodsId);

            setGoodHistory(res);
        }
    }
    const handleCloseModal = () => {
        handleClose();
    }


    const handleReset = () => {


    }






    return (
        <>
            <Modal show={isShow} onHide={handleCloseModal} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Lịch sử tồn hàng  <br /><span style={{ color: "green" }}>Hàng: {dataGood.goodsName}</span></Modal.Title>


                </Modal.Header>
                <Modal.Body>
                    <Table className="table text-center table-border table-hover  border-primary table-sm " style={{ maxHeight: '200px', overflow: 'auto' }}>
                        <thead className='sticky-top' style={{ zIndex: 5 }}>
                            <tr>
                                <th className="align-middle text-nowrap">Mã lô hàng</th>
                                <th className="align-middle text-nowrap">Số lượng</th>
                                {/* <th className="align-middle text-nowrap">Ngày nhập lô</th> */}
                                <th className="align-middle text-nowrap">Ngày sản xuất</th>
                                <th className="align-middle text-nowrap">Ngày hết hạn</th>
                            </tr>
                        </thead>
                        <tbody>
                            {goodHistory && goodHistory.length > 0 &&
                                goodHistory.map((g, index) => (
                                    <tr style={{ backgroundColor: index % 2 === 0 ? "red" : "blue" }} key={`goodHistory${index}`} >
                                        <td className="align-middle text-color-primary">{g.batchCode}</td>
                                        <td className="align-middle text-color-primary">{g.actualQuantity}</td>
                                        {/* <td className="align-middle text-color-primary">{formatDate(g.importDate)}</td> */}
                                        <td className="align-middle text-color-primary">{formatDate(g.manufactureDate)}</td>
                                        <td className="align-middle text-color-primary">{formatDate(g.expiryDate)}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                </Modal.Body>


                <Modal.Footer>


                </Modal.Footer>
            </Modal>
        </>)
}


export default ModalGoodHistory





