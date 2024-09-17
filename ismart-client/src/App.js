
import { ToastContainer, toast } from 'react-toastify';
import { useContext, useEffect } from 'react';
import { UserContext } from './context/UserContext'
import AppRoutes from './routes/AppRoutes';
function App() {
    const { loginContext } = useContext(UserContext);
    // useEffect(() => {
    //     // Xóa hết dữ liệu trên localStorage khi bắt đầu chạy ứng dụng
    //     localStorage.clear();
    // }, []);
    
    useEffect(() => {
        if (localStorage.getItem('token')) {
            loginContext(localStorage.getItem('userName'), localStorage.getItem('token'))
        }
    }, [])
    return (
        <>
            <div className="app">
                <AppRoutes />
            </div>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </>

    );
}

export default App;
