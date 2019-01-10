$(function () {

    /* 一   1.给登录按钮添加添加事件
            2.默认输入框有内容,
            3.遍历用户名和密码,
            4.获取用户名和密码,如果内容没输入提示对应的placeholder的内容 
            5.如果输入框不为空 则发送ajax做判断
            
            */
    //  声明一个全局变量
    var username = '';
    var password = '';
    $('#login button').on('click', function () {
        // 局部变量
        username = $('.userName').val().trim();
        password = $('.password').val().trim();
        inputEmpty()
        // 用开关思想默认为输入框有内容
        var check = true;
        // 获取输入框
        // 如果为true则证明内容不为空
        if (check) {
            queryUser()
        }
    });
    // 二.密码框键盘按下事件
    // 1. 当用户输入完密码后, 按下键盘, 发送Ajax
    // 2.同时要判断内容为空不
    $('.password').on('keydown', function (e) {
        e = e || window.event;
        username = $('.userName').val().trim();
        password = $('.password').val().trim();
        // 按回车
        if (e.keyCode == 13) {
            inputEmpty();
            queryUser()
        }
    })

    // 判断输入框内容为空
    function inputEmpty() {
        var inputs = $('#login input');
        inputs.each(function (i, ele) {
            var val = $(ele).val().trim();
            // 如果文本为空,提示对应placeholder的内容
            if (!val) {
                var tip = $(ele).attr('placeholder');
                console.log(tip);
                alert(tip + ' an not empty ')
                return false;
            }
        });
    };

    function queryUser() {
        $.ajax({
            url: '/employee/employeeLogin',
            type: 'post',
            data: {
                username: username,
                password: password
            },
            success: function (data) {
                console.log(data);
                if (data.success) {
                    location = 'index.html';
                } else {
                    alert(data.message);
                }
            }
        })
    };
});