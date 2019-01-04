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
    });
    searchHistory()
    // 每次搜索都要把数据渲染到页面所以要封装函数
    function searchHistory() {
        // 拿到数据渲染到页面
        var data = localStorage.getItem('historyData1') 
        // console.log(data);
        data = JSON.parse(data) 

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
        data = JSON.parse(data) || []
        // 删除对应索引下的值
        data.splice(id,1)
        // console.log(data);
        data = JSON.stringify(data)
        // 重新设置localStorage
        localStorage.setItem('historyData1',data); 
        searchHistory()
        
    })





})