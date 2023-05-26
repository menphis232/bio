import { Geolocation, GeolocationPosition } from "@capacitor/geolocation";
import { currentNetworkStatus } from "../utils/netWorkStatus";
import { Either, left, Result, right } from "../utils/Result";
import { useRequest } from "./useRequest";
import { useStorage } from "./useStorage";

const OPTIONS = { maximumAge: 0, timeout: 300000, enableHighAccuracy: true };

interface Location {
    latitude: number;
    longitude: number;
}

export function useLocation() {
    const { put } = useRequest();
    const { user } = useStorage();

    async function getLocation(): Promise<
        Either<Result<string>, Result<Location>>
    > {
        try {
            const connection = await currentNetworkStatus();
            if (!connection) {
                return left(Result.fail("No connection"));
            }
            const position: GeolocationPosition =
                await Geolocation.getCurrentPosition(OPTIONS);
            const {
                coords: { latitude, longitude },
            } = position;
            return right(Result.ok({ latitude, longitude }));
        } catch (error: any) {
            console.log(error);
            return left(Result.fail(error.message));
        }
    }

    async function sendActualLocation() {
        const hasPremissions = await checkPermissions();
        if (hasPremissions?.location === 'denied') {
            return askPermissions()
        }
        const result = await getLocation();
        if (result.isLeft()) {
            return console.log(result.value.getErrorValue());
        }
        const { latitude, longitude } = result.value.getValue();
        const response = await put(`/api/v2/user/set/location/${user.idUser}`, {
            latitud: latitude,
            longitud: longitude,
        });
        console.log(response);
    }

    async function askPermissions() {
        try {
            const response = await Geolocation.requestPermissions();
            console.log(response, "askPermissions res");
        } catch (error) {
            console.log(error, "askPermissions err");
        }
    }

    async function checkPermissions() {
        try {
            const response = await Geolocation.checkPermissions();
            console.log(response, 'permissions')
            return response
        } catch (error) {
            console.log(error, "checkPermissions error");
        }
    }

    return {
        sendActualLocation,
    };
}
