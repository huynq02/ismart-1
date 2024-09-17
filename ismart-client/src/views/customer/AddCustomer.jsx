import React from 'react';
import { Modal, Button } from "react-bootstrap"
import { toast } from 'react-toastify';
import { createNewCustomer } from "~/services/CustomerServices";
import { validateEmail, validatePhone, validateText, validateTextRequired } from "~/validate";
import { useState } from "react";

const ModelAddCustomer = ({ isShow, handleClose, updateTableCustomer }) => {
    const [nameCustomer, setNameCustomer] = useState("");
    const [addressCustomer, setAddressCustomer] = useState("");
    const [phoneCustomer, setPhoneCustomer] = useState("");
    const [emailCustomer, setEmailCustomer] = useState("");


    const handleSave = async () => {
        if (!nameCustomer.trim() || !validateTextRequired.test(nameCustomer)) {
            toast.error("Tên khách hàng không được để trống hoặc chứa ký tự đặc biệt");
        } else if (!phoneCustomer.trim() || !validatePhone.test(phoneCustomer)) {
            toast.error("Sai định dạng số điện thoại");
        } else if (!emailCustomer.trim() || !validateEmail.test(emailCustomer)) {
            toast.error("Sai định dạng email");
        } else if (!addressCustomer.trim() || !validateText.test(addressCustomer)) {
            toast.error("Địa chỉ không được chứa ký tự đặc biệt");
        } else {
            let res = await createNewCustomer(nameCustomer.trim(), addressCustomer.trim(), phoneCustomer.trim(), emailCustomer.trim());
            toast.success("Thêm khách hàng thành công", {
                className: 'toast-success',
            });
            updateTableCustomer();
            handleCloseModal();
        }
    }

    const handleCloseModal = () => {
        handleReset();
        handleClose();
    }
    const handleReset = () => {
        setNameCustomer("");
        setAddressCustomer("");
        setPhoneCustomer("");
        setEmailCustomer("");
    }

    return (
        <>
            <Modal show={isShow} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm khách hàng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="body-add-new">
                        <div className="form-group mb-3">
                            <label >Tên khách hàng</label>
                            <input type="text" className="form-control inputCSS" aria-describedby="emailHelp" value={nameCustomer} onChange={(event) => setNameCustomer(event.target.value)} />
                        </div>
                        <div className='"form-group mb-3"'>
                            <label >Địa chỉ</label>
                            <input type="text" className="form-control inputCSS" value={addressCustomer} onChange={(event) => setAddressCustomer(event.target.value)} />
                        </div>
                        <div className="form-group mb-3">
                            <label >Số điện thoại</label>
                            <input type="text" className="form-control inputCSS" value={phoneCustomer} onChange={(event) => setPhoneCustomer(event.target.value)} />
                        </div>
                        <div className="form-group mb-3">
                            <label >Email</label>
                            <input type="text" className="form-control inputCSS" aria-describedby="emailHelp" value={emailCustomer} onChange={(event) => setEmailCustomer(event.target.value)} />
                        </div>

                        <Button className="ButtonRed" onClick={handleReset}>
                            Xóa thông tin thay đổi
                        </Button>

                    </div>
                </Modal.Body>
                <Modal.Footer>

                    <Button variant="secondary" onClick={handleCloseModal}>
                        Đóng
                    </Button>
                    <Button variant="primary" className="ButtonCSS" onClick={handleSave}>
                        Lưu
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
};
export default ModelAddCustomer;

