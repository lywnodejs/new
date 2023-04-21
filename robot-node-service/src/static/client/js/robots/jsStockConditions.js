/**
 * Created by BoBo on 2018-09-21.
 */

// 所有条件集合
var allConditions = [];
// 当前点击的条件项
var currentCondition = null;
// 已选择的条件集合
var selectedConditions = [];
// 当前点击的条件元素
var clickedTarget = '';
// 用户自定义策略集合
var customConditions = [];
// 行业参数
var industry = '';
// 从本地查找是否是带参数跳转到选择行业页面
var industryConditions = [];
// 是否获取条件列表成功
var ifGetConditionSuc = false;

$(document).ready(function () {
    // window.onbeforeunload= function(event) {
    //     alert(1)
    //     return confirm("onbeforeunload确定离开此页面吗？");
    // }
    // window.onunload = function(event) {
    //     alert(2)
    //     return confirm("onunload确定离开此页面吗？");
    // }
    // window.onpageshow = function (ev) {
    // };

    // 页面获取焦点
    window.onfocus = function (ev) {
        // if(urlParams.platform === 'ios'){
        //     saveSearchConditions();
        // }
    };

    // 接收行业参数
    industry = getQueryString('industry') || '';
    //
    var paramsFromRobot = getQueryString('paramsFromRobot') || null;

    if (localStorage) {
        // 查看本地是否有缓存的自定义策略
        var temp = localStorage.getItem('customConditions');
        customConditions = temp ? JSON.parse(temp) : [];
        generateCustomCondition();

        // 从本地查找是否是带参数跳转到选择行业页面
        if (industry) {
            var tempIndustry = localStorage.getItem('industryConditions');
            industryConditions = tempIndustry ? JSON.parse(tempIndustry) : [];
            // 赋值给已选条件列表
            selectedConditions = industryConditions;
            // showToast('c:'+industryConditions.length+', s:'+selectedConditions.length+', t:'+tempIndustry, 6000)
        }
    }

    // 处理行业参数
    if (industry) {
        // 行业参数
        var condition = {
            conditionName: '行业',
            mapingConditionName: '行业',
            conditionFilter: '',
            intervalMap: {is: industry, htmlPlay: industry, talk: industry},
            type: 'industry'
        };

        selectedConditions.push(condition);
        updateSelectionView();
    }

    if (paramsFromRobot) {
        var cons = paramsFromRobot.split(',')
        for(var i=0; i<cons.length; i++) {
            selectedConditions.push({conditionName: cons[i], fromRobot: true});
        }
        updateSelectionView();
    }

    // 取条件列表
    getConditionList();
});

/**
 * ios原生调用，不可删除！！
 * @param params
 */
function callFromApp(params) {
    if (params && params !== '(null)') {
        try{
            industryConditions = params ? JSON.parse(params) : [];
            selectedConditions = industryConditions.concat(selectedConditions);
            //条件列表加载完成
            if (ifGetConditionSuc) {
                // 加入到已选列表，更新选中状态
                updateSelectionView();
            } else {
            }
        }catch (e) {
            saveLog('jsError', e.message, 'jsStockConditions.js', 0, 'callFromApp()', params);
        }
    }
}

/**
 * 弹出提示
 * @param msg
 * @param delay
 */
function showToast(msg, delay) {
    $('#txtToast').html(msg);
    $('#toast').show().fadeOut(delay ? delay : 4000);
}

//点击结果展开
$('.alreadyChooseUp').delegate('#alreadyChooseUp', 'click', function (e) {
    if (selectedConditions.length > 0) {
        setConditionListVisible(true);
        baiduTrackEvent('底部条件列表展开', 'click', '')
    }
});

$('.alreadyChooseDownPanel').delegate('#alreadyChooseDown', 'click', function (e) {
    setConditionListVisible(false);
    baiduTrackEvent('底部条件列表收起', 'click', '')
});

/**
 * 初始化保存的策略
 */
