import { useEffect, useState } from 'react'
import React from 'react'
import ReactToPrint from 'react-to-print'
import { useRef } from 'react'
import { formatDate } from '~/validate'
import { ReactBarcode } from 'react-jsbarcode';

const BarCode = (barCodeDetail) => {
    const [supplierName, setSupplierName] = useState("");
    const [importedDate, setImportedDate] = useState("");
    const [storekeeperName, setStorekeeperName] = useState("");

    const [barcodeValue, setBarCodeValue] = useState(null);

    useEffect(() => {
        setSupplierName(barCodeDetail.barCodeDetail.supplierName);
        setImportedDate(barCodeDetail.barCodeDetail.importedDate);
        setStorekeeperName(barCodeDetail.barCodeDetail.storekeeperName);

    }, [barCodeDetail])

    useEffect(() => {
        // Hàm để loại bỏ các ký tự đặc biệt và định dạng lại ngày giờ
        const formatBarCodeValue = (name, date) => {
            const formattedName = name.replace(/[^a-zA-Z0-9]/g, ''); // Loại bỏ ký tự đặc biệt từ tên
            const formattedDate = date.replace(/[^a-zA-Z0-9]/g, ''); // Loại bỏ ký tự đặc biệt từ ngày
            return `${formattedName}${formattedDate}`;
        };

        const formattedBarCodeValue = formatBarCodeValue(supplierName, importedDate);
        setBarCodeValue(formattedBarCodeValue);
    }, [supplierName, importedDate]);

    const renderBarcode = barcodeValue && barcodeValue.trim().length > 0;

    const test = "ABC Inc.";
    const importDate = "2024-04-19";
    const componentRef = useRef();

    // Tạo giá trị mã vạch bao gồm thông tin nhà sản xuất và ngày nhập hàng

    // const barcodeValue = `${test} - ${importDate}`;


    // Cấu hình mã vạch bằng cách truyền options vào props của Barcode component
    const barcodeOptions = {
        format: "CODE128", // Loại mã vạch
        width: 1, // Độ rộng của các dòng trong mã vạch
        height: 50, // Chiều cao của mã vạch
        displayValue: false // Hiển thị giá trị trên mã vạch
    };

    return (
        <div className="App">
            {/* Truyền giá trị và cấu hình vào component Barcode */}
            {renderBarcode ? (
                <div ref={componentRef}>
                    <ReactBarcode value={barcodeValue} options={barcodeOptions} />
                    <br />
                </div>
            ) : (
                <div>No valid barcode value provided</div>
            )}
            <ReactToPrint
                trigger={() => <button style={{ border: '5px solid #808080', backgroundColor: '#808080' }} variant="primary">In</button>}
                content={() => componentRef.current}
            />

        </div>
    );
}

export default BarCode