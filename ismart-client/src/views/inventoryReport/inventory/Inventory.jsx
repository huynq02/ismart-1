import React, { useEffect, useState } from 'react';
import { Table, Col, Dropdown, DropdownButton, Row } from 'react-bootstrap';
import { fetchAllStorages } from '~/services/StorageServices';
import { fetchInventoryAll } from '~/services/InventoryReport';
import { getUserIdWarehouse } from "~/services/UserWarehouseServices";


const InventoryAll = () => {
    const roleId = parseInt(localStorage.getItem('roleId'), 10);
    const userId = parseInt(localStorage.getItem('userId'), 10);




    const [totalWarehouse, setTotalWarehouse] = useState([]);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [selectedWarehouseId, setSelectedWarehouseId] = useState(null);


    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [inventoryData, setInventoryData] = useState([]);


    const [showMode, setShowMode] = useState(null); // Quản lý chế độ hiển thị
    const [Month, setMonth] = useState('');
    const [year, setYear] = useState(new Date().getFullYear()); // Thêm state để lưu trữ năm




    const getStartDateTenYearsAgo = () => {
        const today = new Date();
        const tenYearsAgo = new Date(today.setFullYear(today.getFullYear() - 10));
        return tenYearsAgo.toISOString().split('T')[0];
    }
    useEffect(() => {
        const fetchInitialData = async () => {
            const start10Date = getStartDateTenYearsAgo();
            const end10Date = new Date().toISOString().split('T')[0];

            const storages = await fetchAllStorages();
            setTotalWarehouse(storages);

            if(roleId === 1){
                const haiPhongWarehouse = storages.find(warehouse => warehouse.warehouseName === "Hải Phòng");
                if (haiPhongWarehouse) {
                    setSelectedWarehouseId(haiPhongWarehouse.warehouseId);
                    const data = await fetchInventoryAll(start10Date, end10Date, haiPhongWarehouse.warehouseId);
                    setInventoryData(data);
                }
            } else {
                const warehouse = await getWarehouseById(userId);
                setSelectedWarehouseId(warehouse.warehouseId);
                const data = await fetchInventoryAll(start10Date, end10Date, warehouse.warehouseId);
                setInventoryData(data);
            }
           
        };

        fetchInitialData();
    }, []);


    useEffect(() => {
        const checkRoleAndFetchData = async () => {
           
            if (startDate, endDate, selectedWarehouseId) {
                const data = await fetchInventoryAll(startDate, endDate, selectedWarehouseId);
                setInventoryData(data);
            }
        };
        checkRoleAndFetchData();
    }, [startDate, endDate, selectedWarehouseId]);


    const getWarehouseById = async (userId) => {
        let res = await getUserIdWarehouse(userId);
        return res[0];
    }
    const hanldStartDate = (e) => {
        setStartDate(e.target.value);
    }


    const hanldEndDate = (e) => {
        setEndDate(e.target.value);
    }
    const getAllStorages = async () => {
        let res = await fetchAllStorages();
        setTotalWarehouse(res);


    }


    // const handleStorageClickTotal = () => {
    //     setSelectedWarehouse("Tất cả kho");
    //     setSelectedWarehouseId(null);
    // }


    const handleStorageClick = async (warehouse) => {
        setSelectedWarehouse(warehouse.warehouseName);
        setSelectedWarehouseId(warehouse.warehouseId);
    }
    const handleSelectAction = (mode) => {
        setShowMode(mode);
        if (mode === 'year') {
            // Nếu chọn theo năm, tính toán ngày đầu tiên và cuối cùng của năm hiện tại
            const currentYear = new Date().getFullYear();
            setYear(currentYear);
            setStartDate(`${currentYear}-01-01`);
            setEndDate(`${currentYear}-12-31`);
        }
    }


    const getTitle = () => {
        switch (showMode) {
            case 'date':
                return 'Chọn theo ngày';
            case 'month':
                return 'Chọn theo tháng';
            case 'quarter':
                return 'Chọn theo quý';
            case 'year':
                return 'Chọn theo năm';
            default:
                return 'Chọn Hành Động';
        }
    };


    const handlMonth = (e) => {
        const selectedMonth = e.target.value;
        const date = new Date(selectedMonth);


        // Tính ngày đầu tiên của tháng
        const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);


        // Tính ngày cuối cùng của tháng
        const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);


        // Cập nhật startDate và endDate với định dạng YYYY-MM-DD
        setStartDate(firstDayOfMonth.toLocaleDateString('en-CA')); // Định dạng YYYY-MM-DD
        setEndDate(lastDayOfMonth.toLocaleDateString('en-CA')); // Định dạng YYYY-MM-DD


        // Cập nhật Month state để hiển thị tháng được chọn
        setMonth(selectedMonth);
    }


    const setQuarter = (quarter, year) => {
        switch (quarter) {
            case '1':
                setStartDate(`${year}-01-01`);
                setEndDate(`${year}-03-31`);
                break;
            case '2':
                setStartDate(`${year}-04-01`);
                setEndDate(`${year}-06-30`);
                break;
            case '3':
                setStartDate(`${year}-07-01`);
                setEndDate(`${year}-09-30`);
                break;
            case '4':
                setStartDate(`${year}-10-01`);
                setEndDate(`${year}-12-31`);
                break;
            default:
                break;
        }
    }


    const handleYearChange = (e) => {
        const selectedYear = e.target.value;
        setYear(selectedYear);
        setStartDate(`${selectedYear}-01-01`);
        setEndDate(`${selectedYear}-12-31`);
    }


    return (
        <>
            <div className="container" style={{ maxWidth: "1600px" }}>
                <div className="row justify-content-center">
                    <div className="col-sm-12">
                        <h2 style={{ color: '#3b3bf5', marginTop: '20px' }}>Báo cáo xuât nhập</h2>
                        <div className="row no-gutters my-3 d-flex justify-content-between">
                            <Row className="align-items-center">
                                {roleId === 1 ?
                                    <Col md={2}>
                                        <DropdownButton
                                            className="DropdownButtonCSS ButtonCSSDropdown"
                                            title={selectedWarehouse ? selectedWarehouse : "Hải Phòng"}
                                            variant="success"
                                            style={{ zIndex: 999 }}
                                        >


                                            {/* <Dropdown.Item eventKey=""
                                                onClick={() => handleStorageClickTotal()}>Tất cả kho</Dropdown.Item> */}


                                            {totalWarehouse && totalWarehouse.length > 0 && totalWarehouse.map((c, index) => (
                                                <Dropdown.Item
                                                    key={`warehouse ${index}`}
                                                    eventKey={c.warehouseName}
                                                    onClick={(e) => handleStorageClick(c, e)}
                                                >
                                                    {c.warehouseName}
                                                </Dropdown.Item>
                                            ))}
                                        </DropdownButton>
                                    </Col>
                                    : ''
                                }




                                <Col md={2} className="px-md-1 d-flex align-items-center">
                                    <DropdownButton
                                        title={getTitle()}
                                        variant="success"
                                        className="DropdownButtonCSS ButtonCSSDropdown"
                                        style={{ zIndex: 999 }}
                                    >
                                        <Dropdown.Item eventKey="Date"
                                            onClick={() => handleSelectAction('date')}
                                        >Chọn theo ngày</Dropdown.Item>
                                        <Dropdown.Item eventKey="Month"
                                            onClick={() => handleSelectAction('month')}
                                        >Chọn theo tháng</Dropdown.Item>
                                        <Dropdown.Item eventKey="Quarter"
                                            onClick={() => handleSelectAction('quarter')}
                                        >Chọn theo quý</Dropdown.Item>
                                        <Dropdown.Item eventKey="Year"
                                            onClick={() => handleSelectAction('year')}
                                        >Chọn theo năm</Dropdown.Item>
                                    </DropdownButton>
                                </Col>


                                {showMode === 'date' && (
                                    <>
                                        <Col md={2} className="px-md-1 d-flex align-items-center">
                                            <div className="input-group mb-3">
                                                <h6>Ngày bắt đầu</h6>
                                                <input type="date" className="datepickerCSS" id="datepickerStart" value={startDate} onChange={hanldStartDate} />
                                            </div>
                                        </Col>


                                        <Col md={2} className="px-md-1">
                                            <div className="input-group mb-3">
                                                <h6>Ngày kết thúc</h6>
                                                <input type="date" className="datepickerCSS" id="datepickerEnd" value={endDate} onChange={hanldEndDate} />
                                            </div>
                                        </Col>
                                    </>
                                )}


                                {showMode === 'month' && (
                                    <>
                                        <Col md={2} className="px-md-1 d-flex align-items-center">
                                            <div className="input-group mb-3">
                                                <h6>Chọn tháng</h6>
                                                <input type="month" className="datepickerCSS" id="monthpicker" value={Month} onChange={handlMonth} />
                                            </div>
                                        </Col>
                                    </>
                                )}


                                {showMode === 'quarter' && (
                                    <>
                                        <Col md={2} className="px-md-1 d-flex align-items-center">
                                            <DropdownButton
                                                title="Chọn Quý"
                                                variant="success"
                                                className="DropdownButtonCSS ButtonCSSDropdown"
                                                style={{ zIndex: 999 }}
                                            >
                                                <Dropdown.Item eventKey="1"
                                                    onClick={() => setQuarter('1', year)}
                                                >Quý 1</Dropdown.Item>
                                                <Dropdown.Item eventKey="2"
                                                    onClick={() => setQuarter('2', year)}
                                                >Quý 2</Dropdown.Item>
                                                <Dropdown.Item eventKey="3"
                                                    onClick={() => setQuarter('3', year)}
                                                >Quý 3</Dropdown.Item>
                                                <Dropdown.Item eventKey="4"
                                                    onClick={() => setQuarter('4', year)}
                                                >Quý 4</Dropdown.Item>
                                            </DropdownButton>
                                        </Col>
                                    </>
                                )}


                                {showMode === 'year' && (
                                    <>
                                        <Col md={2} className="px-md-1 d-flex align-items-center">
                                            <div className="input-group mb-3">
                                                <h6>Chọn năm</h6>
                                                <input type="number" className="datepickerCSS" id="yearpicker" value={year} onChange={handleYearChange} />
                                            </div>
                                        </Col>
                                    </>
                                )}


                            </Row>
                        </div>




                        <div className="table-responsive" style={{ overflowY: 'auto', overflowX: 'auto' }}>
                            <Table className="table text-center table-border table-hover  border-primary table-sm">
                                <thead>
                                    <tr>
                                        <th className="align-middle  text-nowrap position-sticky" style={{ left: 0 }}>STT</th>
                                        <th className="align-middle  text-nowrap">Tên sản phẩm</th>
                                        <th className="align-middle  text-nowrap">Đơn vị tính</th>
                                        <th className="align-middle  text-nowrap">Tồn đầu kì</th>
                                        <th className="align-middle  text-nowrap">Nhập trong kì</th>
                                        <th className="align-middle  text-nowrap">Xuất trong kì</th>
                                        <th className="align-middle  text-nowrap">Tồn kho cuối kì</th>
                                    </tr>
                                </thead>
                                <tbody>


                                    {inventoryData && inventoryData.length > 0
                                        && inventoryData.map((i, index) => (
                                            <tr key={`inventory${index}`}>
                                                <td className="align-middle position-sticky" style={{ left: 0 }}>{index + 1}</td>
                                                <td className="align-middle">{i.productName}</td>
                                                <td className="align-middle">{i.measureUnit}</td>
                                                <td className="align-middle">{i.initialBalance}</td>
                                                <td className="align-middle">{i.imports}</td>
                                                <td className="align-middle">{i.exports}</td>
                                                <td className="align-middle">{i.balance}</td>




                                            </tr>
                                        ))}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
};


export default InventoryAll;



