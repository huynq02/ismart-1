import { Navbar, Nav, NavDropdown, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import ProfileDetail from '../profiles/ProfileDetail';
import ConfirmImport from '../confirm/ConfirmImport';
import ConfirmExport from '../confirm/ConfirmExport';
import ConfirmReturn from '../confirm/ConfirmReturn';

function NavbarCom() {

    const { logout, user } = useContext(UserContext);
    const [hideHeader, setHideHeader] = useState(false);

    const [isShowProfileDetail, setIsShowProfileDetail] = useState(false);

    const userId = parseInt(localStorage.getItem('userId'), 10);
    const roleId = parseInt(localStorage.getItem('roleId'), 10); // Lấy roleId từ localStorage
    const warehouseId = parseInt(localStorage.getItem('warehouseId'), 10); // Lấy warehouseId từ localStorage
    const [showNotifications, setShowNotifications] = useState(false);

    const [unreadMessages, setUnreadMessages] = useState([]);  // Chứa các thông báo chưa đọc
    const [readMessages, setReadMessages] = useState([]);  // Chứa các thông báo đã đọc
    const [showUnread, setShowUnread] = useState(true);  // Quản lý việc hiển thị thông báo "Chưa đọc" hoặc "Đã đọc"

    const [isShowModelConfirmEmport, setIsShowModelConfirmEmport] = useState(false);
    const [isShowModelConfirmImport, setIsShowModelConfirmImport] = useState(false);
    const [isShowModelConfirmReturn, setIsShowModelConfirmReturn] = useState(false);

    const [dataImportOrder, setDataImportOrder] = useState({});
    const [dataEmportOrder, setDataEmportOrder] = useState({});
    const [dataReturnOrder, setDataReturnOrder] = useState({});

    const navigate = useNavigate();
    useEffect(() => {
        if (window.location.pathname === '/dang-nhap' || window.location.pathname === '/') {
            setHideHeader(true);
        }
    }, []);

    useEffect(() => {
        const socket = new WebSocket('wss://localhost:7033/ws');

        socket.onopen = () => {
            console.log('WebSocket connected');
        };

        socket.onmessage = (event) => {
            const message = event.data;
            const idMatch = message.match(/ID (\d+)/);
            const roleId = parseInt(localStorage.getItem('roleId'), 10);
            const localWarehouseId = parseInt(localStorage.getItem('warehouseId'), 10);

            if (idMatch) {
                const importId = idMatch[1];
                localStorage.setItem('importOrderId', importId);

                if (roleId === 1) {
                    setUnreadMessages(prevMessages => [...prevMessages, message]);
                } else if (roleId === 2) {
                    const warehouseIdMatch = message.match(/warehouseId: (\d+)/);
                    if (warehouseIdMatch) {
                        const messageWarehouseId = parseInt(warehouseIdMatch[1], 10);
                        if (messageWarehouseId === localWarehouseId) {
                            setUnreadMessages(prevMessages => [...prevMessages, message]);
                        } else {
                            console.warn("Message warehouseId does not match local warehouseId: ", message);
                        }
                    } else {
                        console.warn("Message does not contain a valid warehouseId: ", message);
                    }
                }
            } else {
                console.warn("Message does not contain a valid ID: ", message);
                setUnreadMessages(prevMessages => [...prevMessages, message]);
            }
        };

        return () => {
            socket.close();
        };
    }, []);

    const handleNotificationClick = async (index) => {
        const selectedMessage = unreadMessages[index];
        const idMatch = selectedMessage.match(/ID (\d+)/);
        const codeMatch = selectedMessage.match(/mã (\w+)/);

        if (idMatch && codeMatch) {
            const Id = idMatch[1];
            const code = codeMatch[1];


            localStorage.setItem('importOrderId', Id);

            if (code.startsWith('IM')) {
                setIsShowModelConfirmImport(true);
                setDataImportOrder({ importId: Id });
            } else if (code.startsWith('XH')) {
                setIsShowModelConfirmEmport(true);
                setDataEmportOrder({ exportId: Id });
            } else if (code.startsWith('RO')) {
                setIsShowModelConfirmReturn(true);
                setDataReturnOrder({ returnId: Id });
            }

            setReadMessages(prevMessages => [...prevMessages, selectedMessage]);
            setUnreadMessages(prevMessages => prevMessages.filter((_, i) => i !== index));
        } else {
            console.warn("Selected message does not contain a valid ID or code: ", selectedMessage);
        }
    };


    const renderNotificationMessage = (message) => {
        return message.replace(/ID \d+/, '').replace(/warehouseId: \d+/, '').trim();
    };

    const handleLogout = () => {
        logout();
        toast.success("Đăng xuất thành công");
        navigate('/dang-nhap');
    };

    return (
        <>
            <Navbar expand="lg" style={{ background: '#2275b7 ' }}>
                {!hideHeader &&
                    <Container>
                        <Navbar.Toggle aria-controls="navbarSupportedContent" />
                        <Navbar.Collapse id="navbarSupportedContent">
                            <Nav className="me-auto">
                            </Nav>
                            <Nav className="d-flex align-items-center">
                                {(roleId === 1 || roleId === 2) && (
                                    <div style={{ position: 'relative', display: 'inline-block' }}>
                                        <i className="fa-solid fa-bell text-white" style={{ cursor: 'pointer' }} onClick={() => setShowNotifications(!showNotifications)}></i>
                                        {unreadMessages.length > 0 && (
                                            <span className="notification-count" style={{
                                                position: 'absolute',
                                                top: '-5px',
                                                right: '-5px',
                                                background: 'red',
                                                borderRadius: '50%',
                                                color: 'white',
                                                fontSize: '10px',
                                                width: '15px',
                                                height: '15px',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}>{unreadMessages.length}</span>
                                        )}
                                    </div>
                                )}
                                <div style={{ position: 'absolute', left: '65%', transform: 'translateX(-50%)', zIndex: '3' }}>
                                    <NavDropdown
                                        id="navbarDropdownMenuAvatarNoti"
                                        className='ButtonCSSDropdownnoti'
                                        show={showNotifications}
                                    >
                                        <h5 style={{ marginLeft: '10px' }}>Thông báo</h5>

                                        {/* Thêm nút "Chưa đọc" và "Đã đọc" bên trong NavDropdown */}
                                        <div className="d-flex justify-content-center">
                                            <Button variant={showUnread ? "primary" : "light"} onClick={() => setShowUnread(true)}>Chưa đọc</Button>
                                            <Button variant={!showUnread ? "primary" : "light"} onClick={() => setShowUnread(false)}>Đã đọc</Button>
                                        </div>
                                        <hr />

                                        {/* Hiển thị thông báo dựa trên trạng thái "Chưa đọc" hoặc "Đã đọc" */}
                                        {showUnread ? (
                                            unreadMessages.length === 0 ? (
                                                <NavDropdown.Item>Không có thông báo chưa đọc</NavDropdown.Item>
                                            ) : (
                                                unreadMessages.map((message, index) => (
                                                    <NavDropdown.Item key={index}
                                                        className='ButtonCSSDropdownnotify'
                                                        onClick={() => handleNotificationClick(index)}>
                                                        {renderNotificationMessage(message)}
                                                    </NavDropdown.Item>
                                                ))
                                            )
                                        ) : (
                                            readMessages.length === 0 ? (
                                                <NavDropdown.Item>Không có thông báo đã đọc</NavDropdown.Item>
                                            ) : (
                                                readMessages.map((message, index) => (
                                                    <NavDropdown.Item key={index}
                                                        className='ButtonCSSDropdownnotify'>
                                                        {renderNotificationMessage(message)}
                                                    </NavDropdown.Item>
                                                ))
                                            )
                                        )}
                                    </NavDropdown>
                                </div>
                                <span style={{ margin: '0 10px' }}></span>
                                <i className="fa-solid fa-user text-white"></i>
                                <NavDropdown
                                    title={<span className="text-white">Chào bạn {user.userName}</span>}
                                    id="navbarDropdownMenuAvatar"
                                    className='ButtonCSSDropdown text-white'
                                    style={{ color: 'white' }}
                                >
                                    {user && user.auth === true ? <NavDropdown.Item onClick={() => setIsShowProfileDetail(true)}>Hồ sơ</NavDropdown.Item> : ''}
                                    <NavDropdown.Item as={Link} to="/doi-mat-khau">Đổi mật khẩu</NavDropdown.Item>
                                    {user && user.auth === true ? <NavDropdown.Item onClick={handleLogout}>Đăng xuất</NavDropdown.Item> : <NavDropdown.Item as={Link} to="/dang-nhap">Đăng nhập</NavDropdown.Item>}
                                </NavDropdown>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                }
            </Navbar>

            <ProfileDetail isShow={isShowProfileDetail} handleClose={() => setIsShowProfileDetail(false)} userId={userId} />
            <ConfirmImport isShow={isShowModelConfirmImport}
                handleClose={() => setIsShowModelConfirmImport(false)}
                dataImportOrder={dataImportOrder}
            />
            <ConfirmExport isShow={isShowModelConfirmEmport}
                handleClose={() => setIsShowModelConfirmEmport(false)}
                dataEmportOrder={dataEmportOrder}
            />
            <ConfirmReturn isShow={isShowModelConfirmReturn}
                handleClose={() => setIsShowModelConfirmReturn(false)}
                dataReturnOrder={dataReturnOrder}
            />
        </>
    );
};

export default NavbarCom;
