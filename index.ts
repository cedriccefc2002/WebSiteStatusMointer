import { configure, getLogger, Logger } from "log4js";

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

function createrTest(label: string, url: string): ITest {
    const logger = getLogger();
    logger.addContext("label", label);
    return {
        logger,
        url,
    };
}

interface ITest {
    logger: Logger;
    url: string;
}
const Tests: ITest[] = [
    createrTest("gcr", "https://gcr.io"),
    createrTest("googleapis", "https://ajax.googleapis.com"),
    createrTest("googleapis_auth", "https://www.googleapis.com/auth/drive.readonly"),
    createrTest("dns", "http://ssss.sss.ss"),
    createrTest("ip", "https://127.0.0.1"),
];
async function main() {
    while (true) {
        for (const Test of Tests) {
            const resp = await RequestAsync({
                Url: Test.url,
            });
            AppendFileAsync("./data.jsonl", `${JSON.stringify(resp)}\n`);
            if (resp.IsSuccess) {
                Test.logger.info(`${Test.url} BodySize:${resp.BodySize} ElapsedTime: ${resp.EndTimeStamp - resp.StartTimeStamp} ms`);
            } else {
                Test.logger.error(`${Test.url} ErrorMessage:${resp.ErrorMessage} ElapsedTime: ${resp.EndTimeStamp - resp.StartTimeStamp} ms`);
            }
            await MSleepAsync(1000);
        }
        await MSleepAsync(60000);
    }
}

main().finally(() => {
    process.exit();
});
