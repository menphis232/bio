import { IonNav } from '@ionic/react';
import Car from '../../components/dashboard/car/CarPage';

const ShoppingCar = () => {
	return <IonNav root={() => <Car />}></IonNav>;
};

export default ShoppingCar;
