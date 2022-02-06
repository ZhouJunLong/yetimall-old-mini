<template>
	<view class="wrap">
		<!-- 轮播图 -->
		<view class="slide-area">
			<swiper indicator-dots="true" autoplay="true" interval="3000" circular="true" indicator-active-color="#7E888C" indicator-color="#DAE0E3">
				<block v-for="item in recommond.slideList">
					<swiper-item>
						<image mode="widthFix" :src="base_url + item"></image>
					</swiper-item>
				</block>
			</swiper>
		</view>
		<view class="bottom-area">
			<view class="options">
				<button open-type="share" class="forward">
					<i class="iconfont icon-fenxiang"></i>
					<text>{{recommond.forward}}</text>
				</button>
				<view class="points" @click="addPoint">
					<i class="iconfont icon-dianzan" v-if="type == 0"></i>
					<i class="iconfont icon-yidianzan" v-else></i>
					<text v-if="count">{{count}}</text>
					<text v-else>0</text>
				</view>
			</view>
			<view class="title">{{recommond.title}}</view>
			<view class="second-title"><image src="../../static/images/recommendImg.png"></image>碟片名称</view>
			<view class="text-brief"><text class="brand">{{recommond.brand}}</text><text class="name">{{recommond.name}}</text></view>
			<view class="context-title"><i class="iconfont icon-icon_xiaolian-mian"></i>使用感受</view>
			<view class="detail">
				<rich-text type="text" :nodes="recommond.context" ></rich-text>
			</view>
			<view class="goods" @click="goGoodDetail(recommond.thing_id)">
				<image class="goods-image" :src="base_url + brand_img"></image>
				<text class="goods-name">{{recommond.goods_name}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import CONFIG from '../../common/config.js';
	import tools from '../../common/tools.js';
	var base_url = CONFIG.BASE_URL;
	var userInfo = "";
	var cityInfo = "";
	var did = 0;
	
	export default {
		data() {
			return {
				base_url: base_url,//BASE_URL
				userInfo: [],//用户信息
				cityList: [],//城市列表
				cityInfo: [],//用户城市信息
				slideList: [],//轮播图列表
				cateList: [],//分类列表
				assemble_png: base_url+'bg/assemble.png',
				more:'static/images/MORE.png',
				recommond: [],//推荐商品列表
				tagList: [],//tag列表
				logo_png: base_url+'bg/logo.png',
				city_show: false,//是否显示城市选择
				tid:0,
				count:0,
				type:0,
				brand_img:'',
			}
		},
		onLoad(options) {
			var that = this;
	
			//判断用户是否通过推广而来
			if (options.user_id) {
				did = options.user_id;
				uni.setStorageSync("did", did);
			}
			let tid = options.tid ? options.tid : 7;
			that.tid = tid;
			that.getrecommond(tid);
			//用户缓存信息
			userInfo = uni.getStorageSync("userInfo");
			that.language = uni.getStorageSync("language");
		
			//获取用户信息
			that.findIsPoint();
			//分享朋友圈（小程序）
			// uni.showShareMenu({
			// 	withShareTicket: true,
			// 	menus: ['shareAppMessage', 'shareTimeline']
			// });
		},
		onShow() {
			var that = this;
	
			//用户缓存信息
			userInfo = uni.getStorageSync("userInfo");
			that.language = uni.getStorageSync("language");
			//获取用户信息
			that.findIsPoint();
		},
		//分享好友（小程序）
		onShareAppMessage(res) {
			var that = this;
		    if (res.from === 'button') {// 来自页面内分享按钮
				//console.log(res.target)
		    }
			var title = "韩国Yetimall官方商城";
			var tid = that.tid;
			that.updateRecommend();
		    return {
				title: title,
				path: '/pages/recommond/recommondDetail?tid='+tid
		    }
			return false;
		},
		//分享朋友圈（小程序）
		onShareTimeline: function () {
		    var that = this;
			var title = "韩国Yetimall官方商城";
		    var user_id = userInfo.id;
		    return {
				title: title,
				query: {
					'user_id': user_id
				}
		    }
		},
		methods: {
			//获取用户信息
			getUserInfo:function(){
				var that = this;
				tools.httpClient('home/WxStore/getUserInfo', {'user_id': userInfo.id}, (error, result) => {
					if (result.errorCode == 0) {
						var userData = result.data;
						userInfo = userData;
						that.userInfo = userData;
					}
				})
			},
			//添加\取消点赞
			addPoint:function(){
				var that  = this;
				if(userInfo.id){
					
				}else{
					uni.showToast({
						title:'请完善信息！',
						icon:'none',
						duration:2000
					})
					return false;
				}
				var tid = that.tid;
				var type = that.type;
				tools.httpClient('home/WxStore/addPoint', {user_id:userInfo.id,tid:tid,type:type}, (error, result) => {
					console.log(result);
					if (result.errorCode == 0) {
						// uni.navigateTo({
						// 	url:'/pages/store/goodsDetail/goodsDetail?gid='+gid
						// })
						if(type == 1){
							that.type = 0;
							that.count--;
						}else{
							that.type = 1;
							that.count++;
						}
					}
				})
			},
			//获取推荐详情
			getrecommond: function(id) {
				var that = this;
				tools.httpClient('home/WxStore/getrecommond', {id:id}, (error, result) => {
					console.log(result);
					if (result.errorCode == 0) {
						var recommondData = result.data;
						that.recommond = recommondData;
						that.count = result.data.count;
						that.brand_img = result.data.brand_img;
					}
				});
			},
			//每次转发，转发数加一
			updateRecommend:function(){
				// console.log('222222222');
				var that = this;
				var tid = that.tid;
				var forward = that.recommond.forward + 1;
				that.recommond.forward = forward;
				tools.httpClient('home/WxStore/updateRecommend', {tid:tid,forward:forward}, (error, result) => {
					// console.log(result);
					if (result.errorCode == 0) {
						tools.httpClient('home/WxStore/addForwardRecord', {user_id:userInfo.id, uname:userInfo.account,text_title:that.recommond.title,tid:tid}, (error, result) => {
							console.log(result);
						});
					}
				});
			},
			goGoodDetail:function(id){
				if(id){
					uni.navigateTo({
						url: '/pages/store/goodsDetail/goodsDetail?gid=' + id
					})
				}
			},
			findIsPoint:function(){
				var that  = this;
				if(userInfo.id){
					
				}else{
					uni.showToast({
						title:'请完善用户信息！',
						icon:'none',
						duration:2000
					})
					return false;
				}
				var tid = that.tid;
				var type = that.type;
				tools.httpClient('home/WxStore/findIsPoint', {user_id:userInfo.id,tid:tid}, (error, result) => {
					// console.log(result);
					if (result.errorCode == 0) {
						if(result.data.is_on){
							that.type = 1;
						}else{
							that.type = 0;
						}
					}else{
						that.type = 0;
					}
				})
			}
		}
	}
</script>

<style>
	@import url("./recommondDetail.css");
</style>
