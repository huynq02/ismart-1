import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap"
import { toast } from 'react-toastify';
import { updateDelivery } from "~/services/DeliveryServices";
import { validateEmail, validatePhone, validateText, validateTextRequired, removeWhiteSpace } from "~/validate";


const ModelEditDelivery = ({ isShow, handleClose, dataUpdateSupplier, updateTableSupplier }) => {

    const [nameSupplier, setNameSupplier] = useState("");


    useEffect(() => {
        setNameSupplier(dataUpdateSupplier.deliveryName ? dataUpdateSupplier.deliveryName : "");
    }, [dataUpdateSupplier])

    const handleSave = async () => {
        if (!validateTextRequired.test(nameSupplier)) {
            toast.error("Tên bên vận chuyển không được để trống hoặc chứa ký tự đặc biệt");
        } else {
            let res = await updateDelivery(dataUpdateSupplier.deliveyId, removeWhiteSpace(nameSupplier));
            console.log(res);
            if (res) {
                toast.success("Sửa thông tin bên vận chuyển thành công", {
                    className: 'toast-success',
                });
            }
            updateTableSupplier();
            handleCloseModal();
        }
    }

    const handleCloseModal = () => {
        handleReset();
        handleClose();
    }

    const handleReset = () => {
        setNameSupplier(dataUpdateSupplier.deliveryName);
    }

    return (<>
        <Modal show={isShow} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>Sửa bên vận chuyển</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="body-add-new">
                    <div className="form-group mb-3">
                        <label >Tên bên cung cấp</label>
                        <input type="text" className="form-control inputCSS" aria-describedby="emailHelp" value={nameSupplier} onChange={(event) => setNameSupplier(event.target.value)} />
                    </div>

                </div>
            </Modal.Body>
            <Modal.Footer>

                <Button variant="secondary" onClick={handleCloseModal}>
                    Đóng
                </Button>
                <Button variant="primary" className="ButtonCSS" onClick={handleSave}>
                    Lưu thay đổi
                </Button>
            </Modal.Footer>
        </Modal>
    </>)
}

export default ModelEditDelivery;