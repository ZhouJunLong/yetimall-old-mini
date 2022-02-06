<!--四栏底部导航-->
<template name="bottom-nav">
    <view class="nav-list">
        <navigator class="item {{home}}" open-type='reLaunch' url='/pages/index/index'>
            <icon class="iconfont icon-jiazhengfuwu01"></icon>
            <view class='nav-title'>首页</view>
        </navigator>
        <navigator class="item {{cate}}" open-type='reLaunch' url='/pages/store/cate/cate'>
            <icon class="iconfont icon-leimupinleifenleileibie"></icon>
            <view class='nav-title'>分类</view>
        </navigator>
        <navigator class="item {{orderList}}" open-type='reLaunch' url='/pages/userCenter/orderList/orderList'>
            <icon class="iconfont icon-dingdan1"></icon>
            <view class='nav-title'>订单</view>
        </navigator>
		<navigator class="item {{center}}" open-type='reLaunch' url='/pages/userCenter/userCenter/userCenter'>
		    <icon class="iconfont icon-wode"></icon>
		    <view class='nav-title'>我的</view>
		</navigator>
    </view>
</template>

<!--两栏底部导航-->
<template name="bottom-nav-2">
    <view class="nav-list">
        <navigator class="item {{home}}" open-type='reLaunch' url='/pages/worker/index/index'>
            <text class="iconfont icon-dingdan"></text>
            <view class='nav-title'>接单大厅</view>
        </navigator>
        <navigator class="item {{center}}" open-type='reLaunch' url='/pages/worker/workerCenter/workerCenter'>
            <i class="iconfont icon-gerenzhongxin1"></i>
            <view class='nav-title'>个人中心</view>
        </navigator>
    </view>
</template>