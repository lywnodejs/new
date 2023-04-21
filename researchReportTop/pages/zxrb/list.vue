<!--
 * @Date: 2018-12-05 09:16:50
 * @Author: 刘亚伟
 * @LastEditTime: 2019-02-20 14:36:26
 -->
<template>
<div class="zxrb_list">
	<header>
		<i class="iconfont icon-xiangzuo" @click="back_()"></i>
		<p>全部话题</p>
	</header>
	<main>
		<div class="list" v-for="(item,index) in items" @click="to_list(item)">
			<dl>
				<dt><img :src="item.picUrl" alt=""></dt>
				<dd>{{item.name}}</dd>
				<p style="display: -webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;">{{item.brief}}</p>
				<i class="iconfont icon-chevron-thin-right"></i>
			</dl>
		</div>
	</main>
</div>
</template>

<script>
var items=[];
import { eventClientService } from '../../service/client/index.js';
export default {
	layout: 'zxrb',
	head: {
	  title: '知行日报',
	},
	data(){
		return {
			items:[]
		}
	},
	methods:{
		async getData(){
			if(items.length!==0){
				this.items=items;
				return;
			}
			var data={};
			data.cp=1;
			data.ps=50;
			let info = await eventClientService.zxrbList(data);
			if(info.message.code==0){
				this.items=info.data.list;
				items=info.data.list;
			}else{
				Toast({
					message:'AjaxErr',
					duration:3000
				})
			}
		},
		back_(){
			window.history.go(-1);
		},
		to_list(item){
			this.$router.push({
				path:'topic',
				query:{
					name:item.name,
					index:'中央'
				}
			})
		}
	},
	created() {
		this.getData();
	},
}
</script>

<style scoped src="../../static/zxrb/css/list.css"></style>