import { useState } from "react";
import {
    Brand,
    BrandsByBusiness,
    CategoriesByBusiness,
    Category,
    Line,
    LinesByBusiness,
    SubCategoriesByBusiness,
    SubCategory,
} from "../../types/categories";
import { Result } from "../utils/Result";
import { currentNetworkStatus } from "../utils/netWorkStatus";
import { useRequest } from "./useRequest";
import {
    BRANDS_BY_BUSINESS,
    CATEGORIES_BY_BUSINESS,
    LINES_BY_BUSINESS,
    SUB_CATEGORIES_BY_BUSINESS,
    useStorage,
} from "./useStorage";

export function useCategories() {
    const { get } = useRequest();
    const { getData, setData, user } = useStorage();

    const [categories, setCategories] = useState<Array<Category>>([]);

    const [subCategories, setSubCategories] = useState<Array<SubCategory>>([]);
    const [lines, setLines] = useState<Array<Line>>([]);
    const [brands, setBrands] = useState<Array<Brand>>([]);

    // const { saveCategories } = useStorage();

    async function getCategories(businessId: number, sync?: boolean) {
        const connection = await currentNetworkStatus();
        const categoriesByBusiness: CategoriesByBusiness =
            (await getData(CATEGORIES_BY_BUSINESS)) || [];
        if (!connection || !sync) {
            return setCategories(
                categoriesByBusiness[user.currentBusiness] || []
            );
        }
        const res = await get(`/api/v2/family/list/${businessId}`);
        if (res.isLeft()) {
            // error response
            return;
        }
        const value = res.value.getValue();
        if (value.status === 204) {
            setCategories([]);
            return setData(CATEGORIES_BY_BUSINESS, {
                [user.currentBusiness]: [],
            });
        }
        setCategories(value.data.response);
        setData(CATEGORIES_BY_BUSINESS, {
            ...categoriesByBusiness,
            [user.currentBusiness]: value.data.response,
        });
    }

    async function getSubCategories(businessId: number, sync?: boolean) {
        const connection = await currentNetworkStatus();
        const subCategoriesByBusiness: SubCategoriesByBusiness =
            (await getData(SUB_CATEGORIES_BY_BUSINESS)) || {};
        if (!connection || !sync) {
            return setSubCategories(
                subCategoriesByBusiness[user.currentBusiness] || []
            );
        }
        const res = await get(`/api/v2/subFamily/list/${businessId}`);
        if (res.isLeft()) {
            // error response
            return;
        }
        const value = res.value.getValue();
        if (value.status === 204) {
            setSubCategories([]);
            return setData(SUB_CATEGORIES_BY_BUSINESS, {
                [user.currentBusiness]: [],
            });
        }
        setSubCategories(value.data.response);
        setData(SUB_CATEGORIES_BY_BUSINESS, {
            ...subCategoriesByBusiness,
            [user.currentBusiness]: value.data.response,
        });
    }

    async function getLines(businessId: number, sync?: boolean) {
        const connection = await currentNetworkStatus();
        const linesByBusiness: LinesByBusiness =
            (await getData(LINES_BY_BUSINESS)) || {};
        if (!connection || sync) {
            return setLines(linesByBusiness[user.currentBusiness] || []);
        }
        const res = await get(`/api/v2/line/list/${businessId}`);
        if (res.isLeft()) {
            // error response
            return Result.fail("Ha ocurrido un error");
        }
        const value = res.value.getValue();
        if (value.status === 204) {
            setLines([]);
            return setData(LINES_BY_BUSINESS, {
                [user.currentBusiness]: [],
            });
        }
        setLines(value.data.response);
        setData(LINES_BY_BUSINESS, {
            ...linesByBusiness,
            [user.currentBusiness]: value.data.response,
        });
    }

    async function getBrands(businessId: number, sync?: boolean) {
        const connection = await currentNetworkStatus();
        const brandsByBusiness: BrandsByBusiness =
            (await getData(BRANDS_BY_BUSINESS)) || {};
        if (!connection || sync) {
            return setBrands(brandsByBusiness[user.currentBusiness] || []);
        }
        const res = await get(`/api/v2/brand/list/${businessId}`);
        if (res.isLeft()) {
            // error response
            return Result.fail("Ha ocurrido un error");
        }
        const value = res.value.getValue();
        if (value.status === 204) {
            setBrands([]);
            return setData(BRANDS_BY_BUSINESS, {
                [user.currentBusiness]: [],
            });
        }
        setBrands(value.data.response);
        setData(BRANDS_BY_BUSINESS, {
            ...brandsByBusiness,
            [user.currentBusiness]: value.data.response,
        });
    }

    async function handleGetCategories(businessId: number, sync: boolean) {
        await getCategories(businessId, sync);
        await getSubCategories(businessId, sync);
        await getLines(businessId, sync);
        await getBrands(businessId, sync);
    }

    return {
        handleGetCategories,
        categories,
        subCategories,
        lines,
        brands,
    };
}
