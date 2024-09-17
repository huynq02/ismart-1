import { Form } from 'react-bootstrap';
import './SwitchButton.css'

const SwitchButtonUser = ({ status, handleChangeStatus }) => {
    return (
        <Form>
            <Form.Check
                type="switch"
                className="custom-switch"
                id="custom-switch"
                label={status === 1 ? "Đang làm việc" : "Ngừng làm việc"}
                checked={status === 1 ? true : false}
                onChange={handleChangeStatus}
            />
        </Form>
    )
}

export default SwitchButtonUser