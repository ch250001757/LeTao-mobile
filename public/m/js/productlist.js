$(function () {


    // 声明一个obj对象 当做ajax参数
    var obj = {
        proName: '',
        page: 1,
        pageSize: 4
    }
    // 获取urlkey键的值
    obj.proName = getQueryString('key');

    // 根据用户在分类页面搜索的内容来渲染页面
    getQueryInfo()

    // 也要根据用户在商品列表搜索内容
    $('#main .search .btn-search').on('tap', function () {
        // 获取字符串,去除空格
        obj.proName = $('#main .search .search-val').val().trim();
        if (!obj.proName) {
            // mui警告框
            mui.alert('', '请输入搜索内容', function () {});
            return;
        };
     
        getQueryInfo();
        
        //搜索完刷新页面
        location ='productlist.html?key='+obj.proName;
        // location.reload;

       
    })


    // 商品的排序功能 点击价格 或者 销量能够实现商品的排序
    $('#main .mui-card-header a').on('tap', function () {
        // 获取当前自定义属性商品类型
        console.log($(this).data('sort-type'));
        var sortType = $(this).data('sort-type');
        // 获取自定义属性排序的值
        var sortVal = $(this).data('sort');
        // console.log(sortVal);
        // 设置的默认值为1,点一下变成2,点一下变成1
        sortVal = sortVal == 1 ? 2 : 1;
        // console.log(sortVal);
        // 给当前排序的值设置成点击后的值
        $(this).data('sort', sortVal);

        // 判断当前的排序类型是价格还是数量
        // if(sortType == 'price'){
        //     $.ajax({
        //         url:'/product/queryProduct',
        //         data:{
        //             proName:key,
        //             page:1,
        //             pageSize:4,
        //             price:sortVal
        //         },
        //         success:function(obj){
        //             console.log(obj);
        //             var html = template('productlistTpl',obj);
        //             $('#main .mui-card .mui-card-content .mui-row').html(html);
        //         }
        //     })
        // } else if (sortType == 'num' ){
        //     $.ajax({
        //         url:'/product/queryProduct',
        //         data:{
        //             proName:key,
        //             page:1,
        //             pageSize:4,
        //             num:sortVal
        //         },
        //         success:function(obj){
        //             console.log(obj);
        //             var html = template('productlistTpl',obj);
        //             $('#main .mui-card .mui-card-content .mui-row').html(html);
        //         }
        //     })
        // }

        // 判断当前的排序类型是价格还是数量
        // 因为参数price和num不能同时传所以要判断,但上面代码比较冗余,我们只需要把获取点击的参数添加到obj对象中
        obj[sortType] = sortVal;
        console.log(obj);
        // 发送ajax请求
        getQueryInfo()

        // 每次添加后需要从新重置obj对象
        obj = {
            proName: obj.proName,
            page: 1,
            pageSize: 4
        }
        console.log(obj);
        // 点击当前的a标签添加active类,移出其他类
        $(this).addClass('active').siblings().removeClass('active');
        if (sortVal == 1) {
            // 添加字体图标的类 find找到后代

            $(this).find('i').removeClass('fa fa-angle-up').addClass('fa fa-angle-down');
        } else {
            $(this).find('i').removeClass('fa fa-angle-down').addClass('fa fa-angle-up');
        }

    })


    // 导入插件,下拉刷新,上拉加载追加数据
    // 定义一个全局变量var page = 1
    var page = 1;
    // mui下拉刷新和上拉加载插件
    mui.init({
        pullRefresh: {
            container: "#pullrefresh", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            down: {
                height: 50, //可选,默认50.触发下拉刷新拖动距离,
                auto: false, //可选,默认false.首次加载自动下拉刷新一次
                contentdown: "下拉可以刷新", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
                contentover: "释放立即刷新", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
                contentrefresh: "正在刷新...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
                callback: function () {
                    setTimeout(function () {
                        getQueryInfo();
                        //下拉刷新结束  mui官方文档有错
                        mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
                        // 重置上拉加载
                        mui('#pullrefresh').pullRefresh().refresh(true);
                        page = 1;
                    }, 2000)

                } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
            },
            up: {
                height: 50, //可选.默认50.触发上拉加载拖动距离
                auto: false, //可选,默认false.自动上拉加载一次
                contentrefresh: "正在加载...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
                contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
                callback: function () {
                    setTimeout(function () {
                        // 每次加载page++;
                        page++
                        // 加载数据
                        $.ajax({
                            url: '/product/queryProduct',
                            data: {
                                proName: obj.proName,
                                page: page,
                                pageSize: 4
                            },
                            success: function (data) {
                                console.log(data);
                                // 每次加载数据可能就没了所以要判断
                                if(data.data.length >0){
                                    var html = template('productlistTpl', data);
                                    $('#main .mui-card .mui-card-content .mui-row').append(html);
                                    mui('#pullrefresh').pullRefresh().endPullupToRefresh();
                                } else {
                                    mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
                                }
                            }
                        })
                     
                    }, 1000)
                }
                //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
            }
        }
    });




    // 点击立即购买跳转到产品详情页面 给按钮添加点击事件,因为是动态生成的 用事件委托
    $('#main .content ').on('tap','.btn-detail',function(){
        var id = $(this).data('id')
        // 要传一个id过去
        location = 'detail.html?id='+id;  
    })

    // 封装一个发送ajax请求的函数
    function getQueryInfo() {
        $.ajax({
            url: '/product/queryProduct',
            data: obj,
            success: function (data) {
                console.log(data);
                var html = template('productlistTpl', data);
                $('#main .mui-card .mui-card-content .mui-row').html(html);
            }
        })
    }




    // 使用网上的正则拿到ulr参数
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    }




})



/*     // 自己写得拿key的值
    function getQueryString(name){
        console.log(location);
        // 地址栏的属性,search 是地址栏的参数
        console.log(location.search);
        // URL传递参数默认为javascript中利用encodeURI()方法进行编码 
        // 用decodeURI解码
        var str = decodeURI(location.search);
        // 截取字符串 参数1,其实下标,参数2截取多少个字符 不写到最后
        str = str.substr(1);
        console.log(str); //key=鞋&time=1546666813529
        // 分割字符串转数组
        var arr = str.split('&');
        console.log(arr); //["key=鞋", "time=1546666813529"]
        // 怎么取到key的值呢,遍历数组
        for(var i = 0;i<arr.length;i++){
            var arr2 = arr[i].split('=');
            console.log(arr2);
            // ["key", "鞋"]
            //  ["time", "1546666813529"]
            if(arr2[0] == name){
                return arr2[1];
            }
        }
    } */