import { IonNav } from "@ionic/react";
import { SyncContainer } from "../../components/dashboard/sync/SyncContainer";

export const SyncPage: React.FC = () => {
    return <IonNav root={() => <SyncContainer />}></IonNav>;
};
