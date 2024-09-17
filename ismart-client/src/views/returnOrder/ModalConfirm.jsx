
import { Modal, Button } from "react-bootstrap"

const ModalConfirm = ({ isShow, handleClose, title, ConfirmCancel }) => {
    const handleSave = () => {
        ConfirmCancel(true);
        handleClose();
    }

    return (<>
        <Modal show={isShow} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="body-add-new">
                    <div className="form-group mb-3">
                        <label>
                            {title === 'Xác nhận đơn trả hàng' ? "Bạn có muốn xác nhận đơn hàng không ?" : "Bạn có chắc chắn muốn hủy đơn hàng trả lại ?"}
                        </label>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer >
                <Button variant="secondary" onClick={handleClose}>
                    Đóng
                </Button>
                <div className="ButtonCSSDropdown">
                    <Button variant="primary" onClick={handleSave}>
                        Lưu thay đổi
                    </Button>
                </div>

            </Modal.Footer>
        </Modal>
    </>)
}

export default ModalConfirm