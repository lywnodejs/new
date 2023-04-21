/**
 * Created by hpc on 2018/5/18.
 */
$(function () {
    var bool=true;
    $(".voice").on("click",function(){
        if(!bool){return}
        // 1.点击后先置灰
        var vThis = $(this);
        vThis.addClass("opacity30");
        setTimeout(function(){
            vThis.removeClass("opacity30");
        },200)

        // 2.进行播放
        var voiceTag = vThis.children("span").hasClass("a-voice-play");
        if(vThis.children("span").hasClass("num")){
            if(voiceTag){
                vThis.children("span").toggleClass("leftPlay");
            }else{
                vThis.children("span").toggleClass("rightPlay");
            }
        }else{
            $(".voice").children("span").removeClass("num");
            vThis.children("span").addClass("num");
            $(".voice").children("span").removeClass("leftPlay rightPlay");
            if(voiceTag){
                vThis.children("span").addClass("leftPlay");
            }else{
                vThis.children("span").addClass("rightPlay");
            }
        }
    })
    //3.录音
    $(".sayBg").on("click",function(){
        var say = $(".say")
        if(say.hasClass("say2")){
            $(".ripple").removeClass("ripple2");
            say.removeClass("say2");
            bool=true;
        }else{
            say.addClass("say2");
            $(".ripple").addClass("ripple2");
            $(".voice").children("span").removeClass("leftPlay rightPlay");
            bool=false;
        }
    })
})
