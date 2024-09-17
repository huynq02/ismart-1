import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap"
import { toast } from 'react-toastify';
import { EditStorage } from "~/services/StorageServices";
import { validatePhone, validateText, validateTextRequired, removeWhiteSpace } from "~/validate";


const ModelEditStorage = ({ isShow, handleClose, dataUpdateStorage, updateTableStorage }) => {
    const [warehouseName, setWarehouseName] = useState("");
    const [warehouseAddress, setWarehouseAddress] = useState("");
    const [warehousePhone, setWarehousePhone] = useState("");

    useEffect(() => {
        if (isShow) {
            // Cập nhật trạng thái của các trường nhập liệu với dữ liệu mới nhất từ dataUpdateStorage
            setWarehouseName(dataUpdateStorage.warehouseName || "");
            setWarehouseAddress(dataUpdateStorage.warehouseAddress || "");
            setWarehousePhone(dataUpdateStorage.warehousePhone || "");
        }
    }, [isShow, dataUpdateStorage]);



    const handleSave = async () => {
        if (!validateTextRequired.test(warehouseName)) {
            toast.error("Tên kho hàng không được để trống hoặc chứa ký tự đặc biệt");
        } else if (!validatePhone.test(warehousePhone.trim())) {
            toast.error("Định dạng số điện thoại sai");
        } else if (!validateText.test(warehouseAddress.trim())) {
            toast.error("Địa chỉ không được chứa ký tự đặc biệt");
        } else if (warehouseName.trim() === "" || warehouseAddress.trim() === "" || warehousePhone.trim() === "") {
            toast.error("Thông tin không được để trống hoặc chỉ chứa dấu cách");
        } else {
            let res = await EditStorage(dataUpdateStorage.warehouseId,
                warehouseName,
                warehouseAddress,
                warehousePhone
            );
            // console.log(res);
            if (res) {
                toast.success("Sửa thông tin kho hàng thành công");
                updateTableStorage();
                handleClose();
            }

            else {
                toast.error("Sửa thông tin kho hàng thất bại");
            }

        }
    }

    const handleReset = () => {
        setWarehouseName(dataUpdateStorage.storageName);
        setWarehouseAddress(dataUpdateStorage.storageAddress);
        setWarehousePhone(dataUpdateStorage.storagePhone);
    }

    const handleCloseModal = () => {
        handleReset();
        handleClose();
    }

    return (<>
        <Modal show={isShow} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>Sửa thông tin nhà cung cấp {dataUpdateStorage.setStorageName}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="body-add-new">
                    <div className="form-group mb-3">
                        <label >Tên kho hàng</label>
                        <input type="text" className="form-control inputCSS" aria-describedby="emailHelp" value={warehouseName} onChange={(event) => setWarehouseName(event.target.value)} />
                    </div>
                    <div className="form-group mb-3">
                        <label >Địa chỉ</label>
                        <input type="text" className="form-control inputCSS" value={warehouseAddress} onChange={(event) => setWarehouseAddress(event.target.value)} />
                    </div>
                    <div className="form-group mb-3">
                        <label >Số điện thoại nhà cung cấp</label>
                        <input type="text" className="form-control inputCSS" value={warehousePhone} onChange={(event) => setWarehousePhone(event.target.value)} />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                {/* <Button variant="secondary" onClick={handleReset}>
                    Xóa thông tin thay đổi
                </Button> */}
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

export default ModelEditStorage;