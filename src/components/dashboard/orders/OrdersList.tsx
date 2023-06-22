import {
    IonButton,
    IonContent,
    IonDatetime,
    IonDatetimeButton,
    IonHeader,
    IonItem,
    IonLabel,
    IonLoading,
    IonModal,
    IonPage,
    IonTitle,
    IonText,
    useIonModal,
    useIonToast,
} from "@ionic/react";
import dayjs from 'dayjs'

import { OrderCard } from "./OrderCard";
import { Header } from "../Header";
import { useOrder } from "./hooks/useOrder";
import { useEffect, useRef, useState } from "react";
import { useStorage } from "../../../hooks/useStorage";
import { Order } from "../../../../types/order";
import OrderDetail from "./OrderDetail";
import { currentNetworkStatus } from "../../../utils/netWorkStatus";

interface DatePicker {
    defaultParts: {
        day: number;
        month: number;
        year: number;
    };
}

interface Dates {
    dateStart: string;
    dateEnd: string;
}

const OrderList: React.FC = () => {
    const { getOrders, lastSync } = useOrder();
    const { user } = useStorage();

    const [loading, setLoading] = useState<boolean>(false);
    const [orders, setOrders] = useState<Array<Order>>([]);

    const [presentToast] = useIonToast()

    function handlePresentToast(msg: string) {
        presentToast({
            position: 'top',
            duration: 1500,
            message: msg
        })
    }

    useEffect(() => {
        let date = dayjs().format('YYYY-MM-DD');
        let finalDates = {
            dateStart: date,
            dateEnd: date,
        }
        handleGetOrders(finalDates, true)
    },[])
    const orderPickerRef = useRef<HTMLIonDatetimeElement & DatePicker>(null);

    async function handleGetOrders(dates?: Dates, sync = false) {
        setLoading(true);
        const connection = await currentNetworkStatus();
        if (!connection) {
            handlePresentToast('Conectate a internet para ver tus pedidos actualizados')
        }
        const data = await getOrders(user.idUser, user.currentBusiness, sync, dates);
        setOrders(data);
        setLoading(false);
    }

    async function handleChangeDate(value: any) {
        let date = value.substring(0, 10);
        await handleGetOrders({
            dateStart: date,
            dateEnd: date,
        });
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
            <IonPage>
                <IonHeader>
                    <Header title="Mis Pedidos" />
                </IonHeader>
                <IonContent>
                    <IonItem>
                        <IonLabel>
                            <strong>Fecha:</strong>
                        </IonLabel>
                        <>
                            <IonDatetimeButton datetime="ordersPicker"></IonDatetimeButton>
                            <IonModal keepContentsMounted={true}>
                                <IonDatetime
                                    onIonChange={(e) =>
                                        handleChangeDate(e.target.value)
                                    }
                                    showDefaultButtons={true}
                                    ref={orderPickerRef}
                                    id="ordersPicker"
                                    doneText="Aceptar"
                                    cancelText="Cancelar"
                                    presentation="date"
                                    style={{
                                        backgroundColor:
                                            "var(--ion-color-light)",
                                        color: "#202020",
                                    }}
                                ></IonDatetime>
                            </IonModal>
                        </>
                    </IonItem>
                    <IonItem>
                        <IonButton onClick={() => handleGetOrders()}>
                            Sincronizar
                        </IonButton>
                        {lastSync && (
                            <IonText style={{ marginLeft: ".5rem" }}>
                                <p style={{ margin: "0" }}>
                                    <strong>Ultima sincronización</strong>
                                </p>
                                {lastSync.toLocaleDateString("es-ES", { hour: '2-digit', minute: '2-digit' })}
                            </IonText>
                        )}
                    </IonItem>
                    {orders.length > 0 ? (
                        orders.map((order) => (
                            <OrderCard
                                key={order.idOrderH}
                                order={order}
                                displayName={true}
                                openDetail={openDetailModal}
                            />
                        ))
                    ) : (
                        <IonTitle
                            style={{
                                textAlign: "center",
                                marginTop: "2rem",
                            }}
                        >
                            <h2>Sin pedidos</h2>
                        </IonTitle>
                    )}
                </IonContent>
                <IonLoading isOpen={loading} />
            </IonPage>
        </>
    );
};

export default OrderList;
