import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap"
import { toast } from 'react-toastify';
import { createNewCategory } from "~/services/CategoryServices";
import { validateText, validateTextRequired } from "~/validate";

const ModelAddCategory = ({ isShow, handleClose, updateTableCategory }) => {
    const [categoryName, setCategoryName] = useState("");
    const [categoryDescription, setCategoryDescription] = useState("");


    const handleSave = async () => {
        if (!validateTextRequired.test(categoryName)) {
            toast.error("Tên khống được trống và chứa ký tự đặc biệt");
        } else if (!validateText.test(categoryDescription)) {
            toast.error("Thông tin miêu tả không được chứa ký tự đặc biệt");
        }
        else {
            let res = await createNewCategory(categoryName, categoryDescription);
            toast.success("Thêm danh mục thành công", {
                className: 'toast-success',

            });
            handleReset();
            updateTableCategory();
            handleClose();
        }

    };

    const handleReset = () => {
        setCategoryName("");
        setCategoryDescription("");
    }

    const handleCloseModal = () => {
        handleReset();
        handleClose();
    }

    return (<>
        <Modal show={isShow} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>Thêm danh mục mới</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="body-add-new">
                    <div className="form-group mb-3" >
                        <label >Danh mục</label>
                        <input type="text" className="form-control inputCSS" required aria-describedby="emailHelp" value={categoryName} onChange={(event) => setCategoryName(event.target.value)} />
                    </div>
                    <div className="form-group mb-3">
                        <label >Thông tin chi tiết</label>
                        <input type="text" className="form-control inputCSS" value={categoryDescription} onChange={(event) => setCategoryDescription(event.target.value)} />
                    </div>


                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleReset}>
                    Xóa thông tin thay đổi
                </Button>
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

export default ModelAddCategory;