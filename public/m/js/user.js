$(function () {


    // 页面一加载渲染 用户名和 手机号
    $.ajax({
        url: '/user/queryUserMessage',
        success: function (data) {
            console.log(data);
            if (data.error) {
                //没登录 打回登录页面
                location = 'login.html?returnUrl=' + location.href;

            } else {
                // 当数据请求成功 表示已经登录了 就显示这个页面
                document.documentElement.style.display = 'block';
                // 就2个内容不用添加模板了
                $('#main .userName').html(data.username);
                $('#main .mobile').html(data.mobile);
            }

        }
    });

    // 退出登录点击事件
    $('#main .exit-btn').on('tap', function () {
        $.ajax({
            url: '/user/logout',
            success: function (data) {
                console.log(data);
                // 如果退出成功则跳转到登录页面,还需要拼接一个参数当前浏览器的地址,因为可能只是换个账户
                if (data.success) {
                    location = 'login.html?returnUrl=' + location.href;
                }
            }
        })
    });


})