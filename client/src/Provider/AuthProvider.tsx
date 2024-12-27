import React, { useEffect, useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "..";

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { store } = useContext(Context);

    useEffect(() => {
        if (localStorage.getItem("token") && !store.isCheckedAuth) {
            store.checkAuth();
        }
    }, [store]);

    if (store.isLoading) {
        return <div>Загрузка...</div>;
    }

    return <>{children}</>;
};

export default observer(AuthProvider);