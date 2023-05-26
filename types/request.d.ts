import { RequestType } from "../src/utils/requestType";

export interface SaveRequest {
    type: RequestType,
    url: string;
    method: string;
    body?: T;
}

export interface Request extends SaveRequest {
    id: string;
}
