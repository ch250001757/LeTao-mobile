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

    // 添加品牌,
    // 页面加载渲染模态框的分类名称下拉框内容
    $.ajax({
        url:'/category/queryTopCategory',
        success:function(data){
            console.log(data);
            var html = template('categoryNameTpl',data)
            $('.categroy-select').html(html)
        }
    });


    // 图片上传
    // 1.在file文件框包裹一个form表单
    // 2.给文件框添加一个值改变事件
    $('.add-category').on('change',function(){
        // console.log(1111);
        // 选择文件后调用后台api把图片对象通过ajax参数传递
        $.ajax({
            url: '/category/addSecondCategoryPic',
            type: 'POST',
            data: new FormData($('#uploadForm')[0]),
            processData: false,
            contentType: false
        }).done(function(res) {
            // 成功的回调函数
            $('.brandLogo').attr('src',res.picAddr)
            
        }).fail(function(res) {
            // 失败的回调函数
            console.log(res);
            
        });
    });

    // 给保存按钮添加点击事件
    $('.btn-save').on('click',function(){
        // 获取品牌分类id
        var categroyId = $('.categroy-select').val();
        // 获取品牌名称
        var brandName = $('.brandName').val().trim();
        // 获取图片地址
        var brandLogo =  $('.brandLogo').attr('src')
        if(!brandName){
            alert('请输入品牌名称');
            return false;
        }
        $.ajax({
            type:'post',
            url:'/category/addSecondCategory',
            data:{
                brandName:brandName,
                categoryId:categroyId,
                brandLogo:brandLogo,
                hot:1
            },
            success:function(data){
                console.log(data);
                if(data.success){
                    getUser()
                }
            }

        })
    })







    // 获取页面的函数
    function getUser() {
        $.ajax({
            url: '/category/querySecondCategoryPaging',
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