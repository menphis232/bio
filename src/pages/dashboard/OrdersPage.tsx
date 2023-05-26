import { IonNav } from '@ionic/react';
import OrderList from '../../components/dashboard/orders/OrdersList';

const OrdersPage = () => {
	return <IonNav root={() => <OrderList />}></IonNav>;
};

export default OrdersPage;
