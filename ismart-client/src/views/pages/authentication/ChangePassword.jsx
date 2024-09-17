import logo from '../../../assets/images/logo.png';
import GlobalStyles from '~/components/GlobalStyles';
import { Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import { changePassword } from '~/services/LoginServices';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const userIdString = localStorage.getItem('userId');
    const userId = parseInt(userIdString, 10);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        await delay(500);
        let response = await changePassword(userId, newPassword, oldPassword);
        if (response === 'Thành công') {
            toast.success('Đổi mật khẩu thành công');
            setLoading(false);
            logout();
            navigate('/dang-nhap');
        }
        else {
            toast.error('Đổi mật khẩu không thành công');
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('warehouseId');
        localStorage.removeItem('token');
        localStorage.removeItem('roleId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userId');
        localStorage.removeItem('selectedItem');
    };

    function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    return (
        <div className="sign-in__wrapper">
            <Form className="shadow p-4 bg-white rounded" onSubmit={handleChangePassword}>
                <img
                    className=" mx-auto d-block mb-2"
                    src={logo}
                    alt="logo"
                    width={200}
                />
                <div className="h4 mb-2 text-center" style={{ color: '#2275b7 ' }}>Đổi mật khẩu</div>
                <Form.Group className="mb-2" controlId="username">
                    <Form.Label style={{ color: '#2275b7 ' }}>Mật khẩu cũ</Form.Label>
                    <Form.Control
                        className='inputCSS'
                        type="text"
                        placeholder="Mật khẩu cũ"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-2" controlId="password">
                    <Form.Label style={{ color: '#2275b7 ' }}>Mật khẩu mới</Form.Label>
                    <Form.Control
                        className='inputCSS'
                        type="password"
                        placeholder="Mật khẩu mới"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </Form.Group>
                <br />
                {!loading ? (
                    <Button className="w-100 ButtonCSS" variant="primary" type="submit">
                        Đổi mật khẩu
                    </Button>
                ) : (
                    <Button className="w-100 ButtonCSS" variant="primary" type="submit" disabled>
                        <div className="spinner-border" role="status">
                        </div>
                    </Button>
                )}
            </Form>
        </div>
    );
};

export default ChangePassword;
