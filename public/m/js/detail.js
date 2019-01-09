$(function () {

    /*  1.拿url地址中的id
     2.根据当前商品的id发请求,拿数据 
      // 2.1 因为尺码是一个40-50 我们需要把它转换为数组
     3.创建模板渲染模板

     4.轮播图等数据是动态生成的,需要手动调用初始化 */

    var id = getQueryString('id')
    // 渲染页面
    $.ajax({
        url: '/product/queryProductDetail',
        data: {
            id: id
        },
        success: function (obj) {
            // console.log(obj);
            // 2.1把字符串分割成数组,然后转成数字
            var min = +obj.size.split('-')[0];
            var max = +obj.size.split('-')[1];
            // console.log(min,max);
            // 添加一个新数组   
            var arr = [];
            for (var i = min; i <= max; i++) {
                arr.push(i)
            }
            // console.log(arr);
            obj.size = arr;
            // console.log(obj);
            // 3创建模板
            var html = template('detailTpl', obj);
            $('#main').html(html)
            // 4.初始化轮播图
            //初始化轮播图
            var gallery = mui('.mui-slider');
            gallery.slider({
                interval: 2000 //自动轮播周期，若为0则不自动播放，默认为0；
            });
            // 5.初始化mui数字输入框
            mui('.mui-numbox').numbox();
            // 6.初始化区域滚动
            mui('.mui-scroll-wrapper').scroll({
                deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
            });
            // 7.当前点击背景颜色改变
            $('.btn-size').on('tap', function () {
                $(this).addClass('mui-btn-danger').siblings().removeClass('mui-btn-danger')
            })
        }
    })
    /* 
        1.给加入购物车加点击事件
        2.获取用户选择的尺码,和数量,没有则要提示用户
        3. 把用户选择器的尺码数量等作为参数调用加入购物车APi
        4. 接收API返回值是成功还是失败 如果是成功表示加入成功去购物车查看
        5.发送请求,判断是否有登录,没有则调转登录页面 */
    $('#footer .btn-shop').on('tap', function () {
        // 2.1获取按钮的内容
        var size = $('.btn-size.mui-btn-danger').data('size');
        if (!size) {
            mui.toast('请输入尺码', {
                duration: 1000,
                type: 'div'
            });
            return false;
        }
        // 2.2 获取mui数字输入框 设置默认为1
        var num = mui('.mui-numbox').numbox().getValue()
        if (!num) {
            mui.toast('请输入数量', {
                duration: 1000,
                type: 'div'
            })
            return false;
        }
        // 3.1根据接口发送ajax请求
        $.ajax({
            type: 'post',
            url: '/cart/addCart',
            data: {
                productId: id,
                num: num,
                size: size
            },
            success: function (data) {
                console.log(data);
                //3.2 判断用户是否有登录
                if (data.success) {
                    // 有登陆,添加成功 
                    
                    var btnArray = ['是', '否'];
                    mui.confirm('进入购物车查看？', '温馨提示', btnArray, function (e) {
                        if (e.index == 0) {
                            location = 'cart.html'
                        } 
                    })
                } else {
                    console.log(location.href);
                    // 没登录,跳转到登录页面,因为登录成功后要返回之前的地址
                    location = 'login.html?returnUrl=' + location.href

                }

            }
        })

    })






    // 使用网上的正则 取url地址
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    }


})