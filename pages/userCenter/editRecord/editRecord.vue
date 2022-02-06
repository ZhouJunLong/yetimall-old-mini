<template>
	<view class="wrap">
		<!-- 选择预约时间 -->
		<view class="top-area">选择预约时间：</view>
		<!-- 主体 -->
		<view class="main-area">
			<!-- 日历 -->
			<view class="date-area">
				<!-- 年月 -->
				<view class="month-area">
					<text class="iconfont icon-left" @click="lastMonth"></text>
					<view class="month">{{year}}年{{month}}月</view>
					<text class="iconfont icon-you1" @click="nextMonth"></text>
				</view>
				<!-- 日历主体 -->
				<view class="calendar-area">
					<view class="calendar-top">
						<block v-for="(item, index) in dayArr">
							<view>{{item}}</view>
						</block>
					</view>
					<view class="calendar-bot">
						<block v-for="(item, index) in dateArr">
							<view>
								<view v-if="item.date_time <= today" :class="[date == item.date_time?'calendar-date old now':'calendar-date old']">
									<view>{{item.dateNum}}</view>
								</view>
								<view v-else-if="item.date_time > today" :class="[date == item.date_time?'calendar-date future now':'calendar-date future']" @click="clickDate" :data-year="year" :data-month="month" :data-date="item.dateNum">
									<view>{{item.dateNum}}</view>
								</view>
							</view>
						</block>
					</view>
				</view>
			</view>
			<!-- 时间区域 -->
			<view class="time-area">
				<block v-for="(item, index) in timeList">
					<view :class="[time == item.time?'time-list cur':'time-list']" @click="selectTime" :data-index="index">
						<text>{{item.time}}</text>
						<view class="tip" v-if="item.is_selected == 1">可预约</view>
						<view class="tip-two" v-if="item.is_selected == 0">约满</view>
					</view>
				</block>
			</view>
			<!-- 提交 -->
			<view class="btn-area">
				<view class="submit" @click="submit">确定</view>
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
				id: 0,//记录id
				recordInfo: [],//记录信息
				year: 0,//年
				month: 0,//月
				dayArr: ['日', '一', '二', '三', '四', '五', '六'],//星期数组
				dateArr: [],//日期数组
				today: '',//当天年月日
				date: '', //服务日期
				timeList: [],//时间数组
				time: '', //具体时间
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
			var id = options.id;
			that.id = id;
			
			//获取预约记录信息
			that.getRecordInfo(id);
		},
		methods: {
			//获取预约记录信息
			getRecordInfo:function(id){
				var that = this;
				tools.httpClient("home/WxStore/getOrderRecord",{'id': id},function(err,res){
					//console.log(res);
					if(res.errorCode == 0){
						that.recordInfo = res.data;
						that.date = res.data.date;
						that.time = res.data.time;
						
						//获取日期
						let now = new Date();
						let year = now.getFullYear();
						let month = now.getMonth() + 1;
						let monthTwo = month < 10 ? '0' + month : month;
						let date = now.getDate() < 10 ? '0'+now.getDate() : now.getDate();
						that.dateInit();
						that.year = year;
						that.month = month;
						//that.date = year + '-' + monthTwo + '-' + date;
						that.today = year +'-'+ monthTwo + '-' + date;
						
						//获取时间列表
						that.getTimeList();
					}
				})
			},
			
			//获取用户信息
			getUserInfo:function(){
				var that = this;
				tools.httpClient('home/WxStore/getUserInfo', {user_id:1}, (error, result) => {
					if (result.errorCode == 0) {
						var userData = result.data;
						userInfo = userData;
						that.userInfo = userData;
					}
				})
			},
			
			//获取时间列表
			getTimeList:function(){
				var that = this;
				var data = {
					city_id: cityInfo.id?cityInfo.id:0,
					oid: that.recordInfo.oid,
					date: that.date,
				};
				tools.httpClient('home/WxStore/getTimeList',data, (error, res) => {
					if (res.errorCode == 0) {
						that.timeList = res.data;
					}
				})
			},
			
			//初始化日历
			dateInit: function (setYear, setMonth) {
				var that = this;
				//全部时间的月份都是按0~11基准，显示月份才+1
				let dateArr = [];  //需要遍历的日历数组数据
				let arrLen = 0;    //dateArr的数组长度
				let now = setYear ? new Date(setYear, setMonth) : new Date();
				let year = setYear || now.getFullYear();
				let nextYear = 0;
				let month = setMonth || now.getMonth(); //没有+1方便后面计算当月总天数
				let nextMonth = (month + 1) > 11 ? 1 : (month + 1);
				let startWeek = new Date(year + '/' + (month + 1) + '/' + 1).getDay();//目标月1号对应的星期
				let dayNums = new Date(year, nextMonth, 0).getDate(); //获取目标月有多少天
				let obj = {};
				let num = 0;
				if (month + 1 > 11) {
					nextYear = year + 1;
					dayNums = new Date(nextYear, nextMonth, 0).getDate();
				}
				arrLen = startWeek + dayNums;
				for (let i = 0; i < arrLen; i++) {
					if (i >= startWeek) {
						num = i - startWeek + 1;
						let numTwo = num < 10 ? '0' + num : num;
						let monthTwo = month + 1 < 10 ? '0' + (month + 1) : (month + 1);
						obj = {
							date_time: year + '-' + monthTwo + '-' + numTwo,
							dateNum: num,
							weight: 5
						}
					} else {
						obj = {};
					}
					dateArr[i] = obj;
				}
				that.dateArr = dateArr;
				console.log(dateArr)
			},
			
			//切换上个月
			lastMonth: function () {
				var that = this;
				//全部时间的月份都是按0~11基准，显示月份才+1
				var year = that.month - 2 < 0 ? that.year - 1 : that.year;
				var month = that.month - 2 < 0 ? 11 : that.month - 2;
				that.year = year;
				that.month = (month + 1);
				//that.dateInit(year, month);
			},
			
			//切换下个月
			nextMonth: function () {
				var that = this;
				//全部时间的月份都是按0~11基准，显示月份才+1
				var year = that.month > 11 ? that.year + 1 : that.year;
				var month = that.month > 11 ? 0 : that.month;
				that.year = year;
				that.month = (month + 1);
				//that.dateInit(year, month);
			},
			
			//点击日期
			clickDate:function(e){
				var that = this;
				var year = e.currentTarget.dataset.year;
				var month = e.currentTarget.dataset.month;
				var day = e.currentTarget.dataset.date;
				that.year = year;
				that.month = month;
				month = month < 10 ? '0' + month : month;
				day = day < 10 ? '0' + day : day;
				that.date = year + '-' + month + '-' + day;
				that.time = '';
				
				//获取时间列表
				that.getTimeList();
			},
			
			//选择时间
			selectTime:function(e){
				let that = this;
				let index = e.currentTarget.dataset.index;
				let timeList = that.timeList;
				if(timeList[index].is_selected == 1){
					that.time = timeList[index].time;
				}
			},
			
			//提交
			submit:function(){
				let that = this;
				if(that.date=='' || that.date==null){
					uni.showToast({
						title:'请选择日期',
						icon:'none',
						duration:2000
					})
					return false;
				}
				if(that.time=='' || that.time==null){
					uni.showToast({
						title:'请选择时间',
						icon:'none',
						duration:2000
					})
					return false;
				}
				let order_time = that.date + ' ' + that.time;
				let rid = that.recordInfo.id;
				let data = {
					id: rid,
					order_time: order_time
				};
				tools.httpClient('home/WxStore/updateOrderRecord',data, (error, res) => {
					if (res.errorCode == 0) {
						uni.showToast({
							title:'改约成功',
							icon:'success',
							success:function(){
								setTimeout(function(){;
									//返回上一页并携带参数
									var pages = getCurrentPages();
									var prevPage = pages[pages.length - 2];
									prevPage.is_update = 1;
									uni.navigateBack({
										delta: 1
									})
								},1500)
							}
						})
					}
					else{
						uni.showToast({
							title:'改约失败',
							icon:'none',
							duration:2000
						})
					}
				})
			},
			
			
		}
	}
</script>

<style>
	@import url("./editRecord.css");
</style>
