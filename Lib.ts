import * as request from "request";

import { appendFile, PathLike } from "fs";

export interface IRequest {
    Url: string;
}

export interface IResponse {
    Url: string;
    IsSuccess: boolean;
    ErrorMessage: string;
    StartTimeStamp: number;
    EndTimeStamp: number;
    BodySize: number;
}

export async function MSleepAsync(timeout: number) {
    return new Promise<void>((resolve) => {
        setTimeout(resolve, timeout);
    });
}

export async function AppendFileAsync(file: PathLike | number, data: any) {
    return new Promise<void>((resolve, reject) => {
        appendFile(file, data, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

export async function RequestAsync(req: IRequest) {
    return new Promise<IResponse>((resolve) => {
        const StartTimeStamp = Date.now();
        request.default(req.Url, (error, response, body) => {
            const EndTimeStamp = Date.now();
            const IsSuccess = error === null ? true : false;
            const ErrorMessage = `${error}`;
            const BodySize = `${body}`.length;
            resolve({
                Url: req.Url,
                IsSuccess,
                ErrorMessage,
                StartTimeStamp,
                EndTimeStamp,
                BodySize,
            });
        });
    });
}
