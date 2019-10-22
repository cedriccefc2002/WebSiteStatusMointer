import { load } from "cheerio";
import { configure, getLogger, Logger } from "log4js";
import { Response } from "request";

import { AppendFileAsync, MSleepAsync, RequestAsync } from "./Lib";

configure({
    appenders: {
        console: { type: "console" },
        everything: {
            type: "multiFile", base: "logs/", property: "label", extension: ".log",
        },
    },
    categories: { default: { appenders: ["everything", "console"], level: "ALL" } },
});

function createrTest(label: string, url: string, testFn?: (body: string, response: Response) => [boolean, string]): ITest {
    const logger = getLogger();
    logger.addContext("label", label);
    return {
        logger,
        url,
        testFn,
    };
}

interface ITest {
    logger: Logger;
    url: string;
    testFn?: (body: string, response: Response) => [boolean, string];
}
const Tests: ITest[] = [
    createrTest("gcr", "https://gcr.io"),
    createrTest("googleapis", "https://ajax.googleapis.com"),
    createrTest("googleapis_auth", "https://www.googleapis.com/auth/drive.readonly"),
    createrTest("mgt.gungwan.net", "https://mgt.gungwan.net/", (body, resp) => {
        const bodyHtml = load(body)("body").text().trim();
        const IsSuscces = bodyHtml !== "500 error";
        if (IsSuscces) {
            return [IsSuscces, ""];
        } else {
            return [IsSuscces, bodyHtml];
        }
    }),
];
async function main() {
    while (true) {
        for (const Test of Tests) {
            const resp = await RequestAsync({
                Url: Test.url,
                testFn: Test.testFn,
            });
            AppendFileAsync("./data.jsonl", `${JSON.stringify(resp)}\n`);
            if (resp.IsSuccess) {
                Test.logger.info(`${Test.url} ${resp.StatusCode} BodySize:${resp.BodySize} ElapsedTime: ${resp.EndTimeStamp - resp.StartTimeStamp} ms`);
            } else {
                Test.logger.error(`${Test.url} ${resp.StatusCode} ErrorMessage:${resp.ErrorMessage} ElapsedTime: ${resp.EndTimeStamp - resp.StartTimeStamp} ms`);
            }
            await MSleepAsync(1000);
        }
        await MSleepAsync(60000);
    }
}

main().finally(() => {
    process.exit();
});
