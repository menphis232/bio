import {
    IonButton,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonLoading,
    IonModal,
    IonPage,
    IonSelect,
    IonSelectOption,
    IonText,
    useIonActionSheet,
    useIonModal,
    useIonToast,
} from "@ionic/react";
import React, { useState } from "react";
import { PRODUCTS_BY_BUSINESS, useStorage } from "../../../hooks/useStorage";
import { ChangePassword } from "./ChangePassword";
import { useUser } from "./hooks/useUser";
import { useHistory } from "react-router";
import { ProductsByBusiness } from "../../../../types/product";
import { currentNetworkStatus } from "../../../utils/netWorkStatus";
import { Header } from "../Header";

interface Props {
    setLoading: Function;
}

const MyProfile: React.FC<Props> = () => {
    const { user, setCurrentBusiness, clearDb, getData } = useStorage();
    const { changeMyPassword } = useUser();
    const [loading, setLoading] = useState(false)

    const actualBusiness = user.business.find(
        (b) => b.idSucursal === user.currentBusiness
    );

    const businessAlreadyLoaded = async (id: number): Promise<boolean> => {
        const productsByBusiness: ProductsByBusiness = await getData(PRODUCTS_BY_BUSINESS);
        const exists = !!productsByBusiness && Object.values(productsByBusiness).length > 0
        if (!exists) return false
        if (productsByBusiness[id] === undefined) {
            return false;
        }
        return true;
    }

    const handleChangeBusiness = async (e: any) => {
        const alreadyLoad = await businessAlreadyLoaded(e.target.value);
        const connection = await currentNetworkStatus();
        if (!alreadyLoad && !connection) {
            return handlePresentToast('Conectate a internet para cambiar de empresa', false);
        }
        setCurrentBusiness(e.target.value);
    };

    const [changePassword, setChangePassword] = useState({ isOpen: false });

    function closeModal() {
        setChangePassword({ isOpen: false });
        dismiss();
    }

    function openModal() {
        setChangePassword({ isOpen: true });
        present();
    }

    const [present, dismiss] = useIonModal(ChangePassword, {
        dismiss: closeModal,
        changePassword: handleChangePassword,
    });

    const [presentToast] = useIonToast();

    const handlePresentToast = (message: string, success: boolean = true) => {
        let icon = success ? "checkmark-done-outline" : "close-outline";
        presentToast({
            message,
            duration: 2000,
            position: "top",
            icon,
        });
    };

    async function handleChangePassword(pin: string) {
        setLoading(true);
        const result = await changeMyPassword(pin);
        setLoading(false);
        handlePresentToast(
            result.isSuccess ? result.getValue() : result.getErrorValue(),
            result.isSuccess
        );
    }

    const [presentAction] = useIonActionSheet();

    const history = useHistory();
    const handleSignOut = async (detail: { role: string }) => {
        console.log(detail);
        if (detail.role !== "ok") {
            return;
        }
        await clearDb();
        history.push("/");
    };

    return (
        <IonPage>
            <IonHeader>
                <Header title="Perfil" />
            </IonHeader>
            <IonContent>
                <IonText>
                    <h1 style={{ textAlign: 'center' }}>{user.fullname}</h1>
                </IonText>
                <IonList>
                    <IonItem>
                        <IonLabel>
                            <strong>Correo:</strong>
                        </IonLabel>
                        <IonText>{user.mail}</IonText>
                    </IonItem>
                    <IonItem>
                        <IonLabel>
                            <strong>Rol:</strong>
                        </IonLabel>
                        <IonText>Vendedor</IonText>
                    </IonItem>
                </IonList>
                {user.business.length > 1 ? (
                    <IonList>
                        <IonItem>
                            <IonLabel>
                                <strong>Seleccionar Empresa:</strong>
                            </IonLabel>
                            <IonSelect
                                value={user.currentBusiness}
                                disabled={user.business.length < 2}
                                onIonChange={handleChangeBusiness}
                            >
                                {user.business.map((b) => (
                                    <IonSelectOption
                                        key={b.idSucursal}
                                        value={b.idSucursal}
                                    >
                                        {b.nombre}
                                    </IonSelectOption>
                                ))}
                            </IonSelect>
                        </IonItem>
                    </IonList>
                ) : (
                    <IonItem>
                        <IonLabel>
                            <strong>Empresa:</strong>
                        </IonLabel>
                        <IonList>
                            {actualBusiness.nombre}
                        </IonList>
                    </IonItem>
                )}
                <div style={{ marginTop: '5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }} >
                    <IonButton onClick={() => openModal()} color="warning">
                        Cambiar contraseña
                    </IonButton>
                    <IonButton
                        onClick={() =>
                            presentAction({
                                header: "Cerrar Sesión",
                                subHeader: `Al cerrar sesión perderas todos los datos guardados
                            y acciones en proceso o sin sincronizar\nEstas seguro de cerrar tu sesión?`,
                                buttons: [
                                    {
                                        text: "Aceptar",
                                        role: "ok",
                                    },
                                    {
                                        text: "Cancelar",
                                        role: "cancel",
                                    },
                                ],
                                onDidDismiss: ({ detail }) =>
                                    handleSignOut(detail as { role: string }),
                            })
                        }
                        color="danger"
                    >
                        Cerrar Sesión
                    </IonButton>
                </div>
                <IonModal isOpen={changePassword.isOpen}>
                    <ChangePassword
                        dismiss={dismiss}
                        changePassword={handleChangePassword}
                    />
                </IonModal>
                <IonLoading isOpen={loading} />
            </IonContent>
        </IonPage>
    );
};

export default MyProfile;