function generateCustomCondition() {
    if (customConditions.length > 0) {
        $('#divCustomStrategy').show();

        var tagStrategy = '';
        var tagStrategyEdit = '';
        // 循环数据
        customConditions.forEach(function (item, index) {
            tagStrategy += '<li onclick="customStrategyClick(event, \'' + item.strategyName + '\')"><p class="heightP">' + item.strategyName + '</p></li>';
            tagStrategyEdit +=
                '<li onclick="strategyClick(event)">' +
                    '<div>' +
                        '<i class="icon-select_no"></i>' +
                        '<span>' + item.strategyName + '</span>' +
                    '</div>' +
                    '<h5></h5>' +
                '</li>'
        });
        //我的策略列表
        $('#customStrategy').html(tagStrategy);

        // 管理策略弹窗
        $('#strategyList').html(tagStrategyEdit);
    }
    else {
        $('#customStrategy').html('');
        $('#divCustomStrategy').hide();
        $('#strategyList').html('');
    }
}

/**
 * 管理策略弹窗中的策略项点击后修改样式
 * @param event
 */
function strategyClick(event) {
    //切换选中/非选中样式
    var $i = $(event.currentTarget).find('i');
    if ($i.hasClass("icon-select")) {
        $(event.currentTarget).find('i').attr("class", 'icon-select_no');
    } else {
        $(event.currentTarget).find('i').attr("class", 'icon-select');
    }

    //设置删除按钮的颜色
    var hasSelection = $('#strategyList').find('i').hasClass('icon-select');
    $('#btnDelStrategy').attr('class', hasSelection ? 'button' : 'buttonNo');
}

/**
 * 自定义策略点击
 * @param event
 * @param strategyName
 */
function customStrategyClick(event, strategyName) {
    // console.log("自定义策略点击：" + strategyName)
    var className = event.currentTarget.className;
    if (className === '') { //选中
        // event.currentTarget.className = 'selectedBackG';
        baiduTrackEvent('自定义策略点击', 'click', strategyName);
        // 找出该策略保存的所有条件
        var conditions = [];
        for (var i = 0; i < customConditions.length; i++) {
            if (customConditions[i].strategyName === strategyName) {
                conditions = customConditions[i].conditions;
                break;
            }
        }

        // 添加到已选集合，总数不超过10
        var len = selectedConditions.length;
        for (i = 0; i < conditions.length && i < (10 - len); i++) {
            changeCondition(conditions[i], 'add');
        }
    } else if (className === 'selectedBackG') { //取消选中
        event.currentTarget.className = '';
    }
}

/**
 * 条件列表返回处理函数
 * @param result
 */
function getConditionsSuccess(result) {
    // console.log(result)

    var list = result.data;
    var len = list.length;
    // 大的分类
    var category;
    // 每个分类的条件集合
    var conditions;
    var tagCategory = '';

    for (var i = 0; i < len; i++) {
        category = list[i];
        conditions = category.conditionData;
        var tagCondition = '';
        var hideCls = '';
        for (var j = 0; j < conditions.length; j++) {
            // 收集条件
            allConditions.push(conditions[j]);
            // 大于6个的条件暂不展示
            if (j > 5) {
                hideCls = 'hideEl';
            }
            tagCondition += '<li id="btnCondition" class="' + hideCls + '" onclick="conditionClick(event, \'' + conditions[j].conditionName + '\')"><p class="condition">' + conditions[j].conditionName + '</p></li>';
        }

        //展开/收起箭头样式
        var arrowCls = conditions.length > 6 ? 'icon-arrow_open' : 'hideEl';
        //条件列表容器一个随机ID
        var ulClass = generateRandomClassName('category');
        //分类
        tagCategory +=
            '<div class="pickStockPanel">' +
                '<div class="strategy clearfix"><p>' + category.conditionType + '</p><i class="' + arrowCls + '" onclick="arrowClick(event, \'' + ulClass + '\')"></i></div>' +
                    '<div class="pickStockNamePanel">' +
                    '<ul id="' + ulClass + '" class="aPanel clearfix skill">' +
                        tagCondition +
                    '</ul>' +
                '</div>' +
            '</div>'
    }

    $('.content').append(tagCategory);

    // 设置行业选中状态
    if (industry) {
        var elP = $("p[class='condition']:contains('行业')");
        var parent = $(elP[0]).parent()[0];
        parent.className = 'selectedBackG';
        // console.log(industry)
        localStorage.removeItem('industryConditions');
    }

    // 将带过来的条件添加到列表
    for (var c = 0; c < industryConditions.length; c++) {
        changeCondition(industryConditions[c], 'add');
    }
    ifGetConditionSuc = true;

    if(urlParams.platform === 'ios')
        updateSelectionView();
}

