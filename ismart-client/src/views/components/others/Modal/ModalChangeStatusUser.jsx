import { Modal, Button } from "react-bootstrap"


const ModalChangeStatusUser = ({ isShow, handleClose, confirmChangeStatus, title, name, status, statusText1, statusText2 }) => {

    const handleSave = () => {
        confirmChangeStatus(true);
        // console.log("Save", true);
        handleClose();

    }

    return (<>
        <Modal show={isShow} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Thay đổi trạng thái {title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="body-add-new">
                    <div className="form-group mb-3">
                        <label>
                            Bạn có muốn thay đổi tình trạng của {title} <b style={{ color: 'red' }}>{name}</b> từ
                            <i> <span style={{ color: 'blue' }}>{status === "Active" ? statusText1 : statusText2}</span></i> sang
                            <i> <span style={{ color: 'green' }}>{status === "Active" ? statusText2 : statusText1}</span></i>
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

export default ModalChangeStatusUser
