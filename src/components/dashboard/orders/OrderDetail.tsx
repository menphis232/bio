import {
    IonButton,
    IonButtons,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonLoading,
    IonRow,
    IonText,
    IonTitle,
    IonToolbar,
} from "@ionic/react";
import { close } from "ionicons/icons";
import { useEffect, useState } from "react";
import { Order, OrderItem, SaveOrder } from "../../../../types/order";
import { Status, STATUS_NAMES } from "../../../utils/status";
import { UNIT_TYPE } from "../products/AddProductToOrder";
import { useOrder } from "./hooks/useOrder";

interface Props {
    order: Order | SaveOrder;
    dismiss: () => void;
}

const OrderDetail: React.FC<Props> = ({ order, dismiss }) => {
    const { calculateTotalRequest } = useOrder();

    const [loading, setLoading] = useState<boolean>(false);
    const [total, setTotal] = useState();

    const handleGetTotal = async () => {
        setLoading(true);
        const total = await calculateTotalRequest(order);
        setTotal(total);
        setLoading(false);
    };

    useEffect(() => {
        handleGetTotal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    console.log(order, "order");

    function calculateSubTotal(product: OrderItem): number {
        let subTotal = 0;
        if (product.idUnitMeasureSaleFk === UNIT_TYPE.KG) {
            subTotal =
                product.weight *
                (product.unitweight *
                    (product.isPromo === "1"
                        ? product.marketPrice
                        : product.priceSale));
        } else {
            subTotal =
                product.weight *
                (product.isPromo === "1"
                    ? product.marketPrice
                    : product.priceSale);
        }
        return subTotal;
    }

    function instanceOfOrder(order: SaveOrder | Order): order is Order {
        return "idStatusOrder" in order;
    }

    return (
        <>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonButtons slot="start">
                        <IonButton onClick={() => dismiss()}>
                            <IonIcon icon={close} />
                        </IonButton>
                    </IonButtons>
                    <IonButtons slot="end">
                        <IonButton />
                    </IonButtons>
                    <IonTitle style={{ textAlign: "center" }}>
                        <strong>Pedido Nro. {order.idOrderH}</strong>
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <section
                    style={{
                        paddingInline: "2px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                    }}
                >
                    <IonText>
                        <h1>
                            <strong>{order.fullNameClient}</strong>
                        </h1>
                    </IonText>
                    <IonText>
                        <h2>Detalles</h2>
                    </IonText>
                    <IonList style={{ width: "100%", marginBottom: "1rem" }}>
                        <IonItem style={{ display: "flex", width: "100%" }}>
                            <IonLabel>
                                <strong>Estado:</strong>
                            </IonLabel>
                            <IonText>
                                {instanceOfOrder(order)
                                    ? STATUS_NAMES[order.idStatusOrder]
                                    : STATUS_NAMES[Status.IN_PROCESS]}
                            </IonText>
                        </IonItem>
                        {instanceOfOrder(order) && (
                            <>
                                <IonItem
                                    style={{ display: "flex", width: "100%" }}
                                >
                                    <IonLabel>
                                        <strong>Fecha de creacion:</strong>
                                    </IonLabel>
                                    <IonText>{order.created_at}</IonText>
                                </IonItem>
                                <IonItem
                                    style={{ display: "flex", width: "100%" }}
                                >
                                    <IonLabel>
                                        <strong>Última actualización:</strong>
                                    </IonLabel>
                                    <IonText>{order.updated_at}</IonText>
                                </IonItem>
                            {
                                order.comments && (
                                <IonText style={{ textAlign: 'start' }} >
                                <p style={{ textAlign: 'start', marginLeft: '1rem' }}>
                                    <strong>Observación:</strong>
                                </p>
                                <p
                                    style={{
                                        textAlign: 'start',
                                        margin: "0 1rem",
                                    }}
                                >
                                    {order?.comments}
                                </p>
                            </IonText>
                                )}
                            </>
                        )}
                    </IonList>
                    <IonText>
                        <h2>Productos</h2>
                    </IonText>
                    <IonGrid fixed={true} >
                        <IonRow>
                            <IonCol size="3" style={{ textAlign: "center" }}>
                                <strong
                                    style={{
                                        color: "var(--ion-color-primary)",
                                    }}
                                >
                                    Nombre
                                </strong>
                            </IonCol>
                            <IonCol size="3" style={{ textAlign: "center" }}>
                                <strong
                                    style={{
                                        color: "var(--ion-color-primary)",
                                    }}
                                >
                                    Cantidad
                                </strong>
                            </IonCol>
                            <IonCol size="3" style={{ textAlign: "center" }}>
                                <strong
                                    style={{
                                        color: "var(--ion-color-primary)",
                                    }}
                                >
                                    Precio
                                </strong>
                            </IonCol>
                            <IonCol size="3" style={{ textAlign: "center" }}>
                                <strong
                                    style={{
                                        color: "var(--ion-color-primary)",
                                    }}
                                >
                                    Sub Total
                                </strong>
                            </IonCol>
                        </IonRow>
                        {order.body?.map((item) => (
                            <IonRow key={item.idProduct} style={{ borderTop: '1px solid #bbb' }}>
                                <IonCol
                                    size="3"
                                    style={{ textAlign: "start", alignItems: 'center', display: 'flex', justifyContent: 'start' }}
                                >
                                    {item.nameProduct}
                                </IonCol>
                                <IonCol
                                    style={{ textAlign: "center", alignItems: 'center', display: 'flex', justifyContent: 'center' }}
                                    size="3"
                                >
                                    {item.idUnitMeasureSaleFk === UNIT_TYPE.KG
                                        ? `${item.weight * item.unitweight}kg`
                                        : `${item.weight}`}
                                </IonCol>
                                <IonCol
                                    style={{ textAlign: "center", alignItems: 'center', display: 'flex', justifyContent: 'center' }}
                                    size="3"
                                >
                                    $
                                    {item.isPromo === "1"
                                        ? item.marketPrice
                                        : item.priceSale}
                                </IonCol>
                                <IonCol
                                    style={{ textAlign: "center", alignItems: 'center', display: 'flex', justifyContent: 'center' }}
                                    size="3"
                                >
                                    ${calculateSubTotal(item).toFixed(2)}
                                </IonCol>
                            </IonRow>
                        ))}
                        <IonRow style={{ borderTop: '1px solid #bbb' }}>
                            <IonCol size="3" style={{ textAlign: "center" }}>
                                <strong>Total</strong>
                            </IonCol>
                            <IonCol
                                size="6"
                                style={{ textAlign: "center" }}
                            ></IonCol>
                            <IonCol size="3" style={{ textAlign: "center" }}>
                                <strong
                                    style={{
                                        color: "var(--ion-color-success)",
                                    }}
                                >
                                    ${total}
                                </strong>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </section>
            </IonContent>
            <IonLoading isOpen={loading} />
        </>
    );
};

export default OrderDetail;
