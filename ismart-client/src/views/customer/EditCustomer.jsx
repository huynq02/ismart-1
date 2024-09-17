import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap"
import { toast } from 'react-toastify';
import { updateCustomer } from "~/services/CustomerServices";
import { validateEmail, validatePhone, validateText, validateTextRequired, removeWhiteSpace } from "~/validate";


const ModelEditCustomer = ({ isShow, handleClose, dataUpdateCustomer, updateTableCustomer }) => {

    const [nameCustomer, setNameCustomer] = useState("");
    const [addressCustomer, setAddressCustomer] = useState("");
    const [phoneCustomer, setPhoneCustomer] = useState("");
    const [emailCustomer, setEmailCustomer] = useState("");

    useEffect(() => {
        setNameCustomer(dataUpdateCustomer.customerName ? dataUpdateCustomer.customerName : "");
        setAddressCustomer(dataUpdateCustomer.customerAddress ? dataUpdateCustomer.customerAddress : "");
        setPhoneCustomer(dataUpdateCustomer.customerPhone ? dataUpdateCustomer.customerPhone : "");
        setEmailCustomer(dataUpdateCustomer.customerEmail ? dataUpdateCustomer.customerEmail : "");
    }, [dataUpdateCustomer])

    const handleSave = async () => {
        if (!nameCustomer.trim() || !validateTextRequired.test(nameCustomer.trim())) {
            toast.error("Tên khách hàng không được để trống hoặc chứa ký tự đặc biệt");
        } else if (!phoneCustomer.trim() || !validatePhone.test(phoneCustomer.trim())) {
            toast.error("Sai định dạng số điện thoại");
        } else if (!emailCustomer.trim() || !validateEmail.test(emailCustomer.trim())) {
            toast.error("Sai định dạng email");
        } else if (!addressCustomer.trim() || !validateText.test(addressCustomer.trim())) {
            toast.error("Địa chỉ không được chứa ký tự đặc biệt");
        } else {
            let res = await updateCustomer(
                dataUpdateCustomer.customerId,
                nameCustomer.trim(),
                addressCustomer.trim(),
                phoneCustomer.trim(),
                emailCustomer.trim());
            // console.log(res);
            if (res) {
                toast.success("Sửa thông tin khách hàng thành công", {
                    className: 'toast-success',
                });
            }
            updateTableCustomer();
            handleClose();
        }
    }

    const handleCloseModal = () => {
        handleReset();
        handleClose();
    }

    const handleReset = () => {
        setNameCustomer(dataUpdateCustomer.customerName);
        setAddressCustomer(dataUpdateCustomer.customerAddress);
        setPhoneCustomer(dataUpdateCustomer.customerPhone);
        setEmailCustomer(dataUpdateCustomer.customerEmail);
    }

    return (
        <>
            <Modal show={isShow} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Chỉnh sửa thông tin khách hàng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="body-add-new">
                        <div className="form-group mb-3">
                            <label >Tên khách hàng</label>
                            <input type="text" className="form-control inputCSS" aria-describedby="emailHelp" value={nameCustomer} onChange={(event) => setNameCustomer(event.target.value)} />
                        </div>
                        <div className="form-group mb-3">
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
}

export default ModelEditCustomer;