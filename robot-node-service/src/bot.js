// const Bot = require('bot-sdk');
import Bot from 'bot-sdk'
import {semanticApiService} from "./service";

const privateKey = require("./rsaKeys.js").privateKey;

class InquiryBot extends Bot {

    constructor(postData) {

        super(postData);

        this.addLaunchHandler(function(){
            this.waitAnswer();
            var card = new Bot.Card.StandardCard();
            card.setTitle('股票问问');
            card.setContent('欢迎使用股票问问!');
            return {
                card: card,
                outputSpeech: '欢迎使用股票问问!'
            };
        });

        this.addIntentHandler('inquiry_tax', () => {
            var result = postData.addRequest;
            var str =result.secName +result.name+":"+ result.value;
            let card = new Bot.Card.TextCard(str);
            return Promise.resolve({
                card: card,
                outputSpeech: str
            });
        });
        this.addSessionEndedHandler(() => {
            this.endSession();
            return {
                outputSpeech: '谢谢使用',
            };
        });

    }

    /**
     *  获取文本展现模板
     *
     *  @param {string} text 歌曲详情
     *  @return {RenderTemplate} 渲染模版
     */
    getTemplate1(text) {
        let bodyTemplate = new BaseBot.Directive.Display.Template.BodyTemplate1();
        bodyTemplate.setPlainTextContent(text);
        let renderTemplate = new BaseBot.Directive.Display.RenderTemplate(bodyTemplate);
        return renderTemplate;
    }

}
 module.exports = InquiryBot;