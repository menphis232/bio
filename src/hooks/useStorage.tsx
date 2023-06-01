import React, { createContext, useContext, useEffect, useState } from "react";
import { Storage } from "@ionic/storage";
import { IonLoading } from "@ionic/react";

import { ipBackOffice } from "../environment";
import axios from "axios";
import { User, UserBackUp } from "../../types/user";

const ENVIRONMENT = "environ";
const USER = "user";
export const PRODUCTS_BY_BUSINESS = "products";
export const CATEGORIES_BY_BUSINESS = "categories";
export const SUB_CATEGORIES_BY_BUSINESS = "subCategories";
export const LINES_BY_BUSINESS = "lines";
export const BRANDS_BY_BUSINESS = "brands";
export const CLIENTS = "clients";
export const CURRENT_ORDER = "currentOrder";
export const REQUEST = "request";
export const MY_ORDERS = "myOrders";
export const LAST_SYNC = "lastSync";
export const LAST_SYNC_ORDERS = "lastSyncOrders";
export const TOKEN = 'token'

interface Props {
    children: React.ReactNode;
}

type StorageContextType = {
    addClient: Function;
    order: any;
    addItem: Function;
    changeQuantity: Function;
    removeItem: Function;
    environment: any;
    getEnvironment: Function;
    user: UserBackUp & User;
    authUser: Function;
    setData: (key: string, value: any) => Promise<void>;
    getData: (key: string) => Promise<any>;
    removeData: (key: string) => Promise<any>;
    setCurrentBusiness: (businessId: number) => void;
    clearDb: Function;
};

export const StorageContext = createContext<Partial<StorageContextType>>({});

export function useStorage() {
    return useContext(StorageContext) as StorageContextType;
}

const INITIAL_USER: UserBackUp & User = {
    token: "",
    currentBusiness: 0,
    userId: 0,
    business: [],
    fullname: "",
    idProfileFk: 0,
    idUser: 0,
    mail: "",
};

const INITIAL_ENVIRON = {
    port: 0,
};

export const StorageProvider: React.FC<Props> = ({ children }) => {
    const [store, setStore] = useState<Storage>();

    const [environment, setEnvironment] = useState<any>();

    const [user, setUser] = useState<UserBackUp & User>(INITIAL_USER);

    const [loading, setLoading] = useState<boolean>(true);

    const initStore = async () => {
        // Storage
        const newStorage = new Storage({
            name: "phoneDb",
        });
        const store = await newStorage.create();
        setStore(store);
        // End Storage
        // environment
        const environmentStore =
            (await store.get(ENVIRONMENT)) || INITIAL_ENVIRON;
        setEnvironment(environmentStore);
        // End environment
        // Auth User
        const userStore = (await store.get(USER)) || INITIAL_USER;
        setUser(userStore);
        // End Auth User
        setLoading(false);
    };

    useEffect(() => {
        initStore();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Environment
    function setPort(port: number) {
        setEnvironment({ ...environment, port });
        store?.set(ENVIRONMENT, { ...environment, port });
    }

    async function getEnvironment(environmentName = "demo") {
        const response = await axios.get(
            `${ipBackOffice}/customer/byname/${environmentName}`
        );
        const port = response.data.restaurante.api_port;
        setPort(port);
        store?.set(ENVIRONMENT, { ...environment, port });
    }
    // End environment

    // User
    function authUser(data: UserBackUp & User) {
        setUser({ ...user, ...data });
        store?.set(USER, { ...user, ...data });
    }

    function setCurrentBusiness(businessId: number) {
        setUser({ ...user, currentBusiness: businessId });
        store?.set(USER, {
            ...user,
            currentBusiness: businessId,
        });
    }
    // End User

    async function setData(key: string, value: any): Promise<void> {
        console.log('hola entramos en setdata')
        await store?.set(key, value);
    }

    async function getData(key: string): Promise<any> {
        return await store?.get(key);
    }

    async function removeData(key: string): Promise<any> {
        console.log('entramos a borrar',key)
        return await store?.remove(key);
    }

    async function clearDb() {
        const environment = await store?.get(ENVIRONMENT);
        await store?.clear();
        store?.set(ENVIRONMENT, { ...environment });
    }
    //

    if (loading) {
        return <IonLoading isOpen={loading}></IonLoading>;
    }

    return (
        <StorageContext.Provider
            value={{
                environment,
                getEnvironment,
                user,
                authUser,
                getData,
                setData,
                setCurrentBusiness,
                clearDb,
                removeData
            }}
        >
            {children}
        </StorageContext.Provider>
    );
};
