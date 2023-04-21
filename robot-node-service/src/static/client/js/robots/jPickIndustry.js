var app = app || {};
app.ItemList = function (data) {
    var map = {};
    var html;

    html = data.map(function (item) {
        var itemArr = item.split(' ');
        var en = itemArr[2];
        var cn = itemArr[1];
        var code = itemArr[0];
        if (map[en]) {
            return '<li onclick="addEventForItem(event)">' + cn + '</li>'
        } else {
            map[en] = true;
            return '<li data-ch="' + en + '" onclick="addEventForItem(event)">' + cn + '</li>'
        }
    }).join('');

    var elItemList = document.querySelector('#item-container ul');
    elItemList.innerHTML = html;

    return {
        gotoChar: function (ch) {
            if (ch === '*') {
                elItemList.scrollTop = 0
            } else if (ch === '#') {
                elItemList.scrollTop = elItemList.scrollHeight
            } else {
                var target = elItemList.querySelector('[data-ch="' + ch + '"]');
                if (target) {
                    target.scrollIntoView();
                    baiduTrackEvent('侧边字母', 'click', ch);
                }
            }
        }
    }
};

app.main = function () {
    var itemList = app.ItemList(industryList);
    // new IndexSidebar().on('charChange', itemList.gotoChar)
};

app.main();

//行业项点击事件
function addEventForItem(event) {
    // $(document).on("click", "#item-container li", function () {
    // $('#item-container').on('click', 'li', function () {
    // var industryName = $(this)[0].innerText;
    var industryName = $(event.currentTarget).text();
    var condition = {
        conditionName: '行业',
        mapingConditionName: '行业',
        conditionFilter: '',
        intervalMap: {is: industryName, htmlPlay: industryName},
        type: 'industry'
    };

    // 保存条件
    saveSearchConditions([condition]);

    baiduTrackEvent('行业点击', 'click', industryName);

    saveLog('info', industryName, 'addEventForItem()', 0, 0, urlParams);

    // 参数处理
    var urlParam = '';
    if (location.search) {
        urlParam = location.search + '&industry=' + industryName;
    } else {
        urlParam += '?industry=' + industryName;
    }

    //调用原生打开“选股条件”页面
    if (urlParams.platform === 'android' || urlParams.platform === 'ios' || getMobileType() === 'ios') {
        var params = {
            pageId: 'webView',
            url: location.protocol + '//' + location.host + '/conditions/pickConditions' + urlParam,
            animationStyle: 'kHsPageAnimationFromTop',
            hasActionBar: 'yes',
            title: '条件选股'
        };
        //ios多传一个参数
        if (urlParams.platform === 'ios')
            params.navigationStyle = 'HsNavigationStatusModel';
        commonCallback('routerNative', JSON.stringify(params));
    } else {
        // 跳转到浏览器“选股条件”页面
        location.href = '/conditions/pickConditions' + urlParam;
    }
    // })
}

/**
 * 将当前选中条件缓存到本地
 */
function saveSearchConditions(condition) {
    if (localStorage) {
        localStorage.searchConditions = JSON.stringify(condition);
    }
}

/**
 * 查找输入的行业
 * @param event
 */
function filterList(event) {
    var txt = $(event.target).val();
    // console.log('aaa'+txt+'bbb')
    if (txt.trim()) {
        var matchEls = $("ul[id='industryList'] li:contains('" + txt + "')");
        // console.log(matchEls)
        if (matchEls.length > 0) {
            //展示搜索结果
            var tag = '';
            for (var i = 0; i < matchEls.length; i++) {
                var el = matchEls[i].outerHTML;
                el = el.replace(txt, '<b>' + txt + '</b>');
                tag += el;
            }
            $('#noMatchView').hide();
            $('#industryList').hide();
            $('.index-sidebar-container').hide();
            $('#searchList').html(tag).show();
            // matchEls[0].scrollIntoView();
        } else {
            //展示无数据
            $('.index-sidebar-container').hide();
            $('#industryList').hide();
            $('#searchList').hide();
            $('#noMatchView').show();
        }
        baiduTrackEvent('搜索框输入', 'input', txt.trim());
    }
    else {
        //展示全部行业
        $('#noMatchView').hide();
        $('#searchList').hide().html('');
        $('#industryList').show();
        $('.index-sidebar-container').show();
    }
}
