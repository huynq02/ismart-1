import { useEffect } from 'react';
import { usePDF } from 'react-to-pdf';
import React from 'react';
import { useRef } from 'react';
import { Table, Dropdown, DropdownButton, Col, Row } from 'react-bootstrap';
const ExportPDF = ({ isPDF, handleClose, dataModalCheckout }) => {
    const { toPDF, targetRef } = usePDF({ filename: `bao_cao_ton_kho.pdf` });


    useEffect(() => {
        if (isPDF) {
            toPDF();
            handleClose();
        }
    }, [isPDF, handleClose]);
    return (<>
        <div ref={targetRef} style={{ position: 'absolute', left: '-9999px' }}>
            <Table className="table text-center table-border table-hover border-primary table-sm">
                <thead>
                    <tr>
                        <th className="align-middle text-nowrap position-sticky" style={{ left: 0 }}>STT</th>
                        <th className="align-middle text-nowrap">Tên, nhãn hiệu</th>
                        <th className="align-middle text-nowrap">Mã số</th>
                        <th className="align-middle text-nowrap">Đơn vị tính</th>
                        <th className="align-middle text-nowrap">Đơn giá</th>
                        <th className="align-middle text-nowrap" >Theo sổ kế toán</th>
                        <th className="align-middle text-nowrap" >Theo kiểm kê</th>
                        <th className="align-middle text-nowrap" colSpan="2">Chênh lệch</th>
                        <th className="align-middle text-nowrap" >Lý do</th>

                    </tr>
                    <tr>
                        <th colSpan="7"></th>


                        <th className="align-middle text-nowrap">Thừa</th>
                        <th className="align-middle text-nowrap">Thiếu</th>
                        <th className="align-middle text-nowrap"></th>

                    </tr>

                </thead>
                <tbody>
                    <tr>
                        <td className="align-middle">sađâsdấd</td>
                        <td className="align-middle">sađâsdấd</td>
                        <td className="align-middle">sađâsdấd</td>
                        <td className="align-middle">sađâsdấd</td>
                        <td className="align-middle">sađâsdấd</td>
                        <td className="align-middle">sađâsdấd</td>
                        <td className="align-middle">sađâsdấd</td>
                        <td className="align-middle">sađâsdấd</td>
                        <td className="align-middle">sađâsdấd</td>
                        <td className="align-middle">sađâsdấd</td>

                    </tr>
                </tbody>
            </Table>
        </div>
    </>

    );
};



export default ExportPDF