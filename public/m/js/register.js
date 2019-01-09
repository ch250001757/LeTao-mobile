$(function () {
    /*  0.给注册按钮加点击事件
        1.做非空判断
        2.所有内容不为空的情况,获取表单中所有元素
        3.判断手机号是否输入正确
        4.判断密码和确认密码是否一直
        5.给获取验证码点击事件 发送ajax请求 获取验证码
        6.判断输入框的验证码和获取的验证码是否一直
        7.判断ajax的返回值是否注册成功 成功跳转 页面 不成功提示用户 */

    $('#main .btn-register').on('tap', function () {
        // 做非空判断mui有方法
        // 自己学习写
        // 怎么知道所有内容不为空,用开关思想
        var check = true;
        $('#main .mui-input-row input').each(function (index, ele) {
            // console.log(ele);
            var val = $(ele).val().trim();
            var $lable = $(ele).prev().text();
            if (val == '') {
                // 如果为空check = false
                check = false;
                mui.toast($lable + '不能为空', {
                    duration: 'long',
                    type: 'div'
                });
                // 不能使用return,不阻止默认行为 ? 因为each循环
                return false;
            }
        })
        // 2.如果check为true 所有内容不为空的情况,获取表单中的元素做判断
        if (check) {

            var moblie = $('#main .mui-input-row .moblie').val();
            var userName = $('#main .mui-input-row .userName').val();
            var passWord1 = $('#main .mui-input-row .passWord1').val();
            var passWord2 = $('#main .mui-input-row .passWord2').val();
            var code = $('#main .mui-input-row .code').val();
            // 3手机号码 用正则判断
            if (!(/^1[34578]\d{9}$/.test(moblie))) {
                mui.toast('手机号输入有误', {
                    duration: 'long',
                    type: 'div'
                });
                return false;
            }
            // 4判断密码是否一直
            if (passWord1 != passWord2) {
                mui.toast('两次密码不一致', {
                    duration: 'long',
                    type: 'div'
                });
                return false;
            }
            // 6.判断输入框的验证码和获取的验证码是否一致
            if (vCode != code) {
                mui.toast('验证码输入有误', {
                    duration: 'long',
                    type: 'div'
                });
                return false;
            }
            // 7.判断ajax的返回值是否注册成功 成功跳转 页面 不成功提示用户 */
            $.ajax({
                type:'post',
                url:'/user/register',
                data:{
                    username:userName,
                    password:passWord1,
                    mobile:moblie,
                    vCode:code
                },
                success:function(data){
                    console.log(data);
                    if(data.success){
                        // 注册成功后应该跳转到登录页面, 并且要跟上登录成功后要跳转的url 登录成功去个人中心???
                        location = 'login.html?returnUrl=user.html'        
                    }else {
                        // 不成功
                        mui.toast(data.message, {
                            duration: 'long',
                            type: 'div'
                        });
                    }
                }
            })
        }
    });
    //   5.给获取验证码点击事件 发送ajax请求 获取验证码
    var vCode = '';
    $('#main .btn-code').on('tap', function () {
        $.ajax({
            url: '/user/vCode',
            success: function (data) {
                // 没有失败情况吗
                console.log(data);
                vCode = data.vCode
                console.log(vCode);
            }
        })
    })
})