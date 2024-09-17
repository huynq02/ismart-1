import logo from '../../../assets/images/logo.png';
import shape from '../../../assets/images/Shape.png';
import GlobalStyles from '~/components/GlobalStyles';
import { Form, Button, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import { loginApi } from '~/services/LoginServices';
import { Link } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const { loginContext } = useContext(UserContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showWarning, setShowWarning] = useState(false);
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let token = localStorage.getItem('token');
        if (token) {
            navigate('/thong-ke');
        }
    }, [navigate]);

    const handleLogin = async (event) => {
        event.preventDefault();
        setLoading(true);
        await delay(500);
        if (!username || !password) {
            toast.error('Vui lòng nhập tài khoản và mật khẩu');
            setLoading(false);
            return;
        }
        try {
            let res = await loginApi(username, password);
            if (res && res.status === 400) {
                toast.error('Sai tên tài khoản hoặc mật khẩu!');
            } else if (res.token) {
                loginContext(username, res.token.accessToken, res.userId, res.roleId, res.warehouseId);
                if (res.roleId === 1 || res.roleId === 2 || res.roleId === 4) {
                    navigate("/thong-ke");
                } else if (res.roleId === 3) {
                    navigate("/cac-lo-hang-nhap-ngoai");
                }
                setLoading(false);
            } else {
                toast.error('Sai tên tài khoản hoặc mật khẩu!');
                setLoading(false);
            }
        } catch (error) {
            toast.error('Đã xảy ra lỗi, vui lòng thử lại sau.');
            setLoading(false);
        }
        setLoading(false);
    }

    function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    return (
        <div className="sign-in__wrapper">
            <div className="sign-in__backdrop"></div>
            <Form className="shadow p-4 bg-white rounded" onSubmit={handleLogin}>
                <img
                    className=" mx-auto d-block mb-2"
                    src={logo}
                    alt="logo"
                    width={200}
                />
                <div className="h4 mb-2 text-center" style={{ color: '#2275b7 ' }}>Đăng nhập</div>
                <Form.Group className="mb-2" controlId="username">
                    <Form.Label style={{ color: '#2275b7 ' }}>Tên tài khoản</Form.Label>
                    <Form.Control
                        className='inputCSS'
                        type="text"
                        placeholder="Tên tài khoản"
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-2" controlId="password">
                    <Form.Label style={{ color: '#2275b7 ' }}>Mật khẩu</Form.Label>
                    <Form.Control
                        className='inputCSS'
                        type="password"
                        placeholder="Mật khẩu"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>
                <br />
                {!loading ? (
                    <Button className="w-100 ButtonCSS" variant="primary" type="submit">
                        Đăng nhập
                    </Button>
                ) : (
                    <Button className="w-100 ButtonCSS" variant="primary" type="submit" disabled>
                        <div className="spinner-border" role="status">
                        </div>
                    </Button>
                )}
                <div className="d-grid justify-content-end">
                    <a href="/quen-mat-khau" className="text-muted px-0">
                        Forgot password?
                    </a>
                </div>
            </Form>
        </div>
    );
};

export default Login;
