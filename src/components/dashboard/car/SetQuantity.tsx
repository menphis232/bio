import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonNote,
    IonTitle,
    IonToolbar,
} from "@ionic/react";
import { close } from "ionicons/icons";
import React from "react";
import { useForm } from "react-hook-form";
import { OrderItem } from "../../../../types/order";

interface Props {
    dismiss: Function;
    currentProduct: OrderItem;
    updateQuantity: (product: OrderItem, weight: number) => Promise<void>;
}

export const SetQuantity: React.FC<Props> = ({
    dismiss,
    currentProduct,
    updateQuantity,
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            weight: currentProduct.weight,
        },
    });

    const onSubmit = async (values: { weight: number }) => {
        await updateQuantity(currentProduct, Number(values.weight));
        dismiss();
    };

    return (
        <>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonButtons slot="start">
                        <IonButton onClick={() => dismiss()}>
                            <IonIcon icon={close} />
                        </IonButton>
                    </IonButtons>
                    <IonTitle style={{ textAlign: "center" }}>
                        <strong>Actualizar cantidad</strong>
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}
            >
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    style={{
                        padding: "1rem",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <IonList style={{ marginBottom: "1rem" }}>
                        <IonItem
                            style={{ marginBottom: "1rem", padding: "0" }}
                            className={`${!errors.weight && "ion-valid"} ${
                                errors.weight?.type === "min" && "ion-invalid"
                            }`}
                        >
                            <IonLabel>Cantidad</IonLabel>
                            <IonInput
                                type="number"
                                {...register("weight", {
                                    required: 'La cantidad es requerida',
                                    min: {
                                        value: 1,
                                        message:
                                            "La cantidad debe ser mayor a 0",
                                    },
                                })}
                            />
                            <IonNote slot="error">
                                {errors.weight?.type === "min" &&
                                    errors.weight.message}
                                {errors.weight?.type === "required" &&
                                    errors.weight.message}
                            </IonNote>
                        </IonItem>
                    </IonList>
                    <IonButton expand="block" type="submit" color="success">
                        Actualizar
                    </IonButton>
                </form>
            </IonContent>
        </>
    );
};
