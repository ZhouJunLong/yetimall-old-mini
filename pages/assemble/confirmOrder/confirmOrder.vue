<template>
	<view class="wrap">
		<!-- 服务地址 -->
		<view class="address-area">
			<view class="address-list" v-if="addressInfo" @click="selectAddress">
				<view class="address-info">
					<view class="address-top">
						<view>姓名：{{addressInfo.name}}</view>
						<view>{{addressInfo.phone}}</view>
					</view>
					<view class="address-bot">服务地址: {{addressInfo.city}} {{addressInfo.region}} {{addressInfo.address}} {{addressInfo.village}}{{addressInfo.building}}栋{{addressInfo.unit}}单元{{addressInfo.room}}室</view>
				</view>
				<text class="iconfont icon-you"></text>
			</view>
			<view class="address-list" v-else @click="selectAddress">
				<view class="address">
					<view class="select-addr">
						<text class="iconfont icon-hao"></text>
						<text>选择服务地址</text>
					</view>
				</view>
			</view>
			<image class="line" :src="line_png" mode="widthFix"></image>
		</view>
		<!-- 商品信息 -->
		<view class="good-area">
			<view class="good-info">
				<image :src="base_url+goodsInfo.img_url" class="good-img"></image>
				<view class="good">
					<view class="good-top">
						<view class="name">{{goodsInfo.name}}</view>
						<view class="price" v-if="goodsInfo.is_specs != 1">￥{{goodsInfo.assemble_price}}</view>
						<view class="price" v-else>￥{{specs_price}}</view>
					</view>
					<view class="good-bot">
						<block v-if="goodsInfo.goodInfo">
							<view class="property" v-if="goodsInfo.goodInfo.type != 3 && goodsInfo.is_specs == 0">规格：{{goodsInfo.goodInfo.simple_desc}} {{goodsInfo.goodInfo.label==1?'日间':'夜间'}}</view>
							<view class="property" v-else-if="goodsInfo.is_specs == 1">规格：{{specs_name}}</view>
						</block>
						<block v-if="goodsInfo.goodInfo">
							<view class="person" v-if="goodsInfo.goodInfo.type != 3">服务人数：{{goodsInfo.goodInfo.person}}人</view>
							<view class="person" v-else>x{{goodsInfo.goods_count}}</view>
						</block>
					</view>
				</view>
			</view>
		</view>
		<!-- 积分信息 -->
		<view class="order-area">
			<view class="order-info">
				<view>积分抵现（可用积分<text class="points">{{user_points}}</text>）</view>
				<text class="iconfont icon-unselect-radio2" v-if="is_use_points == 0" @click="usePoints"></text>
				<text class="iconfont icon-xuanze2" v-else-if="is_use_points == 1" @click="usePoints"></text>
			</view>
			<view class="order-info" v-if="is_use_points == 1">
				<input type="number" class="point_num" :value="points" placeholder="输入使用积分数" placeholder-style="color:#999999;font-size:12px;" @input="getPoints" />
				<view class="point_money">-￥{{points_money}}</view>
			</view>
		</view>
		<!-- 支付方式 -->
		<view class="order-area">
			<view class="order-info">
				<view>支付方式</view>
				<view class="pay-type">
					<text class="iconfont icon-weixin"></text>
					<text>微信支付</text>
				</view>
			</view>
		</view>
		<!-- 买家留言 -->
		<view class="message-area">
			<view class="message-info">
				<view class="tip">买家留言</view>
				<input type="text" class="inp" placeholder="对本次交易的说明,需要特别标注的事情..." placeholder-style="color:#999;font-size:12px;" @input="getMessage" />
			</view>
			<view class="count-info">
				<view>共1件商品</view>
				<view>小计：￥{{totalPrice}}</view>
			</view>
		</view>
		<!-- 底部区域 -->
		<view class="total-area">
			<view class="total-left">
				<text class="total_count">共1件商品</text>
				<text>总计:</text>
				<text class="total-price">￥{{realPrice}}</text>
			</view>
			<view class="total-right" @click="addOrder">立即购买</view>
		</view>
	</view>
</template>

