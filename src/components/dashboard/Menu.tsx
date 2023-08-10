import {
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonMenu,
    IonMenuToggle,
    IonPage,
    IonRouterOutlet,
    IonSplitPane,
    IonTitle,
    IonToolbar,
} from "@ionic/react";
import {
    bag,
    briefcase,
    cart,
    home,
    map,
    people,
    person,
    syncCircle,
} from "ionicons/icons";
import { Redirect, Route } from "react-router";
import { ClientsList } from "./clients/ClientsList";
import MyRoutes from "./clients/MyRoutes";
import OrderList from "./orders/OrdersList";
import ProductsList from "./products/ProductsList";
import Home from "./profile/Home";
import CarPage from "../../components/dashboard/car/CarPage";
import { SyncContainer } from "./sync/SyncContainer";
import ProductDetail from "./products/ProductDetail";
import MyProfile from "./profile/MyProfile";
import Notifications from "../notifications/Notifications";

export const Menu: React.FC = () => {
    const paths = [
        { name: "Inicio", icon: home, url: "/dashboard/home" },
        { name: "Perfil", icon: person, url: "/dashboard/profile" },
        { name: "Productos", icon: bag, url: "/dashboard/products" },
        { name: "Clientes", icon: people, url: "/dashboard/clients" },
        { name: "Rutas", icon: map, url: "/dashboard/routes" },
        { name: "Carrito", icon: cart, url: "/dashboard/shopping-car" },
        { name: "Pedidos", icon: briefcase, url: "/dashboard/orders" },
        {
            name: "Pedidos a sincronizar",
            icon: syncCircle,
            url: "/dashboard/sync",
        },
    ];

    return (
        <IonPage>
            <IonSplitPane contentId="main">
                <IonMenu contentId="main">
                    <IonHeader>
                        <IonToolbar color="primary">
                            <IonTitle color="light">Menú</IonTitle>
                        <Notifications />
                        </IonToolbar>
                    </IonHeader>
                    <IonContent className="ion-padding">
                        {paths.map((item, idx) => (
                            <IonMenuToggle key={idx}>
                                <IonItem
                                    routerLink={item.url}
                                    routerDirection="none"
                                >
                                    <IonIcon
                                        icon={item.icon}
                                        color="primary"
                                        size="small"
                                        style={{ marginRight: ".5rem" }}
                                    />
                                    {item.name}
                                </IonItem>
                            </IonMenuToggle>
                        ))}
                    </IonContent>
                </IonMenu>
                <IonRouterOutlet id="main">
                    <Route path="/dashboard">
                        <Redirect to="/dashboard/home" />
                    </Route>
                    <Route exact path="/dashboard/home" component={Home} />
                    <Route exact path="/dashboard/profile" component={MyProfile} />
                    <Route
                        exact
                        path="/dashboard/products/:id"
                        component={ProductDetail}
                    />
                    <Route
                        path="/dashboard/products"
                        component={ProductsList}
                    />
                    <Route path="/dashboard/clients" component={ClientsList} />
                    <Route path="/dashboard/shopping-car" component={CarPage} />
                    <Route path="/dashboard/orders" component={OrderList} />
                    <Route
                        path="/dashboard/sync"
                        exact
                        component={SyncContainer}
                    />
                    <Route path="/dashboard/routes" component={MyRoutes} />
                </IonRouterOutlet>
            </IonSplitPane>
        </IonPage>
    );
};
