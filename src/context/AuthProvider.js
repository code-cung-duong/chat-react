import { Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { auth } from '../firebase/Config';


export const AuthContext = React.createContext();

function AuthProvider({ children }) {

    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const history = useHistory();

    useEffect(() => {
        const unsub = auth.onAuthStateChanged((user) => {

            if (user) {
                const {
                    displayName,
                    email,
                    uid,
                    phoneNumber,
                    photoURL,
                    countNotify,
                    status,
                    last_changed,
                } = user;

                setUser({
                    displayName,
                    email,
                    uid,
                    phoneNumber,
                    photoURL,
                    countNotify,
                    status,
                    last_changed,
                });
                setIsLoading(false);
                history.push("/");
                document.title = "Fake Messenger"
                return;
            }
            setUser({});
            setIsLoading(false);
            history.push("/login");
            document.title = "Fake Messenger - Đăng nhập"
        });
        return () => {
            unsub();
        };
    }, [history]);


    return (
        <AuthContext.Provider value={
            { user, setUser }
        }>
            {
                isLoading ? <Spin style={
                    {
                        fontSize: '20pt',
                        position: 'fixed',
                        top: '50%',
                        left: '50%'
                    }
                } /> : children
            } </AuthContext.Provider>
    );
}

export default AuthProvider;
