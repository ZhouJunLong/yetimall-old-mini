const BASE_URL = "https://yetimall.fun/public/"
// const BASE_URL = "http://192.168.1.176/swmy/public/"
const stateConfig = [
    {
        state:'0',
        stateStatus:'待付款',
        stateTitle:'您有待付款订单',
        stateDes:'请尽快付款，超时订单将会关闭',
        showTime:true,
        showCancelBtn:true,
        showPayBtn:true,
        showPayMethod:false
    },
    {
        state:'1',
        stateStatus:'待发货',
        stateTitle:'订单待发货',
        stateDes:'订单待发货',
        showPayMethod:true,
        showRefundOrderBtn:true
    },
    {
        state:'2',
        stateStatus:'待收货',
        stateTitle:'订单待收货',
        stateDes:'订单待收货',
        showPayMethod:true,
        showDelivery:true
    },
    {
        state:'3',
        stateStatus:'已完成',
        stateTitle:'交易成功',
        stateDes:'感谢您对YEYE的信任，期待您再次选择',
        showPayMethod:true,
        showDelivery:true,
        showDeleteOrderBtn:true
    },
    {
        state:'4',
        stateStatus:'交易关闭',
        stateTitle:'交易关闭',
        stateDes:'由于您未在规定时间内完成付款，交易已关闭，期待您再次选择',
        showDeleteOrderBtn:true
    },
    {
        state:'5',
        stateStatus:'已结束',
        stateTitle:'订单已结束',
        stateDes:'感谢您对YEYE的信任，期待您再次选择',
        showPayMethod:true,
        showDelivery:true,
        showDeleteOrderBtn:true,
        showComment:false
    },
    {
        state:'6',
        stateStatus:'退款中',
        stateTitle:'订单退款中',
        stateDes:'订单退款中',
        showPayMethod:true
    },
    {
        state:'7',
        stateStatus:'已退款',
        stateTitle:'订单已退款',
        stateDes:'交易已退款，期待您再次选择',
        showPayMethod:true
    },
    {
        state:'8',
        stateStatus:'已取货',
        stateTitle:'已取货',
        stateDes:'感谢您对YEYE的信任，期待您再次选择',
        showPayMethod:true,
        showDelivery:true,
        showDeleteOrderBtn:true
    },
    {
        state:'9',
        stateStatus:'交易删除',
        stateTitle:'交易已删除',
        stateDes:'交易已删除',
    },
    {
        state:'10',
        stateStatus:'交易删除',
        stateTitle:'交易已删除',
        stateDes:'交易已删除',
    },
]
export default {
    BASE_URL,
    stateConfig
}