import {
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonIcon,
} from "@ionic/react";
import { eye } from "ionicons/icons";
import { Client } from "../../../../types/client";

interface Props {
    client: Client;
    openDetail: (client: Client) => void;
}

export const ClientCard: React.FC<Props> = ({ client, openDetail }) => {

    return (
        <IonCard>
            <IonCardHeader>
                <IonCardTitle
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <strong>{client?.nameClient}</strong>
                    <IonButtons>
                        <IonButton onClick={() => openDetail(client)}>
                            <IonIcon color="primary" icon={eye}></IonIcon>
                        </IonButton>
                    </IonButtons>
                </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                <IonCardSubtitle style={{ fontSize: "1.2rem" }}>
                    <strong>Rif:</strong> {client?.numberDocument}
                </IonCardSubtitle>
                <IonCardSubtitle style={{ fontSize: "1.2rem" }}>
                    <strong>Direccion:</strong> {client?.address}
                </IonCardSubtitle>
            </IonCardContent>
        </IonCard>
    );
};
