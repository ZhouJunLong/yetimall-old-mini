<template>
	<view class="wrap">
		<!-- 请假时间 -->
		<view class="top-area">选择请假时间:</view>
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
								<block v-if="item.date_time <= today">
									<view :class="[date == item.date_time?'calendar-date old now':'calendar-date old']">
										<view>{{item.dateNum}}</view>
									</view>
								</block>
								<block v-else-if="item.date_time > today">
									<view v-if="item.is_work == 1" :class="[date == item.date_time?'calendar-date future now':'calendar-date future']" @click="clickDate" :data-year="year" :data-month="month" :data-date="item.dateNum">
										<view>{{item.dateNum}}</view>
									</view>
									<view class="calendar-date old" v-else>
										<view>{{item.dateNum}}</view>
										<view class="holiday">休假</view>
									</view>
								</block>
							</view>
						</block>
					</view>
				</view>
			</view>
			<view class="content-area">
				<textarea class="content" @input="getContent" placeholder="请假理由..." placeholder-style="color:#999;font-size:13px;"></textarea>
			</view>
			<!-- 提交 -->
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
	var is_click = true;
	
	export default {
		data() {
			return {
				base_url: base_url,//BASE_URL
				userInfo: [],//用户信息
				cityInfo: [],//用户城市信息
				year: 0,//年
				month: 0,//月
				dayArr: ['日', '一', '二', '三', '四', '五', '六'],//星期数组
				dateArr: [],//日期数组
				today: '',//当天年月日
				date: '', //请假日期
				timeList: [],//时间数组
				time: '', //具体时间
				content:''
			}
		},
		onLoad(options) {
			var that = this;
			
			//用户缓存信息
			userInfo = {'id':1,'nick_name':'李易峰','manager_id':1};//uni.getStorageSync("userInfo");
			
			//获取用户信息
			that.getUserInfo();
			
			//用户城市信息
			cityInfo = uni.getStorageSync('cityInfo');
			if(cityInfo){
				that.cityInfo = cityInfo;
			}
			
			//获取日期
			let now = new Date();
			let year = now.getFullYear();
			let month = now.getMonth() + 1;
			let monthTwo = month < 10 ? '0' + month : month;
			let date = now.getDate() < 10 ? '0'+now.getDate() : now.getDate();
			that.dateInit();
			that.year = year;
			that.month = month;
			that.today = year +'-'+ monthTwo + '-' + date;
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
				//console.log(year,month,startWeek)
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
				
				//判断某天是会否上班
				that.isAgreeLeave(dateArr);
			},
			
			//判断某天是会否上班
			isAgreeLeave:function(dateArr){
				var that = this;
				var data = {
					date_str: JSON.stringify(dateArr),
					manager_id: userInfo.manager_id
				}
				tools.httpClient("home/WxStore/isManagerAgreeLeave",data,function(err,res){
					if(res.errorCode==0){
						that.dateArr = res.data;
					}
				})
			},
			
			//切换上个月
			lastMonth: function () {
				var that = this;
				//全部时间的月份都是按0~11基准，显示月份才+1
				var year = that.month - 2 < 0 ? that.year - 1 : that.year;
				var month = that.month - 2 < 0 ? 11 : that.month - 2;
				that.year = year;
				that.month = (month + 1);
				that.dateInit(year, month);
			},
			
			//切换下个月
			nextMonth: function () {
				var that = this;
				//全部时间的月份都是按0~11基准，显示月份才+1
				let year = that.month > 11 ? that.year + 1 : that.year;
				let month = that.month > 11 ? 0 : that.month;
				that.year = year;
				that.month = (month + 1);
				that.dateInit(year, month);
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
			},
			
			//获取请假理由
			getContent:function(e){
				var that = this;
				that.content = e.detail.value;
			},
			
			//提交
			submit:function(){
				var that = this;
				if(that.date=='' || that.date==null){
					uni.showToast({
						title:'请选择请假日期',
						icon:'none',
						duration:2000
					})
					return false;
				}
				if(that.content=='' || that.content==null){
					uni.showToast({
						title:'请输入请假理由',
						icon:'none',
						duration:2000
					})
					return false;
				}
				uni.showLoading({
					title:'加载中'
				})
				var data = {
					date_one: that.date,
					content: that.content,
					manager_id: userInfo.manager_id
				};
				tools.httpClient("home/WxStore/addManagerLeave",data,function(err,res){
					if(res.errorCode==0){
						uni.showToast({
							title:'提交成功,等待后台审核!',
							icon:'success',
							success:function(){
								setTimeout(function(){
									uni.navigateBack();
								},1500)
							}
						})
					}
					else{
						uni.showToast({
							title:res.errorInfo,
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
	@import url("./addLeave.css");
</style>
