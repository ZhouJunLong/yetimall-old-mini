<template>
	<view class="wrap">
		<!-- 搜索框 -->
		<view class="search-area">
			<view class="search-list">
				<view class="search-info">
					<text class="iconfont icon-sousuo"></text>
					<input type="text" class="inp" placeholder="输入关键词进行搜索" placeholder-style="color:#999;font-size:13px;" @input="getName" />
				</view>
				<view class="search-right" @click="seachGoods">搜索</view>
			</view>
		</view>
		<view class="good-area" v-if="list.length > 0">
			<block v-for="(item, index) in list">
				<view class="good-list" @click="goodDetail" :data-id="item.id">
					<image class="good-img" :src="base_url+item.img_url"></image>
					<view class="good-info">
						<view class="name">{{item.name}}</view>
						<view class="price-area">
							<image :src="tip_png" class="tip-img"></image>
							<view class="price-info">
								<text class="unit">￥</text>
								<text class="price">{{item.assemble_price_text}}</text>
								<text class="begin">起</text>
							</view>
							<view class="ori-price-info">
								<text>原价</text>
								<text class="ori-price">￥{{item.ori_price_text}}</text>
							</view>
						</view>
						<view class="people-area space-between">
							<view class="team-num space-between-item flex-row">
								<text class="iconfont icon-tuandui flex-row-item"></text>
								<text class="team-num-value flex-row-item">{{item.team_num}}</text>
								<text class="flex-row-item">人团</text>
							</view>
							<view class="buy-btn space-between-item">去拼团</view>
						</view>
						
					</view>
				</view>
			</block>
		</view>
		<view class="good-area" v-else>
			<view class="no-more">暂无数据</view>
		</view>
	</view>
</template>

<script>
	import CONFIG from '../../../common/config.js';
	import tools from '../../../common/tools.js';  
	var base_url = CONFIG.BASE_URL;
	var userInfo = "";
	var cityInfo = "";
	var did = 0;
	
	//分页信息
	var page = 1;
	var pageSize = 10;
	var allPages = 0;
	
	//加载数据
	var GetList = function (that, orbottom) {
		//显示加载中
		uni.showLoading({
			title: '加载中',
		});
		//data数据
		var data = {
			pageIndex: page,
			pageSize: pageSize,
			name: that.name,
			city_id: cityInfo.id?cityInfo.id:0,
		}
		//请求数据
		tools.httpClient('home/WxStore/pagingAssembleGood', data, (error, res) => {
			//console.log(res);
			if (res.errorCode == 0) {
				//隐藏加载中
				uni.hideLoading();
		
				var data = res.data;
				var dataList = data.dataList;
				allPages = data.pageInfo.all_pages;
				var total_count = data.pageInfo.total_count;
		
				//是否下拉触底
				var list = orbottom == 1 ? that.list : [];
		
				//for循环数据
				for (var i = 0; i < dataList.length; i++) {
					//处理价格显示
					dataList[i]['assemble_price_text'] = parseInt(dataList[i]['assemble_price']);
					dataList[i]['ori_price_text'] = parseInt(dataList[i]['ori_price']);
					list.push(dataList[i]);
				}
				//渲染页面数据
				that.list = list;
				page++;
				//设置无内容
				if (total_count == 0) {
					that.no_content = true;
				} else {
					that.no_content = false;
				}
			}
		})
	}
	
	export default {
		data() {
			return {
				base_url: base_url,//BASE_URL
				userInfo: [],//用户信息
				cityInfo: [],//用户城市信息
				tip_png: base_url+'bg/tip.png',//拼团图片
				name: '',//商品名称
				list: [],//列表
				no_content: false,//无内容是否显示
			}
		},
		onLoad(options) {
			var that = this;
			
			//用户缓存信息
			userInfo = uni.getStorageSync("userInfo");
			
			//获取用户信息
			that.getUserInfo();
			
			//用户城市信息
			cityInfo = uni.getStorageSync('cityInfo');
			if(cityInfo){
				that.cityInfo = cityInfo;
			}
			
			//加载分页信息
			page = 1;
			allPages = 0;
			that.list = [];
			GetList(that, 0);
			
			//分享朋友圈（小程序）
			uni.showShareMenu({
				withShareTicket: true,
				menus: ['shareAppMessage', 'shareTimeline']
			});
		},
		onShow() {
			var that = this;
			
			//用户缓存信息
			userInfo = uni.getStorageSync("userInfo");
			
			//获取用户信息
			that.getUserInfo();
		},
		//分享好友（小程序）
		onShareAppMessage(res) {
			var that = this;
		    if (res.from === 'button') {// 来自页面内分享按钮
				//console.log(res.target)
		    }
			var title = "勤家速达";
			var user_id = userInfo.id;
		    return {
				title: title,
				path: '/pages/assemble/index?user_id='+user_id
		    }
		},
		//分享朋友圈（小程序）
		onShareTimeline: function () {
		    var that = this;
			var title = "勤家速达";
		    var user_id = userInfo.id;
		    return {
				title: title,
				query: {
					'user_id': user_id
				}
		    }
		},
		onUnload: function () {
		    var that = this;
		    //初始化参数
		    page = 1;
		    pageSize = 10;
		    allPages = 0;
			that.list = [];
		},
		onReachBottom: function () {
		    var that = this;
		    if (page > allPages) {
				return false;
		    } else {
				GetList(that, 1);
		    }
		},
		methods: {
			//获取用户信息
			getUserInfo:function(){
				var that = this;
				tools.httpClient('home/WxStore/getUserInfo', {'user_id': userInfo.id}, (error, result) => {
					if (result.errorCode == 0) {
						var userInfo = result.data;
						that.userInfo = userInfo;
					}
				})
			},
			
			//输入关键词
			getName:function(e){
				var that = this;
				var name = e.detail.value;
				that.name = name;
			},
			
			//搜索商品
			seachGoods:function(e){
				var that = this;
				//重新加载分页信息
				page = 1;
				that.list = [];
				GetList(that, 0);
			},
			
			//商品详情
			goodDetail:function(e){
				var id = e.currentTarget.dataset.id;
				if(id){
					uni.navigateTo({
						url:'/pages/assemble/goodDetail/goodDetail?id='+id
					})
				}
			},
			
			
		}
	}
</script>

<style>
	@import url("./index.css");
</style>
