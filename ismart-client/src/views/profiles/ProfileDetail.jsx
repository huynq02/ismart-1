import React, { useEffect, useState } from 'react';

import { CustomToggle, CustomMenu } from '../components/others/Dropdown';
import { Form, Button, Modal, Row, Col, Dropdown, DropdownButton } from 'react-bootstrap';
import { validatePhone, validateEmail } from '~/validate';
import uploadImage from '~/services/ImageServices';
import { fetchUserByUserId } from '~/services/UserServices';
import { updateUser } from '~/services/UserServices';
import { toast } from 'react-toastify';

const ProfileDetail = ({ isShow, handleClose, userId }) => {


    const [dataUser, setDataUser] = useState([]);
    const [phone, setPhone] = useState();
    const [email, setEmail] = useState();
    const [address, setAddress] = useState();
    const [image, setImage] = useState(null);
    const [fullName, setFullName] = useState();

    const [isEditProfile, setIsEditProfile] = useState(false);


    useEffect(() => {

        getDataUser(userId);


    }, [userId])

    useEffect(() => {
        setImage(dataUser.image);
        setPhone(dataUser.phone);
        setEmail(dataUser.email);
        setAddress(dataUser.address);
        setFullName(dataUser.fullName);
    }, [dataUser])



    const getDataUser = async (id) => {
        let res = await fetchUserByUserId(id);
        setDataUser(res);
        console.log(res);

    }

    const handleCloseModal = () => {
        handleReset();
        handleClose();
    }

    const handleReset = () => {
        setIsEditProfile(false);
    }

    const handleSave = async () => {
        if (!validatePhone.test(phone)) {
            toast.warning("Số điện thoại không đúng định dạng");
        } else if (!validateEmail.test(email)) {
            toast.warning("Email không đúng định dạng");
        } else {
            let res = await updateUser(dataUser.userId, email, dataUser.password, phone,
                dataUser.roleId, dataUser.statusId, dataUser.userName, dataUser.storageId, dataUser.userCode, address, image, fullName);

            toast.success("Cập nhật hồ sơ thành công");
            setIsEditProfile(false);
        }

    }

    const handleChangePhone = (event) => {
        setPhone(event.target.value);
    }

    const handleChangeEmail = (event) => {
        setEmail(event.target.value);
    }

    const handleChangeAddress = (event) => {
        setAddress(event.target.value);
    }

    const handleChangeFullName = (event) => {
        setFullName(event.target.value);
    }

    const handleChooseFile = async (event) => {
        const file = event.target.files[0];
        let res = await uploadImage(file);
        const urlImage = res.url;
        setImage(urlImage);

    }
    return (<>
        <Modal show={isShow} onHide={handleCloseModal} size="xs">
            <Modal.Header closeButton>
                <Modal.Title>Hồ sơ</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="body-add-new">

                    <Row>
                        <Col md={5}>
                            <img src={image} width="200px" height="250px"></img>
                        </Col>

                        <Col md={5}>
                            <button
                                className="btn btn-success border-left-0 rounded ButtonCSS"
                                type="button"
                                onClick={() => setIsEditProfile(true)}
                            ><i className="fa-solid fa-plus"></i>
                                &nbsp;Chỉnh sửa
                            </button>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '15px' }}>
                        <Col md={5}>
                            <label >Mã nhân viên </label>
                            <input type="text" className="form-control inputCSS"
                                aria-describedby="emailHelp" value={dataUser.userCode} disabled />
                        </Col>

                        {/* <Col md={5}>
                            <label >Kho </label>
                            <input type="text" className="form-control inputCSS"
                                aria-describedby="emailHelp" value={dataUser.storageName} disabled />
                        </Col> */}
                    </Row>

                    <Row style={{ marginTop: '15px' }}>
                        <Col md={5}>
                            <label >Họ và tên</label>
                            <input type="text" className="form-control inputCSS"
                                aria-describedby="emailHelp" value={fullName} onChange={handleChangeFullName} disabled={!isEditProfile} />
                        </Col>

                        <Col md={5}>
                            <label >Số điện thoại </label>
                            <input type="text" className="form-control inputCSS"
                                aria-describedby="emailHelp" value={phone} onChange={handleChangePhone} disabled={!isEditProfile} />
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '15px' }}>
                        <Col md={5}>
                            <label >Email </label>
                            <input type="text" className="form-control inputCSS"
                                aria-describedby="emailHelp" value={email} onChange={handleChangeEmail} disabled={!isEditProfile} />
                        </Col>
                        <Col md={5}>
                            <label >Địa chỉ </label>
                            <input type="text" className="form-control inputCSS"
                                aria-describedby="emailHelp" value={address} onChange={handleChangeAddress} disabled={!isEditProfile} />
                        </Col>


                    </Row>
                    {isEditProfile === true &&
                        <Row style={{ marginTop: '15px' }}>
                            <label>Hình ảnh</label>
                            <Col md={2}>
                                <div>
                                    <input
                                        type="file"
                                        accept="image/*" // Chỉ chấp nhận các loại file ảnh
                                        onChange={handleChooseFile} // Hàm xử lý sự kiện khi người dùng chọn file
                                    />
                                </div>
                            </Col>
                        </Row>}



                </div>
            </Modal.Body>
            <Modal.Footer>

                <Button variant="secondary" onClick={handleCloseModal}>
                    Đóng
                </Button>
                {isEditProfile === true ? <Button variant="primary" className="ButtonCSS" onClick={handleSave}>
                    Lưu thay đổi
                </Button> : ''}

            </Modal.Footer>
        </Modal>
    </>)
}

export default ProfileDetail