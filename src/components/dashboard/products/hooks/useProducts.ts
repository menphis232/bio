import { useMemo, useState } from 'react';
import { useRequest } from '../../../../hooks/useRequest';
import {
	Product,
	ProductQuery,
	ProductsByBusiness,
} from '../../../../../types/product';
import { LAST_SYNC, PRODUCTS_BY_BUSINESS, useStorage } from '../../../../hooks/useStorage';
import { currentNetworkStatus } from '../../../../utils/netWorkStatus';

export function useProducts() {
	const [products, setProducts] = useState<Array<Product>>([]);
    const [lastSync, setLastSync] = useState<Date>()
	const [query, setQuery] = useState<ProductQuery>({
		search: '',
		minPrice: 0,
		maxPrice: 0,
		category: 0,
		subCategory: 0,
		brand: 0,
		line: 0,
		isOnPromotion: false,
		order: ''
	});

	const { get } = useRequest();
	const { setData, getData, user } = useStorage();

	async function getProducts(businessId: number, sync?: boolean) {
		const connection = await currentNetworkStatus();
		const productsByBusiness: ProductsByBusiness = await getData(
			PRODUCTS_BY_BUSINESS
		);
        if (sync) {
            setData(LAST_SYNC, new Date());
            setLastSync(new Date());
        } else {
            let date = await getData(LAST_SYNC);
            setLastSync(date);
        }
		if (!connection || (!sync && productsByBusiness)) {
			return setProducts(productsByBusiness[user.currentBusiness]);
		}
		const response = await get(`/api/v2/product/list/0/0/${businessId}`);
		if (response.isLeft()) {
			// error response
			return;
		} // success response
		const value = response.value.getValue();
		if (value.status === 204) {
			setProducts([]);
			return setData(PRODUCTS_BY_BUSINESS, {
				...productsByBusiness,
				[user.currentBusiness]: [],
			});
		}
		setProducts(value.data.data);
		setData(PRODUCTS_BY_BUSINESS, {
			...productsByBusiness,
			[user.currentBusiness]: value.data.data,
		});
	}

	const productList = useMemo(() => {
		let list = products;
		// Filter
		if (query.search) {
			list = list.filter(
				(p) =>
					p.barCode
						.toLocaleLowerCase()
						.includes(query.search.toLocaleLowerCase()) ||
					p.nameProduct
						.toLocaleLowerCase()
						.includes(query.search.toLocaleLowerCase())
			);
		}
		if (query.minPrice) {
			list = list.filter((p) => p.priceSale > query.minPrice);
		}
		if (query.maxPrice) {
			list = list.filter((p) => p.priceSale < query.maxPrice);
		}
		if (query.category) {
			list = list.filter((p) => p.idProductFamily === query.category);
		}
		if (query.subCategory) {
			list = list.filter(
				(p) => p.idProductSubFamilyFk === query.subCategory
			);
		}
		if (query.line) {
			list = list.filter((p) => p.idLineFk === query.line);
		}
		if (query.brand) {
			list = list.filter((p) => p.idBrandFk === query.brand);
		}
		if (query.isOnPromotion) {
			// eslint-disable-next-line eqeqeq
			list = list.filter((p) => p.isPromo == '1');
		}
		if (query.order) {
			const comparador = (a, b) => {
				const nameA = a.nameProduct.toUpperCase();
				const nameB = b.nameProduct.toUpperCase();
				return query.order === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
			};
			list = list.sort(comparador)
		}
		return list;
	}, [products, query]);

	return {
        lastSync,
		setQuery,
		query,
		products: productList,
		getProducts,
	};
}
