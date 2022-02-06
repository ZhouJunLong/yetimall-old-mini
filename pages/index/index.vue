<template>
	<view class="wrap">
		<!-- head -->
		<view class="head">
			<!-- <image class="back-img" src="../../static/images/phone2.png"></image> -->
			<view class="head-bar">
				<view class="head-image">
				<!-- <image class="chinese" src="../../static/images/chinese.png" @click="changLanguage(1)"></image>
				<image class="korea" src="../../static/images/korea.png" @click="changLanguage(0)"></image> -->
				</view>
				<view class="title">Yetimall</view>
			</view>
			<view class="head-bottom">
				<view class="head-bottom-input">
					<text class="iconfont icon-sousuo"></text>
					<input type="text" @click="toCate" placeholder="검색 내용 입력" placeholder-style="color: rgba(255, 255, 255, 75);font-size: 24rpx;" v-if="language == 0"/>
					<input type="text" @click="toCate" placeholder="请输入搜索内容" placeholder-style="color: #313636;font-size: 24rpx;" v-else/>
					
				</view>
					<text class="all-category" @click="toCate" v-if="language == 0">ALL취소 하 다.</text>
					<text class="all-category" @click="toCate" v-else>ALL分类</text>
			</view>
		</view>
		<view class="head-box">
			<!-- <image class="head-box-img" src="../../static/images/phone1.png"></image> -->
			<!--滑块视图-->
			<swiper indicator-dots="true" autoplay="true" interval="3000" circular="true" indicator-color="#848ae8" indicator-active-color="#ffffff">
				<block v-for="(item, index) in slideList">
					<swiper-item>
						<image :src="base_url+item.img_url" @click="goGoodsDetail(item.h5_url)"></image>
					</swiper-item>
				</block>
			</swiper>
		</view>
		<!-- 主区域 -->
		<view class="main-area">
			<!-- 分类列表 -->
			<view class="menu-area">
				<block v-for="(item, index) in cateList">
					<view class="menu-list" @click="cate(item.id)">
						<image class="menu-img" :src="base_url+item.icon"></image>
						<view class="menu-name">{{item.name}}</view>
					</view>
				</block>
				<!-- <view class="menu-list" @click="toCate">
					<image class="menu-img" :src="base_url+more"></image>
					<view class="menu-name" v-if="language == 0">훨씬</view>
					<view class="menu-name" v-else>更多</view>
				</view> -->
			</view>
		</view>
		<!-- 底部区域 -->
		<view class="bottom-area">
			<!-- 热销品类 -->
			<!-- <view class="menu-hotsale">
				<view class="menu-hotsale-title">精品推荐</view>
				<view class="tip1">全场超过500款优质产品任选，都是最低价</view>
				<view class="bottom-inner">
					<view class="tip2">全场最低价   保障全新正品</view>
					<view class="img">
						<image src="../../static/images/head_img.png"></image>
					</view>
					<view class="tip3"><text></text></view>
					<view class="tip4">爆款推荐更优惠</view>
				</view>
			</view> -->
			<image :src="base_url+index_img"></image>
		</view>
		<!-- 推荐商品 -->
		<!-- <block v-if="is_closecate == 0"> -->
		<view class="menu-commond menu-about">
			<view class="menu-commond-list">
				<block v-for="(item, index) in commondList">
					<view class="menu-commond-item1" v-if="index == 0">
						<view class="item1-left"><image :src="base_url+item.img_url" @click="goodsDetail(item.id)"></image></view>
						<view class="item1-right" @click="goodsDetail(item.id)">
							<view class="goods-title">{{item.simple_desc}}</view>
							<view class="bottom">
								<view class="price">￥<text>{{item.price}}</text></view>
								<view class="sale">
									<text v-if="language == 0">{{item.sale}}이미 구 매</text>
									<text v-else>已售{{item.sale}}件</text>
									<i class="iconfont icon-shoucang1"></i>
								</view>
							</view>
						</view>
					</view>
					<view class="menu-commond-item2" v-else-if="index == 1">
						<view class="item2-left" @click="goodsDetail(item.id)">
							<view class="goods-title">{{item.simple_desc}}</view>
							<view class="bottom">
								<view class="price">￥<text>{{item.price}}</text></view>
								<view class="sale">
									<text v-if="language == 0">{{item.sale}}이미 구 매</text>
									<text v-else>已售{{item.sale}}件</text>
									<i class="iconfont icon-shoucang1"></i>
								</view>
							</view>
						</view>
						<view class="item2-right"><image :src="base_url+item.img_url" @click="goodsDetail(item.id)"></image></view>
					</view>
					<view class="menu-commond-item" v-else @click="goodsDetail(item.id)">
						<view class="item-img"><image :src="base_url+item.img_url" @tap.stop="goodsDetail(item.id)"></image></view>
						<view class="item-goods-title">{{item.simple_desc}}</view>
						<view class="item-bottom">
							<view class="price">￥<text>{{item.price}}</text></view>
							<view class="sale">
								<text v-if="language == 0">{{item.sale}}이미 구 매</text>
								<text v-else>已售{{item.sale}}件</text>
								<i class="iconfont icon-shoucang1"></i>
							</view>
						</view>
					</view>
				</block>
			</view>
		</view>
		<!-- </block>
		<block v-else>
		<view class="menu-commond-list">
				<view class="menu-commond-item1">
					<view class="item1-left"><image :src="base_url+'upload/image/store/goods/20211212/2cb5e5180aa29627b9bdaacdde6d1dae.png'" @click="goodsDetail(2)"></image></view>
					<view class="item1-right" @click="goodsDetail(2)">
						<view class="goods-title">联名纸巾</view>
						<view class="bottom">
							<view class="price">￥<text>10</text></view>
							<view class="sale">
								<text>已售10件</text>
								<i class="iconfont icon-shoucang1"></i>
							</view>
						</view>
					</view>
				</view>
				<view class="menu-commond-item2">
					<view class="item2-left" @click="goodsDetail(10)">
						<view class="goods-title">联名抽纸盒</view>
						<view class="bottom">
							<view class="price">￥<text>20</text></view>
							<view class="sale">
								<text>已售10件</text>
								<i class="iconfont icon-shoucang1"></i>
							</view>
						</view>
					</view>
					<view class="item2-right"><image :src="base_url+'upload/image/store/goods/20211212/b4a67a9c5e4e5b62cc4a1e444815be07.png'" @click="goodsDetail(10)"></image></view>
				</view>
		</view>
		</block> -->
		<!-- 遮罩层 -->
		<view class="shade" catchtouchmove="false" v-if="city_show" @click="shadeHide"></view>
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
				commondList: [],//推荐商品列表
				tagList: [],//tag列表
				logo_png: base_url+'bg/logo.png',
				city_show: false,//是否显示城市选择
				language:1,// 1 中文 ，0韩文
				index_img:'',
				is_closecate:0,
			}
		},
		onLoad(options) {
			var that = this;

			//判断用户是否通过推广而来
			if (options.user_id) {
				did = options.user_id;
				uni.setStorageSync("did", did);
			}

			//用户缓存信息
			that.language = uni.getStorageSync("language");
			if(that.language != ''){
				
			}else{
				if(that.language == 0){
					
				}else{
					uni.setStorageSync('language',1);
				}
			}
			that.language = uni.getStorageSync("language");
			// console.log(that.language);
			//获取用户信息
			// that.getUserInfo();
			
			//获取轮播图列表
			that.getSlideList();
			
			//获取分类列表
			that.getCateList();

			//获取城市列表
			that.getcommondList();
			
			//获取配置信息
			that.getConfigInfo();

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
			if(that.language != ''){
				
			}else{
				if(that.language == "0"){
					
				}else{
					uni.setStorageSync('language',1);
				}
			}
			that.language = uni.getStorageSync("language");
			
			//获取配置信息
			that.getConfigInfo();
			//获取用户信息
			// that.getUserInfo();
		},
		//分享好友（小程序）
		onShareAppMessage(res) {
			var that = this;
		    if (res.from === 'button') {// 来自页面内分享按钮
				//console.log(res.target)
		    }
			var title = "韩国Yetimall官方商城";
			var user_id = userInfo.id;
		    return {
				title: title,
				path: '/pages/index/index?user_id='+user_id
		    }
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
			toCate: function(){
				uni.navigateTo({
					url:'/pages/store/cate/cate'
				})
			},
			//获取轮播图列表
			getSlideList: function() {
				var that = this;
				tools.httpClient('home/WxStore/getSlideList', {}, (error, result) => {
					// console.log(result);
					if (result.errorCode == 0) {
						var slideData = result.data;
						that.slideList = slideData;
					}else{
						that.slideList = [];
					}
				});
			},
			
			//获取配置信息
			getConfigInfo:function(){
				var that = this;
				tools.httpClient('home/WxStore/getConfigInfo', {}, (error, res) => {
					if (res.errorCode == 0) {
						that.configInfo = res.data;
						that.index_img = res.data.index_img;
						that.is_closecate = res.data.is_closecate;
						// console.log(that.is_closecate)
						// console.log(that.configInfo)
					}
				})
			},

			//获取分类列表
			getCateList: function() {
				var that = this;
				tools.httpClient('home/WxStore/getWechatCateList', {}, (error, res) => {
					console.log(res);
					if (res.errorCode == 0) {
						var cateData = res.data;
						// 只获取前七个
						if(cateData.length > 7){
							var arr = [] ;
							for(var i = 0 ; i < 7;i++){
								arr.push(cateData[i]);
							}
							that.cateList = arr;
						}else{
							that.cateList = cateData;
						}
							
					}
				});
			},

			//获取推荐商品列表
			getcommondList: function() {
				var that = this;
				tools.httpClient('home/WxStore/getWechatcommondList', {}, (error, result) => {
					console.log(result);
					if (result.errorCode == 0) {
						var commondData = result.data;
						that.commondList = commondData;
					}
				});
			},
			//隐藏shade
			shadeHide:function(){
				var that = this;
				that.city_show = false;
			},

			//分类
			cate:function(id){
				if(id){
					uni.reLaunch({
						url:'/pages/store/cate/cate?cate_id='+id
					})
				}
			},
			
			goGoodsDetail:function(id){
				//判断用户授权
				if(!tools.isWeixinLogin()){
					return false;
				}
				if(id){
					uni.navigateTo({
						url: '/pages/store/goodsDetail/goodsDetail?gid=' + id
					})
				}
			},
			
			//切换语言
			changLanguage:function(type){
				var that =this;
				that.language = type;
				uni.setStorageSync('language',type);
				return false;
			},

			//商品详情
			goodsDetail: function(id) {
				//判断用户授权
				if(!tools.isWeixinLogin()){
					return false;
				}
				if(id){
					uni.navigateTo({
						url: '/pages/store/goodsDetail/goodsDetail?gid=' + id
					})
				}
			},
		}
	}
</script>

<style>
	@import url("./index.css");
</style>
