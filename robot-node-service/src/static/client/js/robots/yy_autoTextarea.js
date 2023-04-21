/***********************************************************************************/
/******************************       智能问答v2.0       ****************************/
/*******************************      前端开发：阎延     *****************************/
/***********************************************************************************/

//textarea自动高度

$(document).ready(function () {
    $.fn.autoTextarea = function(options) {
        var defaults={
            maxHeight:null,
            minHeight:$(this).height()
        };
        var opts = $.extend({},defaults,options);
        return $(this).each(function() {
            $(this).bind("paste cut keydown keyup focus blur",function(){
                var height,style=this.style,
                    height2;
                this.style.height = opts.minHeight + 'px';

                // $(this).parents("body").removeClass();

                if (this.scrollHeight > opts.minHeight) {
                    if (opts.maxHeight && this.scrollHeight > opts.maxHeight) {
                        height = opts.maxHeight;
                        style.overflowY = 'scroll';

                        //3行
                        // $(this).parents("body").addClass("row3").removeClass("row2");

                    } else {
                        height = this.scrollHeight;
                        style.overflowY = 'hidden';

                        //行数
                        var row = height / ($(this).height());      //行数
                        if( row == 2){
                            $(this).parents("body").addClass("row2").removeClass("row3");
                        }else if( row == 3){
                            $(this).parents("body").addClass("row3").removeClass("row2");
                        }
                    }
                    style.height = height + 'px';
                }
                //scrollFoot();
            });
        });
    };

    $("footer textarea").autoTextarea({
        maxHeight:72,
        minHeight:24
    });
});
