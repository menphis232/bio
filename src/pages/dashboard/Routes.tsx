
import { IonNav } from '@ionic/react';
import MyRoutes from '../../components/dashboard/clients/MyRoutes';


export const RoutesPage = () => {
	return <IonNav root={() => <MyRoutes />}></IonNav>;
}

export default RoutesPage;
