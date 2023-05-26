import {
    IonContent,
    IonHeader,
    IonPage,
    IonText,
    useIonModal,
} from "@ionic/react";

import { ClientCard } from "./ClientCard";
import { useEffect, useState } from "react";
import { useClients } from "./hooks/useClients";
import { useStorage } from "../../../hooks/useStorage";
import { Header } from "../Header";
import { ClientDetail } from "./ClientDetail";
import { Client } from "../../../../types/client";

export const ClientsList: React.FC = () => {
    const { clients, getClients } = useClients();

    const { user } = useStorage();

    async function handleGetClients(userId: number) {
        await getClients(userId);
    }

    useEffect(() => {
        if (user.userId !== 0) {
            handleGetClients(user.userId);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.userId]);

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
            <IonPage>
                <IonHeader>
                    <Header title="Clientes" />
                </IonHeader>
                <IonContent>
                    {clients.length === 0 && (
                        <IonText>
                            <h2 style={{ textAlign: "center" }}>
                                Sin clientes asignados
                            </h2>
                        </IonText>
                    )}
                    {clients.length > 0 &&
                        clients.map((client) => (
                            <ClientCard
                                client={client}
                                key={client.idClient}
                                openDetail={openClientModal}
                            />
                        ))}
                </IonContent>
            </IonPage>
        </>
    );
};
