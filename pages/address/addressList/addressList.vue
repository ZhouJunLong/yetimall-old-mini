<template>
	<view class="wrap">
		<view class="address-area">
			<block v-for="(item, index) in addressList">
				<view class="address-list">
					<view class="addresss-top">
						<view class="address-name">
							<text class="name">{{item.name}}</text>
							<text class="phone">{{item.send_phone}}</text>
						</view>
						<view class="address-detail">{{item.address}}{{item.address_detail}}</view>
					</view>
					<view class="address-bottom">
						<view class="operate-left" @click="setDefaultAddress(item.id,index)">
							<view class="check-area">
								<block v-if="item.is_default == 1">
									<text class="iconfont icon-fuxuankuangweixuanzhong"></text>
									<text class="iconfont icon-xuanzhongzhuangtai seleted"></text>
									<text class="selete" v-if="language == 0">기본 주소 설정</text>
									<text class="selete" v-else>设置默认地址</text>
								</block>
								<block v-else>
									<text class="iconfont icon-fuxuankuangweixuanzhong"></text>
									<text class="selete" v-if="language == 0">기본 주소 설정</text>
									<text class="selete" v-else>设置默认地址</text>
								</block>
							</view>
						</view>
						<view class="operate-right" v-if="language == 0">
							<view class="btn-list" @click="editAddress(item.id)">편집 하 다.</view>
							<view class="btn-list" @click="deleteAddress(item.id)">삭제</view>
						</view>
						<view class="operate-right" v-else>
							<view class="btn-list" @click="editAddress(item.id)">编辑</view>
							<view class="btn-list" @click="deleteAddress(item.id)">删除</view>
						</view>
					</view>
				</view>
			</block>
		</view>
		<view class="submit-area" @click="addAddress">
			<text class="submit" v-if="language == 0">주소 추가</text>
			<text class="submit" v-else>新增地址</text>
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
				addressList: [], //地址列表
				userInfo:[],
				language:0,
			}
		},
		onLoad(options) {
			var that = this;
			
			//用户缓存信息
			that.userInfo = uni.getStorageSync("userInfo");
			that.language = uni.getStorageSync("language");
		},
		onShow: function() {
			var that = this;
			
			//用户缓存信息
			that.userInfo = uni.getStorageSync("userInfo");
			that.language = uni.getStorageSync("language");
			
			//获取地址列表
			that.getAddressList();
		},
		methods: {
			//获取地址列表
			getAddressList: function(){
				var that = this;
				var phone = that.userInfo.phone;
				tools.httpClient('home/WxStore/addressList', {'phone':phone}, (error, res) => {
					// console.log(res)
					if (res.errorCode == 0) {
						var addressData = res.data;
						that.addressList = addressData;
					}
				});
			},
			
			//设置默认地址
			setDefaultAddress: function(id,index){
				var that = this;
				var addressList = that.addressList;
				if (addressList[index].is_default == 1) { //已经是默认地址
					return false;
				}
				uni.showLoading();
				tools.httpClient('home/WxStore/setDefaultAddress', {'id': id,}, (error, res) => {
					uni.hideLoading();
					if(res.errorCode == 0){
						for(var j=0;j<addressList.length;j++){
							addressList[j].is_default = 0;
						}
						addressList[index].is_default = 1;
						that.addressList = addressList;
					}
				})
			},
			
			//编辑地址
			editAddress: function(id) {
				uni.navigateTo({
					url: '/pages/address/editAddress/editAddress?id='+id,
				})
			},
			
			//删除地址
			deleteAddress: function(id) {
				var that = this;
				uni.showModal({
					title: '提示',
					content: "确定删除地址吗？",
					showCancel: true,
					confirmColor: '#57D0D9',
					success: function(res) {
						if (res.confirm) {
							uni.showLoading();
							tools.httpClient('home/WxStore/deleteAddress', {'id': id}, (error, res) => {
								wx.hideLoading();
								console.log(res)
								if (res.errorCode == 0) {
									uni.redirectTo({
										url: '/pages/address/addressList/addressList',
									})
								}
							})
						}
					}
				})
			},
			
			//添加地址
			addAddress: function() {
				uni.navigateTo({
					url: '/pages/address/addAddress/addAddress',
				})
			}
			
		}
	}
</script>

<style>
	@import url("./addressList.css");
</style>
