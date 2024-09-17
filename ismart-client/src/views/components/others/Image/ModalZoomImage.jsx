import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap"

const ModalZoomImage = ({ imageUrl, isShow, handleClose }) => {
    return (<>
        <Modal show={isShow} onHide={handleClose} size="xs">
            <Modal.Header closeButton>
                <Modal.Title>Hình ảnh</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="body-add-new">
                    <img src={imageUrl} alt="Image" style={{ width: '460px', height: '400px' }} />
                </div>
            </Modal.Body>

        </Modal>
    </>)
}

export default ModalZoomImage