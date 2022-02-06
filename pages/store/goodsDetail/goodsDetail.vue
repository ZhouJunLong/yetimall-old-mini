<template>
	<view class="wrap">
		<!-- 轮播图 -->
		<view class="slide-area">
			<swiper indicator-dots="true" autoplay="true" interval="3000" circular="true" indicator-active-color="#57D0D9" :style="{height:imgheight + 'px'}">
				<swiper-item >
					<image mode="widthFix" :src="base_url + goodsInfo.img_url"></image>
				</swiper-item>
				<block v-for="item in goodsInfo.img_list">
					<swiper-item >
						<image mode="widthFix" :src="base_url + item"></image>
					</swiper-item>
				</block>
			</swiper>
		</view>
		<!-- 商品详情 -->
		<view class="goods-detail">
			<view class="price-area flex-row align-items-center space-between">
				<view class="left-area flex-row align-items-center">
					<text class="unit">￥</text>
					<text class="price">{{goodsInfo.price || 0}}</text>
				</view>
				<view class="sale">
					<text class="sale-item">已售{{goodsInfo.sale || 0}}件</text>
				</view>
			</view>
			<view class="goods-name">{{goodsInfo.simple_desc || ''}}</view>
			<view class="select" @click="openMask()"><text class="select-title">规格选择：</text>
				<view class="select-content">
					<text v-if="selectedProperty.length == 0 ">请选择商品规格</text>
					<text v-else v-for="(pro,index) in selectedProperty.propertyList">{{pro.name}} {{pro.value}}</text>
					<text class="iconfont icon-youjiantouda"></text></view>
			</view>
			<view class="commitment">
				<view class="commitment-item" v-for="(items, index) in goodsInfo.commitment">
					<text class="iconfont icon-right_circle"></text>
					<text>{{items}}</text>
				</view>
			</view>
		</view>
		<view class="nav"></view>
		<!-- 详情 -->
		<view class="detail-area">
			<view class="detail-title flex-row align-items-center">
				<text class="title-line"></text>
				<text class="detail-inner-title">商品详情</text>
				<text class="title-line"></text>
			</view>
			<view class="detail">
				<rich-text type="text" :nodes="detailDesc" ></rich-text>
			</view>
		</view>
		<!-- 按钮区域 -->
		<view class="submit-area flex-row align-items-center space-between">
			<view class="icon-area">
				<view class="icon-list" @click="addFavorite">
					<text class="iconfont icon-shoucang" v-if="type"></text>
					<text class="iconfont icon-shoucang1" v-else></text>
					<text>收藏</text>
				</view>
			</view>
			<view @click="addCart" class="submit flex-row align-items-center flex-center">
				<text>加入购物车</text>
			</view>
			<view @click="confirmOrder" class="submit confirm flex-row align-items-center flex-center">
				<text>立即购买</text>
			</view>
		</view>
		<!--多规格-->
		<!-- 选择属性弹层 -->
		<view v-if="!maskHidden" class="property-opt-wrap">
			<view class="other-wrap" @click="offMask"></view>
			<view class="property-detail">
				<view class="property-top">
					<image class="goods-img" mode="scaleToFill" :src="base_url + goodsInfo.img_url"></image>
					<view class="top-right">
						<view class="price-wrap flex-row">
							<text v-if="goodsInfo.standard == 0">￥{{goodsInfo.price}}</text>
							<text v-if="goodsInfo.standard == 1 ">￥{{selectedProperty.price || goodsInfo.price}}</text>
							<text class="iconfont icon-cha off-icon" @click="offMask"></text>
						</view>
						<view class="top-item">
							库存：<text>{{selectedProperty.inventory ||goodsInfo.inventory}}</text>
						</view>
						<view class="top-item">
							已选：<text v-if="selectedProperty" v-for="(pro,index) in selectedProperty.propertyList">{{pro.name}} {{pro.value}}</text>
						</view>
					</view>
				</view>
				<block v-key="5" v-for="(attrValueObj,attrIndex) in attrValueList">
					<view class="property-unit">
						<text class="unit-name">{{attrValueObj.attrKey}}</text>
						<view class="unit-cont flex-row">
							<view @click="selectAttrValue(attrValueObj.attrValueStatus[valueIndex],value,attrValueObj.attrKey,attrIndex,attrValueObj.selectedValue)"
							 class="cont-item" v-bind:class="[attrIndex==firstIndex || attrValueObj.attrValueStatus[valueIndex] ? (value==attrValueObj.selectedValue ? 'attr_value_active' : '') : 'attr_value_disabled']"
							 v-for="(value,valueIndex) in attrValueObj.attrValues">{{value}}</view>
						</view>
					</view>
				</block>
				<view class="property-unit count-box flex-row align-items-center space-between">
					<text class="unit-name">购买数量</text>
					<view class="unit-cont flex-row">
						<text class="opt-btn" @click="goodsCount(0)">-</text>
						<!-- <text class="count">{{count}}</text> -->
						<input type="number" maxlength="4" class="count" v-model="count">
						<text class="opt-btn" @click="goodsCount(1)">+</text>
					</view>
				</view>
				<!-- 按钮区域 -->
				<view class="operator-area flex-row align-items-center space-between">
					<view @click="offMask" class="submit confirm flex-row align-items-center flex-center">
						<text>确定</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// 引入
	var utils = require('../../../common/utils.js');
	var config = require("../../../common/config.js");
	var graceRichText = require("../../../graceUI/jsTools/richText.js");
	var base_url = config.default.BASE_URL;
	var userInfo = "";

	export default {

		data() {
			return {
				base_url: base_url,
				imgheight:'',//轮播图高度
				goodsInfo:[],//所选的商品详情
				userInfo:[],//用户信息
				detailDesc:'',//详情
				maskHidden: true,
				attrValueList: [], //多规格属性
				commodityAttr: [], //多规格属性
				includeGroup: [], //多规格属性
				selectedProperty: [],
				firstIndex:1,
				count:1,
				type:0,
				gid:'',
			}
		},
		watch:{
			count(newVal){
				if(newVal < 1){
					this.count = 1
				}
			}
		},
		onLoad(option) {
			var that = this; 
			let gid = option.gid ? option.gid : 23;
			that.gid = gid;
			//用户缓存信息
			that.userInfo = uni.getStorageSync("userInfo");
			
			//获取用户信息
			// that.getUserInfo();
			//获取商品
			that.getGoodsInfo(gid);
			//用户缓存信息
			userInfo = uni.getStorageSync("userInfo");
		},
		//分享好友（小程序）
		onShareAppMessage(res) {
			var that = this;
		    if (res.from === 'button') {// 来自页面内分享按钮
				//console.log(res.target)
		    }
			var title = "韩国Yetimall官方商城";
			var gid = that.gid;
		    return {
				title: title,
				path: '/pages/store/goodsDetail/goodsDetail?gid='+gid
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
			//添加\取消收藏
			addFavorite:function(){
				var that  = this;
				var user_id =that.userInfo.id;
				if(that.userInfo.id){
					
				}else{
					uni.showToast({
						title:'请完善信息！',
						icon:'none',
						duration:2000
					})
					return false;
				}
				var gid = that.gid;
				var type = that.type;
				utils.httpGet('home/WxStore/addFavorite', {user_id:user_id,gid:gid,type:type}, (error, result) => {
					console.log(result);
					if (result.errorCode == 0) {
						// uni.navigateTo({
						// 	url:'/pages/store/goodsDetail/goodsDetail?gid='+gid
						// })
						if(type == 1){
							that.type = 0;
						}else{
							that.type = 1;
						}
					}
				})
			},
			//获取商品
			getGoodsInfo:function(gid){
				var that = this;
				//用户id
				var user_id = that.userInfo.id;
				if(user_id == undefined){
				  user_id = 0;
				}
				utils.httpGet('home/WxStore/getGoodsInfo',{id:gid,userId:user_id},(error, res)=>{
					if(res.errorCode == 0){
						that.goodsInfo = res.data; 
						console.log(that.goodsInfo)
						that.type = that.goodsInfo.is_favorite;
						if(res.data.detail_desc){
							that.detailDesc =  graceRichText.format(res.data.detail_desc);
						}
						//处理多规格
						if(res.data.standard == 1){
							that.commodityAttr = res.data.propertyList;  
							that.includeGroup = res.data.propertyList;
							that.maskHidden = true;
							//拟合数据用于输出到页面
							that.distachAttrValue(that.commodityAttr);
							// if (that.commodityAttr.length == 1) {
							// 	for (var i = 0; i < that.commodityAttr[0].attrValueList.length; i++) {
							// 		that.attrValueList[i].selectedValue = that.commodityAttr[0].attrValueList[i].attrValue;
							// 	}
							// 	that.attrValueList = that.attrValueList
							// }
						}
						//处理第一张轮播图
						var img = base_url + that.goodsInfo.img_url;
						uni.getImageInfo({
							src: img,
							success: function (res) {
								var imgwidth = res.width;
								var imgheight = res.height;
								//宽高比  
								var ratio = imgwidth / imgheight;
								//计算的高度值  
								var imgheights = (uni.getSystemInfoSync().windowWidth - 25) / ratio;
								that.imgheight = imgheights;
							}
						})
					}
				});
			},
			
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
			
			//针对多规格
			getPropertyGroup: function(gid) {
				var that = this;
				//获取商品属性
				utils.httpGet("home/WxStore/getPropertyGroup", {
					gid: gid,
				}, function(error, res) {
					that.commodityAttr = res.data;
					that.includeGroup = res.data;
					that.maskHidden = true;
					//拟合数据用于输出到页面
					that.distachAttrValue(that.commodityAttr);
					if (that.commodityAttr.length == 1) {
						for (var i = 0; i < that.commodityAttr[0].attrValueList.length; i++) {
							that.attrValueList[i].selectedValue = that.commodityAttr[0].attrValueList[i].attrValue;
						}
						that.attrValueList = that.attrValueList
					}
				})
			},
			
			/* 获取数据 */
			distachAttrValue: function(commodityAttr) {
				//参数为元素数据组合
				/**
				  将后台返回的数据组合成类似
				  {
					attrKey:'型号',
					attrValueList:['1','2','3']
				  }
				*/
				// 把数据对象的数据（视图使用），写到局部内
				//获取空数组
				var attrValueList = this.attrValueList;
				// 遍历获取的数据
				for (var i = 0; i < commodityAttr.length; i++) {
					for (var j = 0; j < commodityAttr[i].propertyList.length; j++) {
						//传入参数   开始时attrValueList为空数组[]
						var attrIndex = this.getAttrIndex(commodityAttr[i].propertyList[j].name, attrValueList);
						// console.log('属性索引', attrIndex); 
						// 如果还没有属性索引为-1，此时新增属性并设置属性值数组的第一个值；索引大于等于0，表示已存在的属性名的位置
						if (attrIndex >= 0) {
							// 如果属性值数组中没有该值，push新值；否则不处理
							if (!this.isValueExist(commodityAttr[i].propertyList[j].value, attrValueList[attrIndex].attrValues)) {
								attrValueList[attrIndex].attrValues.push(commodityAttr[i].propertyList[j].value);
							}
						} else {
							//插入新的属性名
							attrValueList.push({
								attrKey: commodityAttr[i].propertyList[j].name,
								//attrValues为数组
								attrValues: [commodityAttr[i].propertyList[j].value]
							});
						}
					}
				}
				//设置每个属性值的状态为true，代表可点击
				for (var i = 0; i < attrValueList.length; i++) {
					for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
						if (attrValueList[i].attrValueStatus) {
							attrValueList[i].attrValueStatus[j] = true;
						} else {
							attrValueList[i].attrValueStatus = [];
							attrValueList[i].attrValueStatus[j] = true;
						}
					}
				}
				//设置最终拼合的数据
				this.attrValueList = attrValueList
			},

			/**
			 * 获取属性索引
			 */
			getAttrIndex: function(attrName, attrValueList) {
				//返回值为-1表示不存在此属性名，需插入新属性名
				// 判断数组中的attrKey是否有该属性值
				for (var i = 0; i < attrValueList.length; i++) {
					if (attrName == attrValueList[i].attrKey) {
						break;
					}
				}
				var aa = i < attrValueList.length ? i : -1;
				// console.log( aa )
				return aa;
			},
			
			/**
			 * 判断新拼合的数据中是否存在原始数据中的属性值 返回值为true代表原始数据已加入新拼合的数据
			 */
			isValueExist: function(value, valueArr) {
				//value为原始数据的值 valueArr为组合后值的数组
				// 判断是否已有属性值
				for (var i = 0; i < valueArr.length; i++) {
					if (valueArr[i] == value) {
						break;
					}
				}
				return i < valueArr.length;
			},
			
			/* 选择属性值事件 */
			selectAttrValue: function(status,value,key,index,selectedvalue) {
				/*
				点选属性值，联动判断其他属性值是否可选
				{ 
				  attrKey:'型号',
				  attrValueList:['1','2','3'],
				  selectedValue:'1',
				  attrValueStatus:[true,true,true]
				}
				console.log(e.currentTarget.dataset);
				*/
				// console.log(e.currentTarget.dataset);
			
				//获取到拼合的数据
				var attrValueList = this.attrValueList;
				if (status || index == this.firstIndex) {
					if (selectedvalue == value) {
						// 取消选中
						this.disSelectValue(attrValueList, index, key, value);
					} else {
						// 选中
						this.selectValue(attrValueList, index, key, value);
					}
			
				}
			},
			/* 选中 */
			selectValue: function(attrValueList, index, key, value, unselectStatus) {
				// console.log('firstIndex', this.firstIndex);
				var includeGroup = [];
				if (index == this.firstIndex && !unselectStatus) { // 如果是第一个选中的属性值，则该属性所有值可选
					var commodityAttr = this.commodityAttr;
					// 其他选中的属性值全都置空
					// console.log('其他选中的属性值全都置空', index, this.firstIndex, !unselectStatus);
					for (var i = 0; i < attrValueList.length; i++) {
						for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
							attrValueList[i].selectedValue = '';
						}
					}
				} else {
					var commodityAttr = this.includeGroup;
					// console.log(commodityAttr,'3' )
				}
				// console.log('选中', commodityAttr, index, key, value);
				for (var i = 0; i < commodityAttr.length; i++) {
					for (var j = 0; j < commodityAttr[i].propertyList.length; j++) {
						if (commodityAttr[i].propertyList[j].name == key && commodityAttr[i].propertyList[j].value == value) {
							includeGroup.push(commodityAttr[i]);
						}
					}
				}
				// console.log(includeGroup,'已选属性')
				attrValueList[index].selectedValue = value;
			
				// 判断属性是否可选
				for (var i = 0; i < attrValueList.length; i++) {
					for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
						attrValueList[i].attrValueStatus[j] = false;
					}
				}
			
				for (var k = 0; k < attrValueList.length; k++) {
					for (var i = 0; i < includeGroup.length; i++) {
						for (var j = 0; j < includeGroup[i].propertyList.length; j++) {
							if (attrValueList[k].attrKey == includeGroup[i].propertyList[j].name) {
								for (var m = 0; m < attrValueList[k].attrValues.length; m++) {
									if (attrValueList[k].attrValues[m] == includeGroup[i].propertyList[j].value) {
										attrValueList[k].attrValueStatus[m] = true;
									}
								}
							}
						}
					}
				}
				// this.attrValueList = attrValueList;
				//循环遍历更新 vue中 由于 JavaScript 的限制，Vue 不能检测数组和对象的变化。深入响应式原理中有相关的讨论。
				for (var i = 0; i < attrValueList.length; i++) {
					this.$set(this.attrValueList,i,attrValueList[i]);
				}
				this.includeGroup = includeGroup;
				this.count = 1;
			
				var selNum = 0;
				for (var i = 0; i < this.attrValueList.length; i++) {
					if (this.attrValueList[i].selectedValue) {
						selNum++;
					}
				}
				if (selNum == this.attrValueList.length) {
					this.selectedProperty = includeGroup[0];
					this.propertyPrice = includeGroup[0].price;
					this.singlePrice = includeGroup[0].price;
					this.inventory = includeGroup[0].inventory;
				}
				//console.log(this.selectedProperty)
				var count = 0;
				for (var i = 0; i < attrValueList.length; i++) {
					for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
						if (attrValueList[i].selectedValue) {
							count++;
							break;
						}
					}
				}
				if (count < 2) { // 第一次选中，同属性的值都可选
					this.firstIndex = index;
				} else {
					this.firstIndex = -1;
				}
			},
			/* 取消选中 */
			disSelectValue: function(attrValueList, index, key, value) {
				var commodityAttr = this.commodityAttr;
				attrValueList[index].selectedValue = '';
			
				// 判断属性是否可选
				for (var i = 0; i < attrValueList.length; i++) {
					for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
						attrValueList[i].attrValueStatus[j] = true;
					}
				}
				this.includeGroup = commodityAttr;
				// this.attrValueList = attrValueList;
				//循环遍历更新
				for (var i = 0; i < attrValueList.length; i++) {
					this.$set(this.attrValueList,i,attrValueList[i]);
				}
				this.selectedProperty = [];
			
				for (var i = 0; i < attrValueList.length; i++) {
					if (attrValueList[i].selectedValue) {
						this.selectValue(attrValueList, i, attrValueList[i].attrKey, attrValueList[i].selectedValue, true);
					}
				}
			},
					
			
			// 开启弹框选择
			openMask:function(){
				this.maskHidden = false;
			},
			
			//关闭多规格
			offMask: function() {
				this.maskHidden = true
				// console.log(this.selectedProperty.length)
			},
			
			/**
			 * 商品数量操作
			 */
			goodsCount: function (optType) {
				var that = this;
				//获取到默认的商品数量
				var goodsCount = that.count;
				if (optType == 1) {
					goodsCount++;
					that.count = goodsCount; 
				} else {
					goodsCount--;
					if (goodsCount < 1) {
						goodsCount = 1;
					}
					that.count = goodsCount;
				}
		
			},
			
			//加入购物车
			addCart:function(){
				let that = this;
				let goodsInfo = that.goodsInfo;
				var selectedProperty = that.selectedProperty;
				let count = that.count;
				if(that.userInfo.id){
					
				}else{
					uni.showToast({
						title:'请完善信息！',
						icon:'none',
						duration:2000
					})
					return false;
				}
				if(goodsInfo.standard == 1 && !selectedProperty.id){
					uni.showToast({
						title:'请选择规格！',
						icon:'none',
						duration:2000
					})
					return;
				}
				if(goodsInfo.standard == 1){
					if(count > selectedProperty.inventory){
						uni.showToast({
							title:'库存不足！',
							icon:'none',
							duration:2000
						})
						return false;
					}
				}else{
					if(count > goodsInfo.inventory){
						uni.showToast({
							title:'库存不足！',
							icon:'none',
							duration:2000
						})
						return false;
					}
				}
				
				//判断是否是多规格
				let gid = goodsInfo.id;
				var data = {
					uid:that.userInfo.id,
					gid:gid,
					gpid:selectedProperty.id ? selectedProperty.id : 0,
					count:count
				}
				uni.showLoading();
				utils.httpGet("home/WxStore/addCartGoods",data,function(error,res){
					uni.hideLoading();
					if(res.errorCode==0){
						that.maskHidden = true;
						uni.showToast({
							title:'添购物车成功',
							icon:'none',
							duration:2000,
						})
					}else{
						utils.showModal(res.errorInfo);
					}
				})	
			},
		
			
			//提交订单
			// confirmOrder:function(){
			// 	var that = this;
			// 	let gid = that.goodsInfo.id; 
			// 	let count = that.count;
			// 	let selectedProperty = that.selectedProperty;

			// 	uni.navigateTo({
			// 		url:'../confirmOrder/confirmOrder?gids='+gid+'&counts='+count
			// 	})
			// },
			
			//提交订单
			confirmOrder:function(){
				var that = this;
				var gid = that.goodsInfo.id;
				var goodsInfo = that.goodsInfo;
				let count = that.count;
				var selectedProperty = that.selectedProperty;
				if(that.userInfo.id){
					
				}else{
					uni.showToast({
						title:'请完善信息！',
						icon:'none',
						duration:2000
					})
					return false;
				}
				if(goodsInfo.standard == 1){
					if(count > selectedProperty.inventory){
						uni.showToast({
							title:'库存不足！',
							icon:'none',
							duration:2000
						})
						return false;
					}
				}else{
					if(count > goodsInfo.inventory){
						uni.showToast({
							title:'库存不足！',
							icon:'none',
							duration:2000
						})
						return false;
					}
				}
				if(that.goodsInfo.standard == 1){
					if(selectedProperty.id){
						uni.navigateTo({
							url:'../confirmOrder/confirmOrder?gids='+gid+'&counts='+count+'&gpids=' + selectedProperty.id
						})
					}else{
						uni.showToast({
							title:'请选择规格！',
							icon:'none',
							duration:2000
						})
					}
				}else{
					uni.navigateTo({
						url:'../confirmOrder/confirmOrder?gids='+gid+'&counts='+count
					})
				}
				
			}
			
		}
	}
</script>

<style>
	@import "goodsDetail.css";
</style>
