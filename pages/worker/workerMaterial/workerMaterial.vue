<template>
	<view class="wrap">
		<view class="tab-area">
			<view :class="[cur == 1 ? 'tab-list  cur':'tab-list']" data-cur="1" @click="changeInterface">申请界面</view>
			<view :class="[cur == 2 ? 'tab-list  cur':'tab-list']" data-cur="2" @click="changeInterface">申请进度</view>
		</view>
		<view class="order-area" v-if="cur == 1">
			<view class="order-list">
				<view class="order" v-for="(item,index) in list">
					<view class="left">
						<view class="name">{{item.name}}</view>
					</view>
					<view class="right">
						<view class="add" @click="add" :data-count="item.count" :data-index="index"><text class="iconfont icon-hao"></text></view>
						<view class="num">{{item.count}}</view>
						<view class="add" @click="reduce" :data-count="item.count" :data-index="index"><text class="iconfont icon--hao"></text></view>
					</view>
				</view>
			</view>
			<view class="content-area">
				<textarea class="content" @input="getContent" placeholder="在此输入申请物料理由" placeholder-style="color:#999;font-size:13px;" v-model="desc"></textarea>
			</view>
			<!-- 提交 -->
			<view class="btn-area">
				<view class="submit" @click="submit">确定</view>
			</view>
		</view>
		<view class="apply-area" v-if="cur == 2">
			<view class="apply-list" v-for="(item,index) in applyList">
				<view class="header">
					<view class="left">申请时间： {{item.add_time}}</view>
					<view v-if="item.examine == 0">
						<view class="right on">待审核</view>
					</view>
					<view v-if="item.examine == 1">
						<view class="right in">已通过</view>
					</view>
					<view v-if="item.examine == 2">
						<view class="right cur">未通过</view>
					</view>
				</view>
				<view class="center">
					<view class="date">{{item.material}}</view>
					<view class="reason-area">
						<view class="title">申请理由：</view>
						<view class="reason">{{item.content}}</view>
					</view>
					<view class="failed-area" v-if="item.examine == 2">
						<view class="title">原因：</view>
						<view class="reason">{{item.reason}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import CONFIG from '../../../common/config.js';
	import tools from '../../../common/tools.js';  
	var app = getApp();
	var userInfo = "";
	var base_url = CONFIG.BASE_URL;
	var page = 1;
	var applyPage = 1;
	var applyPageSize = 10;
	var pageSize = 10;
	var allPages = 0;
	var bStop = true;
	var is_click = true;
	
	//页面初始化数据
	var pagingMaterial = function(that) {
		var cData = {
			pageIndex:page,
			pageSize:pageSize
		};
		uni.showLoading({
			title:'加载中'
		});
		tools.httpClient('home/WxStore/pagingMaterial',cData, (error, data) => {
			uni.hideLoading();
			bStop = true;
			var res = data;
			var data = data.data;
			var list = that.list;
			//console.log('结果集', list);
			//成功查询到结果集
			if (res.errorCode == 0) { //查询成功
				for (var i = 0; i < data.dataList.length; i++) {
					list.push(data.dataList[i]);
				}
				allPages = data.pageInfo.all_pages;
			}
			that.list = list;
			page++;
		});
	}
	//申请记录数据
	var pagingMaterialApply = function(that) {
		var cData = {
			pageIndex:applyPage,
			pageSize:applyPageSize,
			worker_id:userInfo.worker_id
		};
		uni.showLoading({
			title:'加载中'
		});
		tools.httpClient('home/WxStore/pagingMaterialApply',cData, (error, data) => {
			uni.hideLoading();
			bStop = true;
			var res = data;
			var data = data.data;
			var applyList = that.applyList;
			//成功查询到结果集
			if (res.errorCode == 0) { //查询成功
				for (var i = 0; i < data.dataList.length; i++) {
					applyList.push(data.dataList[i]);
				}
				allPages = data.pageInfo.all_pages;
			}
			that.applyList = applyList;
			page++;
		});
	}
	export default {
		data() {
			return {
				base_url: base_url,//BASE_URL
				userInfo: [],//用户信息
				list:[],
				applyList:[],
				cur :1,
				desc:'',
				content:'',
			}
		},
		onLoad(options) {
			
		},
		onShow() {
			var that = this;
			
			//用户缓存信息
			userInfo = uni.getStorageSync("userInfo");
			
			//获取用户信息
			that.getUserInfo();
			
			//获取分页信息
			page = 1;
			that.list = [];
			pagingMaterial(that);
		},
		methods: {
			//获取用户信息
			getUserInfo:function(){
				var that = this;
				tools.httpClient('home/WxStore/getUserInfo', {'user_id':userInfo.id}, (error, result) => {
					if (result.errorCode == 0) {
						var userData = result.data;
						userInfo = userData;
						that.userInfo = userData;
					}
				})
			},
			
			//切换界面
			changeInterface:function(e){
				var that = this;
				var cur = e.currentTarget.dataset.cur;
				if(cur == 2){
					applyPage = 1;
					that.applyList = [];
					pagingMaterialApply(that);
				}
				that.cur = cur;
			},
			
			//增加数量
			add:function(e){
				var that = this;
				var index = e.currentTarget.dataset.index;
				var list = that.list;
				var count = parseInt(e.currentTarget.dataset.count) + 1;
				if(count > list[index].inventory){
					uni.showToast({
						icon:'none',
						title:'库存不足',
						duration:2000
					})
					return false;
				}
				list[index].count = count;
				that.list = list;
			},
			
			//减少数量
			reduce:function(e){
				var that = this;
				var index = e.currentTarget.dataset.index;
				var list = that.list;
				var count = parseInt(e.currentTarget.dataset.count) - 1;
				if(count < 0){
					uni.showToast({
						icon:'none',
						title:'数量要大于0',
						duration:2000
					})
					return false;
				}
				list[index].count = count;
				that.list = list;
			},
			
			//获取理由
			getContent:function(){
				var that = this;
				var content = that.desc;
				that.content = content;
			},
			
			//提交
			submit:function(e){
				var that = this;
				//判断用户授权
				if(!tools.isWeixinLogin()){
					return false;
				}
				var list = that.list;
				var content = that.content;
				if(content == '' || content == null){
					uni.showToast({
						title:'请输入理由',
						icon:'none',
						duration:2000
					})
					return false;
				}
				var array = [];
				for (var i = 0; i < list.length; i++) {
					if(list[i]['count'] > 0){
						array.push(list[i]);
					}
				}
				var data = {
					material:JSON.stringify(array),
					content:that.content,
					worker_id:userInfo.worker_id
				};
				tools.httpClient("home/WxStore/addMaterialApply",data,function(err,res){
					if(res.errorCode==0){
						uni.showToast({
							title:'提交成功,等待后台审核!',
							icon:'success',
							success:function(){
								setTimeout(function(){
									uni.navigateBack();
								},1500)
							}
						})
					}else{
						uni.showToast({
							title:res.errorInfo,
							icon:'none',
							duration:2000
						})
					}
				})
			},
		}
	}
</script>

<style>
	@import url("./workerMaterial.css");
	@import url("/app.css");
</style>
