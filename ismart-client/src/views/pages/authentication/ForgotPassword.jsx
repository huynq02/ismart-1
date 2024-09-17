import logo from '../../../assets/images/logo.png';
import GlobalStyles from '~/components/GlobalStyles';
import { Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import { forgotPassword } from '~/services/LoginServices';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        await delay(500);
        let response = await forgotPassword(username);
        if (response.statusCode === 200) {
            toast.success('Đã gửi thành công, vui lòng kiểm tra email');
            setLoading(false);
            navigate("/");
        }
        else {
            toast.error('Không tìm thấy tên đăng nhập của bạn');
            setLoading(false);
        }
    };

    function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    return (
        <div className="sign-in__wrapper">
            <div className="sign-in__backdrop"></div>
            <Form className="shadow p-4 bg-white rounded" onSubmit={handleSubmit}>
                <img
                    className=" mx-auto d-block mb-2"
                    src={logo}
                    alt="logo"
                    width={200}
                />
                <div className="h4 mb-2 text-center" style={{ color: '#2275b7 ' }}>Lấy lại mật khẩu</div>
                <Form.Group className="mb-2" controlId="username">
                    <Form.Control
                        className='inputCSS'
                        type="text"
                        placeholder="Nhập tên đăng nhập"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        required
                    />
                    <label style={{ color: 'red', fontStyle: 'italic', fontSize: 'small' }}>
                        Vui lòng nhập tên đăng nhập của bạn, chúng tôi sẽ gửi mật khẩu mới, hãy dùng nó để đăng nhập hoặc thay đổi mật khẩu
                    </label>
                </Form.Group>
                <br />
                {!loading ? (
                    <Button className="w-100 ButtonCSS" variant="primary" type="submit">
                        Lấy lại mật khẩu
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

export default ForgotPassword;
