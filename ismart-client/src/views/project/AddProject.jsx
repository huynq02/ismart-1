import { useState } from "react";
import { Modal, Button } from "react-bootstrap"
import { toast } from 'react-toastify';
import { createNewDelivery } from "~/services/DeliveryServices";
import { addProject } from "~/services/ProjectServices";
import { validateEmail, validatePhone, validateText, validateTextRequired } from "~/validate";

const ModelAddProject = ({ isShow, handleClose, updateTableSupplier }) => {
    const [nameSupplier, setNameSupplier] = useState("");

    const handleSave = async () => {
        if (!validateTextRequired.test(nameSupplier)) {
            toast.error("Tên nhà cung cấp không được để trống hoặc chứa ký tự đặc biệt");

        } else {
            let res = await addProject(nameSupplier);
            toast.success("Thêm dự án mới thành công", {
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
    }
    return (<>
        <Modal show={isShow} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>Thêm dự án mới</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="body-add-new">
                    <div className="form-group mb-3">
                        <label >Tên dự án</label>
                        <input type="text" className="form-control inputCSS" aria-describedby="emailHelp" value={nameSupplier} onChange={(event) => setNameSupplier(event.target.value)} />
                    </div>

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
    </>)
}

export default ModelAddProject;