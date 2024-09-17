import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap"
import { toast } from 'react-toastify';
import { EditCategory } from "~/services/CategoryServices";
import { validatePhone, validateText, validateTextRequired, removeWhiteSpace } from "~/validate";


const ModelEditCategory = ({ isShow, handleClose, dataUpdateCategory, updateTableCategory }) => {
    const [categoryName, setCategoryName] = useState("");
    const [categoryDescription, setCategoryDescription] = useState("");
    useEffect(() => {
        if (isShow) {
            setCategoryName(dataUpdateCategory.categoryName);
            setCategoryDescription(dataUpdateCategory.description ? dataUpdateCategory.description : "");
        }
    }, [dataUpdateCategory])
    const handleSave = async () => {
        if (!validateTextRequired.test(categoryName)) {
            toast.error("Tên không được trống và chứa ký tự đặc biệt");
        } else if (!validateText.test(categoryDescription)) {
            toast.error("Thông tin chi tiết không được chứa ký tự đặc biệt");
        }

        else {
            let res = await EditCategory(dataUpdateCategory.categoryId, removeWhiteSpace(categoryName), removeWhiteSpace(categoryDescription));
            toast.success("Sửa thông tin danh mục thành công", {
                className: 'toast-success',
            });
            updateTableCategory();
            handleClose();
        }
    }

    const handleReset = () => {

        setCategoryName(dataUpdateCategory.categoryName);
        setCategoryDescription(dataUpdateCategory.description ? dataUpdateCategory.description : "");

    }

    const handleCloseModal = () => {
        handleReset();
        handleClose();
    }

    return (<>
        <Modal show={isShow} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>Sửa thông tin danh mục</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="body-add-new">
                    <div className="form-group mb-3">
                        <label >Tên danh mục</label>
                        <input type="text" className="form-control inputCSS" aria-describedby="emailHelp" value={categoryName} onChange={(event) => setCategoryName(event.target.value)} />
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
                    Lưu thay đổi
                </Button>
            </Modal.Footer>
        </Modal>
    </>)
}

export default ModelEditCategory;