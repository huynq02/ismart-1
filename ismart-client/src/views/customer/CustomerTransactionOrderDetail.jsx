import React, { useEffect, useState } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';

import { getExportOrderDetailByExportId } from "~/services/ExportOrderDetailService";

const ModelCusTranOrderDetail = ({ isShow, handleClose, dataOrderDetail }) => {
    const [dataDetail, setDataDetail] = useState({});

    useEffect(() => {
        showExportOrderDetail();
    }, [dataOrderDetail]);

    const showExportOrderDetail = async () => {
        let res = await getExportOrderDetailByExportId(dataOrderDetail.exportId);

        setDataDetail(res);
        // console.log("dataOrderDetail.detailId", res);
    }
    return (
        <>
            <Modal show={isShow} onHide={handleClose} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Chi tiết sản phẩm <br />
                        <span style={{ color: "green" }}>Mã hàng hóa:&nbsp;{dataOrderDetail.exportCode}
                        </span>
                    </Modal.Title>

                </Modal.Header>
                <Modal.Body>
                    <Table className="table text-center table-border table-hover  border-primary table-sm " style={{ maxHeight: '200px', overflow: 'auto' }}>
                        <thead className='sticky-top' style={{ zIndex: 5 }}>
                            <tr>
                                <th className="align-middle text-nowrap">Mã sản phẩm</th>
                                <th className="align-middle text-nowrap">Số lượng</th>

                            </tr>
                        </thead>
                        <tbody>
                            {dataDetail && dataDetail.length > 0 &&
                                dataDetail.map((o, index) => (
                                    <tr style={{ backgroundColor: index % 2 === 0 ? "red" : "blue" }} >
                                        <td className="align-middle text-color-primary">{o.goodsCode}</td>
                                        <td className="align-middle text-color-primary">{o.quantity}</td>


                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                </Modal.Body>

                <Modal.Footer>

                </Modal.Footer>
            </Modal>
        </>
    );
}
export default ModelCusTranOrderDetail;
