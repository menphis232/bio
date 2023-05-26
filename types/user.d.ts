export interface User {
	fullname: string;
	idProfileFk: number;
	idUser: number;
	mail: string;
}


export interface UserBackUp {
	token: string;
	currentBusiness: number;
	userId: number;
	business: Array<any>;
}
