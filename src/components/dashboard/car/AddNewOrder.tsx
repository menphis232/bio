import {
    IonButton,
    IonItem,
    IonLabel,
    IonList,
    IonLoading,
    IonNote,
    IonSelect,
    IonSelectOption,
    IonTextarea,
} from "@ionic/react";
import { useForm } from "react-hook-form";
import { useClients } from "../clients/hooks/useClients";
import { useEffect, useState } from "react";
import { useStorage } from "../../../hooks/useStorage";
import { CreateOrder } from "../../../../types/order";
import { Client } from "../../../../types/client";

interface Props {
    addOrder: (data: CreateOrder) => Promise<void>;
}

interface FormData {
    comments: string;
    client: Client | null;
}

const AddNewOrder: React.FC<Props> = ({ addOrder }) => {
    const { getClients, clients } = useClients();
    const { user } = useStorage();

    const [loading, setLoading] = useState<boolean>(false);

    const INITIAL_VALUES: FormData = {
        comments: "",
        client: null,
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: INITIAL_VALUES,
    });

    const onSubmit = async ({ comments, client }: FormData) => {
        console.log(client, "client");
        if (!client) {
            return;
        }
        setLoading(true);
        const data: CreateOrder = {
            address: client.address,
            comments,
            fullNameClient: client.nameClient,
            idBranchFk: user.currentBusiness,
            idUserOpenFk: user.idUser,
            phoneClient: client.phone,
        };
        await addOrder(data);
        setLoading(false);
    };

    async function handleGetClients(userId: number) {
        setLoading(true);
        await getClients(userId);
        setLoading(false);
    }

    useEffect(() => {
        handleGetClients(user.idUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}
            >
                <h1>
                    <strong>Agregar pedido</strong>
                </h1>
                <div
                    style={{
                        padding: "1rem",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        marginTop: "4rem",
                    }}
                >
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        style={{ width: "100%", maxWidth: "400px" }}
                    >
                        <IonList
                            style={{
                                marginBottom: "1rem",
                                width: "100%",
                                borderRadius: "4px",
                            }}
                        >
                            <IonItem
                                className={`${
                                    errors.client && "ion-invalid"
                                }`}
                            >
                                <IonLabel>
                                    <strong>Cliente:</strong>
                                </IonLabel>
                                <IonSelect
                                    {...register("client", {
                                        required: "Elige un cliente",
                                    })}
                                >
                                    {clients.map((client) => (
                                        <IonSelectOption
                                            key={client.idClient}
                                            value={client}
                                        >
                                            {client.nameClient}
                                        </IonSelectOption>
                                    ))}
                                </IonSelect>
                                <IonNote slot="error">
                                    {errors.client?.message}
                                </IonNote>
                            </IonItem>
                            <IonItem>
                                <IonTextarea placeholder="Observacion (opcional)" {...register("comments")} />
                            </IonItem>
                        </IonList>
                        <IonButton color="primary" expand="block" type="submit">
                            Agregar
                        </IonButton>
                    </form>
                </div>
            </div>
            <IonLoading isOpen={loading} />
        </>
    );
};

export default AddNewOrder;
