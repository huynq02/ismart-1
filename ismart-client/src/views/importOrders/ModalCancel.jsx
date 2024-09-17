
import { Modal, Button } from "react-bootstrap"

const ModalCancel = ({ isShow, handleClose, title, ConfirmCancel }) => {
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
                            Bạn có muốn hủy bỏ đơn hàng không ?
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

export default ModalCancel