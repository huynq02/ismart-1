import { format } from 'date-fns';


const validatePhone = /^(84|0[3|5|7|8|9])+([0-9]{8})$/;

const validateTextRequired = /^[a-zA-Z0-9\sÀ-ÿ\u00C0-\u1EF9đĐ]+$/;

const validateText = /^[a-zA-Z0-9\s,.À-ÿ\u00C0-\u1EF9dĐ]*$/;

const validateEmail = /^(?:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})?$/;

const isStrongPassword = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/;

const removeWhiteSpace = (x) => { return x.trim().replace(/\s+/g, ' ') };

const formatDate = (date) => {
    let formattedDate = format(date, 'dd/MM/yyyy');
    return formattedDate;
}

const formatDateImport = (date) => {
    let formattedDate = format(date, 'yyyy-MM-dd');
    return formattedDate;
}

const   formattedAmount = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

export { isStrongPassword, validatePhone, validateTextRequired, validateText, validateEmail, removeWhiteSpace, formatDate, formatDateImport, formattedAmount };