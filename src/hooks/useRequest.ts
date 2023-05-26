import axios from "axios";
import { REQUEST, TOKEN, useStorage } from "./useStorage";
import { ip } from "../environment";
import { Either, Result, left, right } from "../utils/Result";
import { Request, SaveRequest } from "../../types/request";
import { v4 } from "uuid";

export function useRequest() {
    // eslint-disable-next-line
    const { environment, setData, getData } = useStorage();

    async function get(
        route: string
    ): Promise<Either<Result<string>, Result<any>>> {
        const token = await getData(TOKEN);
        try {
            const response = await axios.get(
                `${ip}${route}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                        'Accept': 'application / json',
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                }
            );
            return right(Result.ok(response));
        } catch (error: any) {
            return left(Result.fail(error.message));
        }
    }

    async function post<T>(
        route: string,
        data: T
    ): Promise<Either<Result<string>, Result<any>>> {
        const token = await getData(TOKEN);
        try {
            const response = await axios.post(
                `${ip}${route}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                        'Accept': 'application / json',
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                }
            );

            return right(Result.ok<any>(response));
        } catch (error: any) {
            return left(Result.fail<string>(error.message));
        }
    }

    async function put<T>(route: string, data: T) {
        const token = await getData(TOKEN);
        try {
            const response = await axios.put(
                `${ip}${route}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                        'Accept': 'application / json',
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                }
            );

            return right(Result.ok(response));
        } catch (error: any) {
            return left(Result.fail(error));
        }
    }

    async function remove(route: string) {
        const token = await getData(TOKEN);
        try {
            const response = await axios.delete(
                `${ip}${route}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                        'Accept': 'application / json',
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                }
            );

            return right(Result.ok(response));
        } catch (error: any) {
            return left(Result.fail(error.message));
        }
    }

    async function addRequest({ method, url, body, type }: SaveRequest) {
        const request: Request = {
            id: v4(),
            method,
            url,
            body,
            type,
        };
        await saveRequests(request);
    }

    async function saveRequests(request: Request, remove: boolean = false) {
        let currentRequests: Array<Request> = (await getData(REQUEST)) || [];
        if (remove) {
            currentRequests = currentRequests.filter(
                (r) => r.id !== request.id
            );
        } else {
            currentRequests = [...currentRequests, request];
        }
        setData(REQUEST, currentRequests);
    }

    async function executeRequest(
        request: Request
    ): Promise<Either<Result<string>, Result<any>>> {
        const token = await getData(TOKEN);
        try {
            const response = await axios({
                method: request.method,
                url: `${ip}${request.url}`,
                data: request.body,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            await saveRequests(request, true);

            return right(Result.ok(response));
        } catch (error) {
            return right(Result.fail("Error al sincronizar"));
        }
    }

    return {
        get,
        post,
        put,
        remove,
        executeRequest,
        addRequest,
    };
}
