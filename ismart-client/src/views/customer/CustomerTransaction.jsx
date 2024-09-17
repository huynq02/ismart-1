import React, { useEffect, useState } from 'react';
import { getCustomerTransaction } from '../../services/CustomerServices';
import { Modal, Button, Table } from 'react-bootstrap';
import { formatDate } from "~/validate";
import ModelCusTranOrderDetail from './CustomerTransactionOrderDetail';

const ModelCustomerTransaction = ({ isShow, handleClose, dataTransaction }) => {
    const [transaction, setTransaction] = useState([]);

    const [dataOrderDetail, setDataOrderDetail] = useState({});
    const [isShowModelOrderDetail, setIsShowModeOrderDetail] = useState(false);

    useEffect(() => {
        if (dataTransaction) {
            getCusTransaction();
        }
    }, [dataTransaction]);

    const getCusTransaction = async () => {
        let res = await getCustomerTransaction(dataTransaction.customerId);
        // console.log(res);
        setTransaction(res);
    };

    const handleExportOrderDetail = (exportId) => {
        setIsShowModeOrderDetail(true);
        setDataOrderDetail(exportId);

    }
    const handleCloseModal = () => {
        handleClose();
    }
    return (<>
        <Modal show={isShow} onHide={handleCloseModal} size="xl">
            <Modal.Header closeButton>
                <Modal.Title>Lịch sử giao dịch <br />
                    <span style={{ color: "green" }} > Tên khách hàng:&nbsp;{dataTransaction.customerName}
                    </span>
                </Modal.Title>

            </Modal.Header>
            <Modal.Body>
                <Table className="table text-center table-border table-hover  border-primary table-sm " style={{ maxHeight: '200px', overflow: 'auto' }}>
                    <thead className='sticky-top' style={{ zIndex: 5 }}>
                        <tr>
                            <th className="align-middle text-nowrap">Mã đơn hàng</th>
                            <th className="align-middle text-nowrap">Nhân viên</th>
                            <th className="align-middle textColor text-nowrap">Vận chuyển</th>
                            <th className="align-middle text-nowrap">Ngày tạo</th>
                            <th className="align-middle text-nowrap">Ngày xuất</th>
                            <th className="align-middle text-nowrap">Kho xuất</th>
                            <th className="align-middle text-nowrap">Chi tiết đơn hàng</th>
                            {/* <th className="align-middle text-nowrap">Ngày ghi nhận</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {transaction && transaction.length > 0 &&
                            transaction.map((t, index) => (
                                <tr style={{ backgroundColor: index % 2 === 0 ? "red" : "blue" }} key={`goodHistory${index}`} >
                                    <td className="align-middle text-color-primary">{t.exportCode}</td>
                                    <td className="align-middle text-color-primary">{t.userName}</td>
                                    <td className="align-middle text-color-primary">{t.deliveryName}</td>
                                    <td className="align-middle text-color-primary">{formatDate(t.createdDate)}</td>
                                    <td className="align-middle text-color-primary">{formatDate(t.exportedDate)}</td>
                                    <td className="align-middle text-color-primary">{t.warehouseName}</td>
                                    <td className="align-middle text-color-primary" >
                                        <div className="col-auto ButtonCSSDropdown" >
                                            <button
                                                className="btn btn-success border-left-0 rounded"
                                                type="button"
                                                onClick={() => handleExportOrderDetail(t)}
                                            >
                                                Chi tiết
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </Modal.Body>

            <Modal.Footer>

            </Modal.Footer>
        </Modal>

        <ModelCusTranOrderDetail isShow={isShowModelOrderDetail}
            handleClose={() => setIsShowModeOrderDetail(false)}
            dataOrderDetail={dataOrderDetail}
        />
    </>
    )


}
export default ModelCustomerTransaction;