export interface Category {
	idProductFamily: number;
	name: string;
}

export interface SubCategory {
	idProductFamily: number;
	idProductSubFamily: number;
	nameSubFamily: string;
}

export interface Line {
	idLine: number;
	idSubfamilyFk?: number;
	idSucursalFk: number;
	name: string;
}

export interface Brand {
	idBrand: number;
	idSucursalFk: number;
	name: string;
}

export interface CategoriesByBusiness {
	[businessId: number]: Array<Category>;
}

export interface SubCategoriesByBusiness {
	[businessId: number]: Array<SubCategory>;
}

export interface LinesByBusiness {
	[businessId: number]: Array<Lines>;
}

export interface BrandsByBusiness {
	[businessId: number]: Array<Brands>;
}
