$(function () {
    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
        indicators: false,
        //是否显示滚动条
    });

    // 左侧分类ajax请求
    $.ajax({
        // 发ajax请求
        // 默认为get请求不用设置
        url: "/category/queryTopCategory",
        //默认为datatype为 json转js数据
        beforeSend: function () {
            $('#mask').show();
        },
        complete: function () {
            $('#mask').hide();
        },
        success: function (obj) {
            console.log(obj);
            var html = template('leftTpl', obj)
            // console.log(html);
            $('#main .left ul').html(html)
        }
    });

    // 点击左侧列表,右侧图片分类ajax请求
    $('#main .left ul').on('tap', 'li > a', function () {
        console.log(this.dataset['id']);
        // 用zeptor 对象转的话可以进行格式转化
        // console.log($(this).data('id'));
        // 当前点击active类名,背景色改变
        $(this).parent().addClass('active').siblings().removeClass('active')
        //拿到自定义属性
        var categoryId = $(this).data('id');
        querySecondCategory(categoryId)
    })

    // 页面一加载完要调用后台数据显示右侧页面
    querySecondCategory(1)
    // 封装一个函数
    function querySecondCategory(categoryId) {
        $.ajax({
            url: '/category/querySecondCategory',
            data: {
                id: categoryId
            },
            beforeSend: function () {
                $('#mask').show();
            },
            success: function (obj) {
                console.log(obj);
                var html = template('rightTpl', obj);
                $('#main .right .mui-row').html(html)
            },
            complete: function () {
                $('#mask').hide();
            },
        })
    }

    // 点击搜索按钮,根据搜索内容跳转到商品列表
    $('#header .btn-search').on('tap', function () {
        var val = $('#header input').val().trim();
        if (!val) {
            mui.toast('请输入搜索内容', {
                duration: 'short',
                type: 'div'
            })
            return false;
        }
        location = 'productlist.html?key=' + val;
    })
})