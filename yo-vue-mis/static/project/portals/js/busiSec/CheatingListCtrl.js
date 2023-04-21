define('js/common/slideUpDown',['require','exports','module'],function (require, exports, module) {
    return function funTransitionHeight(element, time, newHeight) { // time, 数值，可缺省
        if (typeof window.getComputedStyle === "undefined") {
            return;
        }
        if (+newHeight === newHeight) {
            newHeight = newHeight + 'px'
        }
        var height = window.getComputedStyle(element).height;
        element.style.height = "auto";
        var styleObj = window.getComputedStyle(element)
        //再次获取高度
        var targetHeight = typeof newHeight !== 'undefined' ? newHeight : styleObj.height;
        if (targetHeight !== '0px') {
            targetHeight = parseInt(targetHeight, 10) + parseInt(element.dataset.paddingTop || 0, 10) + parseInt(element.dataset.paddingBottom || 0, 10) + 'px';
        }
        element.style.height = height;
        /*if (newHeight === 0) {
            var timmer, done = function () {
                element.removeEventListener("transitionend", done);
                clearTimeout(timmer);
                // element.style.display = "none";
            }
            element.addEventListener("transitionend", done, false);
            timmer = setTimeout(done, time);
        } */
        setTimeout(function () {
            if (time) {
                element.style.transition = "height " + time + "ms ease-in-out,padding-top " + time + "ms ease-in-out,padding-bottom " + time + "ms ease-in-out";
            }
            element.style.height = targetHeight;
            if (!element.dataset) {
                element.dataset = {};
            }
            if (targetHeight === '0px') {
                //cache old padding
                element.dataset.paddingTop = styleObj.paddingTop;
                element.dataset.paddingBottom = styleObj.paddingBottom;
                element.dataset.overflow = styleObj.overflow;
                element.style.paddingTop = 0;
                element.style.paddingBottom = 0;
                element.style.overflow = 'hidden';
            } else {
                element.style.paddingTop = element.dataset.paddingTop;
                element.style.paddingBottom = element.dataset.paddingBottom;
                element.style.overflow = 'hidden';
                setTimeout(function () {
                    element.style.overflow = element.dataset.overflow;
                }, time)
            }
        }, 15);
    };
});
define('js/common/form/slideForm',['require','exports','module','../slideUpDown'],function (require, exports, module) {
    var slideUpDown = require('../slideUpDown');
    return function ($scope, name) {
        $scope.formIsOpen = true;
        name = name || 'slideForm';
        return $scope[name] = function ($event) {
            var hasClass = !!~$event.currentTarget.className.indexOf('open');
            $scope.formIsOpen = !$scope.formIsOpen;
            slideUpDown(document.querySelector('.p-form'), 350, !hasClass ? 0 : undefined)
        }
    }
});
/**
 *  定义常量
 */
