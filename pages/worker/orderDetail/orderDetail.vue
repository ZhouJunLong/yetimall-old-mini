<template>
	<view class="wrap">
		<view class="header">
			<image :src="img" class="top-img" mode="widthFix">
				<view class="title">订单详情</view>
			</image>
		</view>
		<view class="box">
			<view class="head">
				<view class="left">
					<view class="head-img">
						<image :src="recordInfo.orderInfo.head_img_url"  mode="widthFix"></image>
					</view>
					<view class="nick_name">{{recordInfo.orderInfo.nick_name}}</view>
				</view>
				<view class="right">预约上门：{{recordInfo.order_time}}</view>
			</view>
			<view class="center">
				<view class="left">
					<image :src="base_url+recordInfo.orderInfo.good_img"  mode="widthFix"></image>
				</view>
				<view class="right">
					<view class="tops">{{recordInfo.orderInfo.good_name}}</view>
					<view class="middle">规格：{{recordInfo.orderInfo.good_desc}}</view>
					<view class="middle">服务人员：{{recordInfo.orderInfo.server_person}}人</view>
					<view class="money">￥{{recordInfo.orderInfo.good_price}}</view>
				</view>
			</view>
			<view class="address">地址：{{recordInfo.orderInfo.address.address}}</view>
			<view class="footer">
				<view class="left"></view>
				<view class="right">
					共1项服务   合计：<text>￥{{recordInfo.orderInfo.total_price}}</text>
				</view>
			</view>
		</view>
		<view class="box">
			<view class="reserve">
				<view class="left">本次服务次数：</view>
				<view class="right">{{recordInfo.orderInfo.total_num}}次</view>
			</view>
			<view class="reserve">
				<view class="left">剩余服务次数：</view>
				<view class="right">{{recordInfo.orderInfo.residue_num}}次</view>
			</view>
			<view class="reserve">
				<view class="left">服务人员：</view>
				<view class="right">{{recordInfo.worker_name}} {{recordInfo.orderInfo.address.phone}}</view>
			</view>
		</view>
		<view class="box">
			<view class="reserve">
				<view class="left">姓名：</view>
				<view class="right">{{recordInfo.orderInfo.address.name}}</view>
			</view>
			<view class="reserve">
				<view class="left">手机：</view>
				<view class="right">{{recordInfo.orderInfo.address.phone}}</view>
			</view>
			
			<view class="reserve time">
				<view class="left">预约时间：</view>
				<view class="right">{{recordInfo.add_time}}</view>
			</view>
		</view>
		<view class="remarks">
			客户备注：{{recordInfo.remark?recordInfo.remark:'无'}}
		</view>
		<view class="remarks">
			管理备注：无
		</view>
		<view class="btn-area">
			<view class="left" @click="callPhone"><text class="iconfont icon-bohao"></text>一键拨号</view>
			<view class="left" @click="navigation"><text class="iconfont icon-daohang"></text>一键导航</view>
		</view>
	</view>
</template>

<script>
	import CONFIG from '../../../common/config.js';
	import tools from '../../../common/tools.js';  
	const base_url = CONFIG.BASE_URL;
	var app = getApp();
	var userInfo = "";
	var page = 1;
	var pageSize = 10;
	var allPages = 0;
	var bStop = true;
	var is_click = true;
	
	export default {
		data() {
			return {
				base_url: base_url,//BASE_URL
				recordInfo:'',
				img:base_url+'bg/login_bg.png',
			}
		},
		onLoad(options) {
			var that = this;	
			if(options.oid){
				that.getOrderRecord(options.oid);
			}
		},
		methods: {
			//获取预约信息
			getOrderRecord:function(id){
				var that = this;
				tools.httpClient('home/WxStore/getOrderRecord', {id:id}, (error, res) => {
					if (res.errorCode == 0) {
							that.recordInfo = res.data;
					}
				});
			},
			
			//一键拨号
			callPhone:function(){
				let that = this;
				let phone = that.recordInfo.orderInfo.address.phone;
				uni.makePhoneCall({
					phoneNumber:phone,
					fail:function(){
						
					}
				})
			},
			
			//一键导航
			navigation:function(){
				let that = this;
				let lon = parseFloat(that.recordInfo.orderInfo.address.longitude);
				let lat = parseFloat(that.recordInfo.orderInfo.address.latitude);
				let address = that.recordInfo.orderInfo.address.area;
				uni.openLocation({
					latitude:lat,
					longitude:lon,
					address:address
				})
			},
		}
	}
</script>

<style>
	@import url("./orderDetail.css");
	@import url("/app.css");
</style>
