import {
    IonButton,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonLoading,
    IonPage,
    IonText,
    useIonActionSheet,
    useIonToast,
    useIonViewWillEnter,
    useIonRouter,
    useIonViewWillLeave,
} from "@ionic/react";
import { useEffect, useState } from "react";

import AddNewOrder from "./AddNewOrder";
import { Header } from "../Header";
import { useOrder } from "../orders/hooks/useOrder";
import { CartProductList } from "./CartProductList";
import { OrderItem } from "../../../../types/order";
import { Status } from "../../../utils/status";

const Car: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [total, setTotal] = useState<number>();

    const {
        orderExist,
        currentOrder,
        existsAnOrder,
        addOrder,
        getOrderById,
        removeProduct,
        calculateTotalRequest,
        calculateTotal,
        confirmProductQuantity,
        changeStatus,
        reset
    } = useOrder();

    // Modal
    useIonViewWillEnter(() => {
        existsAnOrder()  
        if (orderExist && currentOrder) {
            getOrderById(currentOrder?.idOrderH as number);
        }
    })

    useEffect(() =>{
        return () =>{
            reset()
        }
    },[])

    useIonViewWillLeave(() => {
        reset()
    })

    const [presentToast] = useIonToast();

    const handleUpdateQuantity = async (product: OrderItem, weight: number) => {
        setLoading(true);
        await confirmProductQuantity(product.idOrderB, weight);
        await getOrderById(currentOrder?.idOrderH as number);
        setLoading(false);
    };

    const handleCalculateTotal = async () => {
        if (currentOrder) {
            const total = await calculateTotalRequest(currentOrder);
            setTotal(total);
        }
    };
   

    useEffect(() => {
        handleCalculateTotal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentOrder]);

    const handleRemoveProduct = async (detail: {
        data: OrderItem;
        role: string;
    }) => {
        if (detail.role !== "delete") return;
        setLoading(true);
        await removeProduct(detail.data);
        await getOrderById(currentOrder!.idOrderH);
        setLoading(false);
        return presentToast({
            message: `${detail.data.nameProduct} ha sido removido`,
            duration: 2000,
            position: "top",
        });
    };

    const [presentAction] = useIonActionSheet();

    const router = useIonRouter()

    const handleConfirmOrder = async (detail: any) => {
        if (detail.role !== "confirm") return;
        setLoading(true);
        await changeStatus(Status.RECEIVED, currentOrder!.idOrderH);
        setLoading(false);
        presentToast({
            message: "Pedido enviado exitosamente",
            duration: 1500,
            position: "top",
        });
        router.push('/dashboard/home', 'root', 'replace')
    };

    const handleDeleteOrder = async (detail: any) => {
        if (detail.role !== "confirm") return;
        setLoading(true);
        console.log('aqui vamos a borrsr',currentOrder)
        await changeStatus(Status.DELETED, currentOrder!.idOrderH);
        setLoading(false);
        presentToast({
            message: "Pedido anulado",
            duration: 1500,
            position: "top",
        });
        router.push('/dashboard/home', 'root', 'replace')
    };

    return (
        <>
            <IonPage>
                <IonHeader>
                    <Header title="Carrito" />
                </IonHeader>
                <IonContent
                    style={{
                        textAlign: "center",
                    }}
                >
                    {orderExist ? (
                        <>
                            <IonItem>
                                <IonLabel>
                                    <strong>Pedido Nro:</strong>
                                </IonLabel>
                                <IonText
                                    style={{
                                        marginRight: "1rem",
                                    }}
                                >
                                    {currentOrder?.idOrderH}
                                </IonText>
                            </IonItem>
                            <IonItem>
                                <IonLabel>
                                    <strong>Cliente:</strong>
                                </IonLabel>
                                <IonText
                                    style={{
                                        marginRight: "1rem",
                                    }}
                                >
                                    {currentOrder?.fullNameClient}
                                </IonText>
                            </IonItem>
                            {<IonText style={{ textAlign: 'start' }} >
                                <p style={{ textAlign: 'start', marginLeft: '1rem' }}>
                                    <strong>Observación:</strong>
                                </p>
                                <p
                                    style={{
                                        textAlign: 'start',
                                        margin: "0 1rem",
                                    }}
                                >
                                    {currentOrder?.comments}
                                </p>
                            </IonText>}
                            {currentOrder && (
                                <CartProductList
                                    order={currentOrder}
                                    removeProduct={handleRemoveProduct}
                                    updateQuantity={handleUpdateQuantity}
                                />
                            )}
                            <IonItem>
                                <IonLabel>
                                    <strong>Total</strong>
                                </IonLabel>
                                <IonText color="success">
                                    <strong>$ {total}</strong>
                                </IonText>
                            </IonItem>
                            <IonButton
                                disabled={!currentOrder?.body}
                                style={{ margin: "1rem 0" }}
                                color="success"
                                onClick={() =>
                                    presentAction({
                                        header: "Enviar pedido",
                                        subHeader:
                                            "Estas seguro de confirmar el envio del pedido actual?",
                                        buttons: [
                                            {
                                                text: "Cancelar",
                                                role: "cancel",
                                            },
                                            {
                                                text: "Confirmar",
                                                role: "confirm",
                                            },
                                        ],
                                        onDidDismiss: ({ detail }) =>
                                            handleConfirmOrder(detail),
                                    })
                                }
                            >
                                Realizar Pedido
                            </IonButton>
                            <IonButton
                                style={{ margin: "1rem .5rem" }}
                                color="danger"
                                onClick={() =>
                                    presentAction({
                                        header: "Anular pedido",
                                        subHeader:
                                            "Estas seguro de anular el pedido actual?",
                                        buttons: [
                                            {
                                                text: "Cancelar",
                                                role: "cancel",
                                            },
                                            {
                                                text: "Anular",
                                                role: "confirm",
                                            },
                                        ],
                                        onDidDismiss: ({ detail }) =>
                                            handleDeleteOrder(detail),
                                    })
                                }
                            >
                                Anular
                            </IonButton>
                        </>
                    ) : (
                        <AddNewOrder addOrder={addOrder} />
                    )}
                    <IonLoading isOpen={loading} />
                </IonContent>
            </IonPage>
        </>
    );
};

export default Car;
