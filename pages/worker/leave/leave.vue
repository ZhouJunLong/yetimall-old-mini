<template>
	<view class="wrap">
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
						<view v-for="(item,index) in dayArr">{{item}}</view>
					</view>
					<view class="calendar-bot">
						<block v-for="(item,index) in dateArr">
							<view>
								<block v-if="item.date_time <= today">
									<view class="calendar-date old">
										<view>{{item.dateNum}}</view>
									</view>
								</block>
								<block v-if="item.date_time > today">
									<view v-if="item.is_work == 1" :class="date == item.date_time?'calendar-date future now':'calendar-date future'" :data-year="year" :data-month="month" :data-date="item.dateNum"  @click="clickDate">
										<view>{{item.dateNum}}</view>
									</view>
									<view v-if="item.is_work != 1" class="calendar-date old">
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
				<textarea class="content" @input="getContent" placeholder="请假理由" placeholder-style="color:#999;font-size:13px;" v-model="desc"></textarea>
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
	var app = getApp();
	var userInfo = "";
	var cityInfo = "";
	var base_url = CONFIG.BASE_URL;
	var page = 1;
	var pageSize = 15;
	var allPages = 0;
	var bStop = true;
	var is_click = true;
	var now = new Date();
	
	var year = now.getFullYear();
	var month = now.getMonth() + 1;
	var monthTwo = month < 10 ? '0' + month : month;
	var date = now.getDate() < 10 ? '0'+now.getDate() : now.getDate();
	
	export default {
		data() {
			return {
				base_url: base_url,
				userInfo: [],//用户信息
				cityInfo: [],//用户城市信息
				year: 0,
				month: 0,
				dayArr: ['日', '一', '二', '三', '四', '五', '六'],
				dateArr: [],
				today: '',  //当天年月日
				date:'', //请假日期
				timeList:[],
				content:'',
				desc:''
			}
		},
		onLoad(options) {
			var that = this;
			
			//用户缓存信息
			userInfo = uni.getStorageSync("userInfo");
			
			//获取用户信息
			that.getUserInfo();
		},
		onShow() {
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
			
			//初始化日历
			that.dateInit();
			that.year = year;
			that.month = month;
			that.today =  year +'-'+ monthTwo + '-' + date;
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
				//全部时间的月份都是按0~11基准，显示月份才+1
				var dateArr = [];  //需要遍历的日历数组数据
				var arrLen = 0;    //dateArr的数组长度
				var now = setYear ? new Date(setYear, setMonth) : new Date();
				var year = setYear || now.getFullYear();
				var nextYear = 0;
				var month = setMonth || now.getMonth(); //没有+1方便后面计算当月总天数
				var nextMonth = (month + 1) > 11 ? 1 : (month + 1);
				var startWeek = new Date(year + '/' + (month + 1) + '/' + 1).getDay();//目标月1号对应的星期
				var dayNums = new Date(year, nextMonth, 0).getDate(); //获取目标月有多少天
				var obj = {};
				var num = 0;
				if (month + 1 > 11) {
					nextYear = year + 1;
					dayNums = new Date(nextYear, nextMonth, 0).getDate();
				}
				arrLen = startWeek + dayNums;
				for (var i = 0; i < arrLen; i++) {
					if (i >= startWeek) {
						num = i - startWeek + 1;
						var numTwo = num < 10 ? '0' + num : num;
						var monthTwo = month + 1 < 10 ? '0' + (month + 1) : (month + 1);
						var date_time = year + '-' + monthTwo + '-' + numTwo;
						obj = {
							date_time: date_time,
							dateNum: num,
						}
					} else {
						obj = {};
					}
					dateArr[i] = obj;
				}
				this.isAgreeLeave(dateArr);
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
				let date = year + '-' + month + '-' + day;
				that.date = date;
			},
			
			//判断某天是会否上班
			isAgreeLeave:function(dateArr){
				var that = this;
				let data = {
					date_str:JSON.stringify(dateArr),
					worker_id:userInfo.worker_id
				}
				tools.httpClient("home/WxStore/isAgreeLeave",data,function(err,res){
					if(res.errorCode==0){
						that.dateArr = res.data;
					}
				})
			},
			
			//获取理由
			getContent:function(e){
				var that = this;
				var content = that.desc;
				that.content = content;
			},
			
			//提交
			submit:function(){
				var that = this;
				//判断用户授权
				if(!tools.isWeixinLogin()){
					return false;
				}
				//请假日期
				if(that.date=='' || that.date==null){
					uni.showToast({
						title:'请选择日期',
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
					date_one:that.date,
					content:that.content,
					worker_id:userInfo.worker_id
				};
				tools.httpClient("home/WxStore/addLeave",data,function(err,res){
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
			}
		}
	}
</script>

<style>
	@import url("./leave.css");
	@import url("/app.css");
</style>
