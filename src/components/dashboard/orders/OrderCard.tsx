import {
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonIcon,
    IonText,
} from "@ionic/react";
import { Order, SaveOrder } from "../../../../types/order";
import { STATUS_NAMES } from "../../../utils/status";
import { Status } from "../../../utils/status";
import { parse } from "date-fns";
import { eye } from "ionicons/icons";
import dayjs from "dayjs";
import 'dayjs/locale/es';
dayjs.locale('es')

interface Props {
    order: Order | SaveOrder;
    displayName: boolean;
    openDetail: (order: Order) => void;
}

export const OrderCard: React.FC<Props> = ({
    order,
    displayName,
    openDetail,
}) => {

    const statusColor: { [ind: number]: string } = {
        1: "warning",
        2: "success",
        3: "secondary",
        4: "primary",
        5: "danger",
    };

    function instanceOfOrder(order: SaveOrder | Order): order is Order {
        return "idStatusOrder" in order;
    }

    return (
        <IonCard>
            <IonCardHeader>
                <IonCardTitle
                    style={{ display: "flex", justifyContent: "space-between" }}
                >
                    <strong>
                        {displayName
                            ? order.fullNameClient
                            : `Nro. ${order.idOrderH}`}
                    </strong>
                    <IonButtons>
                        <IonButton onClick={() => openDetail(order as Order)}>
                            <IonIcon icon={eye} color="primary"></IonIcon>
                        </IonButton>
                    </IonButtons>
                </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                <IonCardSubtitle style={{ fontSize: "1.2rem" }}>
                    <strong>Total: </strong>
                    {instanceOfOrder(order) && (
                        <IonText color="success"><strong>${order.totalBot}</strong></IonText>
                    )}
                    <strong style={{ marginLeft:'20px'}}> Estado: </strong>
                    <IonText
                        color={
                            instanceOfOrder(order)
                                ? statusColor[order.idStatusOrder]
                                : "warning"
                        }
                    >
                        <strong>{` ${instanceOfOrder(order)
                                ? STATUS_NAMES[order.idStatusOrder]
                                : STATUS_NAMES[Status.IN_PROCESS]
                            }`}</strong>
                    </IonText>
                </IonCardSubtitle>
                {instanceOfOrder(order) && (
                    <p>
                        <strong>Fecha de creación: </strong>
                        {
                            dayjs(order.created_at).format('DD/MM/YYYY')
                        }
                    </p>
                )}
                {instanceOfOrder(order) && (
                    <p>
                        <strong>Ultima actualización: </strong>
                        {
                        dayjs(order.updated_at).format('DD/MM/YYYY')
                        }
                    </p>
                )}
            </IonCardContent>
        </IonCard>
    );
};
