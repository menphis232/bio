import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import {Route} from "react-router-dom";

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

import { LogIn } from './components/auth/LogIn';
import { useStorage } from './hooks/useStorage';
import { useEffect } from 'react';
import { useLocation } from './hooks/useLocation';
import { Menu } from './components/dashboard/Menu';

setupIonicReact();

const App: React.FC = () => {
    const { getEnvironment, environment } = useStorage();
    const { sendActualLocation } = useLocation()

    useEffect(() => {
        if (environment.port === 0) {
            getEnvironment();
            sendActualLocation();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    setInterval(sendActualLocation, 300000)


    return (
        <IonApp>
            <IonReactRouter>
                <IonRouterOutlet>
                    <Route exact path="/" component={LogIn} />
                    <Route path="/dashboard" component={Menu} />
                </IonRouterOutlet>
            </IonReactRouter>
        </IonApp>
    );
};

export default App;
