import CONFIG from './config.js'
const base_url = CONFIG.BASE_URL
var tools = {

	/**
	 * request请求
	 */
	httpClient(url,data,callback) {
		uni.request({
			url: base_url + url,
			data: data,
			header: {
				"Content-Type": "application/json"
			},
			method: "GET",
			dataType: 'json',
			success: function ( res ) {
				callback( null, res.data )
			},
			fail: function ( error ) {
				callback( error )
			}
		})
	},
	
	/**
	 * 判断微信授权
	 */
	isWeixinLogin() {
		var userInfo = uni.getStorageSync('userInfo');
		if (userInfo) {
			return true;
		}else{
			//弹框提示
			uni.showModal({
				title: '提示',
				content: '微信授权成功即可享受该权益',
				showCancel: true,
				cancelText: '取消',
				cancelColor: '#666666',
				confirmText: '去授权',
				confirmColor: '#57D0D9',
				success: (res) => {
					if (res.confirm) {
						//用户点击去授权
						uni.navigateTo({
							url: '/pages/wxlogin/wxlogin'
						})
					} else if (res.cancel) {}
				}
			})
			return false;
		}
	},
	copy(data) {
		wx.setClipboardData({
			data: data,
			success (res) {
				uni.showToast({
					title:"复制成功",
					icon:'none',
					duration:2000
				})
			}
		  })
	},
	getSafeAreaBottom(){
		const systemInfo = wx.getSystemInfoSync()
		const { screenHeight } = systemInfo;
		const { bottom } = systemInfo.safeArea
		return screenHeight - bottom
	},
	// 手机号隐藏中间四位
	formatPhone(phone){
		if(!phone)return ''
		return phone.substring(0,3) + '****' + phone.substring(7)
	}
}
module.exports = tools;