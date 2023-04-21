<!--
 * @Date: 2018-11-30 13:33:44
 * @Author: 刘亚伟
 * @LastEditTime: 2019-02-20 15:16:00
 -->
<template>
<div class="zxrb_topic">
	<div class="box_top">
		<i class="iconfont icon-xiangzuo" @click="back_()"></i>
		<p>{{title.title}}</p>
	</div>
	<header>
		<h2>
			{{title.titleInfo}}
		</h2>
	</header>
	<div class="main_top">
		<div class="nav">
			<ul>
				<li 
					v-for="(item,index) in navItems" 
					:class="nav_index==index? 'li_click': ''"
					@click="nav_click(index)">
				{{item}}
				<!-- <span>3</span> -->
				</li>
			</ul>
		</div>
			<div class="list">
				<div class="list_info" v-for="(item,index) in items">
					<h3 @click="to_url(JSON.stringify(item.outlines)!=='[]'&&item.outlines!==undefined&&item.outlines[0].relationMethod!=='LINK'&&item.outlines[0].url!==''? item.outlines[0].url:item.url)">{{item.title}}</h3>
					<div v-if="JSON.stringify(item.outlines)!=='[]'&&item.outlines!==undefined" class="text" @click="to_url(item.outlines[0].url||item.url)">{{item.outlines[0].content}}</div>
					<!-- 时间 -->
					<div class="xianguan" v-if="JSON.stringify(item.outlines)!='[]'&&item.outlines!==undefined">
						<span>{{item.outlines[0].publishAt | to_date_}}</span>
					</div>
					<!-- 作者 -->
					<div class="zuoze_box" 
						 v-show="item.influenceIds!==undefined"
						 v-for="(yxitem,yxindex) in item.influences">
						<div class="zuoze">
							<div class="img_">
								<img
									src="../../static/zxrb/images/noimg_43.jpg"
									alt
								>
							</div>
							<div class="zuoze_name">{{yxitem.specialId ? yxitem.specialist.personName : '专家'}}</div>
              				<div class="zuoze_info">{{yxitem.specialId ? yxitem.specialist.company : '--'}} {{yxitem.specialId ? yxitem.specialist.jobs :''}}</div>
							<div class="clear_float"></div>
							<div class="zuoze_text" style="display: -webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:4;text-overflow: ellipsis;overflow: hidden;">
							{{yxitem.content}} <span data_show="show">...<a href="javascript:;">[展开]</a></span><p>[收起]</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="isload" @click="infinity()" v-show="isload">点击加载更多</div>
			<div class="nodata" v-show="nodata">
				<img src="../../static/zxrb/images/nodata2.png" alt="">
			</div>
			<div class="sk-circle login_" v-show="show">
				<div class="sk-circle1 sk-child"></div>
				<div class="sk-circle2 sk-child"></div>
				<div class="sk-circle3 sk-child"></div>
				<div class="sk-circle4 sk-child"></div>
				<div class="sk-circle5 sk-child"></div>
				<div class="sk-circle6 sk-child"></div>
				<div class="sk-circle7 sk-child"></div>
				<div class="sk-circle8 sk-child"></div>
				<div class="sk-circle9 sk-child"></div>
				<div class="sk-circle10 sk-child"></div>
				<div class="sk-circle11 sk-child"></div>
				<div class="sk-circle12 sk-child"></div>
			</div>
		<!-- 查看跟多 -->
		<div class="gengduo">
			<button @click="to_list()">查看更多话题 ></button>
		</div>
	</div>
</div>
</template>

<script>
import { textShow,to_date } from '../../lib/methods.js';
import { eventClientService } from '../../service/client/index.js';
export default {
	layout: 'zxrb',
	head: {
	  title: '知行日报',
	},
	data(){
		return {
			navItems:[
				'中央','部委','一行两会','地方政府','其他部门',
			],
			items:[],
			nav_index:0,
			show:false,
			nodata:false,
			isload:true,
			cp:1,
			title:{
				title:'',
				titleInfo:''
			}
		}
	},
	methods:{
		async getTitle(){
			var data={};
			data.name=this.$route.query.name;
			let info = await eventClientService.zxrbListId(data);
			if(info.message.code==0){
				this.title.title=info.data.list[0].name;
				this.title.titleInfo=info.data.list[0].brief;
			}else{
				Toast({
					message:'AjaxErr',
					duration:3000
				})
			}
		},
		async getData(){
			var data={};
			this.isload=false;
			data.cp=this.cp;
			data.ps=10;
			data.relatedTopics=this.$route.query.name;
			data.catogories=this.navItems[this.nav_index];
			let info = await eventClientService.zxrbIndex(data);
			if(info.message.code==0){
				this.cp++;
				if(this.items.length!==0){
					this.nodata=false;
				}else{
					this.nodata=true;
				}
				if(info.data.list==undefined){
					this.show=false;
					this.isload=false;
					return 
				}
				var arr=[];
				if(info.data.list.length!==0){
					this.items=[];
					arr=info.data.list[0];
					for( var i in arr){
						this.items.push(arr[i])
					}
					this.show=false;
					this.isload=true;
				}
				if(info.data.list.length<10){
					this.isload=false;
				}
				if(this.items.length!==0){
					this.nodata=false;
				}else{
					this.nodata=true;
				}
			}
			setTimeout(function(){
				textShow($('.zuoze_text'))
			},100);
		},
		nav_click(index){
			this.nav_index=index;
		},
		to_url(url){
			if(url==''){return};
			this.$router.push({
				path:'url',
				query:{
					url
				}
			})
		},
		to_list(){
			this.$router.push({
				path:'list'
			})
		},
		back_(){
			window.history.go(-1);
		},
		infinity(){
			this.getData();
		}
	},
	mounted() {
		var this_=this;
		this.nav_index=this.navItems.indexOf(this.$route.query.index);
		this.getTitle();
		this.getData();
		$(window).scroll(function(){
			if($(window).scrollTop()>=$('header').height()-$('.box_top').height()){
				$('.box_top').addClass('img_url');
				$('.nav').css({
					'position':'fixed',
					'top':'2.05926rem'
				})
			}else{
				$('.nav').css({
					'position':'absolute',
					'top':'0rem'
				})
				$('.box_top').removeClass('img_url')
			}
		// var list=$('.main_top').height();
		// var scroll_height_=$('.main_top').offset().top-($(window).scrollTop()+$(window).height());
		// console.log(list+scroll_height_)
		// if(list+scroll_height_<=0){
		// 	if(!this_.isload){return};
		// 	this_.getData()
		// }
		});
	},
	watch:{
		nav_index:function(val){
			this.cp=1;
			this.items=[];
			this.show=true;
			this.nodata=false;
			this.getData();
			if(this.nav_index==4){
				$('.nav').get(0).scrollLeft=200;
			}else{
				$('.nav').get(0).scrollLeft=0;
			}
		}
	},
	filters:{
		to_date_(val){
			return to_date(val); 
		}
	}
}
</script>

<style scoped src="../../static/zxrb/css/topic.css"></style>