import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { Dropdown } from 'react-bootstrap';


const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <div> {/* Container cho CustomToggle */}
        <a
            href=""
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}
            style={{
                display: 'inline-block',
                padding: '5px 12px',
                backgroundColor: '#2275b7',
                color: '#fff',
                border: '1px solid #2275b7',
                borderRadius: '8px',
                textDecoration: 'none',
                cursor: 'pointer',
                textAlign: 'center',

            }}
        >
            {children}
            <span style={{ marginLeft: '4px' }}>&#x25bc;</span>
        </a>
    </div>
));

const CustomMenu = React.forwardRef(
    ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
        const [value, setValue] = useState('');

        return (
            <div
                ref={ref}
                style={{
                    ...style,
                    top: '100%', // Hiển thị phía dưới của CustomToggle
                    left: 0, // Dọc theo cạnh trái của CustomToggle
                    minWidth: '10rem', // Chiều rộng tối thiểu
                    backgroundColor: 'white', // Màu nền trắng
                    border: '1px solid rgba(0,0,0,.15)', // Viền đen nhẹ
                    borderRadius: '0.25rem', // Góc bo tròn
                    zIndex: 9999, // Đảm bảo hiển thị trên các thành phần khác
                    boxShadow: '0 0.5rem 1rem rgba(0,0,0,.15)', // Hiệu ứng bóng đổ,
                    maxHeight: '200px', // Đặt chiều cao tối đa cho menu
                    overflowY: 'auto', // Tạo thanh cuộn dọc khi cần thiết
                    transform: 'translate3d(0px, 0px, 0px)'
                }}
                className={className}
                aria-labelledby={labeledBy}
            >
                <Form.Control
                    autoFocus
                    className="mx-3 my-2 w-auto inputCSS"
                    placeholder="Tìm kiếm"
                    onChange={(e) => setValue(e.target.value)}
                    value={value}
                />
                <ul className="list-unstyled ">
                    {React.Children.toArray(children).filter(
                        (child) =>
                            !value || child.props.children.toLowerCase().includes(value.toLowerCase()),
                    )}
                </ul>
            </div>
        );
    },
);

export { CustomMenu, CustomToggle }
