import {
    IonContent,
    IonIcon,
    IonLabel,
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonTabs,
} from "@ionic/react";
import { Redirect} from "react-router";
import {Route} from "react-router-dom";
import { home, bag, briefcase, cart, map } from "ionicons/icons";

import ProductsPage from "./dashboard/ProductsPage";
import OrdersPage from "./dashboard/OrdersPage";
import ShoppingCar from "./dashboard/ShoppingCar";
import HomePage from "./dashboard/HomePage";
import ClientsPage from "./dashboard/ClientsPage";
import { SyncPage } from "./dashboard/Sync";
import RoutesPage from "./dashboard/Routes";

const Dashboard = () => {
    return (
        <IonContent>
            <IonTabs>
                <IonRouterOutlet>
                    <Redirect from="/dashboard" to="/dashboard/home" />
                    <Route path="/dashboard/home" exact>
                        <HomePage />
                    </Route>
                    <Route path="/dashboard/products" exact>
                        <ProductsPage />
                    </Route>
                    <Route path="/dashboard/clients" exact>
                        <ClientsPage />
                    </Route>
                    <Route path="/dashboard/shopping-car" exact>
                        <ShoppingCar />
                    </Route>
                    <Route path="/dashboard/orders" exact>
                        <OrdersPage />
                    </Route>
                    <Route path="/dashboard/sync" exact>
                        <SyncPage />
                    </Route>
                    <Route path="/dashboard/routes" exact>
                        <RoutesPage />
                    </Route>
                </IonRouterOutlet>
                <IonTabBar slot="bottom" color="light">
                    <IonTabButton tab="home" href="/dashboard/home">
                        <IonLabel color="primary">Inicio</IonLabel>
                        <IonIcon
                            color="primary"
                            icon={home}
                            size="small"
                        ></IonIcon>
                    </IonTabButton>
                    <IonTabButton tab="products" href="/dashboard/products">
                        <IonLabel color="primary">Productos</IonLabel>
                        <IonIcon
                            color="primary"
                            icon={bag}
                            size="small"
                        ></IonIcon>
                    </IonTabButton>
                    <IonTabButton tab="routes" href="/dashboard/routes">
                        <IonLabel color="primary">Rutas</IonLabel>
                        <IonIcon
                            color="primary"
                            icon={map}
                            size="small"
                        ></IonIcon>
                    </IonTabButton>
                    <IonTabButton tab="car" href="/dashboard/shopping-car">
                        <IonLabel color="primary">Carrito</IonLabel>
                        <IonIcon
                            color="primary"
                            icon={cart}
                            size="small"
                        ></IonIcon>
                    </IonTabButton>
                    <IonTabButton tab="orders" href="/dashboard/orders">
                        <IonLabel color="primary">Pedidos</IonLabel>
                        <IonIcon
                            color="primary"
                            icon={briefcase}
                            size="small"
                        ></IonIcon>
                    </IonTabButton>
                </IonTabBar>
            </IonTabs>
        </IonContent>
    );
};

export default Dashboard;
