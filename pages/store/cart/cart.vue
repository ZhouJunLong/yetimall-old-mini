<template>
	<view class="wrap">
		<view class="goods-list">
			<block v-for="(item,index) in goodsList.dataList">
				<view class="goods-item">
					<view class="item-check" :data-id='item.id' @click="selectGoods(item.id)">
						<text class="iconfont icon-yuanxingweixuanzhong" v-if="item.is_check == 0"></text>
						<text class="iconfont icon-queren" v-else></text>
					</view>
					<view class="item-left" @click="goodsDetail(item.gid)">
						<image :src='base_url + item.thumb'></image>
					</view>
					<view class="item-right">
						<view class="goods-name">{{item.goods_name}}</view>
						<view class="goods-portery" v-if="item.property"><text v-for="(items,indexs) in item.property">{{items.name}} {{items.value}}</text></view>
						<view class="options">
							<view class="price">￥{{item.price}}</view>
							<view class="count-option">
								<text class="iconfont icon-jianshao" @click="goodsCount(item.id,0)"></text>
								<text class="count">{{item.goods_count}}</text>
								<text class="iconfont icon-zengjia" @click="goodsCount(item.id,1)"></text>
							</view>
						</view>
					</view>
				</view>
			</block>
		</view>
		<view class="bottom-options">
			<view class="check-box" @click="selectAll">
				<text class="iconfont icon-yuanxingweixuanzhong" v-if="is_all == 0"></text>
				<text class="iconfont icon-queren" v-else></text>
				<text v-if="language == 0">전 선거</text>
				<text v-else>全选</text>
			</view>
			<view class="total-count">
				<text v-if="language == 0">모두</text>
				<text v-else>共</text>
				<text class="count">
					{{total_count}}
				</text>
				<text v-if="language == 0">건.</text>
				<text v-else>件</text>
			</view>
			<view class="total-price">
				<text class="price-title" v-if="language == 0">합계:</text>
				<text class="price-title" v-else>合计：</text>
				<text class="order-price-unit">￥</text>
				<text class="order-price">{{total_price}}</text>
			</view>
			<view class="submit" @click="confirmOrder()">
				<text v-if="language == 0">주문 하 다</text>
				<text v-else>下单</text>
			</view>
			<view class="delete_select" @click="deleteAllSelect">
				<text v-if="language == 0">삭제</text>
				<text v-else>删除</text>
			</view>
		</view>
	</view>
</template>

