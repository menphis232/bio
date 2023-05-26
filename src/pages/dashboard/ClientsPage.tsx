import { IonNav } from '@ionic/react';
import { ClientsList } from '../../components/dashboard/clients/ClientsList';

const ClientsPage: React.FC = () => {
	return <IonNav root={() => <ClientsList />}></IonNav>;
};

export default ClientsPage;
