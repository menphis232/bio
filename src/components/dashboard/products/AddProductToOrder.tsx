import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonNote,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
  useIonRouter,
  useIonToast,
} from "@ionic/react";
import { Product } from "../../../../types/product";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { CURRENT_ORDER, useStorage } from "../../../hooks/useStorage";
import { useOrder } from "../orders/hooks/useOrder";
import {
  CurrentOrderByBusiness,
  OrderItem,
  SaveOrder,
} from "../../../../types/order";
import { close } from "ionicons/icons";
import { ip } from "../../../environment";

interface Props {
  product: Product;
  dismiss: Function;
}

interface FormInputs {
  quantityProduct: number;
}

export enum UNIT_TYPE {
  UNIT = 17,
  KG = 3,
}

export const AddProductToOrder: React.FC<Props> = ({ product, dismiss }) => {
  const { getData, user } = useStorage();
  const { addProductToOrder, confirmProductQuantity, getOrderById } =
    useOrder();
  const [loading, setLoading] = useState<boolean>(false);
  const [order, setOrder] = useState<SaveOrder>();
  const [cantidad, setCantidad] = useState(1);
  const form = useRef(null);
  const [fullORder, fullsetorder] = useState<boolean>(false);


  async function getCurrentOrderId() {
    setLoading(true);
    const currentOrder:CurrentOrderByBusiness = await getData(CURRENT_ORDER);
    let actualOrder = Object.keys(currentOrder).some((x) => Number(x) === user.currentBusiness);
    fullsetorder(actualOrder);
    
    setTimeout(() => {
      if (
        currentOrder &&
        currentOrder[user.currentBusiness] &&
        currentOrder[user.currentBusiness].length > 0 &&
        actualOrder
      ) {
        const firstOrder = currentOrder[user.currentBusiness][0];
        setOrder(firstOrder);
        setCurrentOrderId(firstOrder.idOrderH || 0);
      }
      setLoading(false);
    }, 0);
  }

  const [currentOrderId, setCurrentOrderId] = useState<number>();

  useEffect(() => {
    getCurrentOrderId();
  }, []);

  const [presentToast] = useIonToast();

  const calculateProductPrice = (product: Product): number => {
    let priceProductOrder = product.isPromo === "1" ? product.marketPrice : product.priceSale;
    if (product.idUnitMeasureSaleFk === UNIT_TYPE.KG && product.unitweight > 0) {
      priceProductOrder *= product.unitweight;
    }
    return priceProductOrder;
  };

  const productAlreadyAdded = (productId: number): boolean => {
    if (!order?.body) {
      return false;
    }
    const productExists = order.body.find((p) => p.idProduct === productId);
    return !!productExists;
  };

  const handleAddItem = async (product: Product, quantityProduct: number) => {
    const priceProductOrder = calculateProductPrice(product);

    if (!fullORder) {
      presentToast({
        message: `Crea un pedido antes de agregar un producto`,
        duration: 3000,
        position: "top",
      });

      return;
    }

    if (productAlreadyAdded(product.idProduct)) {
      /// logic to change quantity
      presentToast({
        message: `${product!.nameProduct} ya esta agregado en la orden actual`,
        duration: 2000,
        position: "top",
      });
      return dismiss();
    }

    setLoading(true);
    await addProductToOrder({
      idOrderHFk: currentOrderId as number,
      idProductFk: product.idProduct,
      idUserAddFk: user.idUser,
      priceProductOrder,
      quantityProduct: 1,
    });

    const orders: CurrentOrderByBusiness = await getData(CURRENT_ORDER);
    const order = orders[user.currentBusiness][0];

    if (order.body) {
      const added = order.body?.find((p: OrderItem) => {
        return p.idProduct === product.idProduct;
      });

      if (Number(quantityProduct) > 1) {
        // set weight
        await confirmProductQuantity(added!.idOrderB, Number(quantityProduct));
        await getOrderById(currentOrderId as number);
      }
    }

    setLoading(false);
    // success message
    presentToast({
      message: `${product!.nameProduct} ha sido agregado a tu pedido actual`,
      duration: 2000,
      position: "top",
    });
    dismiss();
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: { quantityProduct: 1 },
  });

  function calculateSubTotal(product: Product, quantity: number) {
    let subTotal = 0;
    if (
      product.idUnitMeasureSaleFk === UNIT_TYPE.KG &&
      product.unitweight > 0
    ) {
      subTotal =
        quantity *
        (product.unitweight *
          (product.isPromo === "1" ? product.marketPrice : product.priceSale));
    } else {
      subTotal =
        quantity *
        (product.isPromo === "1" ? product.marketPrice : product.priceSale);
    }
    return subTotal;
  }

  const quantity = watch("quantityProduct");

  const onSubmit = async ({ quantityProduct }: FormInputs) => {
    await handleAddItem(product, quantityProduct);
  };

  return (
    <>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons>
            <IonButtons slot="start">
              <IonButton onClick={() => dismiss()}>
                <IonIcon icon={close} />
              </IonButton>
            </IonButtons>
            <IonTitle style={{ textAlign: "center" }}>
              <strong>Agregar Producto</strong>
            </IonTitle>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <form
          ref={form}
          onSubmit={handleSubmit(onSubmit)}
          style={{
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minHeight: "300px",
          }}
        >
          <IonText>
            <h2>
              {" "}
              <strong>{product?.nameProduct}</strong>
            </h2>
          </IonText>
          <IonList>
            <IonItem
              style={{ padding: "0" }}
              className={`${!errors.quantityProduct && "ion-valid"} ${
                errors.quantityProduct?.type === "min" && "ion-invalid"
              }`}
            >
              <IonLabel>
                <strong>Cantidad:</strong>
              </IonLabel>
              <IonInput
                type="text"
                inputMode="numeric"
                onIonChange={(e) =>
                  e.detail.value
                    ? setCantidad(parseFloat(e.detail.value))
                    : setCantidad(1)
                }
                {...register("quantityProduct", {
                  required: "La cantidad es requerida",
                  min: {
                    value: 1,
                    message: "La cantidad debe ser mayor a 0",
                  },
                })}
                placeholder="000"
              ></IonInput>
              <IonNote slot="error">
                {errors.quantityProduct?.type === "min" &&
                  errors.quantityProduct.message}
                {errors.quantityProduct?.type === "required" &&
                  errors.quantityProduct.message}
              </IonNote>
            </IonItem>
            {product.idUnitMeasureSaleFk === UNIT_TYPE.KG &&
              product.unitweight > 0 && (
                <>
                  <IonRow
                    style={{
                      marginTop: "1rem",
                      padding: "0",
                    }}
                  >
                    <IonCol>
                      <IonText
                        style={{
                          padding: "10px 0 10px 8px",
                        }}
                      >
                        $
                        {product.isPromo === "1"
                          ? product.marketPrice
                          : product.priceSale}{" "}
                        x kg | Peso por pieza {product.unitweight} kg
                      </IonText>
                    </IonCol>
                  </IonRow>
                </>
              )}
            <IonRow
              style={{
                padding: "10px",
              }}
            >
              <IonCol>
                <IonText>
                  <strong>Total:</strong>
                </IonText>
                <IonText
                  style={{
                    padding: "10px 0 10px 8px",
                  }}
                >
                  <strong>
                    ${calculateSubTotal(product, cantidad).toFixed(2)}
                  </strong>
                </IonText>
              </IonCol>
            </IonRow>
          </IonList>
          <IonImg
            style={{
              maxWidth: "300px",
              height: "auto",
            }}
            src={`${ip}/product/${product?.urlImagenProduct}`}
            alt="Producto"
          />
          <IonButton
            style={{ marginTop: "1rem" }}
            color="success"
            expand="block"
            type="submit"
          >
            Agregar
          </IonButton>
        </form>
      </IonContent>
      <IonLoading isOpen={loading} />
    </>
  );
};
