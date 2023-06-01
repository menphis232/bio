import {
    IonAccordion,
    IonAccordionGroup,
    IonAvatar,
    IonButton,
    IonButtons,
    IonIcon,
    IonImg,
    IonItem,
    IonLabel,
    IonList,
    IonModal,
    IonText,
    useIonActionSheet,
    useIonModal,
} from "@ionic/react";
import { create, trash } from "ionicons/icons";
import { useStorage } from "../../../hooks/useStorage";
import { ip } from "../../../environment";
import { OrderItem, SaveOrder } from "../../../../types/order";
import { useState } from "react";
import { SetQuantity } from "./SetQuantity";
import { UNIT_TYPE } from "../products/AddProductToOrder";

interface Props {
    order: SaveOrder;
    removeProduct: (detail: { data: OrderItem; role: string }) => void;
    updateQuantity: (product: OrderItem, weight: number) => Promise<void>;
}

export const CartProductList: React.FC<Props> = ({
    order,
    removeProduct,
    updateQuantity,
}) => {
    const [quantityModal, setQuantityModal] = useState({ isOpen: false });
    const [currentProduct, setCurrentProduct] = useState<OrderItem | null>(
        null
    );

    const { environment } = useStorage();

    const [presentActionSheet] = useIonActionSheet();

    const closeSetQuantity = () => {
        setQuantityModal({ isOpen: false });
        dismissSetQuantity();
    };

    const openSetQuantity = (product: OrderItem) => {
        setCurrentProduct(product);
        presentSetQuantity();
    };

    const [presentSetQuantity, dismissSetQuantity] = useIonModal(SetQuantity, {
        dismiss: closeSetQuantity,
        currentProduct,
        updateQuantity,
    });

    function calculateSubTotal(item: OrderItem) {
        let subTotal = 0;
        if (item.idUnitMeasureSaleFk === UNIT_TYPE.KG && item.unitweight >0) {
            subTotal =
                item.weight *
                (item.unitweight *
                    (item.isPromo === "1"
                        ? item.marketPrice
                        : item.priceSale));
        } else {
            subTotal =
                item.weight *
                (item.isPromo === "1"
                    ? item.marketPrice
                    : item.priceSale);
        }
        return subTotal
    }

    return (
        <IonAccordionGroup>
            <IonAccordion value="products" color="light">
                <IonItem slot="header">
                    <IonLabel>
                        <strong>Productos:</strong>
                    </IonLabel>
                </IonItem>
                <IonList slot="content">
                    {order.body &&
                        order.body.map((product: OrderItem) => (
                            <IonItem key={product.idProduct}>
                                <IonAvatar style={{ marginRight: '4px' }}>
                                    <IonImg
                                        src={`${ip}/product/${product.urlImagenProduct}`}
                                        alt="producto"
                                    />
                                </IonAvatar>
                                <IonLabel>
                                    <p>{product.nameProduct}</p>
                                    <small>{`$${product.isPromo === "1" ? product.marketPrice : product.priceSale}`}{product.idUnitMeasureSaleFk === UNIT_TYPE.KG && product.unitweight >0 &&  ` x kg | ${product.unitweight}kg`}</small>
                                </IonLabel>
                                <IonText>{product.weight}</IonText>
                                <IonButtons slot="end" style={{ margin: 0 }}>
                                    <IonButton
                                        color="primary"
                                        onClick={() =>
                                            openSetQuantity(product)
                                        }
                                    >
                                        <IonIcon icon={create} />
                                    </IonButton>
                                    <IonButton
                                        color="danger"
                                        onClick={() =>
                                            presentActionSheet({
                                                header: "Remover producto",
                                                subHeader: `Quieres remover el producto ${product.nameProduct}?`,
                                                buttons: [
                                                    {
                                                        text: "Remover",
                                                        role: "delete",
                                                        data: product,
                                                    },
                                                    {
                                                        text: "Cancelar",
                                                        role: "cancel",
                                                        data: product,
                                                    },
                                                ],
                                                onDidDismiss: ({
                                                    detail,
                                                }) =>
                                                    removeProduct(
                                                        detail as {
                                                            role: string;
                                                            data: OrderItem;
                                                        }
                                                    ),
                                            })
                                        }
                                    >
                                        <IonIcon icon={trash} />
                                    </IonButton>
                                    <IonText style={{ minWidth: '3rem' }}>${calculateSubTotal(product).toFixed(2)}</IonText>
                                </IonButtons>
                            </IonItem>
                        ))}
                    {!order.body && (
                        <>
                            <IonText><p>El carrito está vacío</p></IonText>
                            <IonButton color={'primary'} routerLink="/dashboard/products">Agregar producto</IonButton>
                        </>
                    )}
                </IonList>
            </IonAccordion>
            <IonModal
                isOpen={quantityModal.isOpen}
                onDidDismiss={() => setQuantityModal({ isOpen: false })}
            >
                <SetQuantity
                    updateQuantity={updateQuantity}
                    dismiss={closeSetQuantity}
                    currentProduct={currentProduct!}
                />
            </IonModal>
        </IonAccordionGroup>
    );
};
