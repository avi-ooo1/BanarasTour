import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const [isAuth, setIsAuth] = useState(false);
    const [userData, setUserData] = useState(null);

    const checkAuthStatus = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/user/is-auth', {
                method: 'GET',
                credentials: 'include',
            });
            const data = await response.json();
            if (data.success) {
                setIsAuth(true);
                setUserData(data.user);
            } else {
                setIsAuth(false);
                setUserData(null);
            }
        } catch (error) {
            console.error("Auth check failed:", error);
            setIsAuth(false);
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const value = {
        isAuth,
        setIsAuth,
        userData,
        setUserData,
        checkAuthStatus
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
