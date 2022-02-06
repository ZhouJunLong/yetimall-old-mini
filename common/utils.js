var CONFIG = require('./config.js');
var base_url = CONFIG.default.BASE_URL;
function httpGet(url,data,callback){
	uni.request({
		url:base_url + url,
		data:data,
		header: {
			"Content-Type": "application/json"
		},
		method:"GET",
		dataType:"json",
		success:function(res){
			callback( null, res.data )
		},
		error:function(){
			uni.showToast({
				title:"请求失败",
				icon:none,
				duration:1500
			})
		}
	})
}

function httpPost(url,data,callback){
	uni.request({
		url:base_url + url,
		method:"POST",
		data:data,
		header: {
			"Content-Type": "application/x-www-form-urlencoded"
		},
		dataType:"json",
		success:function(res){
			callback( null, res.data )
		},
		error:function(){
			uni.showToast({
				title:"请求失败",
				icon:none,
				duration:1500
			})
		}
	})
}

function showTip(title,time,icon="none",callback=null){
	uni.showToast({
		title:title,
		icon:icon,
		duration:time,
		success:callback
	})
}

function showModal(content,callback=null){
	uni.showModal({
		title:'提示',
		content:content,
		showCancel:false,
		confirmColor:'#3D6ECD',
		success:callback
	});
}

// 判断用户是否微信授权
function isWxLogin(callback) {
	let userInfo = uni.getStorageSync("userInfo");
	if (userInfo.id) {
		if(userInfo.is_register == 1){
			callback(true); //已授权
		}else{
			uni.navigateTo({
				url:'/pages/register/register'
			})
		}
	} else {
		uni.login({
			success: function(res) {
				if (res.code) {
					let code = res.code;
					uni.showLoading({
						title:''
					})
					uni.request({
						url:base_url + 'home/User/getOpendIdByCode',
						method:"GET",
						data:{
							jsCode:code
						},
						header: {
							"Content-Type": "application/json"
						},
						dataType:"json",
						success:function(res){
							let data = res.data;
							if(data.errorCode == 0){//获取成功
								let thirdRD_session = data.data.thirdRD_session;
								//后台传回thirdRD_session存入storage,用于后续通信使用
								uni.setStorageSync('thirdRD_session', thirdRD_session );
								uni.setStorage({
									key: "userInfo",
									data: data.data.userInfo
								});
								// 缓存
								setTimeout(function(){
									callback(true);
								},100);
							}else if(data.errorCode == 2){//无用户只有openId 跳转页面拉取用户信息
								let openId = data.data.openid;
								let thirdRD_session = data.data.thirdRD_session;
								//后台传回thirdRD_session存入storage,用于后续通信使用
								uni.setStorageSync('thirdRD_session', thirdRD_session );
								uni.showModal({
									title: '提示',
									content: '继续使用小程序需要您授权头像昵称等信息',
									showCancel: true,
									confirmText: '去授权',
									confirmColor: '#4F87F2',
									success: function(res) {
										if (res.confirm) {
											uni.navigateTo({
												url: `/pages/wxlogin/login?openId=${openId}`,
											})
										}
									}
								})
								callback(false); //未授权
							}
							uni.hideLoading();
						},
						error:function(){
							uni.showToast({
								title:"请求失败",
								icon:none,
								duration:1500
							})
						}
					})
				} else {
					callback(false); //未授权
				}
			}
		});

	}
}
module.exports = {
	httpGet: httpGet,
	httpPost: httpPost,
	showTip: showTip,
	showModal:showModal,
	isWxLogin:isWxLogin,
}