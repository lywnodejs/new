import  '../css/main.css';
import '../css/index.less';
import laro from './laro/laro.js';
import $ from 'jquery';
import jQuery from 'jquery';
const App=function(){
    $('#app').html(laro().tpl);
} 
new App();