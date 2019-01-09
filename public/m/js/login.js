$(function () {
    // 0.点击登录按钮
    // 1获取用户名和密码
    // 2.用户名和密码非空检测
    //3.调用接口传参 
    // 4.接受API返回值,成功让用户加入购物车,登录失败提示
    $('#main .btn-login').on('tap', function () {
        // 1.1获取用户名去掉前后空格
        var userName = $('#main .userName').val().trim()
        if (!userName) {
            mui.toast('请输入账号', {
                duration: 'short',
                type: 'div'
            });
            return false;
        }
        // 1.2 获取用户密码去掉前后空格
        var passWord = $('#main .passWord').val().trim()
        if (!passWord) {
            mui.toast('请输入密码', {
                duration: 'short',
                type: 'div'
            });
            return false;
        }
        //2.1调用接口发送ajax请求
        $.ajax({
            type: 'post',
            url: '/user/login',
            data: {
                username: userName,
                password: passWord
            },
            success: function (data) {
                console.log(data);
                // 2.2返回成功或者失败
                if (data.success) {
                    // 成功,跳转回url参数传的对应页
                    // 获取url参数
                    var url = getQueryString('returnUrl');
                    console.log(url);
                    location = url;
                } else {
                    // 不成功,提示用户
                    mui.toast(data.message, {
                        duration: 'short',
                        type: 'div'
                    });
                }
            }
        })
    })
    // 3.新用户注册
    $('#main .btn-register').on('tap',function(){
        // 还没 处理玩
        location = 'register.html';
        
    })

    // 使用网上的正则拿到ulr参数
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    }




})