/**
 * 展示/收起箭头点击
 * @param event
 * @param ulClass
 */
function arrowClick(event, ulClass) {
    // console.log(event, ulClass)
    var className = event.target.className;
    var liList = $('#' + ulClass).find('li');

    for (var i = 0; i < liList.length; i++) {
        if (i > 5) {
            // 切换大于6个的条件是否展示样式
            $(liList[i]).toggleClass('hideEl');
        }
    }

    if (className === 'icon-arrow_open') {
        event.target.className = 'icon-arrow_closed2';
    } else if (className === 'icon-arrow_closed2') {
        event.target.className = 'icon-arrow_open';
    }
}

// 移除行业
function toggleIndustry(industryName, operation) {
    for (var i = 0; i < selectedConditions.length; i++) {
        if (selectedConditions[i].conditionName === '行业') {
            selectedConditions.splice(i, 1);
            break;
        }
    }

    updateSelectionView();
}

/**
 * 条件点击
 * @param event
 * @param conditionName
 */
function conditionClick(event, conditionName) {
    // console.log("条件点击: " + conditionName)

    //如果点击的是行业
    if (conditionName === '行业') {
        var elP = $("p[class='condition']:contains('行业')");
        var parent = $(elP[0]).parent()[0];
        // 取消选中
        if (parent.className === 'selectedBackG') {
            parent.className = '';
            toggleIndustry();

            baiduTrackEvent('行业按钮', 'click', '取消选择');
        }
        // 选中行业
        else if (parent.className === '') {
            if (selectedConditions.length === 10) {
                showToast('最多支持10个条件');
                return;
            }

            //缓存当前条件，当从行业跳转回来时使用
            if (localStorage) {
                localStorage.industryConditions = JSON.stringify(selectedConditions);
                // showToast('s:'+selectedConditions.length+', i:'+localStorage.industryConditions)
            }

            baiduTrackEvent('行业按钮', 'click', '选择');

            //调用原生打开“选择行业”页面
            if (urlParams.platform === 'android' || urlParams.platform === 'ios') {
                // gotoIndustryPage();
                var params = {
                    pageId: 'webView',
                    url: location.protocol + '//' + location.host + '/conditions/pickIndustry',
                    animationStyle: 'kHsPageAnimationFromTop',
                    hasActionBar: 'yes',
                    title: '行业'
                };

                //ios多传参数
                if (urlParams.platform === 'ios') {
                    params.navigationStyle = 'HsNavigationStatusModel';
                    params.tempConditions = JSON.stringify(selectedConditions);
                }

                commonCallback('routerNative', JSON.stringify(params));
            } else {
                //浏览器打开“选择行业”页面
                location.href = '/conditions/pickIndustry';
            }
        }
        return;
    }

    var className = event.currentTarget.className;
    if (className === 'selectedBackG') {
        // 取消选中
        changeCondition(conditionName, 'remove');
        baiduTrackEvent('取消选中条件', 'click', conditionName);
    }
    else if (className === '') {
        if (selectedConditions.length >= 10) {
            // alert('最多支持10个条件');
            showToast('最多支持10个条件');
            return;
        }

        // 隐藏自定义框
        $('.userDefined').hide();
        // 记下点击的元素
        clickedTarget = event.currentTarget;

        // 从条件列表中找出选中的条件项
        var len = allConditions.length;
        var options = [];
        // 条件的选项是否包含自定义
        var customizable = false;
        // 条件是否展示选项
        var showOptions = false;
        for (var i = 0; i < len; i++) {
            if (conditionName === allConditions[i].conditionName) {
                currentCondition = allConditions[i];
                showOptions = allConditions[i].conditionFilter !== 'noOption'; // noOption表示此条件无选项
                options = allConditions[i].intervals || [];
                customizable = allConditions[i].conditionFilter === 'custom';

                // 不展示条件的可选项，但是要传给后台
                if (!showOptions) {
                    clickedTarget.className = 'selectedBackG';
                    var condition = {
                        conditionName: conditionName,
                        mapingConditionName: currentCondition.mapingConditionName,
                        conditionFilter: currentCondition.conditionFilter,
                        intervalMap: allConditions[i].intervals[0] ///
                    };
                    changeCondition(condition, 'add');
                    baiduTrackEvent('选中条件', 'click', conditionName);
                    return;
                }
                break;
            }
        }

        // 循环选项
        if (options.length > 0) {
            var tagOption = '';
            options.forEach(function (item, index) {
                if (item.htmlPlay) {
                    tagOption +=
                        '<li onclick="optionClick(event)">' +
                            '<div>' +
                                '<span>' + item.htmlPlay + '</span>' +
                                '<i class="icon-select_no"></i>' +
                            '</div>' +
                            '<h5></h5>' +
                        '</li>'
                }
            });

            // 是否有自定义项
            if (customizable) {
                tagOption +=
                    '<li onclick="customOptionClick()" class="slefDPanel">' +
                        '<div>' +
                            '<span>自定义条件</span>' +
                            '<i class="icon-select_no"></i>' +
                        '</div>' +
                        '<h5></h5>' +
                    '</li>'
            }

            // 加到页面
            $('#optionTitle').html(conditionName);
            $('#optionList').html(tagOption);

            // 弹出窗
            setOptionsVisible(true);
        }
    }
}

