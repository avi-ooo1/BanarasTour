import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [isAuth, setIsAuth] = useState(false);
    const [userData, setUserData] = useState(null);
    const [tours, setTours] = useState([]);

    const getToursData = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/product/list`);
            const data = await response.json();
            
            if (data.success) {
                setTours(data.products || []);
            }
        } catch (error) {
            console.error("Failed to fetch tours:", error);
        }
    }

    const checkAuthStatus = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/user/is-auth`, {
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
        getToursData();
    }, []);

    const value = {
        backendUrl,
        isAuth,
        setIsAuth,
        userData,
        setUserData,
        checkAuthStatus,
        tours,
        getToursData
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
