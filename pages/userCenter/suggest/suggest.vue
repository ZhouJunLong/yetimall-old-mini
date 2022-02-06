<template>
	<view class="wrap">
		<!-- 内容区域 -->
		<view class="main-area">
			<view class="input-area">
				<view class="title">姓名</view>
				<view class="input-list">
					<input type="text" class="inp" @input="getInfo" data-type="name" placeholder="请输入姓名" placeholder-class="tip"></input>
				</view>
			</view>
			<view class="input-area">
				<view class="title">手机号码</view>
				<view class="input-list">
					<input type="number" class="inp" @input="getInfo" data-type="phone" placeholder="请输入联系方式" placeholder-class="tip"></input>
				</view>
			</view>
			<view class="input-area">
				<view class="title">意见</view>
				<textarea class="message" @input="getInfo" data-type="content" placeholder="请输入您对我们平台的意见和建议" placeholder-class="tip" placeholder-style="font-size:14px;color:#b5c0ce;"></textarea>
			</view>
			<view class="btn-area">
				<view class="submit" @click="submit">提交</view>
			</view>
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
	
	export default {
		data() {
			return {
				base_url: base_url,//BASE_URL
				userInfo: [],//用户信息
				cityInfo: [],//用户城市信息
				name: '',//姓名
				phone: '',//手机号
				content: '',//意见内容
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
		},
		onShow() {
			var that = this;
			
			//用户缓存信息
			userInfo = uni.getStorageSync("userInfo");
			
			//获取用户信息
			that.getUserInfo();
		},
		methods: {
			//获取用户信息
			getUserInfo:function(){
				var that = this;
				tools.httpClient('home/WxStore/getUserInfo',{'user_id':userInfo.id}, (error, res) => {
					if (res.errorCode == 0) {
						var userData = res.data;
						userInfo = userData;
						that.userInfo = userData;
					}
				})
			},
			
			//获取输入信息
			getInfo:function(e){
				var that = this;
				var type = e.currentTarget.dataset.type;
				var value = e.detail.value;
				if(type == "name"){
					that.name = value;
				}else if(type == "phone"){
					that.phone = value;
				}else if(type == "content"){
					that.content = value;
				}
			},
			
			//保存
			submit:function(){
				var that = this;
				//判断用户授权
				if(!tools.isWeixinLogin()){
					return false;
				};
				var data = {
					user_id: userInfo.id,
					name: that.name,
					phone: that.phone,
					content: that.content,
					city_id: cityInfo.id?cityInfo.id:0,
					city: cityInfo.city?cityInfo.city:'',
				};
				if(data.name=='' || data.name==null){
					uni.showToast({
						title:'姓名不可为空',
						icon:'none',
						duration:1500
					})
					return false;
				}
				if(data.phone=='' || data.phone==null){
					uni.showToast({
						title:'手机号码不可为空',
						icon:'none',
						duration:1500
					})
					return false;
				}
				if(data.phone.length != 11){
					uni.showToast({
						title:'手机号码格式不正确',
						icon:'none',
						duration:1500
					})
					return false;
				}
				if(data.content=='' || data.content==null){
					uni.showToast({
						title:'意见不可为空',
						icon:'none',
						duration:1500
					})
					return false;
				}
				uni.showLoading({
					title:'加载中'
				})
				tools.httpClient('home/WxStore/addSuggest', data, (err, res) => {
					uni.hideLoading();
					if (res.errorCode == 0) {
						uni.showToast({
							title:'提交成功',
							icon:'success',
							success:function(){
								setTimeout(function(){
									uni.navigateBack();
								},1000)
							}
						})
					}else{
						uni.showModal({
							title: '提示',
							content: res.data.errorInfo,
							showCancel: false,
							confirmText: '确定',
							confirmColor: '#3056d1',
							success: function (res) {
								if (res.confirm) {} 
								else if (res.cancel) {}
							}
						})
					}
				})
			},
			
		}
	}	
</script>

<style>
	@import url("./suggest.css");
</style>
