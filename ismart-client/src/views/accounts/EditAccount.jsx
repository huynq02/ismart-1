import React, { useState, useEffect } from 'react';
import { Modal, Button, Row, Col, Form, DropdownButton, Dropdown } from 'react-bootstrap';
import { updateUser, fetchAllRole } from "~/services/UserServices";
import { toast } from 'react-toastify';
import uploadImage from '~/services/ImageServices';
import { set } from 'lodash';
import { validateEmail, validatePhone, validateText, validateTextRequired, isStrongPassword } from "~/validate";
const ModalEditAccount = ({ isShow, handleClose, updateTable, dataUserEdit, }) => {
    const [selectedOptionRole, setSelectedOption] = useState('3');

    // Define state for account details
    const [userCode, setUserCode] = useState("");
    const [userName, setUserName] = useState("");
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState();
    const [email, setEmail] = useState();
    const [address, setAddress] = useState();
    const [image, setImage] = useState();
    const [status, setStatus] = useState();


    useEffect(() => {
        if (isShow) {

            setUserName(dataUserEdit.userName);
            setUserCode(dataUserEdit.userCode);
            setFullName(dataUserEdit.fullName);
            setPhone(dataUserEdit.phone);
            setEmail(dataUserEdit.email);
            setAddress(dataUserEdit.address);
            setStatus(dataUserEdit.statusId);
        }
    }, [dataUserEdit])


    const handleUserName = (event) => {
        setUserName(event.target.value);
    }
    const handleUserCode = (event) => {
        setUserCode(event.target.value);
    }
    const handleFullName = (event) => {
        setFullName(event.target.value);
    }
    const handlePhone = (event) => {
        setPhone(event.target.value);
    }
    const handleEmail = (event) => {
        setEmail(event.target.value);
    }

    const handleAddress = (event) => {
        setAddress(event.target.value);
    }


    const handleChooseFile = async (event) => {
        const file = event.target.files[0];
        // console.log("file: ", file);
        let res = await uploadImage(file);
        const urlImage = res.url;
        setImage(urlImage);
    }


    const handleSave = async () => {
        if (!userName.trim()) {
            toast.error("Tên đăng nhập không được để trống");
            // } else if (!userCode.trim()) {
            //     toast.error("Mã người dùng không được để trống");
        } else if (!fullName.trim()) {
            toast.error("Tên không được để trống");
        } else if (!(phone || "").trim() || !validatePhone.test((phone || "").trim())) {
            toast.error("Số điện thoại không hợp lệ!");
        } else if (!(email || "").trim() || !validateEmail.test((email || "").trim())) {
            toast.error("Email không hợp lệ!");
        } else if (!(address || "").trim()) {
            toast.error("Địa chỉ không được để trống");
        } else if (!image && !dataUserEdit.image) { // Kiểm tra nếu không có hình ảnh mới và không có hình ảnh hiện tại
            toast.error("Hình ảnh không được để trống");
        } else {
            let finalImage = image || dataUserEdit.image; // Sử dụng hình ảnh mới nếu có, nếu không sử dụng hình ảnh hiện tại
            let res = await updateUser(
                dataUserEdit.userId,
                email,
                phone,
                dataUserEdit.roleId,
                status,
                userName,
                userCode,
                address,
                finalImage, // Sử dụng biến finalImage ở đây
                fullName);
            if (res) { // Check if the update was successful
                toast.success("Cập nhật thông tin người dùng thành công");
                updateTable(); // Update the user list
                handleCloseModal(); // Close the modal
            } else {
                toast.error("Có lỗi xảy ra khi cập nhật thông tin người dùng");
            }
        }
    }
    const handleCloseModal = () => {
        handleClose();
    }



    return (

        <>
            <Modal show={isShow} onHide={handleCloseModal} >
                <Modal.Header closeButton>
                    <Modal.Title>Chỉnh sửa tài khoản: &nbsp;
                        {dataUserEdit.fullName}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col md={7}>
                            <label >Mã nhân viên</label>
                            <input type="text" className="form-control inputCSS" value={userCode} onChange={handleUserCode} disabled />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={7}>
                            <label >Họ và tên</label>
                            <input type="text" className="form-control inputCSS" value={fullName} onChange={handleFullName} />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={7}>
                            <label >Tên Đăng Nhập</label>
                            <input type="text" className="form-control inputCSS" value={userName} onChange={handleUserName} disabled />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={7}>
                            <label >Số điện thoại</label>
                            <input type="number" className="form-control inputCSS" value={phone} onChange={handlePhone} />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={7}>
                            <label >Email</label>
                            <input type="text" className="form-control inputCSS" value={email} onChange={handleEmail} />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={7}>
                            <label >Adress</label>
                            <input type="text" className="form-control inputCSS" value={address} onChange={handleAddress} />
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '15px' }}>
                        <label >Hình ảnh </label>
                        <Col md={2}>
                            <div>
                                <input
                                    type="file"
                                    accept="image/*" // Chỉ chấp nhận các loại file ảnh
                                    onChange={handleChooseFile} // Hàm xử lý sự kiện khi người dùng chọn file
                                />
                            </div>
                        </Col>
                    </Row>


                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Đóng
                    </Button>
                    <Button variant="primary" className="ButtonCSS" onClick={handleSave}>
                        Cập nhật tài khoản
                    </Button>
                </Modal.Footer>

            </Modal>
        </>
    );
}

export default ModalEditAccount;