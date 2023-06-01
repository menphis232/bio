import { useEffect, useState } from "react";
import {
    AddProductToOrder,
    CreateOrder,
    CurrentOrderByBusiness,
    Order,
    OrderItem,
    SaveOrder,
} from "../../../../../types/order";
import { Product } from "../../../../../types/product";
import { useRequest } from "../../../../hooks/useRequest";
import {
    CURRENT_ORDER,
    LAST_SYNC_ORDERS,
    MY_ORDERS,
    PRODUCTS_BY_BUSINESS,
    REQUEST,
    useStorage,
} from "../../../../hooks/useStorage";
import { currentNetworkStatus } from "../../../../utils/netWorkStatus";
import { RequestType } from "../../../../utils/requestType";
import { UNIT_TYPE } from "../../products/AddProductToOrder";

export function useOrder() {
    const { post, get, remove, addRequest } = useRequest();
    const { getData,removeData, setData, user } = useStorage();

    const [orderExist, setOrderExist] = useState<boolean>(false);
    const [synchronyze, setSynchronyze] = useState({
        isSyncronyzed: true,
    });
    const [lastSync, setLastSync] = useState<Date | null>(null)
    const [currentOrder, setCurrentOrder] = useState<SaveOrder | null>(null);

    function randomNumber() {
        let random = Math.floor(Math.random() * 1000 + 1);
        return random;
    }

    async function handleSetCurrentOrder() {
        const order: CurrentOrderByBusiness = await getData(CURRENT_ORDER);
        console.log('aqui obtenemos la orden',order)
        const thereIsOrder = !!order && order[user.currentBusiness] && order[user.currentBusiness][0]
        if (!thereIsOrder) return
        if (orderExist) {
            setCurrentOrder(order[user.currentBusiness][0])
        } else {
            setCurrentOrder(null);
        }
    }

    useEffect(() => {
        console.log('efect')
        handleSetCurrentOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderExist])

    async function existsAnOrder() {
    
        const order: CurrentOrderByBusiness = await getData(CURRENT_ORDER);
        const thereIsOrder = (!!order && !!order[user.currentBusiness] && order[user.currentBusiness][0])
        console.log('esta es la orden acrtual',order)
        console.log('este es el usuario',user.currentBusiness)
        console.log('entramos en existe una order 232',order)
        console.log('este es orden con arreglo',order[user.currentBusiness].length)
        console.log('este es el thereisorder',thereIsOrder)
        if (!thereIsOrder) {
            return setOrderExist(false);
        }
        if (order[user.currentBusiness].length === 0) {
         
            return setOrderExist(false);
        }
        const requests = await getData(REQUEST);
        const thereIsRequest = (!!requests && requests.length > 1)
        if (thereIsRequest) {
            let withoutComplete = order[user.currentBusiness].some(
                (o: SaveOrder) => o.isComplete === false || o.isComplete === undefined
            );
            return setOrderExist(withoutComplete);
        }
        setOrderExist(true);
    }

    async function addOrder(data: CreateOrder) {
        const body = {
            deliveryEnLocal: false,
            deliveryEnTienda: false,
            deliveryExterno: false,
            idEnvironmentFk: 0,
            idTableFk: 0,
            moso: null,
            address: data.address || "",
            comments: data.comments || "",
            fullNameClient: data.fullNameClient || "",
            idBranchFk: data.idBranchFk,
            idUserOpenFk: data.idUserOpenFk, // userId
            phoneClient: data.phoneClient || "", //
        };
        const connection = await currentNetworkStatus();
        const request = await getData(REQUEST);
        const thereIsRequest = !!request && request.length > 0;
        console.log(thereIsRequest, 'there is request')
        if (!connection || thereIsRequest) {
            setSynchronyze({ isSyncronyzed: false });
            let randomId = randomNumber();
            await addRequest({
                type: RequestType.AddOrder,
                method: "POST",
                body: { ...body, idOrderH: randomId },
                url: "/api/v2/order/create",
            });
            await saveCurrentOrder({
                ...body,
                idOrderH: randomId,
                isComplete: false,
            });
            //await getOrderById(randomId);
            return;
        }

        const res = await post("/api/v2/order/create", body);
        if (res.isLeft()) {
            //error response
        }
        const value = res.value.getValue().data.data;
        await saveCurrentOrder({
            address: data.address,
            comments: data.comments,
            fullNameClient: data.fullNameClient,
            idBranchFk: data.idBranchFk,
            idUserOpenFk: data.idUserOpenFk,
            idOrderH: value[0],
            phoneClient: data.phoneClient,
            isComplete: false,
        });
        await getOrderById(value[0]);
    }

    async function saveCurrentOrder(data: SaveOrder) {
        let order: CurrentOrderByBusiness = await getData(CURRENT_ORDER);
        if (!order) {
            order = {
                [user.currentBusiness]: [data],
            };
        } else if (!order[user.currentBusiness]) {
            order = { ...order, [user.currentBusiness]: [data] };
        } else {
            order = {
                ...order,
                [user.currentBusiness]: [data, ...order[user.currentBusiness]],
            };
        }
        setData(CURRENT_ORDER, order);
        setOrderExist(true);
    }

    const getOrderById = async (id: number) => {
        const connection = await currentNetworkStatus();
        let currentOrdersByBusiness: CurrentOrderByBusiness = await getData(
            CURRENT_ORDER
        );
        const requests = await getData(REQUEST);
        const thereIsRequest = (!!requests && requests.length > 0)
        if (!thereIsRequest) setSynchronyze({ isSyncronyzed: false });
        if (!connection || thereIsRequest) {
            return
        }
        const res = await get(`/api/v2/order/byidH/${id}`);
        if (res.isLeft()) {
            throw res.value.getErrorValue();
        }
        const value = res.value.getValue().data;
        if (value.status === 204) {
            return;
        }
        currentOrdersByBusiness[user.currentBusiness] = [value.data];
        await setData(CURRENT_ORDER, currentOrdersByBusiness);
        setCurrentOrder(value.data);
        return value.data;
    };

    const changeStatus = async (status: number, orderId: number) => {
        const connection = await currentNetworkStatus();
        const requests = await getData(REQUEST);
        console.log('este es el request',requests)
        const thereIsRequest = (!!requests && requests.length > 0)
        let orders: CurrentOrderByBusiness = await getData(CURRENT_ORDER);
        let ordersNew=await getData(CURRENT_ORDER);
        console.log('este se supone seria array',ordersNew)
        let deletes= delete ordersNew[user.currentBusiness]
        // orders[user.currentBusiness] = updated;
        console.log('aqui para borrar',deletes)
        await removeData(CURRENT_ORDER)
        await setData(CURRENT_ORDER, deletes);
        setOrderExist(false); // test
        setCurrentOrder(null);//
        if (!connection || thereIsRequest) {
            let orders: CurrentOrderByBusiness = await getData(CURRENT_ORDER);
            let ordersNew=await getData(CURRENT_ORDER);
            const updated = orders[user.currentBusiness].map((o: SaveOrder) => {
                if (o.isComplete === false) {
                    o.isComplete = true;
                }
                return o;
            });
           let deletes= ordersNew.splice(user.currentBusiness,1)
            // orders[user.currentBusiness] = updated;
            console.log('aqui para borrar',deletes)
            await removeData(CURRENT_ORDER)
            await setData(CURRENT_ORDER, deletes);
            setOrderExist(false); // test
            setCurrentOrder(null);//
            return addRequest({
                type: RequestType.SetOrderStatus,
                method: "GET",
                url: `/api/v2/order/satus/${orderId}/${status}`,
            });
        }
        const res = await get(`/api/v2/order/satus/${orderId}/${status}`);
        if (res.isLeft()) {
            throw res.value.getErrorValue();
        }
        const currentOrdersByBusiness: CurrentOrderByBusiness = await getData(
            CURRENT_ORDER
        );
        let data = {
            ...currentOrdersByBusiness,
            [user.currentBusiness]: [],
        };
        await setData(CURRENT_ORDER, data);
        setOrderExist(false);
        setCurrentOrder(null);
    };

    const removeProduct = async (product: OrderItem) => {
        const connection = await currentNetworkStatus();
        const requests = await getData(REQUEST);
        const thereIsRequest = (!!requests && requests.length > 0)
        if (thereIsRequest || !connection) {
            let currentOrders: CurrentOrderByBusiness = await getData(
                CURRENT_ORDER
            );
            let products = currentOrders[user.currentBusiness][0].body!.filter(
                (p) => p.idProduct !== product.idProduct
            );
            currentOrders[user.currentBusiness][0].body = products;
            await setData(CURRENT_ORDER, currentOrders);
            await addRequest({
                url: `/api/v2/order/product/delete/${product.idOrderB}/${user.idUser}`,
                method: "DELETE",
                type: RequestType.RemoveItemFromOrder,
            });
            return;
        }
        const res = await remove(
            `/api/v2/order/product/delete/${product.idOrderB}/${user.idUser}`
        );
        if (res.isLeft()) {
            //Err
            console.log(res);
        }
        // await getOrderById(currentOrder?.idOrderH!)
    };

    const confirmProductQuantity = async (idOrderB: number, weight: number) => {
        const connection = await currentNetworkStatus();
        const requests = await getData(REQUEST);
        const thereIsRequest = (!!requests && requests.length > 0)
        if (!connection || thereIsRequest) {
            let orders: CurrentOrderByBusiness = await getData(CURRENT_ORDER);
            let orderToUpdate = orders[user.currentBusiness][0];
            const productsUpdated = orderToUpdate.body!.map((p) => {
                if (p.idOrderB === idOrderB) {
                    p.weight = Number(weight);
                }
                return p;
            });
            orderToUpdate.body = productsUpdated;
            orders[user.currentBusiness][0] = orderToUpdate;
            await addRequest({
                type: RequestType.SetItemQuantity,
                method: "POST",
                url: "/api/v2/order/product/setweight/sales",
                body: {
                    idOrderB,
                    weight,
                },
            });
            return await setData(CURRENT_ORDER, orders);
        }
        const res = await post("/api/v2/order/product/setweight/sales", {
            idOrderB,
            weight,
        });
        if (res.isLeft()) {
            throw res.value.getErrorValue();
        }
    };

    async function addProductToOrder({
        idOrderHFk,
        idProductFk,
        idUserAddFk,
        priceProductOrder,
        quantityProduct,
    }: AddProductToOrder) {
        const connection = await currentNetworkStatus();
        const request = await getData(REQUEST);
        const thereIsRequest = !!request && request.length > 0;
        console.log(thereIsRequest, 'there is request')
        if (!connection || thereIsRequest) {
            let orders: CurrentOrderByBusiness = await getData(CURRENT_ORDER);
            let order = orders[user.currentBusiness][0];
            // add product to order
            const productsByBusiness = await getData(PRODUCTS_BY_BUSINESS);
            const product = productsByBusiness[user.currentBusiness].find(
                (p: Product) => p.idProduct === idProductFk
            );

            if (order.body) {
                order.body.push({
                    ...product,
                    idOrderB: randomNumber(),
                    weight: quantityProduct,
                    priceProductOrder,
                });
            } else {
                order.body = [
                    {
                        ...product,
                        idOrderB: randomNumber(),
                        weight: quantityProduct,
                        priceProductOrder,
                    },
                ];
            }
            orders[user.currentBusiness][0] = order;
            await setData(CURRENT_ORDER, orders);
            await addRequest({
                type: RequestType.AddProductToOrder,
                body: {
                    idOrderHFk,
                    idProductFk,
                    idStatusFk: 1,
                    idUserAddFk,
                    priceProductOrder,
                    quantityProduct,
                },
                url: "/api/v2/order/product/add",
                method: "POST",
            });

            return await getOrderById(idOrderHFk);
        }
        const res = await post("/api/v2/order/product/add", {
            idOrderHFk,
            idProductFk,
            idStatusFk: 1,
            idUserAddFk,
            priceProductOrder,
            quantityProduct,
        });
        if (res.isLeft()) {
            throw res.value.getErrorValue();
        }
        return await getOrderById(idOrderHFk);
    }

    const calculateTotal = (products: Array<OrderItem>) => {
        let total = 0;
    
        for (const product of products) {
            let subTotal = 0;
            if (product.idUnitMeasureSaleFk === UNIT_TYPE.KG && product.unitweight >0) {
                subTotal =
                    product.weight *
                    (product.unitweight *
                        (product.isPromo === "1"
                            ? product.marketPrice
                            : product.priceSale));
            } else {
                subTotal =
                    product.weight *
                    (product.isPromo === "1"
                        ? product.marketPrice
                        : product.priceSale);
            }
            total += subTotal;
          
        }
        console.log('entramos en calcular total',total)
        return total;
    };

    const calculateTotalRequest = async (order: SaveOrder | Order) => {
        const connection = await currentNetworkStatus();
        const request = await getData(REQUEST);
        const thereIsRequest = !!request && request.length > 0;
        if (!connection || thereIsRequest) {
            if (!order.body) {
                return 0;
            }
            return calculateTotal(order.body!);
        }
        const res = await get(
            `/api/v2/order/calculate/total/sales/${order.idOrderH}`
        );
        if (res.isLeft()) {
            // err response
            return;
        }
        const value = res.value.getValue().data.message[0].TOTAL;
        console.log('este es el total',value)
        return value;
    };

    const getOrders = async (
        idUser: number,
        idBranchFk: number,
        sync?: boolean,
        dates?: { dateStart: string; dateEnd: string }
    ) => {
        const connection = await currentNetworkStatus();
        const dbOrders = await getData(MY_ORDERS);
        if (!connection) {
            if (!dbOrders) {
                return [];
            }
            return dbOrders;
        }
        if (sync) {
            setData(LAST_SYNC_ORDERS, new Date())
            setLastSync(new Date())
        } else {
            let date = await getData(LAST_SYNC_ORDERS);
            setLastSync(date)
        }

        const today = new Date();

        const res = await post(`/api/v2/order/byuser/${idUser}`, {
            idBranchFk,
            dateStart:
                dates?.dateStart ||
                `${today.getFullYear()}-${today.getMonth() + 1
                }-${today.getDate()}`,
            dateEnd:
                dates?.dateEnd ||
                `${today.getFullYear()}-${today.getMonth() + 1
                }-${today.getDate()}`,
        });

        if (res.isLeft()) {
            throw res.value.getErrorValue();
        }
        if (res.value.getValue().status === 204) {
            return [];
        }
        const value = res.value.getValue().data.data;
        let syncDate = new Date();
        await setData(LAST_SYNC_ORDERS, syncDate);
        setLastSync(new Date());
        await setData(MY_ORDERS, value);
        console.log('estas son las ordenes',value)
        return value;
    };

    const reset = () => {
        setOrderExist(false);
        setCurrentOrder(null);
    };

    return {
        lastSync,
        getOrders,
        existsAnOrder,
        addOrder,
        getOrderById,
        changeStatus,
        confirmProductQuantity,
        addProductToOrder,
        removeProduct,
        calculateTotalRequest,
        calculateTotal,
        orderExist,
        currentOrder,
        synchronyze,
        reset,
    };
}
