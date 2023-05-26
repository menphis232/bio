export interface ProductsByBusiness {
	[n: number]: Array<Product>;
}
export interface Product {
	barCode: string;
	cpe: string;
	created_at: string;
	updated_at: string;
	ean: string;
	healthRegister: string;
	idBrandFk: number;
	idLineFk: number;
	idProduct: number;
	idProductFamily: number; //category
	idProductFamilyFk: number; //category
	idProductSubFamilyFk: number;
	idStatus: number;
	idSucursalFk: number;
	idUnitMeasureSaleFk: number;
	image: string;
	isPromo: string;
	marketPrice: number; // promotion price
	nameProduct: string;
	observation: string;
	priceSale: number;
	unitByBox: number;
	unitweight: number;
	urlImagenProduct: string;
}

export interface ProductQuery {
	search: string;
	minPrice: number;
	maxPrice: number;
	category: number;
	subCategory: number;
	line: number;
	brand: number;
	isOnPromotion: false;
}
