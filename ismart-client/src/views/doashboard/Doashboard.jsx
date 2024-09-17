import React, { useEffect, useState } from 'react';
import { Table, DropdownButton, DropdownMenu, Col, Row, Container, Badge, Card } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import { fetchDataAddChart, fetchDataStatisticalExortOrder, fetchDataStatisticalImportOrder } from '~/services/Doashboard';
import { fetchAllStorages } from '~/services/StorageServices';
import { CustomToggle, CustomMenu } from "../components/others/Dropdown";
import { fetchAllGoodsInWarehouse, fetchGoodsWithStorageAndSupplier } from "~/services/GoodServices";
import { fetchGoodById } from "~/services/GoodServices";
import { fetchAllSuppliers } from "~/services/SupplierServices";
import { formatDateImport, formattedAmount, formatDate } from '~/validate';
import ChartComponent from '../components/others/Chart';
import { fetchHistoryGood } from '~/services/GoodServices';
import { useNavigate } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import { fetchAlertsinGoods } from '~/services/GoodServices';
import { getUserIdWarehouse } from '~/services/UserWarehouseServices';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { fetchInventoryExport, fetchInventoryImport } from '~/services/InventoryReport';






const Doashboard = () => {
    const roleId = parseInt(localStorage.getItem('roleId'), 10);
    const userId = parseInt(localStorage.getItem('userId'), 10);




    const navigate = useNavigate();
    useEffect(() => {
        if (![1, 2, 4].includes(roleId)) {
            navigate('/ban-khong-co-quyen-truy-cap'); // Chuyển hướng người dùng không phù hợp
        } else if (roleId === 3) {
            navigate('/cac-lo-hang-nhap-ngoai'); // Chuyển hướng người dùng với roleId là 3 đến dashboard
        }
    }, [roleId, navigate]);




    const [isOpen, setIsOpen] = useState(true);
    const [alerts, setAlerts] = useState([]);




    const [totalStorages, setTotalStorages] = useState([]);
    const [selectedStorage, setSelectedStorage] = useState(null);
    const [selectedStorageId, setSelectedStorageId] = useState(null);




    const [selectedDateStart, setSelectedDateStart] = useState(formatDateImport(new Date()));
    const [selectedDateEnd, setSelectedDateEnd] = useState(formatDateImport(new Date()));




    const [totalImportOrderByDate, setTotalImportOrderByDate] = useState(0);
    const [mostGoodImportOrderByDate, setMostGoodImportOrderByDate] = useState('');
    const [mostQuantityGoodImportOrderByDate, setMostQuantityGoodImportOrderByDate] = useState('');




    const [totalExportOrderByDate, setTotalExportOrderByDate] = useState(0);
    const [mostGoodExportOrderByDate, setMostGoodExportOrderByDate] = useState('');
    const [mostQuantityGoodExportOrderByDate, setMostQuantityGoodExportOrderByDate] = useState('');




    const [totalGoods, setTotalGoods] = useState([]);
    const [selectedGoodCode, setSelectedGoodCode] = useState(null);
    const [selectedGoodId, setSelectedGoodId] = useState(null);




    // thông tin của hàng đang được hiển thị trên chart
    const [dataGood, setDataGood] = useState([]);








    const [totalStoragesGood, setTotalStoragesGood] = useState([]);
    const [selectedStorageGood, setSelectedStorageGood] = useState(null);
    const [selectedStorageIdGood, setSelectedStorageIdGood] = useState(null);
    // dữ liệu truyền vào chart
    const [dateImportOrder, setDateImportOrder] = useState([]);
    const [quantityImportOrder, setQuantityImportOrder] = useState([]);




    // dữ liệu truyền vào chart
    const [dateExportOrder, setDateExportOrder] = useState([]);
    const [quantityExportOrder, setQuantityExportOrder] = useState([]);




    const [totalYear, setTotalYear] = useState(["2024", "2023", "2022"])
    const [selectedYear, setSelectedYear] = useState(null);
    const [importQuantity, setImportQuantity] = useState([]);
    const [exportQuantity, setExportQuantity] = useState(null);
    useEffect(() => {
        fetchAlerts();
    }, []);
    const fetchAlerts = async () => {
        let u = await getUserIdWarehouse(userId);
        if (u && u.length > 0) {
            const a = await fetchAlertsinGoods(u[0].warehouseId);
            setAlerts(a);
            setIsOpen(true);
        } else {
            console.error("User data is not available");
        }
    };








    const closePopup = () => {
        setIsOpen(false);
    };




    useEffect(() => {
        setIsOpen(true);


        getAllStorages();
        getDataStatisticalImport();
        getDataStatisticalExport();
    }, [])




    useEffect(() => {
        getAllGoods();
        setSelectedGoodId(null);
        setSelectedGoodCode(null);
        setDateImportOrder([]);
        setDateExportOrder([]);
        setQuantityImportOrder([]);
        setQuantityExportOrder([]);
    }, [selectedStorageIdGood])




    useEffect(() => {
        getDataStatisticalExport();
        getDataStatisticalImport();
    }, [selectedDateStart, selectedDateEnd, selectedStorageId])




    useEffect(() => {
        getHistoryGood();
        getGoodById();








    }, [selectedGoodId, selectedYear])




    const getGoodById = async () => {
        if (selectedGoodId) {
            let res = await fetchGoodById(selectedGoodId);
            if (res) {
                setDataGood(res);
            } else {
                console.error("Invalid response from fetchGoodById");
            }
        }
    }








    function fillMissingMonths(data) {
        const monthsWithQuantities = data.map(item => item.month);
        const allMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        const missingMonths = allMonths.filter(month => !monthsWithQuantities.includes(month));








        const filledData = data.slice(); // Tạo một bản sao của mảng dữ liệu ban đầu
        missingMonths.forEach(month => {
            filledData.push({ year: selectedYear, month, quantity: 0 });
        });
        // Sắp xếp lại mảng theo tháng
        filledData.sort((a, b) => a.month - b.month);
        return filledData;
    }




    const getHistoryGood = async () => {
        if (roleId === 1) {
            if (selectedStorageIdGood && selectedGoodCode && selectedYear) {
                let res = await fetchDataAddChart(selectedStorageIdGood, selectedGoodCode, selectedYear);
                
                if (Array.isArray(res)) {
                    const importQuantities = res.map(item => item.imports || 0);
                    setImportQuantity(importQuantities);
                    const exportQuantities = res.map(item => item.exports || 0);
                    setExportQuantity(exportQuantities);
                } else {
                    console.error("Invalid response from fetchDataAddChart");
                }
            }
        }
        else if (roleId === 2 || roleId === 4) {
            let warehouse = await getWarehouseById(userId);
            if (warehouse.warehouseId && selectedGoodCode && selectedYear) {
                let res = await fetchDataAddChart(warehouse.warehouseId, selectedGoodCode, selectedYear);
                
                if (Array.isArray(res)) {
                    const importQuantities = res.map(item => item.imports || 0);
                    setImportQuantity(importQuantities);
                    const exportQuantities = res.map(item => item.exports || 0);
                    setExportQuantity(exportQuantities);
                } else {
                    console.error("Invalid response from fetchDataAddChart");
                }
            }
        }
    }








    const getDataStatisticalImport = async () => {
        if (roleId === 1) {
            let res = await fetchInventoryImport(selectedDateStart, selectedDateEnd, selectedStorageId);
            if (Array.isArray(res)) {
                const totalQuantity = res.reduce((sum, item) => sum + item.quantity, 0);
                setTotalImportOrderByDate(totalQuantity);
                const quantityMap = res.reduce((acc, item) => {
                    if (item.productId !== 0 && item.productId !== null) {
                        if (!acc[item.productId]) {
                            acc[item.productId] = { quantity: 0, productName: item.productName };
                        }
                        acc[item.productId].quantity += item.quantity;
                    }
                    return acc;
                }, {});




                let maxProduct = null;
                let maxQuantity = 0;




                for (const [productId, data] of Object.entries(quantityMap)) {
                    if (data.quantity > maxQuantity) {
                        maxQuantity = data.quantity;
                        maxProduct = { productId, productName: data.productName, quantity: maxQuantity };
                    }
                }
                if (maxProduct) {
                    console.log(`Sản phẩm được nhập nhiều nhất: ${maxProduct.productName} với số lượng: ${maxProduct.quantity}`);
                    setMostGoodImportOrderByDate(maxProduct.productName);
                    setMostQuantityGoodImportOrderByDate(maxProduct.quantity);
                }
            }
        }
        else if (roleId === 2  || roleId === 4) {
            let warehouse = await getWarehouseById(userId);
            let res = await fetchInventoryImport(selectedDateStart, selectedDateEnd, warehouse.warehouseId);
            if (Array.isArray(res)) {
                const totalQuantity = res.reduce((sum, item) => sum + item.quantity, 0);
                setTotalImportOrderByDate(totalQuantity);
                const quantityMap = res.reduce((acc, item) => {
                    if (item.productId !== 0 && item.productId !== null) {
                        if (!acc[item.productId]) {
                            acc[item.productId] = { quantity: 0, productName: item.productName };
                        }
                        acc[item.productId].quantity += item.quantity;
                    }
                    return acc;
                }, {});




                let maxProduct = null;
                let maxQuantity = 0;




                for (const [productId, data] of Object.entries(quantityMap)) {
                    if (data.quantity > maxQuantity) {
                        maxQuantity = data.quantity;
                        maxProduct = { productId, productName: data.productName, quantity: maxQuantity };
                    }
                }
                if (maxProduct) {
                    console.log(`Sản phẩm được nhập nhiều nhất: ${maxProduct.productName} với số lượng: ${maxProduct.quantity}`);
                    setMostGoodImportOrderByDate(maxProduct.productName);
                    setMostQuantityGoodImportOrderByDate(maxProduct.quantity);
                }
            }
        }
    };




    // lấy số lượng và giá trị xuất hàng
    const getDataStatisticalExport = async () => {
        if (roleId === 1) {
            let res = await fetchInventoryExport(selectedDateStart, selectedDateEnd, selectedStorageId);
            if (Array.isArray(res)) {
                const totalQuantity = res.reduce((sum, item) => sum + item.quantity, 0);
                setTotalExportOrderByDate(totalQuantity);
                const quantityMap = res.reduce((acc, item) => {
                    if (item.productId !== 0 && item.productId !== null) {
                        if (!acc[item.productId]) {
                            acc[item.productId] = { quantity: 0, productName: item.productName };
                        }
                        acc[item.productId].quantity += item.quantity;
                    }
                    return acc;
                }, {});




                let maxProduct = null;
                let maxQuantity = 0;




                for (const [productId, data] of Object.entries(quantityMap)) {
                    if (data.quantity > maxQuantity) {
                        maxQuantity = data.quantity;
                        maxProduct = { productId, productName: data.productName, quantity: maxQuantity };
                    }
                }
                if (maxProduct) {
                    console.log(`Sản phẩm được xuất nhiều nhất: ${maxProduct.productName} với số lượng: ${maxProduct.quantity}`);
                    setMostGoodExportOrderByDate(maxProduct.productName);
                    setMostQuantityGoodExportOrderByDate(maxProduct.quantity);
                }
            }
        }
        else if (roleId === 2 || roleId === 4) {
            let warehouse = await getWarehouseById(userId);
            console.log("warehouse: ", warehouse.warehouseId);
            let res = await fetchInventoryExport(selectedDateStart, selectedDateEnd, warehouse.warehouseId);
            if (Array.isArray(res)) {
                const totalQuantity = res.reduce((sum, item) => sum + item.quantity, 0);
                setTotalExportOrderByDate(totalQuantity);
                const quantityMap = res.reduce((acc, item) => {
                    if (item.productId !== 0 && item.productId !== null) {
                        if (!acc[item.productId]) {
                            acc[item.productId] = { quantity: 0, productName: item.productName };
                        }
                        acc[item.productId].quantity += item.quantity;
                    }
                    return acc;
                }, {});




                let maxProduct = null;
                let maxQuantity = 0;




                for (const [productId, data] of Object.entries(quantityMap)) {
                    if (data.quantity > maxQuantity) {
                        maxQuantity = data.quantity;
                        maxProduct = { productId, productName: data.productName, quantity: maxQuantity };
                    }
                }
                if (maxProduct) {
                    console.log(`Sản phẩm được xuất nhiều nhất: ${maxProduct.productName} với số lượng: ${maxProduct.quantity}`);
                    setMostGoodExportOrderByDate(maxProduct.productName);
                    setMostQuantityGoodExportOrderByDate(maxProduct.quantity);
                }
            }
        }
    }








    const getWarehouseById = async (userId) => {
        let res = await getUserIdWarehouse(userId);
        return res[0];
    }




    const getAllGoods = async () => {
        if (roleId === 1) {
            if (selectedStorageIdGood) {
                let res = await fetchAllGoodsInWarehouse(selectedStorageIdGood);
                setTotalGoods(res);
            }
        }
        else if (roleId === 2 || roleId === 4) {
            let warehouse = await getWarehouseById(userId);
            let res = await fetchAllGoodsInWarehouse(warehouse.warehouseId);
            setTotalGoods(res);
        }
    }








    const handleGoodClick = (good, event) => {
        setSelectedGoodCode(good.goodsCode);
        setSelectedGoodId(good.goodsId);
    }




    const getAllStorages = async () => {
        let res = await fetchAllStorages();
        setTotalStorages(res);
        setTotalStoragesGood(res);
    }








    const handleStorageClickTotal = () => {
        setSelectedStorage("Tất cả kho");
        setSelectedStorageId("");
    }








    const handleStorageClick = (storage) => {
        setSelectedStorage(storage.warehouseName);
        setSelectedStorageId(storage.warehouseId);
    }








    // lấy ngày tháng để filter order
    const handleDateStartChange = (event) => {
        setSelectedDateStart(formatDateImport(event.target.value));
    };








    const handleDateEndChange = (event) => {
        setSelectedDateEnd(formatDateImport(event.target.value));
    };




    const handleStorageGoodClick = (storage) => {
        setSelectedStorageGood(storage.warehouseName);
        setSelectedStorageIdGood(storage.warehouseId);
    }








    const handleYearSelect = (year) => {
        setSelectedYear(year);
    };




    //Demo Dashboard
    const importDates = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    const importQuantities = [100, 150, 120, 170, 140, 160, 100, 150, 120, 170, 140, 16];








    // Dữ liệu giả lập cho thống kê xuất kho
    const exportDates = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    const exportQuantities = [80, 130, 110, 160, 150, 180];








    // Mã sản phẩm và tiêu đề cho biểu đồ
    const productCode = 'exampleGoodCode';
    const importChartTitle = 'Nhập kho';
    const exportChartTitle = 'Xuất kho';




    return (<>
        <div className="container" >
            <div className="">
                <div className="">
                    <h2 style={{ color: '#3b3bf5', marginTop: '20px' }}>Thống kê</h2>
                    <div className="row d-flex align-items-center">
                        {
                            (roleId == 1) ?


                                <Col md={2}>
                                    <label className='text-muted'>Chọn kho:</label>
                                    <DropdownButton className="DropdownButtonCSS ButtonCSSDropdown" title={selectedStorage !== null ? selectedStorage : "Tất cả"} variant="success" >








                                        <Dropdown.Item eventKey="" onClick={() => handleStorageClickTotal()}>Tất cả</Dropdown.Item>
                                        {totalStorages && totalStorages.length > 0 && totalStorages.map((c, index) => (
                                            <Dropdown.Item key={`storage ${index}`} eventKey={c.warehouseName} onClick={(e) => handleStorageClick(c, e)}>{c.warehouseName}</Dropdown.Item>
                                        ))}
                                    </DropdownButton>
                                </Col>
                                : ''
                        }






                        <Col md={2}>
                            <label className='text-muted'>Từ ngày: &nbsp;</label>
                            <div>








                                <input type="date" className="datepickerCSS" id="datepicker" value={selectedDateStart} onChange={handleDateStartChange} />
                            </div>
                        </Col>








                        <Col md={2}>
                            <div>
                                <label className='text-muted'>Đến ngày: &nbsp;</label>
                                <input type="date" className="datepickerCSS" id="datepicker" value={selectedDateEnd} onChange={handleDateEndChange} />
                            </div>
                        </Col>








                    </div>
                </div>
                <hr></hr>
            </div>








            <Row className='SolieuCSS'>
                <Col md={3}>
                    <Card className=" text-white mb-4" style={{ backgroundImage: 'linear-gradient(to left, #6fb3fe, #4398ff)' }}>
                        <Card.Body>
                            <Card.Title>Tổng số lượng hàng nhập</Card.Title>
                            {totalImportOrderByDate === 0 ? '' : (
                                <div className="d-flex align-items-center">
                                    <i className="fa-duotone fa-file-import fa-xl"></i> &nbsp;
                                    <Card.Text className="ml-2 h3">{totalImportOrderByDate}</Card.Text>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className=" text-white mb-4" style={{ backgroundImage: 'linear-gradient(to left, #52e2c8, #36dab8)' }}>
                        <Card.Body>
                            <Card.Title>Sản phẩm nhập nhiều nhất</Card.Title>
                            {mostGoodImportOrderByDate === '' ? '' : (
                                <div className="d-flex align-items-center">
                                    <i className="fa-duotone fa-chart-simple fa-xl "></i> &nbsp;
                                    <Card.Text className="ml-2 h3">
                                        {mostGoodImportOrderByDate}
                                        &nbsp;&nbsp;&nbsp;
                                        SL: {mostQuantityGoodImportOrderByDate}
                                    </Card.Text>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>








                <Col md={3}>
                    <Card className="text-white mb-4" style={{ backgroundImage: 'linear-gradient(to left, #fbcf6e, #ffb751)' }}>
                        <Card.Body>
                            <Card.Title>Tổng số lượng hàng xuất</Card.Title>
                            {totalExportOrderByDate === 0 ? '' : (
                                <div className="d-flex align-items-center">
                                    <i className="fa-duotone fa-file-export fa-xl"></i> &nbsp;
                                    <Card.Text className="ml-2 h3">  {totalExportOrderByDate}</Card.Text>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className=" text-white mb-4" style={{ backgroundImage: 'linear-gradient(to left, #fe8398, #ff5774)' }}>
                        <Card.Body>
                            <Card.Title>Sản phẩm xuất nhiều nhất</Card.Title>
                            {mostGoodExportOrderByDate === '' ? '' : (
                                <div className="d-flex align-items-center">
                                    <i className="fa-duotone fa-chart-simple fa-xl "></i> &nbsp;
                                    <Card.Text className="ml-2 h3">
                                        {mostGoodExportOrderByDate}
                                        &nbsp;&nbsp;&nbsp;
                                        SL: {mostQuantityGoodExportOrderByDate}
                                    </Card.Text>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>








            </Row>
            <hr></hr>
            <Row>
                {roleId === 1 ?
                    <Col md={3}>
                        <div>
                            <Dropdown style={{ position: 'relative', fontWeight: 'bold' }}>
                                <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                                    <span style={{ color: 'white' }}>{selectedStorageGood !== null ? selectedStorageGood : "Kho"}</span>
                                </Dropdown.Toggle>
                                <Dropdown.Menu as={CustomMenu} style={{ position: 'absolute', zIndex: '9999' }} className='ButtonCSSDropdown'>
                                    {totalStoragesGood && totalStoragesGood.length > 0 && totalStoragesGood.map((g, index) => (
                                        <Dropdown.Item key={`storageGood ${index}`} eventKey={g.warehouseName} onClick={(e) => handleStorageGoodClick(g, e)}>
                                            {g.warehouseName}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </Col>
                    : ''
                }
                <Col md={3}>








                    <div>
                        <Dropdown style={{ position: 'relative', fontWeight: 'bold' }} >
                            <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components" className='DropdownButtonCSS'>
                                <span style={{ color: 'white' }}>{selectedGoodCode !== null ? selectedGoodCode : "Mã Sản phẩm"}</span>
                            </Dropdown.Toggle>








                            <Dropdown.Menu as={CustomMenu} style={{ position: 'absolute', zIndex: '9999' }} className='ButtonCSSDropdown'>
                                {totalGoods && totalGoods.length > 0 && totalGoods.map((g, index) => (
                                    <Dropdown.Item key={`good ${index}`} eventKey={g.goodsCode} onClick={(e) => handleGoodClick(g, e)} >
                                        {g.goodsCode}
                                    </Dropdown.Item>
                                ))}








                                {totalGoods.length === 0 && (
                                    <Dropdown.Item key="empty" disabled>
                                        Không có mặt hàng
                                    </Dropdown.Item>
                                )}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </Col>




                <Col md={3}>
                    <div>
                        <Dropdown className='ButtonCSSDropdown'>
                            <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                {selectedYear ? selectedYear : 'Chọn năm'}
                            </Dropdown.Toggle>








                            <Dropdown.Menu >
                                {totalYear.map(year => (
                                    <Dropdown.Item key={year} onClick={() => handleYearSelect(year)}>
                                        {year}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown></div>
                </Col>
            </Row>
            <hr></hr>
            <Row>
                <label>Tổng số lượng của sản phẩm {selectedGoodCode} trong kho: {selectedGoodCode ? dataGood.inStock : ''}</label>
            </Row>
            <Row>
                <div style={{ padding: '20px' }}>
                    <Row>
                        <Col md={6}>
                            <ChartComponent
                                selectedGoodCode={selectedGoodCode}
                                dateOrder={importDates}
                                quantityOrder={importQuantity}
                                title={importChartTitle}
                            />
                        </Col>








                        <Col md={6}>
                            <ChartComponent
                                selectedGoodCode={selectedGoodCode}
                                dateOrder={exportDates}
                                quantityOrder={exportQuantity}
                                title={exportChartTitle}
                            />
                        </Col>
                    </Row>
                </div>
            </Row>




            <Modal show={isOpen} onHide={closePopup} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title style={{ color: 'red' }}>Cảnh báo kho hàng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {Array.isArray(alerts) && alerts.length > 0 ? (
                        <ul>
                            {alerts.map((alert, index) => (
                                <li key={index}
                                    style={{ listStyleType: '"  "' }}>
                                    <p></p>
                                    {/* <p>Mã hàng: {alert.goodCode}</p>
                            <p>Tên hàng: {alert.goodName}</p>
                            <p>Số lượng: {alert.quantity}</p> */}
                                    <p> <FontAwesomeIcon icon={faExclamationTriangle}
                                        style={{ color: 'red', fontSize: '24px' }}
                                    />&nbsp; Cảnh báo: {alert.alertType}</p>
                                    <p>Thông báo: {alert.message}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div>Không có cảnh báo nào để hiển thị</div>
                    )
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closePopup}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
        </div >
    </>)
}








export default Doashboard

























