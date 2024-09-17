import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Navbar, NavDropdown, Image } from 'react-bootstrap';
import logo from '../../assets/images/logo.png';
import { Link } from 'react-router-dom';


const Sidebar = () => {
    const roleId = parseInt(localStorage.getItem('roleId'), 10);
    const [isInventoryOpen, setIsInventoryOpen] = useState(false);


    const [isImportOrderOpen, setIsImportOrderOpen] = useState(false);  // Import Order
    const [isExportOrderOpen, setIsExportOrderOpen] = useState(false);  // Export Order
    const [selectedItem, setSelectedItem] = useState(() => {
        return localStorage.getItem('selectedItem') || '';
    });
    const toggleInventory = () => setIsInventoryOpen(!isInventoryOpen);
    const toggleImportOrder = () => setIsImportOrderOpen(!isImportOrderOpen);
    const toggleExportOrder = () => setIsExportOrderOpen(!isExportOrderOpen);


    const handleSelectItem = (item) => {
        setSelectedItem(item);
        localStorage.setItem('selectedItem', item);
    };


    return (
        <>
            <Col sm={3} md={3} xl={2} className="px-sm-2 px-0" style={{ width: '240px', }}>
                <div className="d-flex flex-column align-items-center px-3 pt-2 text-white min-vh-100">
                    <br />
                    <a href="/thong-ke">
                        <img className="d-flex justify-content-between" width={"100px"} src={logo} />
                    </a>
                    <br />
                    <Nav
                        className=" flex-column  mb-sm-auto mb-0 align-items-center align-items-sm-start"
                        id="menu"
                    >
                        {
                            (roleId == 1 || roleId == 2 || roleId == 4) ?
                                <Nav.Item className="mb-2 ">
                                    <Nav.Link as={Link} to="/thong-ke"
                                        className={`align-middle sidebar-item text-sidebar px-0 d-flex justify-content-between rounded-3 ${selectedItem === '/thong-ke' ? 'ButtonCSS text-white' : ''}`}
                                        style={{ width: 180 }}
                                        onClick={() => handleSelectItem('/thong-ke')}
                                    >
                                        <div className="d-flex" style={{ marginLeft: 15 }}>
                                            <div style={{ width: 30 }}>
                                                <i className="fa-solid fa-gauge-high"></i>
                                            </div>
                                            <div>
                                                <span className=" d-none d-sm-inline ">Thống kê</span>
                                            </div>
                                        </div>
                                    </Nav.Link>
                                </Nav.Item>
                                : ''
                        }


                        {
                            (roleId == 1 || roleId == 2 || roleId == 4) ?
                                <Nav.Item className="mb-2">
                                    <Nav.Link as={Link} to="/kho-3d"
                                        className={`align-middle sidebar-item text-sidebar px-0 d-flex justify-content-between rounded-3 ${selectedItem === '/kho-3d' ? 'ButtonCSS text-white' : ''}`} style={{ width: 180 }}
                                        onClick={() => handleSelectItem('/kho-3d')}
                                    >
                                        <div className="d-flex" style={{ marginLeft: 15 }}>
                                            <div style={{ width: 30 }}>
                                                <i className="fa-solid fa-cube"></i>
                                            </div>
                                            <div>
                                                <span className="ms-1 d-none d-sm-inline">Tạo Kho 3D</span>
                                            </div>
                                        </div>
                                    </Nav.Link>
                                </Nav.Item>
                                : ''
                        }




                        <Nav.Item className="mb-2">
                            <Nav.Link as={Link} to="/danh-sach-mat-hang"
                                className={`align-middle sidebar-item text-sidebar px-0 d-flex justify-content-between rounded-3
                                    ${selectedItem === '/danh-sach-mat-hang' ?
                                        'ButtonCSS text-white' : ''}`} style={{ width: 180 }}
                                onClick={() => handleSelectItem('/danh-sach-mat-hang')}
                            >
                                <div className="d-flex" style={{ marginLeft: 15 }}>
                                    <div style={{ width: 30 }}>
                                        <i className="fa-solid fa-cookie"></i>
                                    </div>
                                    <div>
                                        <span className="ms-1 d-none d-sm-inline">Hàng hóa</span>
                                    </div>
                                </div>
                            </Nav.Link>
                        </Nav.Item>










                        <Nav.Item className="mb-2">
                            <Nav.Link as={Link} to=""
                                className="align-middle sidebar-item text-sidebar px-0 d-flex justify-content-between"
                                style={{ width: 180 }}
                                onClick={toggleInventory} // Prevent default to not navigate immediately
                            >
                                <div className="d-flex" style={{ marginLeft: 15 }}>
                                    <div style={{ width: 30 }}>
                                        <i className="fa-solid fa-warehouse"></i>
                                    </div>
                                    <div>
                                        <span className="ms-1 d-none d-sm-inline">Tồn kho</span>
                                    </div>
                                </div>
                                <div>
                                    <i className={`fa-solid ${isInventoryOpen ? 'fa-angle-down' : 'fa-angle-right'}`}></i>
                                </div>
                            </Nav.Link>
                            {isInventoryOpen && (
                                <Nav className="flex-column pl-4">
                                    <Nav.Item className="mb-1">
                                        <Nav.Link as={Link} to="/quan-ly-ton-kho-nhap"
                                            className={`align-middle sidebar-item text-sidebar px-0 d-flex justify-content-between rounded-3 ${selectedItem === '/quan-ly-ton-kho-nhap' ? 'ButtonCSS text-white' : ''}`} style={{ width: 180 }}
                                            onClick={() => handleSelectItem('/quan-ly-ton-kho-nhap')}
                                        >
                                            <div className="d-flex" style={{ marginLeft: 25 }}>
                                                <div style={{ width: 30 }}>
                                                    <i className="fa-solid fa-warehouse " style={{ fontSize: '14px' }}></i>
                                                </div>
                                                <div>
                                                    <span className="ms-1 d-none d-sm-inline" style={{ fontSize: '14px' }}>Báo cáo hàng nhập</span>
                                                </div>
                                            </div>
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item className="mb-1">
                                        <Nav.Link as={Link} to="/quan-ly-ton-kho-xuat"
                                            className={`align-middle sidebar-item text-sidebar px-0 d-flex justify-content-between rounded-3 ${selectedItem === '/quan-ly-ton-kho-xuat' ? 'ButtonCSS text-white' : ''}`} style={{ width: 180 }}
                                            onClick={() => handleSelectItem('/quan-ly-ton-kho-xuat')}
                                        >
                                            <div className="d-flex" style={{ marginLeft: 25 }}>
                                                <div style={{ width: 30 }}>
                                                    <i className="fa-solid fa-warehouse " style={{ fontSize: '16px' }}></i>
                                                </div>
                                                <div>
                                                    <span className="ms-1 d-none d-sm-inline" style={{ fontSize: '14px' }}  >Báo cáo hàng xuất</span>
                                                </div>
                                            </div>
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item className="mb-1">
                                        <Nav.Link as={Link} to="/quan-ly-ton-all"
                                            className={`align-middle sidebar-item text-sidebar px-0 d-flex justify-content-between rounded-3 ${selectedItem === '/quan-ly-ton-all' ? 'ButtonCSS text-white' : ''}`} style={{ width: 180 }}
                                            onClick={() => handleSelectItem('/quan-ly-ton-all')}
                                        >
                                            <div className="d-flex" style={{ marginLeft: 25 }}>
                                                <div style={{ width: 30 }}>
                                                    <i className="fa-solid fa-warehouse " style={{ fontSize: '14px' }}></i>
                                                </div>
                                                <div>
                                                    <span className="ms-1 d-none d-sm-inline" style={{ fontSize: '14px' }} >Báo cáo xuất nhập </span>
                                                </div>
                                            </div>
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            )}
                        </Nav.Item>














                        <Nav.Item className="mb-2">
                            <Nav.Link as={Link} to=""
                                className="align-middle sidebar-item text-sidebar px-0 d-flex justify-content-between"
                                style={{ width: 180 }}
                                onClick={toggleImportOrder} // Prevent default to not navigate immediately
                            >
                                <div className="d-flex" style={{ marginLeft: 15 }}>
                                    <div style={{ width: 30 }}>
                                        <i className="fa-solid fa-dolly" style={{ fontSize: '16px' }}></i>
                                    </div>
                                    <div>
                                        <span className="ms-1 d-none d-sm-inline">Nhập hàng </span>
                                    </div>
                                </div>
                                <div>
                                    <i className={`fa-solid ${isImportOrderOpen ? 'fa-angle-down' : 'fa-angle-right'}`}></i>
                                </div>
                            </Nav.Link>
                        </Nav.Item>
                        {isImportOrderOpen && (
                            <Nav className="flex-column pl-4">
                                <Nav.Item className="mb-1">
                                    <Nav.Link as={Link} to="/cac-lo-hang-nhap-ngoai"
                                        className={`align-middle sidebar-item text-sidebar px-0 d-flex justify-content-between rounded-3 ${selectedItem === '/cac-lo-hang-nhap-ngoai' ? 'ButtonCSS text-white' : ''}`} style={{ width: 180 }}
                                        onClick={() => handleSelectItem('/cac-lo-hang-nhap-ngoai')}
                                    >
                                        <div className="d-flex" style={{ marginLeft: 25 }}>
                                            <div style={{ width: 30 }}>
                                                <i className="fa-solid fa-dolly" style={{ fontSize: '14px' }}></i>
                                            </div>
                                            <div>
                                                <span className="ms-1 d-none d-sm-inline" style={{ fontSize: '14px' }}>Nhập hàng <br /> từ nhà cung cấp</span>
                                            </div>
                                        </div>
                                    </Nav.Link>
                                </Nav.Item>


                                <Nav.Item className="mb-2">
                                    <Nav.Link as={Link} to="/cac-lo-hang-nhap-noi"
                                        className={`align-middle sidebar-item text-sidebar px-0 d-flex justify-content-between rounded-3 ${selectedItem === '/cac-lo-hang-nhap-noi' ? 'ButtonCSS text-white' : ''}`} style={{ width: 180 }}
                                        onClick={() => handleSelectItem('/cac-lo-hang-nhap-noi')}
                                    >
                                        <div className="d-flex" style={{ marginLeft: 25 }}>
                                            <div style={{ width: 30 }}>
                                                <i className="fa-solid fa-dolly" style={{ fontSize: '14px' }}></i>
                                            </div>
                                            <div>
                                                <span className="ms-1 d-none d-sm-inline" style={{ fontSize: '14px' }}>Nhập hàng <br /> giữa các kho</span>
                                            </div>
                                        </div>
                                    </Nav.Link>
                                </Nav.Item>
                            </Nav>
                        )}




                        <Nav.Item className="mb-2">
                            <Nav.Link as={Link} to=""
                                className="align-middle sidebar-item text-sidebar px-0 d-flex justify-content-between"
                                style={{ width: 180 }}
                                onClick={toggleExportOrder} // Prevent default to not navigate immediately
                            >
                                <div className="d-flex" style={{ marginLeft: 15 }}>
                                    <div style={{ width: 30 }}>
                                        <i className="fa-solid fa-truck-ramp-box" style={{ fontSize: '16px' }}></i>
                                    </div>
                                    <div>
                                        <span className="ms-1 d-none d-sm-inline">Xuất hàng </span>
                                    </div>
                                </div>
                                <div>
                                    <i className={`fa-solid ${isExportOrderOpen ? 'fa-angle-down' : 'fa-angle-right'}`}></i>
                                </div>
                            </Nav.Link>
                        </Nav.Item>


                        {isExportOrderOpen && (
                            <Nav className="flex-column pl-4">
                                <Nav.Item className="mb-2">
                                    <Nav.Link as={Link} to="/cac-lo-hang-xuat-khach-hang"
                                        className={`align-middle sidebar-item text-sidebar px-0 d-flex justify-content-between rounded-3 ${selectedItem === '/cac-lo-hang-xuat-khach-hang' ? 'ButtonCSS text-white' : ''}`} style={{ width: 180 }}
                                        onClick={() => handleSelectItem('/cac-lo-hang-xuat-khach-hang')}
                                    >
                                        <div className="d-flex" style={{ marginLeft: 25 }}>
                                            <div style={{ width: 30 }}>
                                                <i className="fa-solid fa-truck-ramp-box" style={{ fontSize: '14px' }}></i>
                                            </div>
                                            <div>
                                                <span className="ms-1 d-none d-sm-inline">Xuất hàng <br /> cho khách hàng </span>
                                            </div>
                                        </div>
                                        <div>
                                            {/* <i className="fa-solid fa-angle-right"></i> */}
                                        </div>
                                    </Nav.Link>
                                </Nav.Item>




                                <Nav.Item className="mb-2">
                                    <Nav.Link as={Link} to="/cac-lo-hang-xuat-noi"
                                        className={`align-middle sidebar-item text-sidebar px-0 d-flex justify-content-between rounded-3 ${selectedItem === '/cac-lo-hang-xuat-noi' ? 'ButtonCSS text-white' : ''}`} style={{ width: 180 }}
                                        onClick={() => handleSelectItem('/cac-lo-hang-xuat-noi')}
                                    >
                                        <div className="d-flex" style={{ marginLeft: 25 }}>
                                            <div style={{ width: 30 }}>
                                                <i className="fa-solid fa-truck-ramp-box" style={{ fontSize: '14px' }}></i>
                                            </div>
                                            <div>
                                                <span className="ms-1 d-none d-sm-inline">Xuất hàng<br /> giữa các kho </span>
                                            </div>
                                        </div>
                                        <div>
                                            {/* <i className="fa-solid fa-angle-right"></i> */}
                                        </div>
                                    </Nav.Link>
                                </Nav.Item>


                            </Nav>
                        )}
                        <Nav.Item className="mb-2">
                            <Nav.Link as={Link} to="/tra-lai-don-hang"
                                className={`align-middle sidebar-item text-sidebar px-0 d-flex justify-content-between rounded-3 ${selectedItem === '/tra-lai-don-hang' ? 'ButtonCSS text-white' : ''}`} style={{ width: 180 }}
                                onClick={() => handleSelectItem('/tra-lai-don-hang')}
                            >
                                <div className="d-flex" style={{ marginLeft: 15 }}>
                                    <div style={{ width: 30 }}>
                                        <i className="fa-solid fa-reply"></i>
                                    </div>
                                    <div>
                                        <span className="ms-1 d-none d-sm-inline">Trả lại hàng nhà cung cấp </span>
                                    </div>
                                </div>
                            </Nav.Link>
                        </Nav.Item>


                        {
                            (roleId == 1 || roleId == 2 || roleId == 4) ?
                                <Nav.Item className="mb-2">
                                    <Nav.Link as={Link} to="/kiem-ke"
                                        className={`align-middle sidebar-item text-sidebar px-0 d-flex justify-content-between rounded-3 ${selectedItem === '/kiem-ke' ? 'ButtonCSS text-white' : ''}`} style={{ width: 180 }}
                                        onClick={() => handleSelectItem('/kiem-ke')}
                                    >
                                        <div className="d-flex" style={{ marginLeft: 15 }}>
                                            <div style={{ width: 30 }}>
                                                <i className="fa-xl fa-duotone fa-badge-check fa-swap-opacity"></i>
                                            </div>
                                            <div>
                                                <span className="ms-1 d-none d-sm-inline">Kiểm hàng</span>
                                            </div>
                                        </div>
                                    </Nav.Link>
                                </Nav.Item>
                                : ''
                        }




                        {


                            <Nav.Item className="mb-2">
                                <Nav.Link as={Link} to="/cac-danh-muc"
                                    className={`align-middle sidebar-item text-sidebar px-0 d-flex justify-content-between rounded-3 ${selectedItem === '/cac-danh-muc' ? 'ButtonCSS text-white' : ''}`} style={{ width: 180 }}
                                    onClick={() => handleSelectItem('/cac-danh-muc')}
                                >
                                    <div className="d-flex" style={{ marginLeft: 15 }}>
                                        <div style={{ width: 30 }}>
                                            <i className="fa-solid fa-list"></i>
                                        </div>
                                        <div>
                                            <span className="ms-1 d-none d-sm-inline">Danh mục</span>
                                        </div>
                                    </div>
                                </Nav.Link>
                            </Nav.Item>


                        }


                        {
                            // (roleId == 1 || roleId == 2 || roleId == 4) ?
                            <Nav.Item className="mb-2">
                                <Nav.Link as={Link} to="/nha-cung-cap"
                                    className={`align-middle sidebar-item text-sidebar px-0 d-flex justify-content-between rounded-3 ${selectedItem === '/nha-cung-cap' ? 'ButtonCSS text-white' : ''}`} style={{ width: 180 }}
                                    onClick={() => handleSelectItem('/nha-cung-cap')}
                                >
                                    <div className="d-flex" style={{ marginLeft: 15 }}>
                                        <div style={{ width: 30 }}>
                                            <i className="fa-solid fa-building"></i>
                                        </div>
                                        <div>
                                            <span className="ms-1 d-none d-sm-inline">Nhà cung cấp</span>
                                        </div>
                                    </div>
                                </Nav.Link>
                            </Nav.Item>
                            // : ''
                        }
                        {
                            // (roleId == 1 || roleId == 2 || roleId == 4) ?
                            <Nav.Item className="mb-2">
                                <Nav.Link as={Link} to="/quan-ly-khach-hang"
                                    className={`align-middle sidebar-item text-sidebar px-0 d-flex justify-content-between rounded-3 ${selectedItem === '/quan-ly-khach-hang' ? 'ButtonCSS text-white' : ''}`} style={{ width: 180 }}
                                    onClick={() => handleSelectItem('/quan-ly-khach-hang')}
                                >
                                    <div className="d-flex" style={{ marginLeft: 15 }}>
                                        <div style={{ width: 30 }}>
                                            <i className="fa-solid fa-user"></i>
                                        </div>
                                        <div>
                                            <span className="ms-1 d-none d-sm-inline">Khách hàng</span>
                                        </div>
                                    </div>
                                </Nav.Link>
                            </Nav.Item>
                            // : ''
                        }
                        {
                            // (roleId == 1 || roleId == 2) ?
                            <Nav.Item className="mb-2">
                                <Nav.Link as={Link} to="/cac-kho-hang"
                                    className={`align-middle sidebar-item text-sidebar px-0 d-flex justify-content-between rounded-3 ${selectedItem === '/cac-kho-hang' ? 'ButtonCSS text-white' : ''}`} style={{ width: 180 }}
                                    onClick={() => handleSelectItem('/cac-kho-hang')}
                                >
                                    <div className="d-flex" style={{ marginLeft: 15 }}>
                                        <div style={{ width: 30 }}>
                                            <i className="fa-sharp fa-solid fa-warehouse"></i>
                                        </div>
                                        <div>
                                            <span className="ms-1 d-none d-sm-inline">Kho hàng</span>
                                        </div>
                                    </div>
                                </Nav.Link>
                            </Nav.Item>
                            // : ''
                        }


                        {
                            // (roleId == 1 || roleId == 2) ?
                            <Nav.Item className="mb-2">
                                <Nav.Link as={Link} to="/ben-van-chuyen"
                                    className={`align-middle sidebar-item text-sidebar px-0 d-flex justify-content-between rounded-3 ${selectedItem === '/ben-van-chuyen' ? 'ButtonCSS text-white' : ''}`} style={{ width: 180 }}
                                    onClick={() => handleSelectItem('/ben-van-chuyen')}
                                >
                                    <div className="d-flex" style={{ marginLeft: 15 }}>
                                        <div style={{ width: 30 }}>
                                            <i className="fa-duotone fa-truck"></i>
                                        </div>
                                        <div>
                                            <span className="ms-1 d-none d-sm-inline">Bên vận chuyển</span>
                                        </div>
                                    </div>
                                </Nav.Link>
                            </Nav.Item>
                            // : ''
                        }


                        {
                            roleId == 1 ?
                                <Nav.Item className="mb-2">
                                    <Nav.Link as={Link} to="/quan-ly-tai-khoan"
                                        className={`align-middle sidebar-item text-sidebar px-0 d-flex justify-content-between rounded-3 ${selectedItem === '/quan-ly-tai-khoan' ? 'ButtonCSS text-white' : ''}`} style={{ width: 180 }}
                                        onClick={() => handleSelectItem('/quan-ly-tai-khoan')}
                                    >
                                        <div className="d-flex" style={{ marginLeft: 15 }}>
                                            <div style={{ width: 30 }}>
                                                <i className="fa-solid fa-user"></i>
                                            </div>
                                            <div>
                                                <span className="ms-1 d-none d-sm-inline">Tài khoản</span>
                                            </div>
                                        </div>
                                    </Nav.Link>
                                </Nav.Item>
                                : ''
                        }
                    </Nav>
                </div>
            </Col>
        </>
    );
};


export default Sidebar;





