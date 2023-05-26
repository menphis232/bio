import { useState } from 'react';
import { useRequest } from '../../../../hooks/useRequest';
import { currentNetworkStatus } from '../../../../utils/netWorkStatus';
import { CLIENTS, useStorage } from '../../../../hooks/useStorage';
import { Client } from '../../../../../types/client';
import { Order } from '../../../../../types/order';

interface GetClientOrdersBody {
    query: string;
    dateStart: string;
    dateEnd: string;
}

export function useClients() {
    const [clients, setClients] = useState<Array<Client>>([]);

    const { get, post } = useRequest();
    const { getData, setData, user } = useStorage();

    async function getClients(userId: number) {
        const connection = await currentNetworkStatus();
        const savedClients = await getData(CLIENTS);
        if (!connection) {
            return setClients(savedClients);
        }
        const response = await get(`/api/v2/user/client/${userId}`);
        if (response.isLeft()) {
            // Error response
            return;
        }
        // success
        const value = response.value.getValue().data.data;
        saveClients(value);
    }

    async function getClientsOrders(body: GetClientOrdersBody) {
        const connection = await currentNetworkStatus()
        if (!connection) {
            return [];
        }
        const res = await post('/api/v2/order/byclient/byfilter', body);
        if (res.isLeft()) {
            // err response
        }
        const value = res.value.getValue().data.data;
        const filteredByBusiness = value.filter((item: Order) => (item.idBranchFk === user.currentBusiness));
        return filteredByBusiness;
    }

    async function saveClients(clients: Array<Client>) {
        await setData(CLIENTS, clients);
        setClients(clients);
    }

    return {
        clients,
        getClients,
        getClientsOrders,
    };
}
