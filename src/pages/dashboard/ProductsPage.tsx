import { IonNav } from '@ionic/react';
import ProductsList from '../../components/dashboard/products/ProductsList';

const ProductsPage: React.FC = () => {
	return <IonNav root={() => <ProductsList />}></IonNav>;
};

export default ProductsPage;