<script>
	import CONFIG from '../../../common/config.js';
	import tools from '../../../common/tools.js';  
	var utils = require('../../../common/utils.js');
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
				userInfo:[],//用户信息
				is_all:0,//是否全选
				total_price:0,
				total_count:0,
				language:1,// 1 中文 ，0韩文
				sum:0,//商品总数
				select_num:0,//选中总数
			}
		},
		onLoad(options) {
			var that = this;
			
			//设置高度
			uni.getSystemInfo({
				success: function(res) {
					var height = res.windowHeight + 'px';
					that.style_height = "height:"+height;
				}
			})
			//用户缓存信息
			that.userInfo = uni.getStorageSync("userInfo");
			that.language = uni.getStorageSync("language");
			
			
			//获取用户信息
			// that.getUserInfo();
			
			//获取购物车列表
			// that.getCartGoods();
			
		},
		onShow(){
			var that = this;
			//用户缓存信息
			that.userInfo = uni.getStorageSync("userInfo");
			that.language = uni.getStorageSync("language");
			//获取分类列表
			that.getCartGoods();
		},
		methods: {			
			//获取用户信息
			getUserInfo:function(){
				var that = this;
				utils.httpGet('home/WxStore/getUserInfo', {user_id:userInfo.id}, (error, result) => {
					if (result.errorCode == 0) {
						var userData = result.data;
						userInfo = userData;
						that.userInfo = userData;
					}
				})
			},
			//商品复选
			selectGoods:function(id){
				var that = this;
				var goodsList = that.goodsList.dataList;
				var select_num = that.select_num;
				var sum = that.sum;
				for(var k = 0;k < goodsList.length;k++){
					if(id == goodsList[k]['id']){
						if(goodsList[k]['is_check'] == 1){
							goodsList[k]['is_check'] = 0;
							select_num--;
						}else{
							goodsList[k]['is_check'] = 1;
							select_num++;
						}
					}
				}
				that.select_num = select_num;
				that.sum = sum;
				if(select_num == sum){
					if(sum == 0){
						that.is_all = 0;
					}else{
						that.is_all = 1;
					}
				}else{
					that.is_all = 0;
				}
				that.goodsList.dataList = goodsList;
				that.getBottomPrice()
			},
			//商品全选\取消全选
			selectAll:function(){
				var that = this;
				var is_all = that.is_all;
				var goodsList = that.goodsList.dataList;
				if(is_all == 1){
					for(var k = 0;k < goodsList.length;k++){
						goodsList[k]['is_check'] = 0;
					}
					that.is_all = 0;
				}else{
					for(var k = 0;k < goodsList.length;k++){
						goodsList[k]['is_check'] = 1;
					}
					that.is_all = 1;
				}
				that.goodsList.dataList = goodsList;
				that.getBottomPrice()
			},
			
			//切换语言
			changLanguage:function(type){
				var that =this;
				that.language = type;
				uni.setStorageSync('language',type);
				return false;
			},
			
			//获取底部数据
			getBottomPrice:function(){
				var that = this;
				var goodsList = that.goodsList.dataList;
				var total = 0;
				var price = 0;
				for(var s = 0;s < goodsList.length;s++){
					if(goodsList[s]['is_check'] == 1){
						total += goodsList[s]['goods_count'];
						price += parseFloat(goodsList[s]['goods_count'])*goodsList[s]['price']
					}
				}
				that.total_count = total;
				that.total_price = price; 
			},
			//获取分类下商品列表
			getCartGoods: function() {
				var that = this;
				var user_id = that.userInfo.id;
				uni.showLoading({
					title: '加载中'
				})
				if(user_id){
					tools.httpClient('home/WxStore/getCartGoods', {'user_id': user_id}, (error, result) => {
						uni.hideLoading();
						// console.log(result);
						if (result.errorCode == 0) {
							var goodsData = result.data;
							var is_all = that.is_all;
							if(is_all == 1){
								for(var i = 0;i < goodsData.dataList.length ;i++){
									goodsData.dataList[i]['is_check'] = 1;
								}
							}else{
								for(var i = 0;i < goodsData.dataList.length ;i++){
									goodsData.dataList[i]['is_check'] = 0;
								}
							}
							that.sum = goodsData.dataList.length;
							that.goodsList = goodsData;
							// console.log(goodsData)
						}
					})
				}else{
					uni.hideLoading();
				}
			},
			
			//提交订单
			confirmOrder:function(){
				var that = this;
				var goodsList = that.goodsList.dataList;
				var counts = '';
				var gids = '';
				var gpids = '';
				var cids = '';
				for(var i = 0;i < goodsList.length;i++){
					if(goodsList[i]['is_check'] == 1){
						counts += String(goodsList[i]['goods_count'])+',';
						gids += String(goodsList[i]['gid'])+',';
						gpids += String(goodsList[i]['gpid'])+',';
						cids += String(goodsList[i]['id'])+',';
					}
				}
				console.log(gpids);
				if(gids){
					//判断商品是否可以购买
					tools.httpClient('home/WxStore/cartIsCanBuy', {'gids': gids,'gpids':gpids}, (error, result) => {
						if (result.errorCode == 0) {
							uni.navigateTo({
								url: '/pages/store/confirmOrder/confirmOrder?gids=' + gids +'&gpids='+gpids+'&counts='+counts+'&cids='+cids
							})
						}else{
							uni.showToast({
								title:result.errorInfo,
								icon:'none',
								duration:1000,
							})
							return false;
						}
					})
				}else{
					uni.showToast({
						title:"请选择要下单的商品！",
						icon:'none',
						duration:1000,
					})
				}
				// console.log(gids);
				// console.log(gpids);
				// console.log(counts);
				// console.log(cids);
				// return false;
				
			},
			
			/**
			 * 商品数量操作
			 */
			goodsCount: function (gid,optType) {
				var that = this;
				var goodsList = that.goodsList.dataList;
				for(var j = 0;j < goodsList.length;j++){
					if(gid == goodsList[j]['id']){
						if (optType == 1) {
							if(goodsList[j]['goods_count'] < goodsList[j].inventory){
								goodsList[j]['goods_count']++
							}else{
								uni.showToast({
									title:"库存不足",
									icon:'none',
									duration:2000
								})
							}
						} else {
							goodsList[j]['goods_count']--;
							if (goodsList[j]['goods_count'] < 1) {
								goodsList[j]['goods_count'] = 1;
							}
						}
					}
				}
				that.getBottomPrice()
			},
			//删除选中购物车商品
			deleteAllSelect:function(){
				var that = this;
				var goodsList = that.goodsList.dataList;
				var ids = '';
				for(var i = 0;i < goodsList.length;i++){
					if(goodsList[i]['is_check'] == 1){
						ids += String(goodsList[i]['id'])+',';
					}
				}
				uni.showLoading({
					title: '加载中'
				})
				if(ids != ''){
					tools.httpClient('home/WxStore/deleteCartGoods', {'ids': ids}, (error, result) => {
						uni.hideLoading();
						// console.log(result);
						if (result.errorCode == 0) {
							uni.showToast({
								title:"删除成功",
								icon:'none',
								duration:1000
							})
							var idList = ids.split(',');
							for(var k = 0;k < idList.length - 1 ;k++){
								for(var j = 0;j < goodsList.length;j++){
									if(goodsList[j]['is_check'] == 1){
										goodsList.splice(j, 1);
									}
								}
							}
							if(goodsList.length == 0){
								that.is_all = 0;
							}
							that.getBottomPrice()
							return false;
						}else{
							uni.showToast({
								title:"删除失败",
								icon:'none',
								duration:1000
							})
							return false;
						}
					})
				}else{
					uni.hideLoading();
					uni.showToast({
						title:"您未选择任何商品！",
						icon:'none',
						duration:1000
					})
					return false;
				}
				
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
	@import url("./cart.css");
</style>
