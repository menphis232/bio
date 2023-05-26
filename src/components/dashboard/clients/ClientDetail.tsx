import {
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonContent,
    IonDatetime,
    IonDatetimeButton,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonLoading,
    IonModal,
    IonText,
    IonTitle,
    IonToolbar,
    useIonModal,
} from "@ionic/react";
import { Client } from "../../../../types/client";
import { useEffect, useRef, useState } from "react";
import { useClients } from "./hooks/useClients";
import { Order } from "../../../../types/order";
import { OrderCard } from "../orders/OrderCard";
import { close, eye } from "ionicons/icons";
import OrderDetail from "../orders/OrderDetail";
import { OverlayEventDetail } from "@ionic/react/dist/types/components/react-component-lib/interfaces";

interface Props {
    client:Client;
    closeClientModal: any;
    openModal:boolean
}

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

export const ClientDetail: React.FC<Props> = ({ client, closeClientModal, openModal }) => {

    const orderPickerRef = useRef<HTMLIonDatetimeElement & DatePicker>(null);

    const { getClientsOrders } = useClients();

    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState<Array<Order>>([]);
    const [openModalCondition, setOpenModalCondition] = useState(false)

    const handleGetOrders = async (phoneNumber: string, dates?: Dates) => {
        setLoading(true);
        let today = new Date();
        let date = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`

        try {
            const orders = await getClientsOrders({
                query: phoneNumber,
                dateStart: dates?.dateStart || date,
                dateEnd: dates?.dateEnd || date,
            });
            setOrders(orders);
            setLoading(false);

        } catch (error) {
            setLoading(false);
        }
        
    };

    useEffect(() => {
        openModal && handleGetOrders(client?.phone);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openModal]);

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
    const modal = useRef<HTMLIonModalElement>(null);

    const [message, setMessage] = useState(
        'This modal example uses triggers to automatically open a modal when the button is clicked.'
    );



    // function onWillDismiss(ev: CustomEvent<OverlayEventDetail>) {
    //   if (ev.detail.role === 'confirm') {
    //     setMessage(`Hello, ${ev.detail.data}!`);
    //   }
    // }

    async function handleChangeDate(value: any) {
        let date = value.substring(0, 10);
        await handleGetOrders(
            client?.phone,
            {
                dateStart: date,
                dateEnd: date,
            });
    }

    return (
        <IonModal isOpen={openModal}>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonButtons slot="start">
                        <IonButton onClick={() => closeClientModal()}>
                            <IonIcon icon={close} />
                        </IonButton>
                    </IonButtons>
                    <IonButtons slot="end">
                        <IonButton />
                    </IonButtons>
                    <IonTitle style={{ textAlign: "center" }}>
                        <strong>Detalle de cliente</strong>
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonText style={{ textAlign: "center", marginTop: "2rem" }}>
                    <h2>
                        <strong>{client?.nameClient}</strong>
                    </h2>
                </IonText>
                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle style={{ textAlign: "center" }}>
                            <h4>
                                <strong>Información General</strong>
                            </h4>
                        </IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent style={{ padding: '0 0 1rem 0' }}>
                        <IonList>
                            <IonItem>
                                <IonLabel>
                                    <strong>Teléfono:</strong>
                                </IonLabel>
                                <IonText>{client?.phone}</IonText>
                            </IonItem>
                            <IonItem>
                                <IonLabel>
                                    <strong>Rif:</strong>
                                </IonLabel>
                                <IonText>{client?.numberDocument}</IonText>
                            </IonItem>
                            <IonItem>
                                <IonLabel>
                                    <strong>Condiciones comerciales:</strong>
                                </IonLabel>

                                <IonButton id="open-modal" onClick={()=> setOpenModalCondition(true)}  ><IonIcon icon={eye} color='light' /></IonButton>
                                
                                <IonModal ref={modal} isOpen={openModalCondition} >
                                    <IonHeader>
                                        <IonToolbar color="primary">
                                            <IonButtons slot="start">
                                                <IonButton onClick={() => setOpenModalCondition(false)}>
                                                    <IonIcon icon={close} />
                                                </IonButton>
                                            </IonButtons>
                                            <IonTitle style={{ textAlign: "center" }}>
                                                <strong>Condiciones comerciales</strong>
                                            </IonTitle>
                                    
                                        </IonToolbar>
                                    </IonHeader>

                                    <IonContent className="ion-padding">
                                    <button onClick={() => console.log('asd')} ></button>

                                    <p style={{textAlign: "justify"}} >
                                    Productos y Descripción:

Nuestros productos de queso son elaborados con ingredientes de alta calidad y siguiendo procesos artesanales/tradicionales.
Ofrecemos una variedad de quesos, que incluyen queso fresco, queso semicurado, queso curado, queso de cabra, queso azul, entre otros. Cada queso tiene características y sabores únicos.
Precios y Pagos:

Los precios de nuestros quesos están indicados en nuestra lista de precios actualizada.
Todos los precios están expresados en la moneda local y no incluyen impuestos aplicables.
Aceptamos diferentes métodos de pago, como efectivo, tarjetas de crédito/débito y transferencias bancarias. Los detalles de pago se proporcionarán al momento de realizar la compra.
Pedido y Entrega:

Los pedidos se pueden realizar a través de nuestro sitio web, por teléfono o visitando nuestro establecimiento físico.
La disponibilidad de los quesos puede variar según la demanda y la temporada. Nos esforzamos por mantener un inventario adecuado, pero recomendamos realizar el pedido con anticipación para garantizar la disponibilidad del producto deseado.
La entrega de los productos se realizará en la dirección especificada por el cliente. Se pueden aplicar cargos adicionales por el envío, dependiendo de la ubicación y el volumen del pedido.
Política de Devolución:

Si por alguna razón no está satisfecho con el producto recibido, le solicitamos que nos lo comunique de inmediato.
Evaluaremos cada caso de forma individual y, si procede, realizaremos el reemplazo o reembolso correspondiente. Es posible que se requiera la devolución del producto original para procesar la solicitud de devolución.
Conservación y Consumo:

Para garantizar la calidad y frescura de nuestros quesos, se recomienda almacenarlos adecuadamente siguiendo las instrucciones de conservación proporcionadas.
Se proporcionarán instrucciones de consumo, incluyendo sugerencias de maridaje, para que pueda disfrutar plenamente de nuestros quesos.
Responsabilidad:

Nos esforzamos por garantizar la calidad de nuestros productos y la satisfacción del cliente. Sin embargo, no nos hacemos responsables de problemas derivados del mal manejo, almacenamiento o uso inadecuado de los productos de queso una vez entregados.
                                    </p>
                                    
                                    </IonContent>
                                </IonModal>
                            </IonItem>
                        </IonList>
                        <IonText
                            style={{
                                fontSize: "1rem",
                                padding: '0 1rem',
                                color: 'black',
                            }}
                        >
                            <strong>Dirección:</strong> {client?.address}
                        </IonText>
                    </IonCardContent>
                </IonCard>
                <h2 style={{ textAlign: "center" }}>
                    <strong>Pedidos</strong>
                </h2>
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
                {orders.length > 0 ? (
                    orders.map((o) => (
                        <OrderCard
                            key={o.idOrderH}
                            order={o}
                            displayName={false}
                            openDetail={openDetailModal}
                        />
                    ))
                ) : (
                    <h3 style={{ textAlign: "center" }}>Sin pedidos</h3>
                )}

            </IonContent>
            
            <IonLoading isOpen={loading} />
            
        </IonModal>
    );
};
