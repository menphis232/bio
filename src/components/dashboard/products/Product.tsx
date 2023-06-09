import {
  IonAvatar,
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonRow,
  IonText,
} from "@ionic/react";
import { cart, eye } from "ionicons/icons";

import { Product } from "../../../../types/product";
import { useStorage } from "../../../hooks/useStorage";
import { ip } from "../../../environment";
import "./Product.css";

interface Props {
  presentAddProduct: (product: Product) => void;
  presentDetail: (product: Product) => void;
  product: Product;
}

const ProductItem: React.FC<Props> = ({
  product,
  presentAddProduct,
  presentDetail,
}) => {

  return (
    <>
      <IonCard>
        <IonItem
          style={{ margin: 0, padding: 0, width: "100%" }}
          key={product.idProduct}
        >
          <IonAvatar
            style={{
              margin: ".5rem 1rem",
              width: "3.5rem",
              height: "auto",
            }}
          >
            <IonImg
              src={`${ip}/product/${product.urlImagenProduct}`}
              alt="producto"
            />
          </IonAvatar>
          <IonLabel>
            <h2 style={{ fontWeight: "bold" }}>{product.nameProduct}</h2>
            <IonText>
              <IonRow className="row-align-center">
                <p> ${product.priceSale} </p>{" "}
                {product.isPromo === "1" && (
                  <IonBadge className="badge-promo-product" color="danger">
                    Promoción
                  </IonBadge>
                )}
              </IonRow>
            </IonText>
          </IonLabel>
          <IonButtons>
            <IonButton onClick={() => presentDetail(product)}>
              <IonIcon icon={eye} color="primary"></IonIcon>
            </IonButton>
            <IonButton
              onClick={() => presentAddProduct(product)}
              style={{ color: "var(--ion-color-primary)" }}
            >
              <IonIcon color="success" icon={cart}></IonIcon>
            </IonButton>
          </IonButtons>
        </IonItem>
      </IonCard>
    </>
  );
};

export default ProductItem;