/**
 * 普通选项点击
 * @param event
 */
function optionClick(event) {
    $('.userDefined').hide();
    $('.slefDPanel').show();

    var el = $(event.currentTarget).find('i');
    var curCls = el.attr('class');
    if (curCls === 'icon-select_no') {
        $('#optionList').find('i').attr('class', 'icon-select_no');
        el.attr('class', 'icon-select');
    } else if (curCls === 'icon-select') {
        el.attr('class', 'icon-select_no');
    }

    var hasSelection = $('#optionList').find('i').hasClass('icon-select');
    $('#btnConfirmCondition').attr('class', hasSelection ? 'button' : 'buttonNo');
}

/**
 * 自定义选项点击后修改样式
 */
function customOptionClick() {
    $('.userDefined').show();
    $('.slefDPanel').hide();

    $('#optionList').find('i').attr('class', 'icon-select_no');
    $('.slefDPanel').find('i').attr('class', 'icon-select');

    var txtGt = $('#txtGt').val();
    var txtLt = $('#txtLt').val();
    $('#btnConfirmCondition').attr('class', txtGt || txtLt ? 'button' : 'buttonNo');
}

/**
 * 选项弹窗中点击确定
 */
function confirmConditions() {
    var elI = $('#optionList').find('i');
    for (var i = 0; i < elI.length; i++) {
        // 找出选中项
        if (elI[i].className === 'icon-select') {
            // 取出选项文本
            var option = $(elI[i]).parent().find('span').html();
            // 选项条件
            var condition = {
                conditionName: currentCondition.conditionName,
                mapingConditionName: currentCondition.mapingConditionName,
                conditionFilter: option === '自定义条件' ? 'custom' : '',
                intervalMap: {}
            };

            var match = false;
            if (option === '自定义条件') {
                var txtGt = $('#txtGt').val();
                var txtLt = $('#txtLt').val();

                if (!txtGt && !txtLt) {
                    break;
                }

                if (txtGt) {
                    condition.intervalMap.gte = parseNumber(txtGt);
                    condition.intervalMap.htmlPlay = ">=" + txtGt;
                    condition.intervalMap.talk = condition.conditionName + condition.intervalMap.htmlPlay + (currentCondition.unit || '');
                }
                if (txtLt) {
                    condition.intervalMap.lte = parseNumber(txtLt);
                    condition.intervalMap.htmlPlay = "<=" + txtLt;
                    condition.intervalMap.talk = condition.conditionName + condition.intervalMap.htmlPlay + (currentCondition.unit || '');
                }
                if (txtGt && txtLt) {
                    condition.intervalMap.htmlPlay = txtGt + "-" + txtLt;
                    condition.intervalMap.talk = condition.conditionName + condition.intervalMap.htmlPlay + (currentCondition.unit || '');
                }
                match = true;
            }
            else { // 非自定义条件
                // console.log(currentCondition)
                for (var j = 0; j < currentCondition.intervals.length; j++) {
                    if (option === currentCondition.intervals[j].htmlPlay) {
                        condition.intervalMap = currentCondition.intervals[j];
                        match = true;
                        break;
                    }
                }
            }

            // 添加到已选列表
            var flag = changeCondition(condition, 'add', option === '自定义条件'?500:0);
            // console.log("选中条件：" + currentCondition.conditionName + ", 选中项: " + condition.intervalMap.htmlPlay);
            baiduTrackEvent('选中选项', 'click', "选中条件：" + currentCondition.conditionName, "选中项: " + condition.intervalMap.htmlPlay);
            hidePopUp();
            break;
        }
    }
}

