import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonItem,
    IonLoading,
    IonPage,
    IonSearchbar,
    IonText,
    IonToolbar,
    useIonModal,
    useIonRouter,
    useIonToast,
 
    useIonViewWillEnter,
} from "@ionic/react";
import { useEffect, useState } from "react";

import { useStorage } from "../../../hooks/useStorage";
import FiltersModal from "./FilstersModal";
import ProductItem from "./Product";
import { Header } from "../Header";
import { useProducts } from "./hooks/useProducts";
import { useCategories } from "../../../hooks/useCategories";
import { AddProductToOrder } from "./AddProductToOrder";
import { Product } from "../../../../types/product";
import ProductDetail from "./ProductDetail";
import { useOrder } from "../orders/hooks/useOrder";
import { currentNetworkStatus } from "../../../utils/netWorkStatus";

const ProductsList: React.FC = () => {
    const { user } = useStorage();

    // Loading
    const [loading, setLoading] = useState<boolean>(false);

    // Products
    const { getProducts, products, setQuery, query, lastSync } = useProducts();
    const { categories, handleGetCategories, subCategories, lines, brands } =
        useCategories();

    const { orderExist, existsAnOrder } = useOrder()
    const router = useIonRouter();
    

    async function handleGetProducts(sync: boolean = false) {
        const conn = await currentNetworkStatus()
        if (!conn) {
            return presentToast({
                message: `Conectate a internet para sincronizar productos`,
                duration: 1500,
                position: "top",
            });
        }
        setLoading(true);
        await getProducts(user.currentBusiness, sync);
        await handleGetCategories(user.currentBusiness, sync);
        setLoading(false);
    }

    useIonViewWillEnter(async () => {
        await existsAnOrder()
    })

    useEffect(() => {
        handleGetProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.currentBusiness]);

    const handleSearchProducts = (e: any) => {
        setQuery((prev) => ({ ...prev, search: e.target.value }));
    };
    // End Products

    // Modal
    const onModalClose = () => {
        dismissFilters();
    };
    const [presentFilters, dismissFilters] = useIonModal(FiltersModal, {
        query,
        setQuery,
        onClose: onModalClose,
        categories,
        subCategories,
        lines,
        brands,
    });


    const [productToAdd, setProductToAdd] = useState<Product>();
    const closeAddModal = () => {
        dismissAddProduct();
    };

    const [presentToast] = useIonToast();

    const openAddModal = (product: Product) => {
        if (!orderExist) {
            presentToast({
                message: `Agrega un pedido antes de agregar un producto`,
                duration: 1500,
                position: "top",
            });
          
            return
        }
        setProductToAdd(product);
        presentAddProduct();
    };

    const [presentAddProduct, dismissAddProduct] = useIonModal(
        AddProductToOrder, {
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

    // End Modal

    return (
        <>
            {/*<Menu />*/}
            <IonPage>
                <IonHeader>
                    <Header title="Productos" />
                    <IonToolbar>
                        <IonButtons style={{ marginBottom: ".5rem" }}>
                            <IonSearchbar
                                placeholder="Buscar"
                                onIonChange={(e) => handleSearchProducts(e)}
                                style={{
                                    paddingInline: "16px",
                                    paddingBottom: "0",
                                }}
                            />
                            <IonButton
                                color="primary"
                                onClick={() => presentFilters()}
                            >
                                Filtros
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <IonItem>
                        <IonButton onClick={() => handleGetProducts(true)}>
                            Sincronizar
                        </IonButton>
                        {lastSync && (
                            <IonText style={{ marginLeft: ".5rem" }}>
                                <p style={{ margin: "0" }}>
                                    <strong>Ultima sincronización</strong>
                                </p>
                                {lastSync.toLocaleDateString("es-ES", { hour: '2-digit', minute: '2-digit' })}
                            </IonText>
                        )}
                    </IonItem>
                    {products?.length === 0 && !loading ? (
                        <h1 style={{ textAlign: 'center' }}>No se encontraron productos</h1>
                    ) : (
                        products?.map((i) => (
                            <ProductItem
                                key={i.idProduct}
                                product={i}
                                presentAddProduct={openAddModal}
                                presentDetail={openDetailModal}
                            />
                        ))
                    )}
                </IonContent>
                <IonLoading
                    isOpen={loading}
                    onDidDismiss={() => setLoading(false)}
                />
            </IonPage>
        </>
    );
};

export default ProductsList;
