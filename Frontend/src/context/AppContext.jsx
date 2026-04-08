import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

const AppContextProvider = (props) => {
    let rawBackendUrl = import.meta.env.VITE_BACKEND_URL;
    // Remove trailing slash if exists
    const backendUrl = rawBackendUrl ? rawBackendUrl.replace(/\/$/, "") : "";

    const [isAuth, setIsAuth] = useState(false);
    const [userData, setUserData] = useState(null);
    const [tours, setTours] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const getToursData = async () => {
        if (!backendUrl) {
            console.error("VITE_BACKEND_URL is missing! Please set it in your environment variables.");
            return;
        }
        console.log("Fetching tours from:", `${backendUrl}/api/product/list`);
        try {
            const response = await fetch(`${backendUrl}/api/product/list`);
            const data = await response.json();
            console.log("Backend Response:", data);
            
            if (data.success) {
                setTours(data.products || []);
            }
        } catch (error) {
            console.error("Error fetching tours:", error);
        }
    }

    const checkAuthStatus = async () => {
        if (!backendUrl) return;
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
            console.error("Auth check failed for:", `${backendUrl}/api/user/is-auth`, error);
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
        getToursData,
        searchTerm,
        setSearchTerm
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
