import * as request from "request";

import { appendFile, PathLike } from "fs";

export interface IRequest {
    Url: string;
    testFn?: (body: string, response: request.Response) => [boolean, string];
}

export interface IResponse {
    Url: string;
    IsSuccess: boolean;
    ErrorMessage: string;
    StartTimeStamp: number;
    EndTimeStamp: number;
    BodySize: number;
    StatusCode: number;
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
            const bodyString = `${body}`;
            let IsSuccess = false;
            let ErrorMessage = "";
            if (error === null) {
                if (req.testFn) {
                    [IsSuccess, ErrorMessage] = req.testFn(bodyString, response);
                } else {
                    IsSuccess = true;
                }
            } else {
                IsSuccess = false;
                ErrorMessage = `${error}`;
            }
            const BodySize = bodyString.length;
            const StatusCode = response.statusCode;
            resolve({
                Url: req.Url,
                IsSuccess,
                ErrorMessage,
                StartTimeStamp,
                EndTimeStamp,
                BodySize,
                StatusCode,
            });
        });
    });
}
