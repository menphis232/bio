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
import { close, eye, eyeOff } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
    dismiss: Function;
    changePassword: (pin: string) => void;
}

export const ChangePassword: React.FC<Props> = ({
    dismiss,
    changePassword,
}) => {
    const INITITAL_VALUES = {
        pin: "",
        repeatPin: "",
    };

    const {
        formState: { errors },
        handleSubmit,
        register,
        watch,
        reset,
    } = useForm({
        defaultValues: INITITAL_VALUES,
    });

    async function onSubmit(value: { pin: string }) {
        console.log(value);
        changePassword(value.pin);
        reset(INITITAL_VALUES);
        dismiss();
    }

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
    const [repeatInput, setRepeatInput] = useState({
        type: TYPES.password,
        icon: ICONS.eyeOff,
        visible: false
    });

    const changeVisibility = (input: string) => {
        if (input === "password") {
            passwordInput.visible
                ? setPasswortInput({ type: TYPES.password, icon: ICONS.eyeOff, visible: false })
                : setPasswortInput({ type: TYPES.text, icon: ICONS.eye, visible: true });
        } else {
            repeatInput.visible
                ? setRepeatInput({ type: TYPES.password, icon: ICONS.eyeOff, visible: false })
                : setRepeatInput({ type: TYPES.text, icon: ICONS.eye, visible: true });
        }
    };

    useEffect(() => {
        console.log(passwordInput);
    }, [passwordInput])

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
                        <strong>Cambiar contraseña</strong>
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    style={{
                        padding: "0, .5rem",
                        margin: "4rem 1rem",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-evenly",
                        minHeight: "300px",
                    }}
                >
                    <IonList>
                        <IonItem
                            className={`${!errors.pin && "ion-valid"} ${errors.pin && "ion-invalid"
                                }`}
                        >
                            <IonLabel>
                                <strong>Contraseña:</strong>
                            </IonLabel>
                            <IonInput
                                type={passwordInput.type as any}
                                {...register("pin", {
                                    required: "Ingresa una contraseña",
                                    pattern: {
                                        value: /^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,16}$/,
                                        message:
                                            "La contraseña debe tener entre 8 y 16 caracteres, un número, una mayúscula, una minúscula y un caracter especial",
                                    },
                                })}
                            />
                            <IonButtons>
                                <IonButton onClick={() => changeVisibility('password')}>
                                    <IonIcon icon={passwordInput.icon} color="medium" />
                                </IonButton>
                            </IonButtons>
                            <IonNote slot="error">
                                {errors.pin?.message}
                            </IonNote>
                        </IonItem>
                        <IonItem
                            className={`${!errors.repeatPin && "ion-valid"} ${errors.repeatPin && "ion-invalid"
                                }`}
                        >
                            <IonLabel>
                                <strong>Repetir:</strong>
                            </IonLabel>
                            <IonInput
                                type={repeatInput.type as any}
                                {...register("repeatPin", {
                                    validate: (val: string) => {
                                        if (watch("pin") !== val) {
                                            return "Las contraseñas no coinciden";
                                        }
                                    },
                                })}
                            />
                            <IonButtons>
                                <IonButton onClick={() => changeVisibility('repeat')}>
                                    <IonIcon icon={repeatInput.icon} color="medium" />
                                </IonButton>
                            </IonButtons>
                            <IonNote slot="error">
                                {errors.repeatPin?.message}
                            </IonNote>
                        </IonItem>
                    </IonList>
                    <IonButton color="success" type="submit" expand="block">
                        Cambiar
                    </IonButton>
                </form>
            </IonContent>
        </>
    );
};