<script>
	import CONFIG from '../../../common/config.js';
	import tools from '../../../common/tools.js';
	var base_url = CONFIG.BASE_URL;
	var userInfo = "";
	//var cityInfo = "";
	var did = 0;
	var isClick = true;
	
	export default {
		data() {
			return {
				base_url: base_url,//BASE_URL
				userInfo: [],//用户信息
				//cityInfo: [],//用户城市信息
				gid: 0, //商品id
				count: 1, //商品数量
				specs_name: '',//多商品规格名称
				specs_price: 0.00,//商品多规格价格
				city_id: 0,//城市id
				city: '',//城市
				group_id: 0, //拼团id
				addressInfo: '', //默认地址信息
				line_png: base_url+'bg/line.png', //地址ling
				goodsInfo: '',//商品信息
				is_use_points: 0,//是否使用积分
				points: '',//使用积分
				points_money: 0,//积分抵现金额
				user_points: 0,//用户积分
				message: '',//在线留言信息
				totalPrice: 0.00,//订单总额
				realPrice: 0.00,//商实付款
			}
		},
		onLoad(options) {
			var that = this;
			
			//用户缓存信息
			userInfo = uni.getStorageSync("userInfo");
			
			//获取用户信息
			that.getUserInfo();
			
			//用户城市信息
			//cityInfo = uni.getStorageSync('cityInfo');
			//if(cityInfo){
			//	that.cityInfo = cityInfo;
			//}
			
			//页面携带参数
			var gid = options.gid;
			var count = options.count;
			var specs_name = options.specs_name;
			var specs_price = options.specs_price;
			var city_id = options.city_id;
			var city = options.city;
			var group_id = options.group_id;
			that.gid = gid;
			that.count = count;
			that.specs_name = specs_name;
			that.specs_price = specs_price;
			that.city_id = city_id;
			that.city = city;
			that.group_id = group_id;
			
			//获取确认订单信息
			that.getAssembleConfirmInfo(gid, count);	
		},
		onShow: function() {
			var that = this;
			
			//用户缓存信息
			userInfo = uni.getStorageSync("userInfo");
			
			//获取用户信息
			that.getUserInfo();
			
			//获取地址信息
			that.getAddressInfo();
			
			//获取配置信息
			that.getConfigInfo();
		},
		methods: {
			getAssembleConfirmInfo: function(gid, count){
				var that = this;
				tools.httpClient("home/WxStore/getAssembleConfirmInfo",{'gid':gid,'count':count},function(err,res){
					//console.log(res);
					if(res.errorCode == 0){
						var goodsData = res.data;
						//商品总额
						var total = goodsData.assemble_price * goodsData.goods_count;
						//多规格
						if(goodsData.is_specs == 1){
							//商品总额
							var total = (that.specs_price) * goodsData.goods_count;
						}
						var totalPrice = total.toFixed(2);
						//实付总额
						var realPrice = totalPrice;
						that.totalPrice = totalPrice;
						that.realPrice = realPrice;
						that.goodsInfo = goodsData;
					}
				})
			},
			
			//获取用户信息
			getUserInfo:function(){
				var that = this;
				tools.httpClient('home/WxStore/getUserInfo',{'user_id':userInfo.id}, (error, res) => {
					if (res.errorCode == 0) {
						var userData = res.data;
						userInfo = userData;
						that.userInfo = userData;
						that.user_points = userData.points;
					}
				});
			},
			
			//获取地址信息
			getAddressInfo:function(){
				var that = this;
				tools.httpClient('home/WxStore/getAddress',{'user_id':userInfo.id}, (error, res) => {
					if (res.errorCode == 0) {
						var addressData = res.data;
						that.addressInfo = addressData;
					}
				});
			},
			
			//获取配置信息
			getConfigInfo:function(){
				var that = this;
				tools.httpClient('home/WxStore/getConfigInfo',{}, (error, res) => {
					if (res.errorCode == 0) {
						var configData = res.data;
						that.configInfo = configData;
					}
				});
			},
			
			//选择服务地址
			selectAddress:function(){
				uni.navigateTo({
					url:'/pages/address/addressList/addressList'
				})
			},
			
			//使用积分、取消使用积分
			usePoints:function(){
				var that = this;
				var is_use_points = that.is_use_points;
				if(is_use_points == 0){
					that.is_use_points = 1;
					var realPrice = that.totalPrice;
					var points_money = that.points_money;
					realPrice = parseFloat(realPrice) - parseFloat(points_money);
					that.realPrice = realPrice > 0 ? realPrice.toFixed(2):0.00;
				}else{
					that.is_use_points = 0;
					that.realPrice = that.totalPrice;
				}
			},
			
			//输入积分数
			getPoints:function(e){
				var that = this;
				var configInfo = that.configInfo;
				var points = parseInt(e.detail.value)?parseInt(e.detail.value):0;
				var points_money = points * configInfo.points_rate;
				var userInfo = that.userInfo;
				if(points > parseInt(userInfo.points)){
					uni.showToast({
						title:'使用积分超过可用积分',
						icon:'none',
						duration:1500
					});
					return false;
				}
				var realPrice = that.totalPrice;
				realPrice = parseFloat(realPrice) - parseFloat(points_money);
				that.points = points;
				that.points_money = points_money.toFixed(2);
				that.realPrice = realPrice > 0 ? realPrice.toFixed(2):0.00;
			},
			
			//在线留言
			getMessage:function(e){
				var that = this;
				that.message = e.detail.value;
			},
			
			//提交订单
			addOrder:function(){
				var that = this;
				//判断用户授权
				if(!tools.isWeixinLogin()){
					return false;
				};
				//服务地址
				if(that.addressInfo == '' || that.addressInfo == null){
					uni.showToast({
						title:'请选择服务地址！',
						icon:'none',
						duration:1500
					})
					return false;
				}
				if(that.addressInfo.city != that.city){
					uni.showToast({
						title:'服务地址与选择城市 “'+that.city+'” 不匹配！请重新选择',
						icon:'none',
						duration:1500
					})
					return false;
				}
				var data = {
					user_id: userInfo.id,
					pay_type: 1,
					points: that.points || 0,
					points_money: that.points_money,
					message: that.message,
					gid: that.goodsInfo.id,
					good_count: that.goodsInfo.goods_count,
					good_is_specs: that.goodsInfo.is_specs,
					good_specs_name: that.specs_name,
					good_specs_price: that.specs_price,
					city_id: that.city_id,
					city: that.city,
					house_area: that.addressInfo.area,
					group_id: that.group_id,
				};
				var address = {
					id: that.addressInfo.id,
					name: that.addressInfo.name,
					phone: that.addressInfo.phone,
					city: that.addressInfo.city,
					region: that.addressInfo.region,
					address_name: that.addressInfo.address_name,
					address: that.addressInfo.address,
					longitude: that.addressInfo.longitude,
					latitude: that.addressInfo.latitude,
					village: that.addressInfo.village,
					building: that.addressInfo.building,
					unit: that.addressInfo.unit,
					room: that.addressInfo.room,
					area: that.addressInfo.area,
				}
				var address_text = that.addressInfo.name + '--' + that.addressInfo.phone +'--'+ that.addressInfo.city + that.addressInfo.village + that.addressInfo.region + that.addressInfo.address + that.addressInfo.village + that.addressInfo.building+'栋'+that.addressInfo.unit+'单元'+that.addressInfo.room+'室'+'--'+that.addressInfo.area;
				data.address = JSON.stringify(address);
				data.address_text = address_text;
				uni.showLoading({
					title:'加载中'
				})
				if(isClick){
					isClick = false;
					uni.request({
						url: base_url + 'home/WxStore/addAssembleOrder',
						data: data,
						method: 'POST', 
						success: function (res) {
							//console.log(res);
							if(res.data.errorCode==0){
								if(res.data.data.state==0){
									uni.request({
										url: base_url + '../extend/pay/request/WxAssemblePay.php',
										data: {oid: res.data.data.oid},
										method: 'GET', 
										success: function (res) {
											uni.hideLoading();//隐藏提示层
											isClick = true;//按钮可以点击   
											uni.requestPayment({
												'timeStamp': res.data.timeStamp,
												'nonceStr': res.data.nonceStr,
												'package': res.data.package,
												'signType': 'MD5',
												'paySign': res.data.paySign,
												'success': function (res) {
													uni.showToast({
														title: '支付成功',
														icon: 'success',
														success: function () {
															setTimeout(function(){
																uni.reLaunch({
																	url:'/pages/userCenter/userCenter/userCenter'
																})
															},1000)
														}
													})
												}
											})
										}
									})
								}
								else{
									uni.hideLoading();//隐藏提示层
									isClick = true;//按钮可以点击 
									uni.showToast({
										title:"提交成功",
										icon:'success',
										success:function(){
											setTimeout(function(){
												uni.reLaunch({
													url:'/pages/userCenter/userCenter/userCenter'
												})
											},1000)
										}
									})
								}
							}
							else{
								uni.hideLoading();//隐藏提示层
								isClick = true;//按钮可以点击 
								uni.showToast({
									title:res.data.errorInfo,
									icon:'none',
									duration:2000
								})
							}
						}
					})
				}
			},
			
			
		}
	}
</script>

<style>
	@import url("./confirmOrder.css");
</style>
