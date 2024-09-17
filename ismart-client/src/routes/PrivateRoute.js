
import { useContext,  useState } from 'react';
import { UserContext } from '../context/UserContext';



const PrivateRoute = (props) => {
    const { user } = useContext(UserContext);
    const [show, setShow] = useState(true);
    if (user) {
        return <>
            {props.children}
        </>
    }
    else {
        return (
            <>
                <div
                    className="access-denied "
                >
                    <h1>Bạn không có quyền truy cập vào đây</h1>
                </div>
            </>
        )
    }
}

export default PrivateRoute;