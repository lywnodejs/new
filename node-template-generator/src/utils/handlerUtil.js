import middleGroundConfig from "../libs/middleGroundConfig";
import _ from "underscore";

var handlerUtil = {
    getTemplateConfig: function (templateType) {
        // 取模块配置参数
        let templateConfig = middleGroundConfig["middleGroundConfig"];
        let params = _.clone(templateConfig[templateType]);
        if (params) {
            params.code = 0;
            params.templateType = templateType;
            return params;
        } else {
            return {
                code: -1,
                templateType: templateType,
                message: "该指标不存在"
            }
        }
    },
};

export default handlerUtil;

