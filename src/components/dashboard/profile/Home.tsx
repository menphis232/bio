import {
    IonButton,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader,
    IonLoading,
    IonPage,
    IonRow,
    IonText,
    useIonModal,
    useIonToast,
    useIonViewWillEnter,
} from "@ionic/react";
import { useEffect, useMemo, useState } from "react";

import { Header } from "../Header";
import { PRODUCTS_BY_BUSINESS, useStorage } from "../../../hooks/useStorage";
import { useProducts } from "../products/hooks/useProducts";
import { useCategories } from "../../../hooks/useCategories";
import ProductItem from "../products/Product";
import { Product } from "../../../../types/product";
import { AddProductToOrder } from "../products/AddProductToOrder";
import ProductDetail from "../products/ProductDetail";
import { useOrder } from "../orders/hooks/useOrder";
import { useIonRouter } from "@ionic/react";

const Home: React.FC = () => {
    const [loading, setLoading] = useState(false);

    const { user, getData } = useStorage();
    const { getProducts, products } = useProducts();
    const { handleGetCategories } = useCategories();
    const { orderExist, existsAnOrder } = useOrder()

    const router = useIonRouter();

    async function handleFetchData(businessId: number) {
        setLoading(true);
        const data = await getData(PRODUCTS_BY_BUSINESS);
        if (!data || !data[user.currentBusiness]) {
            await getProducts(businessId, true);
            await handleGetCategories(businessId, true);
            return setLoading(false);
        }
        await getProducts(businessId, false);
        return setLoading(false);
    }

    useIonViewWillEnter(async () => {
        await existsAnOrder()
    })

    useEffect(() => {
        handleFetchData(user.currentBusiness);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.currentBusiness]);

    const filteredProducts = useMemo(() => {
        return products.filter((p) => p.isPromo === "1");
    }, [products]);


    const [productToAdd, setProductToAdd] = useState<Product>();
    const closeAddModal = () => {
        dismissAddProduct();
    };

    const [presentToast] = useIonToast()

    const openAddModal = (product: Product) => {
        if (!orderExist) {
            presentToast({
                message: `Agrega un pedido antes de agregar un producto`,
                duration: 1500,
                position: "top",
            });
            return router.push('/dashboard/shopping-car');
        }
        setProductToAdd(product);
        presentAddProduct();
    };

    const [presentAddProduct, dismissAddProduct] = useIonModal(
        AddProductToOrder,
        {
            dismiss: closeAddModal,
            product: productToAdd,
        }
    );


    const [productDetail, setProductDetail] = useState<Product>();
    const closeDetailModal = () => {
        dismissDetail();
    };

    const openDetailModal = (product: Product) => {
        setProductDetail(product);
        presentDetail()
    };

    const [presentDetail, dismissDetail] = useIonModal(
        ProductDetail,
        {
            dismiss: closeDetailModal,
            product: productDetail,
        }
    );

    return (
        <>
            {/*<Menu />*/}
            <IonPage>
                <IonHeader>
                    <Header title="Inicio" />
                </IonHeader>
                <IonContent>
                    <main style={{ textAlign: "center" }}>
                        <section>
                            <IonGrid
                                color="light"
                                style={{
                                    backgroundColor: "var(--ion-color-light)",
                                }}
                            >
                                <IonRow>
                                    <IonCol
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "start",
                                        }}
                                        size="5"
                                    >
                                        <IonButton
                                            color="primary"
                                            routerLink="/dashboard/routes"
                                        >
                                            Ver Rutas
                                        </IonButton>
                                    </IonCol>
                                    <IonCol size="7">
                                        <IonRow>
                                            <IonCol>
                                                <IonText>
                                                    <h3>{user.fullname}</h3>
                                                </IonText>
                                            </IonCol>
                                        </IonRow>
                                    </IonCol>
                                </IonRow>
                            </IonGrid>
                        </section>
                        <section style={{ marginTop: "3rem" }}>
                            <>
                                <h1>Productos en Promoción</h1>
                                {filteredProducts.length === 0 && (
                                    <h2>No hay productos en promoción</h2>
                                )}
                                {filteredProducts.length > 0 &&
                                    filteredProducts.map((p) => (
                                        <ProductItem
                                            key={p.idProduct}
                                            product={p}
                                            presentAddProduct={openAddModal}
                                            presentDetail={openDetailModal}
                                        />
                                    ))}
                            </>
                        </section>
                    </main>
                </IonContent>
                <IonLoading isOpen={loading} />
            </IonPage>
        </>
    );
};

export default Home;
