
import React, { useState, useEffect } from 'react';
import { logoutApi } from '../services/LoginServices';


const UserContext = React.createContext({
    userName: '', auth: false, userId: '',
    roleId: '', warehouseId: ''
});


const UserProvider = ({ children }) => {
    const [user, setUser] = React.useState({
        userName: '', auth: false, userId: '',
        roleId: '', warehouseId: ''
    });
    const loginContext = (userName, token, userId,
        roleId, warehouseId
    ) => {
        setUser((user) => ({
            userName: userName,
            auth: true,
            userId: userId,
            roleId: roleId,
            warehouseId: warehouseId
        }));

        console.log(userId, roleId, warehouseId);


        localStorage.setItem('token', token);
        localStorage.setItem('userName', userName);
        localStorage.setItem('warehouseId', warehouseId);
        if (localStorage.getItem('userId') === null && localStorage.getItem('roleId') === null) {
            localStorage.setItem('userId', userId);
            // Store userId
            localStorage.setItem('roleId', roleId);
            // Store roleId
        }
    };

    const logout = () => {
        const userId = localStorage.getItem('userId');
        logoutApi(userId);

        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        localStorage.removeItem('userId'); // Remove userId
        localStorage.removeItem('roleId'); // Remove roleId


        setUser((user) => ({
            userName: '',
            auth: false,
            userId: '',
            roleId: ''
        }));
    };

    return (
        <UserContext.Provider value={{ user, loginContext, logout }}>
            {children}
        </UserContext.Provider>
    );
};




export { UserContext, UserProvider };