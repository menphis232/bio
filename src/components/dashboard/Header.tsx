import {
    IonButton,
    IonButtons,
    IonIcon,
    IonMenuButton,
    IonTitle,
    IonToolbar,
} from "@ionic/react";
import { sync } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useStorage } from "../../hooks/useStorage";

interface Props {
    title: string;
}

export const Header: React.FC<Props> = ({ title }) => {
    const { user } = useStorage();

    const [business, setBusiness] = useState<any>();

    useEffect(() => {
        const business = user.business.find(
            (b) => b.idSucursal === user.currentBusiness
        );
        setBusiness(business);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.currentBusiness]);

    return (
        <>
            <IonToolbar color="primary">
                <IonButtons slot="start">
                    <IonMenuButton color="light"></IonMenuButton>
                </IonButtons>
                <IonTitle style={{ textAlign: "center" }}>
                    <h4 style={{ margin: "4px 0 0 0" }}>
                        <strong>{business?.nombre}</strong>
                    </h4>
                    <h5 style={{ margin: "0" }}>{title}</h5>
                </IonTitle>
                <IonButtons slot="end">
                    {
                        title!=='Sincronizar' ?
                    <IonButton

                        routerLink="/dashboard/sync"
                        //fill="outline"
                        //shape="round"
                    >
                        <IonIcon icon={sync} color="light"></IonIcon>
                    </IonButton>
                    :
                    ''
                    }
                </IonButtons>
            </IonToolbar>
        </>
    );
};
