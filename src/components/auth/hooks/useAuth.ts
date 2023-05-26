import { User } from '../../../../types/user';
import { useRequest } from '../../../hooks/useRequest';
import { TOKEN, useStorage } from '../../../hooks/useStorage';
import { Result } from '../../../utils/Result';
import { PROFILES } from '../../../utils/profiles';
import { useUser } from '../../dashboard/profile/hooks/useUser';

export interface Login {
	mail: string;
	pin: string;
}

enum ErrorMessages {
    DEFAULT = 'Ha ocurrido un error',
    INVALID = 'Correo o contraseña incorrectos'
}

export function useAuth() {
	const { post } = useRequest();
	const { authUser, setData } = useStorage();
	const { getCurrentUser, getUserBusiness } = useUser();

	async function login(data: Login): Promise<Result<string>> {
		const response = await post(`/api/v1/validator/login`, data);
		console.log(response);
		if (response.isLeft()) {
			return Result.fail(ErrorMessages.DEFAULT);
		}
		if (response.value.getValue().status === 204) {
			return Result.fail<string>(ErrorMessages.INVALID);
		}
		if (
			response.value.getValue().data.data[0].idProfileFk !==
			PROFILES.SELLER
		) {
			return Result.fail<string>(ErrorMessages.INVALID);
		}
		// Validate User Business

		const token = response.value.getValue().data.data[0].token;
        await setData(TOKEN, token);
		const userId = response.value.getValue().data.data[0].idUser;
		const user: User = await getCurrentUser(userId);
		const business: Array<any> = await getUserBusiness(userId);
		if (business.length === 0 || !user) {
			console.log('aqui entramos',business,user)
			return Result.fail<string>(ErrorMessages.INVALID);
		}
		authUser({
			token,
			userId,
			currentBusiness: business[0].idSucursal,
			business,
			...user,
		});
		return Result.ok<string>('Iniciando Sesión');
	}

	return {
		login,
	};
}
