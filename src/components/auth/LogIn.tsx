import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import "../../theme/main.css";
import "./Login.css";

import {
    IonButton,
    IonContent,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonLoading,
    IonNote,
    IonPage,
    IonButtons,
    useIonToast,
} from "@ionic/react";
import { mailOutline, shieldOutline, eye, eyeOff } from "ionicons/icons";
import { Login, useAuth } from "./hooks/useAuth";
import { currentNetworkStatus } from "../../utils/netWorkStatus";
import { useIonRouter } from "@ionic/react";
import { TOKEN, useStorage } from "../../hooks/useStorage";

export const LogIn: React.FC = () => {
    let router = useIonRouter();

    const { getData } = useStorage()
    const { login } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);

    let initialValues = {
        mail: "",
        pin: "",
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: initialValues,
    });

    const TYPES = {
        password: "password",
        text: "text",
    };

    const ICONS = {
        eye,
        eyeOff,
    };

    const [passwordInput, setPasswortInput] = useState({
        type: TYPES.password,
        icon: ICONS.eyeOff,
        visible: false
    });

    const changeVisibility = () => {
        passwordInput.visible
            ? setPasswortInput({ type: TYPES.password, icon: ICONS.eyeOff, visible: false })
            : setPasswortInput({ type: TYPES.text, icon: ICONS.eye, visible: true });
    }

    async function handleLogin(data: Login) {
        const res = await login(data);
        return {
            message: res.isFailure ? res.getErrorValue() : res.getValue(),
            success: res.isSuccess,
        };
    }

    const onSubmit = async (data: Login) => {
        const connection = await currentNetworkStatus();
        setLoading(true);
        if (!connection) {
            setLoading(false);
            return presentToast("Asegurate de tener conexión a internet");
        }
        const res = await handleLogin(data);
        if (!res.success) {
            setLoading(false);
            return presentToast(res.message);
        }
        setLoading(false);
        presentToast(res.message);
        reset(initialValues);
        router.push("/dashboard/products");
    };

    const [present] = useIonToast();

    const presentToast = (message: string) => {
        const duration = 1500; //ms
        present({
            message,
            duration,
            position: "top",
        });
    };

    async function alreadyLogin() {
        const token = await getData(TOKEN);
        if (token) {
            router.push('/dashboard/products')
        }
    }

    useEffect(() => {
        alreadyLogin()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <IonPage>
            <IonContent
                style={{
                    display: "flex",
                    flexWrap: "1 auto",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100vh",
                }}
            >
                <main
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <div
                        style={{
                            width: "100%",
                            height: "12rem",
                            display: "flex",
                            alignItems: "end",
                            justifyContent: "center",
                            backgroundImage: `url(/assets/images/background.jpeg)`,
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                        }}
                    >
                        <h1
                            style={{
                                color: "var(--ion-color-light)",
                                fontSize: "3rem",
                                fontWeight: "bold",
                                marginBottom: "1rem",
                                textAlign: "center",
                            }}
                        >
                            SiempreOL
                        </h1>
                    </div>
                    <form
                        style={{
                            width: "100%",
                            maxWidth: "400px",
                        }}
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <IonList
                            style={{
                                marginBottom: "1rem",
                                width: "100%",
                                borderRadius: "4px",
                            }}
                        >
                            <IonItem
                                className={`${errors.mail && "ion-invalid"}`}
                            >
                                <IonLabel
                                    position="floating"
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <IonIcon
                                        icon={mailOutline}
                                        size="large"
                                        style={{ marginRight: ".5rem" }}
                                    />{" "}
                                    Correo
                                </IonLabel>
                                <IonInput
                                    {...register("mail", {
                                        required: "Ingresa un email",
                                        pattern: {
                                            value: /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
                                            message: "Email Invalido",
                                        },
                                    })}
                                />
                                <IonNote slot="error">
                                    {errors.mail?.message}
                                </IonNote>
                            </IonItem>
                            <IonItem
                                style={{ alignItems: 'end' }}
                                className={`${errors.pin && "ion-invalid"} `}
                            >
                                <IonLabel
                                    position="floating"
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <IonIcon
                                        icon={shieldOutline}
                                        size="large"
                                        style={{ marginRight: ".5rem" }}
                                    />{" "}
                                    Contraseña
                                </IonLabel>
                                <IonInput
                                    type={passwordInput.type as any}
                                    {...register("pin", {
                                        required: "Ingresa una contraseña",
                                    })}
                                />
                                <IonButtons slot='end'>
                                    <IonButton onClick={() => changeVisibility()}>
                                        <IonIcon icon={passwordInput.icon} color="medium" />
                                    </IonButton>
                                </IonButtons>
                                <IonNote slot="error">
                                    Ingresa una contraseña
                                </IonNote>
                            </IonItem>
                        </IonList>
                        <div
                            style={{
                                padding: "1rem",
                            }}
                        >
                            <IonButton
                                type="submit"
                                color="primary"
                                expand="block"
                            >
                                Iniciar Sesión
                            </IonButton>
                        </div>
                        <p
                            style={{
                                textAlign: "center",
                                marginTop: "2rem",
                                color: "var(--ion-color-medium)",
                                fontSize: ".8rem",
                            }}
                        >
                            Versión 1.0.0
                        </p>
                    </form>
                </main>
                <IonLoading isOpen={loading} />
            </IonContent>
        </IonPage>
    );
};
