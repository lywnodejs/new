module.exports = {
  isEmptyObj: function (obj) {
    for (var name in obj) {
      return false;
    }
    return true;
  },
  stringIsNull: function(str) {
    return typeof str === "undefined" || str === null;
  },
  stringIsEmpty: function(str) {
    return this.stringIsNull(str) || str === "";
  },
  stringIsNotEmpty: function (str) {
    return !this.stringIsEmpty(str);
  },
  arrayISNotEmpty:function (array) {
    return  typeof array != "undefined" && array!= null && array.length > 0;
  },
  stringIsEndWith: function (str, suffix){
    var d= str.length- suffix.length;
    return (d >= 0 && str.lastIndexOf(suffix) == d )
  },
  stringIsStartWith: function (str, prefix){
    return str.slice(0, prefix.length) === prefix;
  },
  betweenVersion: function (version, lower, upper){
    return this.compare(version,lower)>=0 && this.compare(version,upper)<=0;
  },

  firstGESecond: function (versionA, versionB){
    return this.compare(versionA,versionB)>=0;
  },

  firstGTSecond: function (versionA, versionB){
    return this.compare(versionA,versionB) > 0;
  },

  firstLESecond: function (versionA, versionB){
    return this.compare(versionA,versionB)<=0;
  },

  firstLTSecond: function (versionA, versionB){
    return this.compare(versionA,versionB) < 0;
  },

  compare: function (a,b){
    var a=a.split(/[^\d]+/g),b=b.split(/[^\d]+/g);
    var len = a.length;
    for(var i=0;i<len;i++){
      if((a[i]||0) != (b[i]||0)) return a[i]-b[i];
    }
    return 0;
  }
};