/**
 * 文本框输入事件
 * @param obj
 */
function txtInputHandler(obj) {
    if(obj.value.length>12)
        obj.value=obj.value.slice(0,12);
    //先把非数字的都替换掉，除了数字和.
    obj.value = obj.value.replace(/[^\d\.]/g, '');
    //必须保证第一个为数字而不是.
    obj.value = obj.value.replace(/^\./g, '');
    //保证只有出现一个.而没有多个.
    obj.value = obj.value.replace(/\.{2,}/g, '.');
    //保证.只出现一次，而不能出现两次以上
    obj.value = obj.value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
    //只能输入两个小数
    obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
    var txtGt = $('#txtGt').val();
    var txtLt = $('#txtLt').val();
    $('#btnConfirmCondition').attr('class', txtGt || txtLt ? 'button' : 'buttonNo');
}

//遮罩点击时，隐藏各种弹窗
function maskClick(event) {
    hidePopUp();
}

function fullScreen(event) {
    if (event.target.className === 'fullScreen')
        hidePopUp();
}

// 隐藏所有弹窗
function hidePopUp() {
    $('#txtGt').val('');
    $('#txtLt').val('');
    $('#btnConfirmCondition').attr('class', 'buttonNo');
    $('#divEditStrategy').hide();
    $('#divOptions').hide();
    $('#alreadyChooseDown').click();
    setConditionListVisible(false);
    $('#divMask').hide();
    $('#strategyList').find('i').attr("class", 'icon-select_no');
    $('#btnDelStrategy').attr('class', 'buttonNo');
}

// 设置底部条件列表的显示与隐藏
function setConditionListVisible(flag) {
    if (flag) {
        $('.alreadyChooseUp').hide();
        $('.alreadyChooseDownPanel').slideDown();
        $('.bg').fadeIn();
    } else {
        $('.alreadyChooseDownPanel').slideUp();
        $('.alreadyChooseUp').show();
        $('.bg').hide();
    }
}

/**
 * 关闭选项弹窗
 */
function closeOptionPopup() {
    setOptionsVisible(false);
    $('#txtGt').val('');
    $('#txtLt').val('');
    $('#btnConfirmCondition').attr('class', 'buttonNo');
}

/**
 * 设置选项弹窗是否可见
 * @param flag
 */
function setOptionsVisible(flag) {
    if (flag) {
        $('#divMask').fadeIn();
        $('#divOptions').fadeIn();
    } else {
        $('#divMask').fadeOut();
        $('#divOptions').fadeOut();
    }
}

/**
 * 弹窗
 */
function showStrategyPopup() {
    setStrategyPopupVisible(true);
}

/**
 * 关闭选项弹窗
 */
function closeStrategyPopup() {
    setStrategyPopupVisible(false);
    $('#strategyList').find('i').removeClass('icon-select').addClass('icon-select_no');
    $('#btnDelStrategy').attr('class', 'buttonNo');
}

/**
 * 设置选项弹窗是否可见
 * @param flag
 */
function setStrategyPopupVisible(flag) {
    if (flag) {
        $('#divMask').fadeIn();
        $('#divEditStrategy').fadeIn();
    } else {
        $('#divMask').fadeOut();
        $('#divEditStrategy').fadeOut();
    }
}

/**
 * 删除自定义策略
 */
function confirmDeleteStrategy() {
    var elIList = $('#strategyList').find('i');
    for (var i = 0; i < elIList.length; i++) {
        var item = elIList[i];
        // if($(item).hasClass('choose')){
        if ($(item).hasClass('icon-select')) {
            var sname = $(item).parent().find('span')[0].innerText;
            for (var j = 0; j < customConditions.length; j++) {
                if (customConditions[j].strategyName === sname) {
                    customConditions.splice(j, 1);
                    break;
                }
            }
        }
    }
    localStorage.customConditions = JSON.stringify(customConditions);
    generateCustomCondition();

    var flag = $('#strategyList').find('i').hasClass('icon-select');
    $('#btnDelStrategy').attr('class', flag ? 'button' : 'buttonNo');

    hidePopUp();
}

