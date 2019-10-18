import * as request from "request";

export interface IRequest {
    Url: string;
}

export interface IResponse {
    IsSuccess: boolean;
    ErrorMessage: string;
    StartTimeStamp: number;
    EndTimeStamp: number;
    BodySize: number;
}

export async function MSleep(timeout: number) {
    return new Promise<void>((resolve) => {
        setTimeout(resolve, timeout);
    });
}
export async function Request(req: IRequest) {
    return new Promise<IResponse>((resolve) => {
        const StartTimeStamp = Date.now();
        request.default(req.Url, (error, response, body) => {
            const EndTimeStamp = Date.now();
            const IsSuccess = error === null ? true : false;
            const ErrorMessage = `${error}`;
            const BodySize = `${body}`.length;
            resolve({
                IsSuccess,
                ErrorMessage,
                StartTimeStamp,
                EndTimeStamp,
                BodySize,
            });
        });
    });
}
