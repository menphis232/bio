import {
    IonButton,
    IonContent,
    IonHeader,
    IonLoading,
    IonPage,
    useIonModal,
    useIonToast,
    useIonViewWillEnter,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { CurrentOrderByBusiness, Order, SaveOrder } from "../../../../types/order";
import { Request } from "../../../../types/request";
import { useRequest } from "../../../hooks/useRequest";
import { CURRENT_ORDER, REQUEST, useStorage } from "../../../hooks/useStorage";
import { currentNetworkStatus } from "../../../utils/netWorkStatus";
import { RequestType } from "../../../utils/requestType";
import { Status } from "../../../utils/status";
import { Header } from "../Header";
import { OrderCard } from "../orders/OrderCard";
import OrderDetail from "../orders/OrderDetail";

export const SyncContainer: React.FC = () => {
    const { getData, setData, user } = useStorage();
    const { executeRequest } = useRequest();

    const [orders, setOrders] = useState<Array<SaveOrder>>([]);
    const [sync, setSync] = useState({ pendingSync: false });
    const [loading, setLoading] = useState(false);

    async function handleGetOrders() {
        setLoading(true);
        const data: CurrentOrderByBusiness = await getData(CURRENT_ORDER);
        let orders = [];
        if (data) {
            for (const business of Object.values(data)) {
                for (const order of business) {
                    console.log(order);
                    orders.push(order);
                }
            }
        }
        setOrders(orders);
        setLoading(false);
    }

    async function getSync() {
        const ordersByBusiness: CurrentOrderByBusiness = await getData(CURRENT_ORDER);
        if (!ordersByBusiness || Object.values(ordersByBusiness).length === 0) {
            return setSync({ pendingSync: false })
        }
        let readyToSync = true
        const hasOrders = Object.values(ordersByBusiness).every(list => list.length > 0)
        if (!hasOrders) return setSync({ pendingSync: false })
        for (const list of Object.values(ordersByBusiness)) {
            readyToSync = list.every((o: SaveOrder) => o.isComplete || o.isComplete === undefined)
        }
        setSync({ pendingSync: !!readyToSync || false })
    }

    useIonViewWillEnter(() => {

        getSync();
        handleGetOrders();
    })

    useEffect(() => {
        getSync();
        handleGetOrders();
        //setPendingOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [present] = useIonToast();

    const presentToast = (message: string) => {
        present({
            message,
            duration: 1500,
            position: "top",
        });
    };

    async function setPendingOrders() {
        let allOrders: CurrentOrderByBusiness = await getData(CURRENT_ORDER);
        Object.entries(allOrders).forEach((orderList) =>
            orderList.filter((o: SaveOrder) => o.isComplete === false)
        );
        for (let [idx, value] of Object.entries(allOrders)) {
            allOrders[Number(idx)] = value.filter(
                (o: SaveOrder) => o.isComplete === false
            );
        }
        let orders;
        if (allOrders) {
            orders = Object.values(allOrders)
                ?.map((b) => b?.map((o: SaveOrder) => o))
                .flat();
        }
        console.log("all orders", allOrders, orders);
        return {
            dbOrders: allOrders || {},
            localOrders: orders || [],
        };
    }

    async function setOrderId(request: Request, orderId: number) {
        const ordersByBusiness: CurrentOrderByBusiness = await getData(
            CURRENT_ORDER
        );
        for (const orderList of Object.values(ordersByBusiness)) {
            console.log(orderList, "lista");
            for (const order of orderList) {
                console.log(order, "order");
                if (order.idOrderH === request.body.idOrderH) {
                    console.log("iff");
                    order.idOrderH = orderId;
                }
            }
        }

        console.log(orderId, "updated id");
        console.log(ordersByBusiness);
        await setData(CURRENT_ORDER, ordersByBusiness);
    }

    async function handleSyncRequest() {
        const connection = await currentNetworkStatus();
        if (!connection)
            return presentToast(
                "Conectate a internet para sincronizar tus pedidos"
            );
        setLoading(true);
        const requestList: Array<Request> = await getData(REQUEST);
        let idOrderH = 0;
        let idOrderB = 0;
        for (let request of requestList) {
            switch (request.type) {
                case RequestType.AddOrder:
                    //delete request.body.idOrderH;
                    const orderResult = await executeRequest(request);
                    console.log(orderResult);
                    if (orderResult.isLeft()) {
                        console.log('if')
                        return console.log('There was an error', orderResult.value.getErrorValue());
                    }
                    if (orderResult.isRight()) {
                        idOrderH = orderResult.value.getValue().data.data[0];
                        await setOrderId(request, idOrderH);
                    }
                    break;
                case RequestType.AddProductToOrder:
                    if (idOrderH !== 0) {
                        request.body.idOrderHFk = idOrderH
                    }
                    let productResult = await executeRequest(request);
                    if (productResult.isRight()) {
                        idOrderB = productResult.value.getValue().data.data[0];
                    }
                    break;
                case RequestType.SetItemQuantity:
                    if (idOrderB) request.body.idOrderB = idOrderB;
                    await executeRequest(request);
                    break;
                case RequestType.RemoveItemFromOrder:
                    console.log(request, "request before remove");
                    if (idOrderB)
                        request.url = `/api/v2/order/product/delete/${idOrderB}/${user.idUser}`;
                    await executeRequest(request);
                    break;
                case RequestType.SetOrderStatus:
                    if (idOrderH)
                        request.url = `/api/v2/order/satus/${idOrderH}/${Status.RECEIVED}`;
                    await executeRequest(request);
                    break;
                default:
                    break;
            }
        }
        let ordersWithoutSync = await setPendingOrders();
        await setData(CURRENT_ORDER, ordersWithoutSync.dbOrders);
        await getSync();
        setOrders(ordersWithoutSync.localOrders);
        setSync({ pendingSync: false });
        setLoading(false);
        return presentToast('Pedidos sincronizados exitosamente');
    }



    const [orderDetail, setOrderDetail] = useState<Order>();
    const closeDetailModal = () => {
        dismissDetail();
    };

    const openDetailModal = (order: Order) => {
        setOrderDetail(order);
        presentDetail()
    };

    const [presentDetail, dismissDetail] = useIonModal(
        OrderDetail,
        {
            dismiss: closeDetailModal,
            order: orderDetail,
        }
    );


    return (
        <>
            {/*<Menu />*/}
            <IonPage >
                <IonHeader>
                    <Header title="Sincronizar" />
                </IonHeader>
                <IonContent>
                    <IonButton
                        disabled={!sync.pendingSync}
                        color="warning"
                        expand="block"
                        onClick={() => handleSyncRequest()}
                    >
                        Sincronizar
                    </IonButton>
                    {orders.length > 0 &&
                        orders.map((o) => (
                            <OrderCard
                                key={o.idOrderH}
                                order={o}
                                displayName={true}
                                openDetail={openDetailModal}
                            />
                        ))}
                    <IonLoading isOpen={loading} />
                </IonContent>
            </IonPage>
        </>
    );
};
