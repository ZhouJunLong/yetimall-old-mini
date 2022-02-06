<template>
	<view class="wrap">
		<view class="header">
			<view class="left">员工：{{userInfo.nick_name}}</view>
			<view class="right">
				<view class="time">
					<picker  mode="date" :value="date" fields="month" :start="startDate" :end="endDate" @change="dateChange">
						<view class="uni-input">{{date}}<text class="iconfont icon-icon-up1"></text></view>
					</picker>
				</view>
			</view>
		</view>
		<view class="box-area" v-if="salary != 0">
			<view class="box">
				<view class="left">当月单数：</view>
				<view class="right">{{salaryInfo.order_num}}次</view>
			</view>
			<view class="box">
				<view class="left">保底薪资：</view>
				<view class="right">{{salaryInfo.worker_salary}}元</view>
			</view>
			<view class="box">
				<view class="left">上单薪资：</view>
				<view class="right">{{salaryInfo.order_num * salaryInfo.order_fee}}元</view>
			</view>
			<view class="box">
				<view class="left">社保扣款：</view>
				<view class="right">-{{salaryInfo.socialSecurity}}元</view>
			</view>
			<view class="box">
				<view class="left">其他扣款：</view>
				<view class="right">-{{salaryInfo.other}}元</view>
			</view>
			<view class="box">
				<view class="left">实发工资：</view>
				<view class="right money">{{salaryInfo.total}}元</view>
			</view>
		</view>
		<view class="tips" v-if="salary == 0">~暂无记录~</view>
	</view>
</template>

<script>
	import CONFIG from '../../../common/config.js';
	import tools from '../../../common/tools.js';  
	var base_url = CONFIG.BASE_URL;
	var userInfo = "";
	
	export default {
		data() {
			return {
				base_url: base_url,//BASE_URL
				userInfo: [],//用户信息
				date: new Date().toISOString().slice(0, 7),
				salaryInfo :'',
				salary:1,
				startDate:'1499-01-01',
				endDate:'2599-12-31',
			}
		},
		onShow() {
			var that = this;
			
			//用户缓存信息
			userInfo = uni.getStorageSync("userInfo");
			
			//获取用户信息
			that.getUserInfo();
			
			//获取工资记录
			that.getSalaryInfo();
		},
		methods: {
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
			
			//选择日期
			dateChange(e) {
				var that = this;
				that.date = e.target.value.slice(0,7);
				that.getSalaryInfo();
			},
			
			//获取工资记录
			getSalaryInfo:function(){
				var that = this;
				tools.httpClient('home/WxStore/getSalaryInfo', {worker_id:userInfo.worker_id,date:that.date}, (err, res) => {
					if (res.errorCode == 0) {
						//console.log(res);
						var salaryInfo = res.data;
						that.salaryInfo = res.data;
						that.salary = 1;
					}else{
						that.salary = 0;
					}
				});
			},
		}
	}
</script>

<style>
	@import url("./salaryRecord.css");
	@import url("/app.css");
</style>
