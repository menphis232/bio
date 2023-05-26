import {
    IonContent,
    IonDatetime,
    IonDatetimeButton,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonLoading,
    IonModal,
    IonPage,
    IonText,
    useIonModal,
    useIonToast,
} from "@ionic/react";

import { useUser } from "../profile/hooks/useUser";
import { useEffect, useRef, useState } from "react";
import { useStorage } from "../../../hooks/useStorage";
import { Route } from "../../../../types/route";
import { useClients } from "./hooks/useClients";
import { Header } from "../Header";
import { ClientCard } from "./ClientCard";
import { ClientDetail } from "./ClientDetail";
import { Client } from "../../../../types/client";
import { currentNetworkStatus } from "../../../utils/netWorkStatus";

interface DatePicker {
    defaultParts: {
        day: number;
        month: number;
        year: number;
    };
}

const MyRoutes: React.FC = () => {
    const { getMyRoutes } = useUser();
    const { user } = useStorage();
    const { clients, getClients } = useClients();

    const routesPickerRef = useRef<HTMLIonDatetimeElement & DatePicker>(null);

    const [routes, setRoutes] = useState<Array<Route>>([]);
    const [loading, setLoading] = useState(false);

    const [presentToast] = useIonToast()

    async function handleGetRoutes() {
        setLoading(true);
        const conn = await currentNetworkStatus()
        if (!conn) {
            setLoading(false)
            return presentToast({
                position: 'top',
                duration: 1500,
                message: 'Conectate a internet para ver tus rutas'
            })
        }
        const today = new Date();
        let date = `${today.getFullYear()}-${today.getMonth() + 1
            }-${today.getDate()}`;
        const routes = await getMyRoutes(user.idUser, {
            dateStart: date,
            dateEnd: date,
        });
        setRoutes(routes);
        setLoading(false);
    }

    async function handleGetClients(userId: number) {
        await getClients(userId);
    }

    async function handleChangeDate(value: any) {
        setLoading(true)
        let date = value.substring(0, 10);
        const routes = await getMyRoutes(user.idUser, {
            dateStart: date,
            dateEnd: date,
        });
        setRoutes(routes);
        setLoading(false)
    }

    useEffect(() => {
        if (routesPickerRef.current) {
            handleGetRoutes();
            handleGetClients(user.userId);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [routesPickerRef]);


    const [clientData, setClientData] = useState<Client>();

    const openClientModal = (client: Client) => {
        setClientData(client);
        presentClient();
    };

    const closeClientModal = () => {
        dismissClient();
    };

    const [presentClient, dismissClient] = useIonModal(ClientDetail, {
        client: clientData,
        closeClientModal,
    });

    return (
        <>
            {/*<Menu />*/}
            <IonPage >
                <IonHeader>
                    <Header title="Rutas" />
                </IonHeader>
                <IonContent>
                    <IonItem>
                        <IonLabel>
                            <strong>Fecha:</strong>
                        </IonLabel>
                        <>
                            <IonDatetimeButton datetime="routesPicker"></IonDatetimeButton>
                            <IonModal keepContentsMounted={true}>
                                <IonDatetime
                                    onIonChange={(e) =>
                                        handleChangeDate(e.target.value)
                                    }
                                    showDefaultButtons={true}
                                    doneText="Aceptar"
                                    cancelText="Cancelar"
                                    ref={routesPickerRef}
                                    id="routesPicker"
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
                    <IonList>
                        {routes.length === 0 && (
                            <IonText>
                                <h2 style={{ textAlign: "center" }}>
                                    Sin rutas
                                </h2>
                            </IonText>
                        )}
                        {routes.length > 0 &&
                            routes.map((r, idx) => {
                                const client = clients.find(
                                    (c) => c.idClient === Number(r.idClientFk)
                                );
                                return (
                                    <ClientCard
                                        client={client!}
                                        key={idx}
                                        openDetail={openClientModal}
                                    />
                                );
                            })}
                    </IonList>
                    <IonLoading isOpen={loading} />
                </IonContent>
            </IonPage>
        </>
    );
};

export default MyRoutes;
