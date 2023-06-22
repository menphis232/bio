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
                <IonCardSubtitle style={{ fontSize: ".9rem" }}>
                    <strong>Rif:</strong> {client?.numberDocument}
                </IonCardSubtitle>
                <IonCardSubtitle style={{ fontSize: ".9rem" }}>
                    <strong>Dirección fiscal:</strong> {client?.address}
                </IonCardSubtitle>
                <IonCardSubtitle style={{ fontSize: ".9rem" }}>
                    <strong>Dirección <small>(opcional)</small>:</strong>
                </IonCardSubtitle>
            </IonCardContent>
        </IonCard>
    );
};
