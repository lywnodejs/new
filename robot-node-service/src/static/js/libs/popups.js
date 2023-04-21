/**
 * 动态加载弹窗中的html内容，以减小首页体积
 */

// 选择弹窗，个股偏好筛选
$('#popStockFilter').load('/static/popups/popStockFilter.html');

// 选择弹窗，热点偏好筛选
$('#popFocusFilter').load('/static/popups/popFocusFilter.html');

// 操盘线说明，提示弹窗
$('#popExpmaExplain').load('/static/popups/popExpmaExplain.html');

// 趋势体系说明，提示弹窗
$('#popTrendSystemExplain').load('/static/popups/popTrendSystemExplain.html');

// 短线决策，提示弹窗
$('#popShortTermPolicyExplain').load('/static/popups/popShortTermPolicyExplain.html');
