import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonImg,
    IonItem,
    IonLabel,
    IonList,
    IonLoading,
    IonText,
    IonTitle,
    IonToolbar,
} from "@ionic/react";
import { checkmarkCircle, close, closeCircle } from "ionicons/icons";
import { Product } from "../../../../types/product";
import { useStorage } from "../../../hooks/useStorage";
import { ip } from "../../../environment";
import { useCategories } from "../../../hooks/useCategories";
import { useEffect, useState } from "react";
import { UNIT_TYPE } from "./AddProductToOrder";

interface Props {
    product: Product;
    dismiss: Function;
}

const ProductDetail: React.FC<Props> = ({ product, dismiss }) => {
    const { environment, user } = useStorage();

    const { brands, categories, lines, handleGetCategories, subCategories } =
        useCategories();

    const [loading, setLoading] = useState(false);

    const handleFetchCategories = async () => {
        setLoading(true);
        await handleGetCategories(user.currentBusiness, false);
        setLoading(false);
    };

    const [names, setNames] = useState({
        category: "",
        subCategory: "",
        line: "",
        brands: "",
    });

    useEffect(() => {
        handleFetchCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product]);

    console.log(product);

    const filterNames = () => {
        const category = categories.find(
            (c) => c.idProductFamily === product.idProductFamily
        );
        const subCategory = subCategories.find(
            (s) => s.idProductSubFamily === product.idProductSubFamilyFk
        );
        const brand = brands.find((b) => b.idBrand === product.idBrandFk);
        const line = lines.find((l) => l.idLine === product.idLineFk);
        setNames((prev) => ({
            ...prev,
            category: category?.name || "",
            subCategory: subCategory?.nameSubFamily || "",
            line: line?.name || "",
            brands: brand?.name || "",
        }));
    };

    useEffect(() => {
        filterNames();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [brands, categories, subCategories, lines]);

    return (
        <>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonButtons slot="start">
                        <IonButton
                            onClick={() => dismiss()}
                        >
                            <IonIcon icon={close} />
                        </IonButton>
                    </IonButtons>
                    <IonTitle style={{ textAlign: "center" }}>
                        <strong>Detalle producto</strong>
                    </IonTitle>
                    <IonButtons slot="end">
                        <IonButton />
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <section
                    style={{
                        paddingInline: "2px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                    }}
                >
                    <h1>{product?.nameProduct}</h1>
                    <IonList style={{ width: "100%", marginBottom: "1rem" }}>
                        <IonItem>
                            <IonLabel>
                                <strong>Precio:</strong>
                            </IonLabel>
                            <IonText>
                                ${product?.priceSale}
                                {product.idUnitMeasureSaleFk === UNIT_TYPE.KG &&
                                    `/KG`}
                            </IonText>
                        </IonItem>
                        <IonItem>
                            <IonLabel>
                                <strong>Código:</strong>
                            </IonLabel>
                            <IonText>{product?.barCode}</IonText>
                        </IonItem>
                        <IonItem>
                            <IonLabel>
                                <strong>Marca:</strong>
                            </IonLabel>
                            <IonText>{names.brands}</IonText>
                        </IonItem>
                        <IonItem>
                            <IonLabel>
                                <strong>Categoría:</strong>
                            </IonLabel>
                            <IonText>{names.category}</IonText>
                        </IonItem>
                        <IonItem>
                            <IonLabel>
                                <strong>Sub categoría:</strong>
                            </IonLabel>
                            <IonText>{names.subCategory || "N/A"}</IonText>
                        </IonItem>
                        <IonItem>
                            <IonLabel>
                                <strong>Linea:</strong>
                            </IonLabel>
                            <IonText>{names.line || "N/A"}</IonText>
                        </IonItem>
                        <IonItem>
                            <IonLabel>
                                <strong>Promocionado:</strong>
                            </IonLabel>
                            <IonIcon
                                style={{
                                    color: `${product.isPromo === "1"
                                            ? "var(--ion-color-success)"
                                            : "var(--ion-color-danger)"
                                        }`,
                                }}
                                icon={
                                    product?.isPromo === "1"
                                        ? checkmarkCircle
                                        : closeCircle
                                }
                            />
                        </IonItem>
                        {product?.isPromo === "1" && (
                            <IonItem>
                                <IonLabel>
                                    <strong>Precio de promoción:</strong>
                                </IonLabel>
                                <IonText>
                                    ${product.marketPrice}
                                    {product.idUnitMeasureSaleFk ===
                                        UNIT_TYPE.KG && `/KG`}
                                </IonText>
                            </IonItem>
                        )}
                        <IonItem>
                            <IonLabel>
                                <strong>Medida:</strong>
                            </IonLabel>
                            <IonText>
                                {product.idUnitMeasureSaleFk === UNIT_TYPE.UNIT
                                    ? "Unidad"
                                    : "KG"}
                            </IonText>
                        </IonItem>
                        {product.idUnitMeasureSaleFk === UNIT_TYPE.KG && (
                            <IonItem>
                                <IonLabel>
                                    <strong>Peso unitario:</strong>
                                </IonLabel>
                                <IonText>{product.unitweight} KG</IonText>
                            </IonItem>
                        )}
                        <IonItem>
                            <IonLabel>
                                <strong>Registro sanitario:</strong>
                            </IonLabel>
                            <IonText>{product.healthRegister}</IonText>
                        </IonItem>
                        <IonItem>
                            <IonLabel>
                                <strong>CPE:</strong>
                            </IonLabel>
                            <IonText>{product.cpe}</IonText>
                        </IonItem>
                        <IonItem>
                            <IonLabel>
                                <strong>EAN:</strong>
                            </IonLabel>
                            <IonText>{product.ean}</IonText>
                        </IonItem>
                        <IonItem>
                            <div
                                style={{
                                    width: "100%",
                                    justifyContent: "center",
                                    display: "flex",
                                }}
                            >
                                <IonImg
                                    style={{
                                        maxWidth: "300px",
                                        height: "auto",
                                    }}
                                    src={`${ip}/product/${product?.urlImagenProduct}`}
                                />
                            </div>
                        </IonItem>
                    </IonList>
                </section>
            </IonContent>
            <IonLoading isOpen={loading} />
        </>
    );
};

export default ProductDetail;
