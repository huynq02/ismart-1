import { useState } from "react";
import { Modal, Button } from "react-bootstrap"
import { toast } from 'react-toastify';
import { createNewSupplier } from "~/services/SupplierServices";
import { validateEmail, validatePhone, validateText, validateTextRequired } from "~/validate";


const ModelAddSupplier = ({ isShow, handleClose, updateTableSupplier }) => {
    const [nameSupplier, setNameSupplier] = useState("");
    const [phoneSupplier, setPhoneSupplier] = useState("");
    const [emailSupplier, setEmailSupplier] = useState("");
    const [noteSupplier, setNoteSupplier] = useState("");
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = (event) => {
        if (event.target.checked) {
            setNoteSupplier("kho nội bộ");
        } else {
            setNoteSupplier("");
        }
        setIsChecked(event.target.checked);
    };

    const handleSave = async () => {
        // Sử dụng trim() để loại bỏ khoảng trắng ở đầu và cuối chuỗi
        const trimmedNameSupplier = nameSupplier.trim();
        const trimmedPhoneSupplier = phoneSupplier.trim();
        const trimmedEmailSupplier = emailSupplier.trim();
        const trimmedNoteSupplier = noteSupplier.trim();
    
        if (!validateTextRequired.test(trimmedNameSupplier)) {
            toast.error("Tên nhà cung cấp không được để trống hoặc chứa ký tự đặc biệt");
        } else if (!validatePhone.test(trimmedPhoneSupplier)) {
            toast.error("Sai định dạng số điện thoại");
        } else if (!validateEmail.test(trimmedEmailSupplier)) {
            toast.error("Sai định dạng email");
        } else if (!validateText.test(trimmedNoteSupplier)) {
            toast.error("Lưu ý không được chứa ký tự đặc biệt");
        } else {
            let res = await createNewSupplier(trimmedNameSupplier, trimmedPhoneSupplier, 1, trimmedEmailSupplier, trimmedNoteSupplier);
            toast.success("Thêm nhà cung cấp thành công", {
                className: 'toast-success',
            });
            updateTableSupplier();
            handleCloseModal();
        }
    };


    const handleCloseModal = () => {
        handleReset();
        handleClose();
    }
    const handleReset = () => {
        setNameSupplier("");
        setPhoneSupplier("");
        setEmailSupplier("");
        setNoteSupplier("");
    }
    return (
        <>
            <Modal show={isShow} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm nhà cung cấp</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="body-add-new">
                        <div className="form-group mb-3">
                            <label >Tên nhà cung cấp</label>
                            <input type="text" className="form-control inputCSS" aria-describedby="emailHelp" value={nameSupplier} onChange={(event) => setNameSupplier(event.target.value)} />
                        </div>
                        <div className="form-group mb-3">
                            <label >Số điện thoại</label>
                            <input type="text" className="form-control inputCSS" value={phoneSupplier} onChange={(event) => setPhoneSupplier(event.target.value)} />
                        </div>
                        <div className="form-group mb-3">
                            <label >Email</label>
                            <input type="text" className="form-control inputCSS" aria-describedby="emailHelp" value={emailSupplier} onChange={(event) => setEmailSupplier(event.target.value)} />
                        </div>
                        <div className="form-group mb-3">
                            <label>
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    checked={isChecked}
                                    onChange={handleCheckboxChange}
                                />
                                Lưu ý: Kho nội bộ
                            </label>
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

export default ModelAddSupplier;