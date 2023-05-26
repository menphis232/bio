import { useRequest } from '../../../../hooks/useRequest';
import { User } from '../../../../../types/user';
import { useStorage } from '../../../../hooks/useStorage';
import { Result } from '../../../../utils/Result';

interface DateRange {
    dateStart: string;
    dateEnd: string;
}

export function useUser() {
    const { get, post, put } = useRequest();
    const { user } = useStorage()

    async function getCurrentUser(userId: number) {
        const res = await get(`/api/v2/user/${userId}`);
        console.log(res);
        if (res.isLeft()) {
            // error response
        }
        // success response
        const value: User = await res.value.getValue().data.data[0];
        return value;
    }

    async function getUserBusiness(userId: number) {
        const res = await get(`/api/v2/user/branch/${userId}`);
        if (res.isLeft()) {
            // error response
        }
        // success response
        const value = res.value.getValue().data.data;
        return value;
    }

    function todayToString(): string {
        const today = new Date();
        return `${today.getFullYear()}-${today.getMonth() + 1
            }-${today.getDate()}`;
    }

    async function getMyRoutes(
        userId: number,
        date: DateRange = {
            dateStart: todayToString(),
            dateEnd: todayToString(),
        }
    ) {
        const res = await post(`/api/v2/user/rute/bydate/${userId}`, {
            userId,
            ...date,
        });
        if (res.isLeft()) {
            // error response
        }
        const value = res.value.getValue().data.data;
        return value
    }

    async function changeMyPassword(pin: string): Promise<Result<string>> {
        const res = await put(`/api/v2/user/edit/pass`, {
            pin,
            idUser: user.idUser,
            mail: user.mail,
        })
        if (res.isLeft()) {
            return Result.fail('Ha ocurrido un error')
        }
        console.log(res);
        return Result.ok('Contraseña actualizada')
    }

    return {
        getCurrentUser,
        getUserBusiness,
        getMyRoutes,
        changeMyPassword,
    };
}