/**
 * 修改已选列表
 * @param condition type为remove时, condition为条件名称， add时为对象
 * @param type add, remove
 */
function changeCondition(condition, type, animationDelay) {
    var i = 0;
    var flag = false;
    var contains = '';
    var elP = '';
    var parent = '';
    animationDelay = animationDelay || 0;
    if (type === 'add') {
        //如果当前没有已选条件，则直接添加
        if (selectedConditions.length === 0) {
            selectedConditions.push(condition);
            contains = "p[class='condition']:contains('" + condition.conditionName + "')";
            elP = $(contains);
            parent = $(elP[0]).parent()[0];
            parent.className = 'selectedBackG';
            setTimeout(function () {
                addConditionAnimate(parent);
            }, animationDelay);
            flag = true;
        }
        else {
            // 如果已经有选中条件，则需要查找是否有重复
            var conditionExist = false;
            for (i = 0; i < selectedConditions.length; i++) {
                if (selectedConditions[i].conditionName === condition.conditionName) {
                    // alert('同名条件['+selectedConditions[i].conditionName+"]已存在")
                    contains = "p[class='condition']:contains('" + condition.conditionName + "')";
                    elP = $(contains);
                    parent = $(elP[0]).parent()[0];
                    if (parent) {
                        parent.className = 'selectedBackG';
                    }
                    conditionExist = true;
                    // break;
                }
            }
            if (conditionExist) {
                flag = false;
            }
            else {
                selectedConditions.push(condition);
                contains = "p[class='condition']:contains('" + condition.conditionName + "')";
                elP = $(contains);
                parent = $(elP[0]).parent()[0];
                if (parent) {
                    parent.className = 'selectedBackG';
                    setTimeout(function () {
                        addConditionAnimate(parent);
                    }, animationDelay);
                }
                flag = true;
            }
        }
    }
    else if (type === 'remove') {
        for (i = 0; i < selectedConditions.length; i++) {
            if (selectedConditions[i].conditionName === condition) {
                // 从选中条件列表中移除
                var delItem = selectedConditions.splice(i, 1);
                // 来自小E中的条件不处理
                if (!delItem.fromRobot) {
                    // 清除条件选中样式
                    contains = "p[class='condition']:contains('" + condition + "')";
                    elP = $(contains);
                    $(elP[0]).parent().removeClass('selectedBackG');
                    // $(elP[0]).parent().find('p').eq(1).html(''); // 清空选项
                    flag = true;
                    break;
                }
            }
        }
    }

    if (urlParams.platform === 'ios' && selectedConditions.length > 0)
        saveSearchConditions();
    updateSelectionView();
    return flag;
}

/**
 * 刷新底部条件展示视图
 */
function updateSelectionView() {
    var w= window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;
    var tag = '';
    tag += '<div class="alreadyChooseDown">' +
                '<div id="alreadyChooseDown"><i class="icon-select_arrowB"></i><a>已选择  <span>' + selectedConditions.length + '</span>  个条件</a></div>' +
                '<div class="result2"><i class="icon-recycleBin"></i><span onclick="clearAllCondition()">清空</span></div>' +
            '</div>';

    tag += '<div class="tlBox">';
    for (var i = 0; i < selectedConditions.length; i++) {
        // console.log(selectedConditions[i])

        // 选项
        var option = '';
        // 来自小E中的条件不处理
        if (!selectedConditions[i].fromRobot) {
            if (selectedConditions[i].conditionFilter !== 'noOption') {
                option = ": " + selectedConditions[i].intervalMap.htmlPlay;
            }
        }

        tag +=
            '<ul class="alreadyPickl">' +
                '<li>' + selectedConditions[i].conditionName + '<span style="max-width: '+w*0.5+'px">' + option + '</span></li>' +
                '<li onclick="changeCondition(\'' + selectedConditions[i].conditionName + '\',\'' + 'remove' + '\')"><i class="icon-close"></i></li>' +
                '<h5></h5>' +
            '</ul>';

    }
    tag += '</div>';

    var resultCls = '';
    if (selectedConditions.length > 0)
        resultCls = 'result';
    else
        resultCls = 'resultNo';

    tag += '<div class="' + resultCls + '" onclick="gotoResultPage(event)">查看结果</div>';
    $('#chooseUpResult').attr('class', resultCls);
    $('#divSelectedCondition').html(tag);
    $('#spanConditionCount').html(selectedConditions.length);

    // 条件列表删到0后隐藏
    if (selectedConditions.length === 0) {
        setConditionListVisible(false);
    }
}

