$(function () {

    // 页面一加载查询购物车
    queryCart();
    // 上拉加载 下拉刷新功能
    /*  1.写结构,样式
        2.初始化代码 上拉下拉
        3.下拉刷新,请求数据,下拉刷新结束
        4.上拉下载,请求数据page++ 追加到页面,判断没数据的情况 */
    mui.init({
        pullRefresh: {
            container: "#refreshContainer", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            down: {
                callback: endPulldownToRefresh //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
            },
            up: {
                callback: endPullupToRefresh //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
            }
        }
    });
    // 声明一个全局变量,为了加载的时候加载第二页数据
    var page = 1;
    // 下拉刷新
    function endPulldownToRefresh() {
        // 1. 为了模拟延迟也设置一个定时器
        setTimeout(function () {
            //发送请求加载数据
            queryCart();
            // 结束上拉刷新
            mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
            // 重置上拉刷新
            mui('#refreshContainer').pullRefresh().refresh(true);
            page = 1
        }, 1000)
    };

    // 上拉加载
    function endPullupToRefresh() {
        //发送请求加载追加数据数据
        // 每次上拉加载page+1
        setTimeout(function () {
            page++;
            // 问题1 为什么第一次可以请求到?
            $.ajax({
                url: '/cart/queryCartPaging',
                data: {
                    page: page,
                    pageSize: 4
                },
                success: function (data) {
                    // console.log(data);
                    // 因为不断上拉追加数据可能会没 只会返回数组,所以要做判断
                    if (data instanceof Array) {
                        data = {
                            data: []
                        }
                    }
                    console.log(data);
                    // 判断数组的长度
                    if (data.data.length > 0) {
                        var html = template('cartlistTpl', data)
                        // console.log(page);
                        $('#main .cartList').append(html);
                        // 追加的时候把总额也一起算出来
                        totalSum()
                        // 结束上拉刷新
                        mui('#refreshContainer').pullRefresh().endPullupToRefresh();
                    } else {
                        mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
                    }
                }
            })
        }, 1000)
    };

    // 公共ajax请求
    function queryCart() {
        $.ajax({
            url: '/cart/queryCartPaging',
            data: {
                page: 1,
                pageSize: 4
            },
            beforeSend: function () {
                $('#mask').show();
            },
            complete: function () {
                $('#mask').hide();
            },
            success: function (data) {
                // 模仿数据请求的事件
                if (!data.error) {
                    console.log(data);
                    var html = template('cartlistTpl', data);
                    $('#main .cartList').html(html);
                    // 页面一加载把总额计算出来
                    totalSum()
                } else {
                    location = 'user.html';
                }

            }
        })
    };

    // 滑动删除功能
    /*  1.模板填入要删除的对应id
     2.给删除添加委托的点击事件
     3.获取对应的id
     3.当点击删除按钮的时候提示用户
     4.确定发送ajax,刷新模板
     5.取消侧拉隐藏 */


    $('.cartList').on('tap', '.btn-del', function () {
        // 2.获取对应的id
        var id = $(this).data('id');
        console.log(id);
        // 获取elem的li元素 给取消时调用
        var elem = this.parentNode.parentNode;
        // console.log(elem);
        var btnArray = ['确定', '取消'];
        mui.confirm('你确定要删除商品吗？', '温馨提示', btnArray, function (e) {
            if (e.index == 0) {
                $.ajax({
                    url: '/cart/deleteCart',
                    data: {
                        id: id
                    },
                    success: function (data) {
                        console.log(data);
                        if (data.success) {
                            queryCart()
                        }
                    }
                })
            } else {
                // 取消
                setTimeout(function () {
                    mui.swipeoutClose(elem);
                }, 0);

            }
        })
    });


    // 滑动编辑功能
    /*   1.给编辑按钮添加点击事件
      2.模板传入对入整个data数据
      2.1 获取data数据
      3.当点击的时候加载编辑商品的模板
      4.初始化尺码和数量
      5.取消的时候隐藏编辑按钮 
      6.获取最新的数据,根据数据访问接口,更新到页面
      */


    $('.cartList').on('tap', '.btn-edit', function () {
        // 2.1获取data数据
        var data = $(this).data('product');
        // 获取elem的li元素 给取消时调用
        var elem = this.parentNode.parentNode;
        console.log(data);
        // 把data数据中的productSize变成数组
        var min = +data.productSize.split('-')[0];
        var max = +data.productSize.split('-')[1];
        console.log(max, min);
        var productSize = [];
        for (var i = min; i <= max; i++) {
            productSize.push(i)
        }
        data.productSize = productSize;
        console.log(data);
        // 渲染编辑商品模板
        var html = template('editTpl', data);
        // 去掉回车空格 不然mui自动加br结构
        html = html.replace(/[\r\n]/g, "");
        // console.log(html);
        var btnArray = ['确定', '取消'];
        mui.confirm(html, '编辑商品产品', btnArray, function (e) {
            if (e.index == 0) {
                // 获取尺码
                var size = $('.product-size .mui-btn-warning').data('size');
                console.log(size);
                // 获取最新数量
                var val = mui('.mui-numbox').numbox().getValue();
                $.ajax({
                    type: 'post',
                    url: '/cart/updateCart',
                    data: {
                        id: data.id,
                        size: size,
                        num: val
                    },
                    success: function (data) {
                        console.log(data);
                        if (data.success) {
                            queryCart();
                        }

                    },
                })
            } else {
                // 取消
                setTimeout(function () {
                    mui.swipeoutClose(elem);
                }, 0);

            }
        });
        // 初始化按钮和数量
        $('.btn-size').on('tap', function () {
            $(this).addClass('mui-btn-warning').siblings().removeClass('mui-btn-warning')
        })
        mui('.mui-numbox').numbox()
    });

    // 计算总额
    // 1.给按钮委托加change事件
    // 2.给表单添加自定义属性把数量和金额存起来
    // 3.获取已选中的表单
    // 4.遍历数组,拿到自定义属性 把总额加起来

    $('.cartList').on('change', '.left input', totalSum)

    function totalSum() {
        var sum = 0;
        var checked = $('input:checked');
        // console.log(checkeds);
        checked.each(function (i, ele) {
            console.log(ele, i);
            // 获取自定义属性num,price
            var num = $(ele).data('num');
            console.log(num);
            var price = $(ele).data('price');
            sum += num * price;
        })
        sum = sum.toFixed(2);
        console.log(sum);
        $('#order .count').html(sum)
    }




});