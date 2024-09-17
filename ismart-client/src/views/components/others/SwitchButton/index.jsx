import { Form } from 'react-bootstrap';
import './SwitchButton.css'

const SwitchButton = ({ status, handleChangeStatus }) => {
    return (
        <Form>
            <Form.Check
                type="switch"
                className="custom-switch"
                id="custom-switch"
                label={status === 1 ? "Đang hợp tác" : "Ngừng hợp tác"}
                checked={status === 1 ? true : false}
                onChange={handleChangeStatus}
            />
        </Form>
    )
}

export default SwitchButton