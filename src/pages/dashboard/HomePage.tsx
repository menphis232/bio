import { IonNav } from "@ionic/react";
import Home from "../../components/dashboard/profile/Home";

const HomePage: React.FC = () => {
    return <IonNav root={() => <Home />}></IonNav>;
};

export default HomePage;
