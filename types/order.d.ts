import { Product } from './product';

export enum OrderStatus {
	PROCESS = 1,
}

export interface OrderItem extends Product {
	idOrderB: number;
	quantityProduct: number;
	weight: number;
}
export interface Order {
	fullNameClient: string;
    idBranchFk: number;
	idOrderH: number;
	idStatusOrder: number;
	numberOrder: string;
	body?: Array<OrderItem>;
    created_at: string;
    updated_at: string;
    idUser: number;
    comments: string;
    phoneClient: string;
    totalBot: number;
}

export interface CurrentOrderByBusiness {
	[index: number]: Array<SaveOrder>;
}

export interface CreateOrder {
	address: string;
	comments: string;
	fullNameClient: string;
	idBranchFk: number;
	idUserOpenFk: number; // userId
	phoneClient: string; //
}

export interface SaveOrder extends CreateOrder {
	idOrderH: number;
    isComplete: boolean;
    body?: Array<OrderItem>
}

export interface AddProductToOrder {
	idOrderHFk: number;
	idProductFk: number;
	idUserAddFk: number;
	priceProductOrder: number;
	quantityProduct: number;
}