define('js/busiSec/EnumConstants',['require','exports','module'],function(require, exports, module) {
    //  exports.moduleName = '于个'
    module.exports = {
        levelOpts: ['正常', '高危', '异常'],
        statusOpts: {1162:'未打击',
                    1164: '已打击'},
        osOpts:['其它', 'Android', 'iOS']
    }
    /**
    //  exports.moduleName = '于个'
    return {
        levelOpts: ['正常', '高位', '异常'],
        statusOpts: ['未确认', '未处理', '已处理']
    }
    **/
})
;
define('js/busiSec/RuleFilter',['require'], function(require) {
    return function(ctrl, $http) {
        var ruleUrl = '/bsSec/rules',
            rules;
        
        $http({
            method : "GET",
            url : ruleUrl
        }).success(function (res) {
            rules = res;
            ctrl.ruleFormat = function(ids) {
                if(ids) {
                    var idArray = ids.split(','),
                        result = [],
                        i = 0,
                        len = rules.length;
                    for(; i < len; i++) {
                        var rule_id = idArray[i];
                        //  
                        for(var j = 0; j < rules.length; j ++) {
                            if(rules[j].rule_id == rule_id) {
                                result.push(rules[j].rule_name);
                                break;
                            }                            
                        }                        
                    }
                    if(ids.length > 0) {
                        return result.join(',')
                    }                    
                }
                return ids
            }
            //
            ctrl.ruleTable = function(ids) {
                if(ids) {
                   var idArray = ids.split(','),
                        result = [],
                        i = 0,
                        len = rules.length;
                    for(; i < len; i++) {
                        var rule_id = idArray[i];
                        //  
                        for(var j = 0; j < rules.length; j ++) {
                            if(rules[j].rule_id == rule_id) {
                                result.push(rules[j]);
                                break;
                            }                            
                        }                        
                    }
                    return result      
                }                  
            }
            /**
            appMod.filter('ruleFilter', function() {
                return function(input) {
                    var ids = input.split(',');
                    return ids.length
                }
            });
            **/
        });
       
        
    }
});
define('js/common/add-water-mark',['require','exports','module'],function (require, exports, module) {
    return function ($rootScope) {
        $rootScope.$on('init.user', function () {
            waterMark && waterMark({
                systemId: '452',
                containerEl: document.querySelector('.content'),
                imgWidthDis: 100,
                imgHeightDis: 100,
                textStyle: 'rgba(0,0,0,0.08)',
                userId: $rootScope.$user.name
            })
        })
    }
});
define('js/busiSec/CheatingListCtrl',['require', '../common/form/slideForm', './EnumConstants', './RuleFilter', './../common/add-water-mark'], function (require, slideForm, enums, ruleFilter, addWaterMark) {
    return function (appMod) {
            appMod.controller('CheatingListCtrl', 
                              ['$rootScope', '$scope', '$http', '$uibModal',
                function ($rootScope, $scope, $http, $uibModal) {
                    addWaterMark($rootScope)
                    var ctrl = this,
                        listUrl = '/bsSec/list',
                        initDomain = function () {
                            var endTime = new Date(),    
                                st = endTime.valueOf() - 1000 * 60 * 60 * 24;
                            return {
                                startTime: new Date(st),
                                endTime,
                                id: '',
                                
                                level: '',
                                status: '',
                                user_id_multi: '',
                                order_id : '',
                                app_name : '',
                                rule : '',
                                app_version : '',
                                os : ''
                            }
                        };
                    //  激活查询菜单收缩功能
                    slideForm($scope);
                    //  激活规则过滤器
                    ruleFilter($scope, $http);
                    //  初始化词典
                    angular.extend(this, {
                        levelOpts: enums.levelOpts,
                        statusOpts: enums.statusOpts,
                        osOpts : enums.osOpts,
                        closeText: '关闭',
                        currentText: '今天',
                        clearText: '清除',
                        format: 'yyyy-MM-dd',
                        dateOptions: {
                            formatYear: 'yyyy',
                            maxDate: new Date(),
                            minDate: new Date(2012, 5, 22),
                            startingDay: 1
                        }
                    });
                    
                    //  初始化$scope
                    angular.extend($scope, {
                            currPage : 1,
                            itemsOfPage : 10,
                            totalItems : 0,
                            datas : [],
                            pages : 1,
                            searching : false,
                            idSearch : false,
                            updatePages () {
                                this.pages = Math.ceil(this.totalItems / this.itemsOfPage);    
                            },                 
                            //  时间控制
                            startTimeOpened: false,
                            endTimeOpened: false,
                            //  注册日期点击事件
                            startTimeOpen() {
                                this.startTimeOpened = true
                            },
                        
                            //  注册日期点击事件
                            endTimeOpen() {
                                this.endTimeOpened = true
                            },

                            //  初始化业务对象
                            init() {
                                angular.extend(ctrl, initDomain())
                                this.search();
                            },
                        
                            getParams () {
                                var params = initDomain();
                                for(var prop in params) {
                                    params[prop] = ctrl[prop];
                                }
                                if(params.startTime) {
                                    params.startTime.setHours(0)
                                    params.startTime.setMinutes(0)
                                    params.startTime.setSeconds(0)
                                    params.startTime.setMilliseconds(0)
                                    params.startTime = params.startTime.valueOf();
                                }
                                if(params.endTime) {
                                    params.endTime = params.endTime.valueOf();
                                }
                                
                                //  提取分页信息
                                params.page = this.currPage;
                                params.size = this.itemsOfPage;
                                return params;
                            },

                            //  查询对象
                            search() {
                                var _this = this,
                                    params = this.getParams();
                                $scope.searching = true
                                $http({
                                    method : "GET",
                                    url : listUrl,
                                    params: params
                                }).success(function (res) {
                                    _this.totalItems = res.total;
                                    _this.datas = res.data;
                                    _this.updatePages();
                                    //  后台数据记录条数减少
                                    if(_this.currPage > _this.pages && _this.currPage > 0) {
                                        _this.currPage = _this.pages;
                                    }
                                    //  控制显示
                                    $scope.searching = false
                                });
                            },
                        
                            findById (id) {
                                if(this.datas && this.datas.length > 0) {
                                    for(var i = 0; i < this.datas.length; i ++) {
                                        if(this.datas[i].id == id) {
                                            return this.datas[i]
                                        }
                                    }
                                }                                
                            }
                    });
                    // 初始化业务对象
                    $scope.init()
                    var listScope = $scope;
                    
                    //
                    $scope.detail = function(id) {
                        
                        $uibModal.open({
                          animation: true,
                          ariaLabelledBy: 'modal-title-top',
                          ariaDescribedBy: 'modal-body-top',
                          templateUrl: 'detailModal.html',
                          size: 'lg',
                          backdrop : false,
                          controller: ['$scope', '$uibModalInstance', '$http', function($scope, $uibModalInstance, $http) {
                            //  激活规则过滤器
                            ruleFilter($scope, $http);
                            var domain = listScope.findById(id);
                            //  如果没有在缓存中找到
                            if(domain) {
                                angular.extend($scope, domain)
                            } else {
                                var detailUrl = '/bsSec/detail/' + id;
                                $scope.idSearch = true;
                                $http({
                                    method : "GET",
                                    url : detailUrl
                                }).success(function (res) {
                                    angular.extend($scope, res)
                                    $scope.idSearch = false;
                                });
                            }
                            
                              
                            $scope.close = function() {
                               $uibModalInstance.close();
                            }
                          }]
                        });
                    }
                    
            }
        ]);
    }
});
