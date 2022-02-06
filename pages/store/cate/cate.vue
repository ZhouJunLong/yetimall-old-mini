<template>
	<view class="wrap">
		<!-- 搜索区域 -->
		<view class="search-area">
			<text class="iconfont icon-sousuo"></text>
			<input type="text" placeholder="请输入搜索内容" @confirm="getKeywords" confirm-type="搜索"/>
		</view>
		<!-- 分类区域 -->
		<view class="main-area">
			<!-- 分类列表 -->
			<view class="main-left">
				<scroll-view scroll-y class="cate-fir" :style="style_height">
					<block v-for="(item, index) in cateList">
						<view :class="[cid == item.id ? 'fir-list cur':'fir-list']" @click="selectFirCate(item.id, item.img_url, item.goods_id)">
							<text class="left-border"></text><text>{{item.name}}</text>
						</view>
					</block>
				</scroll-view>
			</view>
			<!-- 分类下商品列表 -->
			<view class="main-right">
				<scroll-view scroll-y class="cate-snd" :style="style_height">
					<image class="fir-img" mode="widthFix" :src="base_url+cate_img_url" @click="goodsDetail(cate_gid)" v-if="cate_img_url"></image>
					<view class="snd-area" v-if="goodsList.length > 0">
						<block v-for="(item, index) in goodsList">
							<view class="cate-list space-between" @click="goodsDetail(item.id)">
								<view class="good-image space-between-item">
									<image mode="widthFix" :src="base_url+item.img_url"></image>
								</view>
								<view class="good-right space-between-item">
									<view class="good-name">{{item.simple_desc}}</view>
									<view class="price-buy space-between">
										<view class="price-area space-between-item">
											<text class="unit">￥</text>
											<text class="price">{{item.price}}</text>
										</view>
										<view class="bottom-right">
											<text class="sale">已售{{item.sale}}件</text>
											<text class="iconfont icon-shoucang" v-if="item.is_like"></text>
											<text class="iconfont icon-shoucang1" v-else></text>
											</view>
									</view>
								</view>
							</view>
						</block>
					</view>
					<view class="snd-area" v-else>
						<view class="no-more">暂无数据</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	import CONFIG from '../../../common/config.js';
	import tools from '../../../common/tools.js';  
	var base_url = CONFIG.BASE_URL;
	var userInfo = "";
	var did = 0;
	
	export default {
		data() {
			return {
				base_url: base_url,//BASE_URL
				cateList: [],//分类列表
				cid: 0,//分类id
				cate_img_url: '',//分类主图
				cate_gid: 0,//分类商品id
				style_height: '',//高度
				goodsList: [],//商品列表
				keyword:'',//搜索关键字
			}
		},
		onLoad(options) {
			var that = this;
			
			//页面携带参数
			if(options.cate_id){
				var cid = options.cate_id;
				that.cid = cid;
			}
			
			//设置高度
			uni.getSystemInfo({
				success: function(res) {
					var height = res.windowHeight + 'px';
					that.style_height = "height:"+height;
				}
			})
			
			//获取分类列表
			that.getCateList();
			
		},
		//分享好友（小程序）
		onShareAppMessage(res) {
			var that = this;
		    if (res.from === 'button') {// 来自页面内分享按钮
				//console.log(res.target)
		    }
			var title = "韩国Brickpop官方商城";
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
			var title = "韩国Brickpop官方商城";
		    var user_id = userInfo.id;
		    return {
				title: title,
				query: {
					'user_id': user_id
				}
		    }
		},
		methods: {
			//获取分类列表
			getCateList: function() {
				var that = this;
				tools.httpClient('home/WxStore/getWechatCateList',{}, (error, res) => {
					console.log(res);
					if (res.errorCode == 0) {
						var cataData = res.data;
						that.cateList = cataData;
						var cid = that.cid;
						if(cid > 0){
							for(var i=0;i<cataData.length;i++){
								if(cataData['id'] == cid){
									that.cid = cataData[i]['id'];
									that.cate_img_url = cataData[i]['img_url'];
									that.cate_gid = cataData[i]['goods_id'];
									break;
								}
							}
						}else{
							if(cataData.length > 0){
								that.cid = cataData[0]['id'];
								that.cate_img_url = cataData[0]['img_url'];
								that.cate_gid = cataData[0]['goods_id'];
							}
						}
						//获取分类商品列表
						that.getCateGoods();
					}
				});
			},
			
			getKeywords: function(e){
				var that = this;
				that.keyword = e.detail.value;
				//获取分类商品列表
				that.getCateGoods();
			},
			
			//获取分类下商品列表
			getCateGoods: function() {
				var that = this;
				var cid = that.cid;
				var keyword = that.keyword;
				uni.showLoading({
					title: '加载中'
				})
				if(cid > 0){
					tools.httpClient('home/WxStore/getCateGoods', {'cate_id': cid,'name':keyword}, (error, result) => {
						uni.hideLoading();
						// console.log(result);
						if (result.errorCode == 0) {
							var goodsData = result.data;
							that.goodsList = goodsData;
						}
					})
				}
			},
			
			//选择分类
			selectFirCate: function(id,img_url,goods_id) {
				var that = this;
				that.cid = id;
				that.cate_img_url = img_url;
				that.cate_gid = goods_id;
				that.goodsList = [];
				//重新获取分类下商品列表
				that.getCateGoods();
			},
			
			//商品详情
			goodsDetail: function(id) {
				var gid = id;
				if(gid){
					uni.navigateTo({
						url: '/pages/store/goodsDetail/goodsDetail?gid=' + gid
					})
				}
			},
			
		}
	}
</script>

<style>
	@import url("./cate.css");
</style>
