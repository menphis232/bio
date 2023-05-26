import {
    IonButton,
    IonButtons,
    IonCol,
    IonContent,
    IonHeader,
    IonIcon,
    IonImg,
    IonItem,
    IonLabel,
    IonList,
    IonLoading,
    IonNote,
    IonRow,
    IonText,
    IonTitle,
    IonToolbar,
    useIonToast,
} from "@ionic/react";
import { Product } from "../../../../types/product";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { CURRENT_ORDER, useStorage } from "../../../hooks/useStorage";
import { useOrder } from "../orders/hooks/useOrder";
import {
    CurrentOrderByBusiness,
    OrderItem,
    SaveOrder,
} from "../../../../types/order";
import { close } from "ionicons/icons";
import { ip } from "../../../environment";

interface Props {
    product: Product;
    dismiss: Function;
}

interface FormInputs {
    quantityProduct: number;
}

export enum UNIT_TYPE {
    UNIT = 17,
    KG = 3,
}


export const AddProductToOrder: React.FC<Props> = ({ product, dismiss }) => {
    const { getData, user, environment } = useStorage();
    const { addProductToOrder, confirmProductQuantity, getOrderById } = useOrder();

    const [loading, setLoading] = useState<boolean>(false);
    const [order, setOrder] = useState<SaveOrder>();

    useEffect(() => {
        console.log(product, "product in addProduct");
    }, [product]);

    async function getCurrentOrderId() {
        setLoading(true);
        const currentOrder: CurrentOrderByBusiness = await getData(
            CURRENT_ORDER
        );
        if (
            !!currentOrder === true &&
            Object.keys(currentOrder[user.currentBusiness]).length > 0
        ) {
            setOrder(currentOrder[user.currentBusiness][0]);
            setCurrentOrderId(
                currentOrder[user.currentBusiness][0].idOrderH || 0
            );
        }
        setLoading(false);
    }

    const [currentOrderId, setCurrentOrderId] = useState<number>();

    useEffect(() => {
        getCurrentOrderId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [presentToast] = useIonToast();

    const calculateProductPrice = (product: Product): number => {
        let priceProductOrder =
            product.isPromo === "1" ? product.marketPrice : product.priceSale;
        if (product.idUnitMeasureSaleFk === UNIT_TYPE.KG) {
            priceProductOrder *= product.unitweight;
        }
        return priceProductOrder;
    };

    const productAlreadyAdded = (productId: number): boolean => {
        if (!order?.body) {
            return false;
        }
        const productExists = order.body.find((p) => p.idProduct === productId);
        console.log(productExists, "hey");
        return !!productExists;
    };

    const handleAddItem = async (product: Product, quantityProduct: number) => {
        const priceProductOrder = calculateProductPrice(product);

        if (productAlreadyAdded(product.idProduct)) {
            /// logic to change quantity
            presentToast({
                message: `${product!.nameProduct
                    } ya esta agregado en la orden actual`,
                duration: 2000,
                position: "top",
            });
            return dismiss();
        }

        setLoading(true);
        await addProductToOrder({
            idOrderHFk: currentOrderId as number,
            idProductFk: product.idProduct,
            idUserAddFk: user.idUser,
            priceProductOrder,
            quantityProduct: 1,
        });

        const orders: CurrentOrderByBusiness = await getData(CURRENT_ORDER);
        const order = orders[user.currentBusiness][0];
        console.log(order, "order before set quantity");

        if (order.body) {
            const added = order.body?.find((p: OrderItem) => {
                console.log(p.idProduct, product.idProduct, "ids");
                return p.idProduct === product.idProduct;
            });

            if (Number(quantityProduct) > 1) {
                // set weight
                console.log(quantityProduct, added, "set quantityProduct");
                await confirmProductQuantity(added!.idOrderB, Number(quantityProduct));
                await getOrderById(currentOrderId as number)
            }
        }

        setLoading(false);
        // success message
        presentToast({
            message: `${product!.nameProduct
                } ha sido agregado a tu pedido actual`,
            duration: 2000,
            position: "top",
        });
        dismiss();
    };

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormInputs>({
        defaultValues: { quantityProduct: 1 }
    });

    function calculateSubTotal(product: Product, quantity: number) {
        let subTotal = 0;
        if (product.idUnitMeasureSaleFk === UNIT_TYPE.KG) {
            subTotal =
                quantity *
                (product.unitweight *
                    (product.isPromo === "1"
                        ? product.marketPrice
                        : product.priceSale));
        } else {
            subTotal =
                quantity *
                (product.isPromo === "1"
                    ? product.marketPrice
                    : product.priceSale);
        }
        return subTotal
    }

    const quantity = watch('quantityProduct')
    console.log(watch('quantityProduct'), 'watch');

    const onSubmit = async ({ quantityProduct }: FormInputs) => {
        await handleAddItem(product, quantityProduct);
    };

    return (
        <>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonButtons>
                        <IonButtons slot="start">
                            <IonButton onClick={() => dismiss()}>
                                <IonIcon icon={close} />
                            </IonButton>
                        </IonButtons>
                        <IonTitle style={{ textAlign: "center" }}>
                            <strong>Agregar Producto</strong>
                        </IonTitle>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    style={{
                        padding: "1rem",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        minHeight: "300px",
                    }}
                >
                    <IonText>
                        <h2> <strong>{product?.nameProduct}</strong>
                        </h2>
                    </IonText>
                    <IonList>
                        <IonItem
                            style={{ padding: "0" }}
                            className={`${!errors.quantityProduct && "ion-valid"
                                } ${errors.quantityProduct?.type === "min" &&
                                "ion-invalid"
                                }`}
                        >
                            <IonLabel>
                                <strong>Cantidad:</strong>
                            </IonLabel>
                            <input
                                style={{
                                    padding: '10px 0 10px 10px',
                                    background: 'var(--background)',
                                    color: 'var(--color)',
                                    fontFamily: 'var(--ion-font-family)',
                                    border: 0,
                                    outline: 'none',

                                }}
                                type="number"
                                {...register("quantityProduct", {
                                    required: 'La cantidad es requerida',
                                    min: {
                                        value: 1,
                                        message:
                                            "La cantidad debe ser mayor a 0",
                                    },
                                })}
                            />
                            <IonNote slot="error">
                                {errors.quantityProduct?.type === "min" &&
                                    errors.quantityProduct.message}
                                {errors.quantityProduct?.type === "required" &&
                                    errors.quantityProduct.message}
                            </IonNote>
                        </IonItem>
                        {product.idUnitMeasureSaleFk === UNIT_TYPE.KG && (
                            <>
                                <IonRow
                                    style={{
                                        marginTop: "1rem",
                                        padding: "0",
                                    }}
                                >
                                    <IonCol>
                                        <IonText
                                            style={{
                                                padding: "10px 0 10px 8px",
                                            }}
                                        >
                                            ${product.isPromo === "1"
                                                ? product.marketPrice
                                                : product.priceSale} x kg | Peso por pieza {product.unitweight} kg
                                        </IonText>
                                    </IonCol>
                                </IonRow>
                            </>
                        )}
                        <IonRow
                            style={{
                                padding: "10px",
                            }}
                        >
                            <IonCol>
                                <IonText><strong>Total:</strong></IonText>
                                <IonText
                                    style={{
                                        padding: "10px 0 10px 8px",
                                    }}
                                >
                                    <strong>${calculateSubTotal(product, quantity).toFixed(2)}</strong>
                                </IonText>
                            </IonCol>
                        </IonRow>
                    </IonList>
                    <IonImg
                        style={{
                            maxWidth: "300px",
                            height: "auto",
                        }}
                        src={`${ip}:${environment.port}/product/${product?.urlImagenProduct}`}
                        alt="Producto"
                    />
                    <IonButton
                        style={{ marginTop: "1rem" }}
                        color="success"
                        expand="block"
                        type="submit"
                    >
                        Agregar
                    </IonButton>
                </form>
            </IonContent>
            <IonLoading isOpen={loading} />
        </>
    );
};
