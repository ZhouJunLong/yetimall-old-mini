<template>
	<view class="wrap">
		<!-- 内容区域 -->
		<view class="address-area" v-if="orderInfo.address">
			<view class="address-top">
				<view class="name">姓名：{{orderInfo.address.name}}</view>
				<view class="phone">{{orderInfo.address.phone}}</view>
			</view>
			<view class="address-bot">服务地址：{{orderInfo.address.address}}</view>
		</view>
		<view class="time-area">
			<view>预约时间</view>
			<view class="time-list" @click="selectDate">
				<text>{{order_time?order_time:'选择预约时间'}}</text>
				<text class="iconfont icon-icon-up1"></text>
			</view>
		</view>
		<view class="count-area" v-if="orderInfo.type == 1 || orderInfo.type == 4">
			<view>使用次数 (剩余<text class="count">{{orderInfo.residue_num}}</text>)</view>
			<input type="number" class="inp" placeholder="输入次数" placeholder-style="font-size:12px;color:#999;" @input="getCount" />
		</view>
		<view class="message-area">
			<view>备注:</view>
			<input type="text" class="message" placeholder="对本次预约的说明,需要特别标注的事情..." placeholder-style="font-size:12px;color:#999;" @input="getMessage" />
		</view>
		<view class="btn-area">
			<view class="submit" @click="submit">立即预约</view>
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
	var is_click = true;
	
	export default {
		data() {
			return {
				base_url: base_url,//BASE_URL
				userInfo: [],//用户信息
				cityInfo: [],//用户城市信息
				oid: 0,//订单id
				orderInfo: [],//订单信息
				order_time: '',//预约时间
				use_count: '',//使用次数
				remark: '',//备注信息
				order_time: '',//预约时间
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
			
			//页面携带参数
			var oid = options.oid;
			that.oid = oid;
			//选好预约时间
			if(options.order_time){
				that.order_time = options.order_time;
			}
			
			//获取订单信息
			that.getOrderInfo(oid);
		},
		methods: {
			//获取订单信息
			getOrderInfo:function(oid){
				var that = this;
				tools.httpClient('home/WxStore/getOrderInfo', {'oid':oid}, (error, res) => {
					//console.log(res);
					if (res.errorCode == 0) {
						that.orderInfo = res.data;
					}
				})
			},
			
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
			
			//选择上门日期
			selectDate:function(){
				var that = this;
				var oid = that.oid;
				uni.navigateTo({
					url:'/pages/userCenter/selectDate/selectDate?oid='+oid
				})
			},
			
			//获取次数
			getCount:function(e){
				var that = this;
				var count = parseInt(e.detail.value);
				that.use_count = count;
			},
			
			//获取备注
			getMessage:function(e){
				var that = this;
				that.remark = e.detail.value;
			},
			
			//提交
			submit:function(){
				var that = this;
				var orderInfo = that.orderInfo;
				var data = {
					user_id: userInfo.id,
					oid: that.oid,
					order_num: orderInfo.order_num,
					order_time: that.order_time,
					use_count: that.use_count,
					remark: that.remark,
					city_id: cityInfo.id?cityInfo.id:0,
					city: cityInfo.city?cityInfo.city:'',
				};
				var residue_num = parseInt(orderInfo.residue_num);
				if(data.use_count <= 0){
					uni.showToast({
						title:'使用次数不可小于0',
						icon:'none',
						duration:1500
					})
					return false;
				}
				if(data.use_count > residue_num){
					uni.showToast({
						title:'使用次数不可大于可用次数',
						icon:'none',
						duration:1500
					})
					return false;
				}
				if(data.order_time=='' || data.order_time==null){
					uni.showToast({
						title:'请选择上门服务时间',
						icon:'none',
						duration:2000
					})
					return false;
				}
				uni.showLoading({
					title:'加载中'
				})
				if(is_click){
					is_click = false;
					tools.httpClient('home/WxStore/addOrderRecord', data, (err, res) => {
						uni.hideLoading();
						if (res.errorCode == 0) {
							is_click = true;
							uni.showToast({
								title:'预约成功',
								icon:'success',
								success:function(){
									setTimeout(function(){
										//返回上一页并携带参数
										var pages = getCurrentPages();
										var prevPage = pages[pages.length - 2];
										prevPage.is_order = 1;
										uni.navigateBack({
											delta: 1
										})
									},1000)
								}
							})
						}
						else{
							is_click = true;
							uni.showToast({
								title:res.errorInfo,
								icon:'none',
								duration:1500
							})
						}
					})
				}
			},
			
		}
	}
</script>

<style>
	@import url("./orderRecord.css");
</style>