/**
 * 清空所有已选条件
 */
function clearAllCondition() {
    if (selectedConditions.length > 0) {
        //弹确认窗
        $('.pop_confirm').show();
    }
}

//清空
function doClear() {
    $('.pop_confirm').hide();
    for (var i = 0; i < selectedConditions.length; i++) {
        var contains = "p[class='condition']:contains('" + selectedConditions[i].conditionName + "')";
        var elP = $(contains);
        $(elP[0]).parent().removeClass('selectedBackG');
    }
    selectedConditions = [];
    updateSelectionView();
    setConditionListVisible(false);
}

//关闭弹窗
function closeConfirmPopup() {
    $('.pop_confirm').hide();
}

var clickAble = true;
/**
 * 去结果页
 */
function gotoResultPage(event) {
    if (selectedConditions.length > 0)
    {
        if (saveSearchConditions()) {
            baiduTrackEvent('查看结果', 'click', '');
            if(clickAble){
                clickAble = false;
                setTimeout(function () {
                    clickAble = true;
                }, 2000)
            }else{
                return;
            }
            //调用原生打开
            if (urlParams.platform === 'android' || urlParams.platform === 'ios') {
                var params = {
                    pageId: 'webView',
                    url: location.protocol + '//' + location.host + '/conditions/pickStockResult',
                    animationStyle: 'kHsPageAnimationFromTop',
                    hasActionBar: 'yes',
                    action: 'pickCondition',
                    title: '选股详情'
                };

                //ios多传一个参数
                if (urlParams.platform === 'ios') {
                    params.navigationStyle = 'HsNavigationStatusModel';
                    params.searchConditions = JSON.stringify(selectedConditions);
                }

                if (urlParams.platform === 'ios') {
                    showToast('跳转中...');
                    setTimeout(function () {
                        commonCallback('routerNative', JSON.stringify(params));
                    }, 2000);
                }
                else if (urlParams.platform === 'android') {
                    commonCallback('routerNative', JSON.stringify(params));
                }
            } else {
                //H5打开
                location.href = '/conditions/pickStockResult';
            }
        }
    }
}

/**
 * 将当前选中条件缓存到本地
 */
function saveSearchConditions() {
    if (localStorage) {
        localStorage.searchConditions = JSON.stringify(selectedConditions);
        return true;
    }
}

/**
 * 生成随机class名
 * @param classNamePrefix 前缀
 */
function generateRandomClassName(classNamePrefix) {
    var randomTime = new Date().getTime();
    return classNamePrefix + randomTime + (Math.random() * 10000).toFixed(0);
}

/**
 * 取条件列表
 */
function getConditionList() {
    var url = '/robot/semantic/conditionalStock/conditions';
    $.ajax({
        type: "get",
        url: url,
        dataType: "jsonp",
        timeout: 10000,
        jsonp: "callback",
        success: getConditionsSuccess
    })
}

/**
 * 添加条件动画
 * 传入参数：需要播放动画的对象
 */
function addConditionAnimate(dom) {
    var conditionItem = $(dom).closest("li");
    var flyElm = conditionItem.clone();
    $('body').append(flyElm);
    flyElm.css({
        'z-index': 9000,
        'display': 'block',
        'position': 'absolute',
        'top': conditionItem.offset().top + 'px',
        'left': conditionItem.offset().left + 'px',
        'width': conditionItem.width() + 'px',
        'height': conditionItem.height() + 'px',
        'border-radius': '0.313rem',
        'text-align': 'center'
    });
    flyElm.animate({
        top: $('#spanConditionCount').offset().top,
        left: $('#spanConditionCount').offset().left,
        width: 10,
        height: 10
    }, 'slow', function () {
        flyElm.remove();
    });
}
