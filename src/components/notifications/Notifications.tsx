import { useContext, useEffect, useState, useRef } from 'react';
import Cookie from 'js-cookie';
import {ip} from '../../environment'
import { IonIcon } from '@ionic/react';
import { notifications } from 'ionicons/icons';
import {   IonButtons,
  IonButton,
  IonModal,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonPage,
  IonItem,
  IonLabel,
  IonInput, } from '@ionic/react';
  import { OverlayEventDetail } from '@ionic/core/components';
  import axios from 'axios';
 import { useRequest } from "../../../src/hooks/useRequest"



interface Props {

}


const Notifications: React.FC = () => {

  	const [open, setOpen] = useState(false);
	const [minStockData, setMinStockData] = useState([]);

	const modal = useRef<HTMLIonModalElement>(null);
  	const input = useRef<HTMLIonInputElement>(null);

	const [message, setMessage] = useState(
    	'This modal example uses triggers to automatically open a modal when the button is clicked.'
  	);


    const getProductsByStockMinimum = async () => {

	// Cookie.set('idBranchFk', selectedBusiness.idSucursal);
	// const idBranchFk = Cookie.get('idBranchFk');


  	const url =`${ip}/api/v2/product/listminstock/lite/1`;

  try {
    const res = await axios.get(url);
		console.log(res)

    if (!res.data) {
      console.error('Error response from server:', res);
      throw new Error('Server response was not ok.');
    }

   const dataMinStock = res.data.data;

	// const minStockselectedData = dataMinStock.map((item: { nameProduct: any; stock: any; }) => ({
	// 	Nombre: item.nameProduct,
	// 	stock: item.stock
    // }));
    //   setMinStockData(minStockselectedData);
	  console.log("AQUÍ")

  } catch (error) {
    console.error('Error al acceder a los datos:', error);
  }

};

  function confirm() {
    modal.current?.dismiss(input.current?.value, 'confirm');
  }

  function onWillDismiss(ev: CustomEvent<OverlayEventDetail>) {
    if (ev.detail.role === 'confirm') {
      setMessage(`Hello, ${ev.detail.data}!`);
    }
  }

  const openModal = () => {
    setOpen(true);
  };

  return (
 <div>
      <IonButton onClick={() => {
		openModal();
		getProductsByStockMinimum()

	  }}>
        <IonIcon icon={notifications} color="light" />
      </IonButton>
      <IonModal isOpen={open} onDidDismiss={() => setOpen(false)}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={() => setOpen(false)}>Cancel</IonButton>
            </IonButtons>
            <IonTitle>Alerta de stock:</IonTitle>
            <IonButtons slot="end">
              <IonButton strong={true} onClick={confirm}>
                Confirm
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonItem>
            <IonLabel position="stacked">Enter your name</IonLabel>
            <IonInput ref={input} type="text" placeholder="Your name" />
          </IonItem>
        </IonContent>
      </IonModal>
    </div>
  );
};

export default Notifications;