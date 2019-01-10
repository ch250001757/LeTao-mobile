$(function () {

    // 分页插件初始化,声明全局变量 ,默认渲染为第一页
    var currentPage = 1;
    var totalPages = 25;
    // 一.页面加载渲染用户列表
    getUser()



    // 三退出
    /* 1.给退出按钮加点击事件
    2.发送请求,成功则返回登陆页 */
    $('.signOut').on('click', function () {
        $.ajax({
            url: '/employee/employeeLogout',
            success: function (data) {
                console.log(data);
                if (data.success) {
                    location = 'login.html';
                }


            }
        });
    });

    // 添加分类功能 
    // 1.判断内容是否为空
    $('.btn-save').on('click', function () {
        var val = $('.add-category').val().trim();
        if (!val) {
            alert('分类名不能为空');
            return false;
        }
        $.ajax({
            type: 'post',
            url: '/category/addTopCategory',
            data: {
                categoryName: val,
            },
            success: function (data) {
                console.log(data);
                if (data.success) {
                    getUser()
                }

            }
        })
    })





    // 获取页面的函数
    function getUser() {
        $.ajax({
            url: '/category/queryTopCategoryPaging',
            data: {
                // 改成全局变量当前页
                page: currentPage,
                pageSize: 4
            },
            success: function (data) {
                console.log(data);
                // 渲染模板
                var html = template('userTpl', data)
                $('.content tbody').html(html)
                // 算总页数
                totalPages = Math.ceil(data.total / data.size);
                // 调用分页函数
                init();

            }
        });
    }

    // 定义一个初始化分页函数
    function init() {
        $("#page").bootstrapPaginator({
            bootstrapMajorVersion: 3, //对应的bootstrap版本
            currentPage: currentPage, //当前页数
            numberOfPages: 10, //每次显示页数
            totalPages: totalPages, //总页数
            shouldShowPage: true, //是否显示该按钮
            useBootstrapTooltip: true,
            //点击事件
            onPageClicked: function (event, originalEvent, type, page) {
                console.log(page);
                currentPage = page;
                getUser()
            }
        });
    }

});