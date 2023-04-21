let postListS=[{dataP:"["},{dataP:"]"},{dataP:"{"},{dataP:"}"},{dataP:"#"},{dataP:"%"},{dataP:"^"},{dataP:"*"},{dataP:"+"},{dataP:"="},{dataP:"_"},{dataP:"\\"},{dataP:"|"},{dataP:"~"},{dataP:"<"},{dataP:">"},{dataP:"$"},{dataP:"&"},{dataP:"@"},{dataP:'"'},{dataP:"`"},{dataP:","},{dataP:"?"},{dataP:"!"},{dataP:"'"}],postListN=[{dataP:"1"},{dataP:"2"},{dataP:"3"},{dataP:"4"},{dataP:"5"},{dataP:"6"},{dataP:"7"},{dataP:"8"},{dataP:"9"},{dataP:"0"},{dataP:"-"},{dataP:"/"},{dataP:":"},{dataP:";"},{dataP:"("},{dataP:")"},{dataP:"$"},{dataP:"&"},{dataP:"@"},{dataP:'"'},{dataP:"."},{dataP:","},{dataP:"?"},{dataP:"!"},{dataP:"'"}],postList=[{dataP:"q"},{dataP:"w"},{dataP:"e"},{dataP:"r"},{dataP:"t"},{dataP:"y"},{dataP:"u"},{dataP:"i"},{dataP:"o"},{dataP:"p"},{dataP:"a"},{dataP:"s"},{dataP:"d"},{dataP:"f"},{dataP:"g"},{dataP:"h"},{dataP:"j"},{dataP:"k"},{dataP:"l"},{dataP:"z"},{dataP:"x"},{dataP:"c"},{dataP:"v"},{dataP:"b"},{dataP:"n"},{dataP:"m"}];var BL={"index":"","starstr":[],"mappingstr":[],"PH":[]};var jiami={};jiami.microdone=require('./jsencrypt.js');jiami.microdone2=require('./aes.js');jiami.microdone3=require('./SM24.js');jiami.microdone4=require('./tripledes.js');var hy;var aes=new jiami.microdone2.aes();var interv=null,intervs=[],dateType;Component({behaviors:[],properties:{bod2top:String,keyboardNum:{type:Number,value:1},starstr:{type:Array,value:[]},SM24PublicKey:{type:String,value:"1093A047C5CBF48283EC7A210703F3FF9EA4448DC15D56B4CD82FCB27DAD2D45F2BB0BF953BCEBB635D9D34E473ECEFC9F25880EB1669F94DE050A29AC86F308"},rsaPublicKey:{type:String,value:"3081890281810092D9D8D04FB5F8EF9B8374F21690FD46FDBF49B40EECCDF416B4E2AC2044B0CFE3BD67EB4416B26FD18C9D3833770A526FD1AB66A83ED969AF74238D6C900403FC498154EC74EAF420E7338675CAD7F19332B4A56BE4FF946B662A3C2D217EFBE4DC646FB742B8C62BFE8E25FD5DC59E7540695FA8B9CD5BFD9F92DFAD009D230203010001"},ifMapping:{type:Number,value:1},placeHolder:{type:Array,value:[]},regExpone:{type:Array,value:[]},regExptwo:{type:Array,value:[]},lengthLimit:{type:Array,value:[]},pressStatus:{type:String,value:"1"},chaosMode:{type:String,value:'0'},imgaddress:{type:String,value:'/images/'},addfn:{type:Array,value:[]},delfn:{type:Array,value:[]},callBackfn:{type:Number,value:0},license:{type:String,value:""}},data:{kbvalue:{type:Object,value:{}},mappingstr:{type:Array,value:[]},display:true,postList1:"",postList2:"",postList3:"",postListN1:"",postListN2:"",postListN3:"",postListS1:"",postListS2:"",postListS3:"",postListS4:"",postListP1:"",postListP2:"",postListP3:"",postListP4:"",display1:"block",display2:"none",display3:"none",display4:"none",lastTapDiffTime:0,jiaoti:1,changeCap:0,},lifetimes:{attached:function(){},moved:function(){},},attached:function(){},ready:function(){var self=this;let arrlen=postList.length;var try3=new Array();var postListN1=postListN.slice(0,10);var arrlen2=postListN1.length;var try6=new Array();if(self.data.chaosMode==0){for(let i=0;i<arrlen;i++){try3[i]=postList[i];}
for(let i=0;i<arrlen2;i++){try6[i]=postListN1[i];}}else{try3=self._randArray(postList);try6=self._randArray(postListN1);}
self.setData({postList1:try3.slice(0,10),postList2:try3.slice(10,19),postList3:try3.slice(19,26),postListN1:try6,postListN2:postListN.slice(10,20),postListN3:postListN.slice(20,25),postListS1:postListS.slice(0,10),postListS2:postListS.slice(10,20),postListS3:postListS.slice(20,28),postListS4:postListS.slice(28,33),postListP1:try6.slice(0,3),postListP2:try6.slice(3,6),postListP3:try6.slice(6,9),postListP4:try6.slice(9,10),green:self.data.imgaddress+"shift.png",del:self.data.imgaddress+"DEL.png",H5close:this.data.imgaddress+"close.png",});BL.PH=self.data.placeHolder;hy=jiami.microdone3.Cd(this.data.license);},pageLifetimes:{show:function(){},},methods:{onTap:function(){var myEventDetail={}
var myEventOption={}
this.triggerEvent('microdoneevent',myEventDetail,myEventOption)},_randArray:function(data,flag){var arrlen=data.length;var try1=new Array();for(var i=0;i<arrlen;i++){try1[i]=i;}
var try2=new Array();for(var i=0;i<arrlen;i++){try2[i]=try1.splice(Math.floor(Math.random()*try1.length),1);}
var try3=new Array();for(var i=0;i<arrlen;i++){try3[i]={};if(flag){try3[i].dataP=data[try2[i]].dataP.toUpperCase();}else{try3[i].dataP=data[try2[i]].dataP.toLowerCase();}}
return try3;},_upercase:function(data,flag){var arrlen=data.length;var try3=new Array();if(flag){for(let k=0;k<arrlen;k++){try3[k]={};try3[k].dataP=data[k].dataP.toUpperCase();}}else{for(let k=0;k<arrlen;k++){try3[k]={};try3[k].dataP=data[k].dataP.toLowerCase();}}
return try3},_sq:function(bQ){var eD=new Array(-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,62,-1,-1,-1,63,52,53,54,55,56,57,58,59,60,61,-1,-1,-1,-1,-1,-1,-1,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,-1,-1,-1,-1,-1,-1,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,-1,-1,-1,-1,-1);var aN,bp,aT,cX;var i,ad,out;ad=bQ.length;i=0;out="";while(i<ad){do{aN=eD[bQ.charCodeAt(i++)&0xff];}while(i<ad&&aN==-1);if(aN==-1)
break;do{bp=eD[bQ.charCodeAt(i++)&0xff];}while(i<ad&&bp==-1);if(bp==-1)
break;out+=String.fromCharCode((aN<<2)|((bp&0x30)>>4));do{aT=bQ.charCodeAt(i++)&0xff;if(aT==61)
return out;aT=eD[aT];}while(i<ad&&aT==-1);if(aT==-1)
break;out+=String.fromCharCode(((bp&0XF)<<4)|((aT&0x3C)>>2));do{cX=bQ.charCodeAt(i++)&0xff;if(cX==61)
return out;cX=eD[cX];}while(i<ad&&cX==-1);if(cX==-1)
break;out+=String.fromCharCode(((aT&0x03)<<6)|cX);}
return out;},_zI:function(sKeys,tA){var neiKeya1=[0x11];var neiKeya2=[0x22];var neiKeya=[0x33];var neiKeyb=[0x44];var neiKeyc=[0x55];var neiKeyd=[0x66];var neiKeye=[0x77];var neiKeyf=[0x1A];var neiKeyg=[0x2A];var neiKeyh=[0x2B];var neiKeyi=[0x2C];var neiKeyj=[0x2D];var neiKeyk=[0x2E];var neiKeyl=[0x2F];var neiKeym=[0x3A];var neiKeyn=[0x3B];var neiKeyo=[0x11];var neiKeyp=[0x22];var neiKeyq=[0x33];var neiKeyr=[0x44];var neiKeys=[0x55];var neiKeyt=[0x66];var neiKeyu=[0x77];var neiKeyv=[0x1A];var neiKeyw=[0x2A];var neiKeyx=[0x2B];var neiKeyy=[0x2C];var neiKeyz=[0x2D];var neiKeyaa=[0x2E];var neiKeybb=[0x2F];var neiKeycc=[0x3A];var neiKeydd=[0x3B];var sr="";var qX="";for(var i=0;i<sKeys.length;i++){var yU;if(i==0)
yU=neiKeya1;if(i==1)
yU=neiKeya2;if(i==2)
yU=neiKeya;if(i==3)
yU=neiKeyb;if(i==4)
yU=neiKeyc;if(i==5)
yU=neiKeyd;if(i==6)
yU=neiKeye;if(i==7)
yU=neiKeyf;if(i==8)
yU=neiKeyg;if(i==9)
yU=neiKeyh;if(i==10)
yU=neiKeyi;if(i==11)
yU=neiKeyj;if(i==12)
yU=neiKeyk;if(i==13)
yU=neiKeyl;if(i==14)
yU=neiKeym;if(i==15)
yU=neiKeyn;if(i==16)
yU=neiKeyo;if(i==17)
yU=neiKeyp;if(i==18)
yU=neiKeyq;if(i==19)
yU=neiKeyr;if(i==20)
yU=neiKeys;if(i==21)
yU=neiKeyt;if(i==22)
yU=neiKeyu;if(i==23)
yU=neiKeyv;if(i==24)
yU=neiKeyw;if(i==25)
yU=neiKeyx;if(i==26)
yU=neiKeyy;if(i==27)
yU=neiKeyz;if(i==28)
yU=neiKeyaa;if(i==29)
yU=neiKeybb;if(i==30)
yU=neiKeycc;if(i==31)
yU=neiKeydd;qX=String.fromCharCode(sKeys[i].charCodeAt(0)^yU);sr+=qX;}
sr=sr.substr(0,sr.length-16);var xk=aes.CryptoJS.enc.Utf8.parse(sr);var oY=aes.CryptoJS.AES.encrypt(tA,xk,{mode:aes.CryptoJS.mode.ECB,padding:aes.CryptoJS.pad.Pkcs7});return oY.toString();},_mapping:function(key){var keyCode=key.charCodeAt(0);var bQ=this._sq(jiami.setMapping);var strs=bQ.replace(/'/g,"").replace(" ","");var mapR=strs.slice(1,strs.length-1).split(",");return String.fromCharCode(mapR[keyCode-33]);},_CharMode:function(iN,qp){if(iN>=48&&iN<=57)
return 1;if(iN>=65&&iN<=90)
return 2;if(iN>=97&&iN<=122&&qp==1)
return 4;if(iN>=97&&iN<=122&&qp==0)
return 2;else
return 8;},pwdSetSk:function(s){jiami.random=s;},pwdSetMap:function(s){jiami.setMapping=s;},pwdLength:function(qp){if(!hy){console.log("license AA error!");return false}
return this.data.kbvalue[qp].length;},clearpwd:function(qp){if(!hy){console.log("license AA error!");return false}
var jianpan={};var date={};BL.starstr[qp]="";var kbvalue=this.data.kbvalue;kbvalue[qp]=[]
var Ph1=[];Ph1=BL.PH.concat([]);Ph1[BL.index]=""
date["placeHolder"]=Ph1;date['starstr']=BL.starstr;if(this.data.ifMapping==1){BL.mappingstr[qp]="";}
this.setData({kbvalue:kbvalue,mappingstr:BL.mappingstr})
this.triggerEvent('microdoneevent',{date},{});},pwdSimple:function(qp){if(!hy){console.log("license AA error!");return false}
var that=this;var parrt;var pwd=that.data.kbvalue[qp];var bQ="";for(var i=0;i<that.data.kbvalue[qp].length;i++){bQ+=jiami.microdone3.BF(that.data.kbvalue[qp][i]);}
var vlen=pwd.length;var count=0;for(var i=0;i<vlen;i++){parrt=jiami.microdone3.BF(pwd[0]);for(var i=0;i<vlen;i++){if(parrt==jiami.microdone3.BF(pwd[i])){count=count+1;}
if(count==vlen){parrt="";bQ="";return 1;}}
parrt="";}
var mm2=bQ.substr(0,3);if(mm2==bQ.substr(3,3)){bQ="";return 1;}
var bz=new Array();bz[0]="01234567890";bz[1]="09876543210";bz[2]="mnbvcxz";bz[3]="zxcvbnm";bz[4]="lkjhgfdsa";bz[5]="asdfghjkl";bz[6]="poiuytrewq";bz[7]="qwertyuiop";bz[8]="zyxwvutsrqponmlkjihgfedcba";bz[9]="abcdefghijklmnopqrstuvwxyz";bz[10]="12378901234";bz[11]="147258";bz[12]="147369";bz[13]="258369";bz[14]="321987";bz[15]="369258";bz[16]="456123";bz[17]="987321";for(var c=0;c<bz.length;c++){var cZ=bQ;if(cZ.indexOf("\\")>-1){cZ=cZ.replace(/\\/g,"\\\\");}
if(cZ.indexOf("|")>-1){cZ=cZ.replace(/\|/g,"\\\|");}
if(cZ.indexOf("$")>-1){cZ=cZ.replace(/\$/g,"\\$");}
if(cZ.indexOf("(")>-1){cZ=cZ.replace(/\(/g,"\\(");}
if(cZ.indexOf(")")>-1){cZ=cZ.replace(/\)/g,"\\)");}
if(cZ.indexOf("[")>-1){cZ=cZ.replace(/\[/g,"\\[");}
if(cZ.indexOf("*")>-1){cZ=cZ.replace(/\*/g,"\\*");}
if(cZ.indexOf("^")>-1){cZ=cZ.replace(/\^/g,"\\^");}
if(cZ.indexOf("+")>-1){cZ=cZ.replace(/\+/g,"\\+");}
if(bz[c].match(cZ)){cZ="";bQ="";return 1;}}
bQ="";return 0;},pwdCommon:function(qp){if(!hy){console.log("license AA error!");return false}
var Modes=0;var pwd=this.data.kbvalue[qp];for(var i=0;i<pwd.length;i++){Modes|=this._CharMode(jiami.microdone3.BF(pwd[i]).charCodeAt(),1);};if(Modes==0){return 0;}else if(Modes==1){return 1;}else if(Modes==4){return 2;}else if(Modes==5){return 3;}else if(Modes==2){return 4;}else if(Modes==3){return 5;}else if(Modes==6){return 6;}else if(Modes==7){return 7;}else if(Modes==8){return 8;}else if(Modes==9){return 9;}else if(Modes==12){return 10;}else if(Modes==13){return 11;}else if(Modes==10){return 12;}else if(Modes==11){return 13;}else if(Modes==14){return 14;}else if(Modes==15){return 15;}},pwdNum:function(qp){if(!hy){console.log("license AA error!");return false}
var Modes=0;var pwd=this.data.kbvalue[qp];for(var i=0;i<pwd.length;i++){Modes|=this._CharMode(jiami.microdone3.BF(pwd[i]).charCodeAt(),0);};var num=0;for(i=0;i<4;i++){if(Modes&1)
num++;Modes>>>=1;}
return num;},pwdValid:function(qp){if(!hy){console.log("license AA error!");return false}
let parrt=new RegExp(this.data.regExptwo[qp]||"[\\S\\s]");let bQ="";if(this.data.kbvalue[qp]==undefined){return 1}
for(var i=0;i<this.data.kbvalue[qp].length;i++){bQ+=jiami.microdone3.BF(this.data.kbvalue[qp][i]);}
if(parrt.test(bQ)){return 0;}else{return 1;}},pwdHash:function(qp,name){if(!hy){console.log("license AA error!");return false}
var that=this;if(this.data.ifMapping==1){var bQ=that.data.mappingstr[qp];}else{var bQ="";for(var i=0;i<that.data.kbvalue[qp].length;i++){bQ+=jiami.microdone3.BF(that.data.kbvalue[qp][i]);}}
if(name==1||!name){let ph=jiami.microdone2.aes.prototype.CryptoJS.MD5(bQ).toString();bQ="";return ph;}},getoutput:function(qp){if(!hy){console.log("license AA error!");return false}
var crypt=new jiami.microdone.JSEncrypt();crypt.setPublicKey(this.data.rsaPublicKey);if(this.data.ifMapping==1){var rsaStr=crypt.encrypt(this.data.mappingstr[qp]);}else{var rsaStr="";for(var i=0;i<that.data.kbvalue[qp].length;i++){rsaStr+=jiami.microdone3.BF(that.data.kbvalue[qp][i]);}
rsaStr=crypt.encrypt(rsaStr);}
var aesstr=this._zI(jiami.random.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,""),rsaStr.replace(/(^s*)|(s*$)/g,""));rsaStr="";return aesstr;},getoutputSM:function(qp){if(!hy){console.log("license AA error!");return false}
var self=this;let bQ;if(this.data.ifMapping==1){bQ=self.data.mappingstr[qp];}else{bQ="";for(var i=0;i<self.data.kbvalue[qp].length;i++){bQ+=jiami.microdone3.BF(self.data.kbvalue[qp][i]);}}
var gz=self.data.SM24PublicKey;var retdata=jiami.microdone3.SM2_Encrypt(bQ,gz,'1',true);var oY=jiami.microdone3.getSM4EnStr(jiami.random,retdata);bQ="";return oY;},bindButtonTap:function(e,or){var WindowHeight,WindowWidth,jianpanHeight,Height,clientY;var self=this;if(!or){wx.createSelectorQuery().select('#'+e.target.id).boundingClientRect(function(rect){Height=rect.height;wx.getSystemInfo({success:function(dz){WindowHeight=dz.windowHeight;WindowWidth=dz.windowWidth;}});clientY=e.touches[0].clientY-e.touches[0].pageY+e.target.offsetTop+2;var TTT=WindowHeight-Height-clientY;if(TTT<WindowWidth/750*488){var date={};date.bod2top=(TTT-WindowWidth/750*488)+"px"
self.triggerEvent('microdoneevent',{date},{})}}).exec();}
for(let fD=0;fD<intervs.length;fD++){clearInterval(intervs[fD]);};if(BL.index!=""){BL.starstr[BL.index]=BL.starstr[BL.index].replace("|","");var date={};if(BL.starstr[BL.index]==""){date.starstr=BL.starstr,date.placeHolder=BL.PH}else{date.starstr=BL.starstr}
self.triggerEvent('microdoneevent',{date},{})};BL.index=e.currentTarget.dataset.p;var Ph1=[];for(let k=0;k<self.data.keyboardNum;k++){BL.starstr[k]=BL.starstr[k]||"";if(self.data.ifMapping==1){BL.mappingstr[k]=this.data.mappingstr[k]||"";}
if(k==BL.index){Ph1[k]="";}else{Ph1[k]=BL.PH[k]}};setTimeout(function(){wx.hideKeyboard({complete:res=>{}})},50);dateType=e.currentTarget.dataset.type;var jianpan={};if(dateType==1){jianpan['display1']="none";jianpan['display2']="none";jianpan['display3']="none";jianpan['display4']="block";}else{jianpan['display1']="block";jianpan['display2']="none";jianpan['display3']="none";jianpan['display4']="none";};jianpan['display']=false;jianpan["select"]="";var date={};date.placeHolder=Ph1;if(self.data.ifMapping==1){jianpan.mappingstr=BL.mappingstr;}
self.triggerEvent('microdoneevent',{date},{})
self.setData(jianpan);var dv=false;interv=setInterval(function(){if(BL.starstr.length==0){return;}
if(dv){BL.starstr[BL.index]=BL.starstr[BL.index].replace("|","");dv=false;}else{BL.starstr[BL.index]+="|";dv=true;};var date={};date.starstr=BL.starstr
self.triggerEvent('microdoneevent',{date},{})},500);intervs.push(interv);},close:function(e){var self=this;if(BL.index!=""){BL.starstr[BL.index]=BL.starstr[BL.index].replace("|","");}else{for(let k=0;k<BL.PH.length;k++){BL.starstr[k]=this.data.starstr[k];}}
var date={};date.bod2top=0;var jianpan={};jianpan["display"]=true;jianpan["select"]="close";date["starstr"]=BL.starstr;for(let fD=0;fD<intervs.length;fD++){clearInterval(intervs[fD]);}
if(BL.starstr[BL.index]==""){date["placeHolder"]=BL.PH;};if(!self.data.display){date.callBackfn=BL.index;}
self.triggerEvent('microdoneevent',{date},{});self.setData(jianpan);},tapName:function(event){var self=this;var jianpan={};var date={};var inner=event.currentTarget.dataset.p;var parrt=new RegExp(self.data.regExpone[BL.index]||"[\\S\\s]");if(self.data.pressStatus!=0){jianpan["select"]=event.currentTarget.dataset.index;self.setData(jianpan);};BL.starstr[BL.index]=BL.starstr[BL.index].replace("|","");var lengthlimit=false;if(self.data.lengthLimit[BL.index]===undefined){lengthlimit=true}else if(self.data.lengthLimit[BL.index]>BL.starstr[BL.index].length){lengthlimit=true}
if(parrt.test(inner)&&lengthlimit){var innerm=jiami.microdone3.Ce(inner);var kbvalue=self.data.kbvalue;if(self.data.kbvalue[BL.index]==undefined){kbvalue[BL.index]=[];}
kbvalue[BL.index].push(innerm);BL.starstr[BL.index]+="*";date.starstr=BL.starstr;if(self.data.ifMapping==1){BL.mappingstr[BL.index]+=self._mapping(inner);}
self.setData({kbvalue:kbvalue,mappingstr:BL.mappingstr})
date.addfn=[BL.index,BL.starstr[BL.index].length]
self.triggerEvent('microdoneevent',{date},{});}},tapName2:function(event){var self=this;var try3=new Array();var jianpan={};jianpan["select"]="";if(self.data.changeCap==2){try3=self._randArray(postList,1);jianpan['changeCap']=2;}else{try3=self._randArray(postList);jianpan['changeCap']=0;jianpan['jiaoti']=1;jianpan['green']=self.data.imgaddress+"shift.png";jianpan['cap']="";}
jianpan['postList1']=try3.slice(0,10);jianpan['postList2']=try3.slice(10,19);jianpan['postList3']=try3.slice(19,26);self.setData(jianpan);},tapName3:function(){var self=this;var jianpan={};var try3=new Array();jianpan["select"]="";try3=self._randArray(self.data.postListN1);if(dateType==1){jianpan['postListP1']=try3.slice(0,3);jianpan['postListP2']=try3.slice(3,6);jianpan['postListP3']=try3.slice(6,9);jianpan['postListP4']=try3.slice(9,10);self.setData(jianpan);}else{jianpan['postListN1']=try3;self.setData(jianpan);}},tapName5:function(){var self=this;var jianpan={};jianpan["select"]="";if(self.data.changeCap==2){jianpan['postList1']=self._upercase(self.data.postList1,1);jianpan['postList2']=self._upercase(self.data.postList2,1);jianpan['postList3']=self._upercase(self.data.postList3,1)
jianpan['changeCap']=2;}else{jianpan['postList1']=self._upercase(self.data.postList1);jianpan['postList2']=self._upercase(self.data.postList2);jianpan['postList3']=self._upercase(self.data.postList3)
jianpan['changeCap']=0;jianpan['jiaoti']=1;jianpan['green']=self.data.imgaddress+"shift.png";jianpan['cap']="";}
setTimeout(function(){self.setData(jianpan);},50);},CAP:function(e){var curTime=e.timeStamp;var lastTime=this.data.lastTapDiffTime;var jianpan={};var self=this;if(lastTime>0){if(curTime-lastTime<300){jianpan['postList1']=self._upercase(self.data.postList1,1);jianpan['postList2']=self._upercase(self.data.postList2,1);jianpan['postList3']=self._upercase(self.data.postList3,1)
jianpan['green']=self.data.imgaddress+"shift_DS.png";jianpan['cap']="cap";jianpan['jiaoti']=0;jianpan['changeCap']=2;}else{if(self.data.jiaoti==1){jianpan['postList1']=self._upercase(self.data.postList1,1);jianpan['postList2']=self._upercase(self.data.postList2,1);jianpan['postList3']=self._upercase(self.data.postList3,1)
jianpan['green']=this.data.imgaddress+"shift_D.png";jianpan['jiaoti']=0;jianpan['changeCap']=1;}else{jianpan['postList1']=self._upercase(self.data.postList1);jianpan['postList2']=self._upercase(self.data.postList2);jianpan['postList3']=self._upercase(self.data.postList3);jianpan['green']=this.data.imgaddress+"shift.png";jianpan['jiaoti']=1;jianpan['changeCap']=0;}
jianpan['cap']="";}}else{if(self.data.jiaoti==1){jianpan['postList1']=self._upercase(self.data.postList1,1);jianpan['postList2']=self._upercase(self.data.postList2,1);jianpan['postList3']=self._upercase(self.data.postList3,1)
jianpan['green']=self.data.imgaddress+"shift_D.png";jianpan['cap']="";jianpan['jiaoti']=0;jianpan['changeCap']=1;}else{jianpan['postList1']=self._upercase(self.data.postList1);jianpan['postList2']=self._upercase(self.data.postList2);jianpan['postList3']=self._upercase(self.data.postList3)
jianpan['green']=self.data.imgaddress+"shift.png";jianpan['cap']="";jianpan['jiaoti']=1;jianpan['changeCap']=0;}}
jianpan['lastTapDiffTime']=curTime;self.setData(jianpan);},delect:function(event){var self=this;var jianpan={};var date={};var kbvalue=self.data.kbvalue;if(self.data.kbvalue[BL.index]==undefined){kbvalue[BL.index]=[];}
kbvalue[BL.index].pop()
jianpan.kbvalue=kbvalue;BL.starstr[BL.index]=BL.starstr[BL.index].replace("|","");BL.starstr[BL.index]=BL.starstr[BL.index].substr(0,BL.starstr[BL.index].length-1);if(self.data.ifMapping==1){BL.mappingstr[BL.index]=BL.mappingstr[BL.index].substr(0,BL.mappingstr[BL.index].length-1);jianpan.mappingstr=BL.mappingstr;}
date.starstr=BL.starstr;if(dateType==0){jianpan['del']=self.data.imgaddress+"DEL_2.png";}else{jianpan['del']=self.data.imgaddress+"DEL_2.png";}
jianpan["select"]="del";date.delfn=[BL.index,BL.starstr[BL.index].length]
self.triggerEvent('microdoneevent',{date},{})
this.setData(jianpan);},undelect:function(){var self=this;var jianpan={};setTimeout(function(){if(dateType==0){jianpan['del']=self.data.imgaddress+"DEL.png";}else{jianpan['del']=self.data.imgaddress+"DEL.png";}
jianpan["select"]="";self.setData(jianpan);},30);},switch_N:function(){var jianpan={};jianpan['display1']="none";jianpan['display2']="block";jianpan['display3']="none";this.setData(jianpan);},switch_S:function(){var jianpan={};jianpan['display1']="none";jianpan['display2']="none";jianpan['display3']="block";this.setData(jianpan);},switch_C:function(){var jianpan={};jianpan['display1']="block";jianpan['display2']="none";jianpan['display3']="none";this.setData(jianpan);},tapspace:function(event){var jianpan={};if(this.data.pressStatus!=0){jianpan["select"]="space";}
this.setData(jianpan);},tapspace2:function(event){var jianpan={};jianpan["select"]="";this.setData(jianpan);},defaultfn:function(){}}})