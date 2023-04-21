import commonUtil from "../../questionView/utils/commonUtil";
import config from "../../config";

let ejs = require("ejs");

module.exports = {

    async renderTemp(req, res, next, info, params) {
        // console.log(info)
        // let code = info.data.secCode;
        // let reqParmas = {
        //     code:code,
        //     type:'financialAnalysis',
        //     d:'j'
        // }
        // let result = await nodeService.getTemplate(reqParmas);
        // result.config = result.srcHost;
        // let needJson = req.query.d === "j";
        //
        //
        // if (needJson) {
        //     res.send(result)
        // } else {
        //     ejs.renderFile("./src/questionView/financialAnalys.ejs", result, function (err, str) {
        //         console.log(err)
        //         res.set('Content-Type', 'text/html');
        //         res.send(str);
        //     });
        // }

        let random = (new Date()).getTime();
        let needJson = req.query.d === "j";
        let renderData = {
            random: random,
            info: info,
            req: req,
            ispop: req.query.isPop || false,
            params: params,
            commonUtil: commonUtil,
            noSource: req.query.noSource,
            preAnswer: info.preAnswerContent,
            host: config[process.env.NODE_ENV].host,
            config: config[process.env.NODE_ENV].resource,
            apiUrl: config[process.env.NODE_ENV].semanticApiService
        };

        ejs.renderFile("./src/questionView/financialAnalys.ejs", renderData, function (err, str) {
            console.log(err)
            if (needJson) {
                res.send({
                    info: info,
                    content: str
                })
            } else {
                res.set('Content-Type', 'text/html');
                res.send(str);
            }
        });
    }
};

