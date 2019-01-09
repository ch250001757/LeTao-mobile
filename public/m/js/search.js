$(function () {
    // 给搜索加点击按钮
    $('#main .btn-search').on('tap', function () {
        // 获取文本框内容,并去除空格
        var searchText = $('#main .search-val').val().trim();
        // console.log(searchText);
        // 做非空检测
        if (searchText == "") {
            // mui插件
            mui.toast('请输入内容')
            return;
        }
        // 获取之前的storage数据,但也可能是空 空的话是null 所以要做逻辑短路
        var data = localStorage.getItem('historyData1') || '[]';
        // console.log(data);
        data = JSON.parse(data) ;
        // console.log(data);
        // 每次搜索要添加数组,判断数组中有没有相同的值 不等-1存在 等-1 不存在
        if (data.indexOf(searchText) != -1) {
            data.splice(data.indexOf(searchText), 1)
        }
        // 搜索的数组要添加到第一个
        data.unshift(searchText)
        // console.log(data);
        // 把数组的内容存到localstorge中
        // 先转换
        data = JSON.stringify(data)
        // console.log(data);
        localStorage.setItem('historyData1', data)
        // 把搜索框内容清空
        $('#main .search-val').val("")
        searchHistory()

        // 点击搜索按钮跳转到产品详情页面,把对应的数据传过去和当前搜索时间    URL传递参数默认为javascript中利用encodeURI()方法进行编码 
        location ='productlist.html?key='+searchText+'&time='+new Date().getTime();
    });
    // 给每个搜索历史记录li加个点击事件,然后跳转到产品列表页面,因为他是动态生成的所以要事件委托
    $('#main .close .mui-table-view').on('tap','li',function(){
        
        console.log($(this).data('value'));
        var searchText = $(this).data('value');
        location ='productlist.html?key='+searchText+'&time='+new Date().getTime();
        
    })
    searchHistory()
    // 每次搜索都要把数据渲染到页面所以要封装函数
    function searchHistory() {
        // 拿到数据渲染到页面
        var data = localStorage.getItem('historyData1') 
       
        data = JSON.parse(data) 
        console.log(data);
        // 把数组包在对象中
        var html = template('searchIdTpl', {
            list: data
        });
        $('#main .mui-table-view').html(html);
    }
    // 清空记录
    $('#main .content .clearHistory').on('tap',function(){
        var btnArray = ['是', '否'];
        mui.confirm('', '是否清空内容?', btnArray, function(e) {
            if (e.index == 0) {
                // 不能用clear,把整个库都删了,只能删对应的键,会可能影响到别人的键
                localStorage.removeItem('historyData1');
                searchHistory()
            } 
        })
    });

    // 单独删除
    // 页面一加载渲染了一次,函数调用又渲染了一次 事件失效
    $('#main').on('tap','.content .mui-badge',function(){
        console.log(this);
        // 获取自定义属性
        var id = this.dataset['id']
        console.log(id);
        // localStorage.removeItem('historyData1')
        // 根据自定义id删除
        // 获取数组
        var data = localStorage.getItem('historyData1');
        console.log(data);
        data = JSON.parse(data || '[]') 
        // 删除对应索引下的值
        data.splice(id,1)
        // console.log(data);
        data = JSON.stringify(data)
        // 重新设置localStorage
        localStorage.setItem('historyData1',data); 
        searchHistory()
    })

})