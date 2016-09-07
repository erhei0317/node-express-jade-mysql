/**
 * Created by ZYZ on 2016/9/3.
 */
$(function(){
    setFootOn('#manage');  //设置底部选中
    $('#add').click(function() {       //保存添加的内容
        var formParam = $("form").serialize();//序列化表格内容为字符串
        if(!isEmptyById('name', '代理名称不能为空')){
            return false;
        };
        if(!isEmptyById('product', '产品名称不能为空')){
            return false;
        };
        if(!isEmptyById('level', '代理级别不能为空')){
            return false;
        };
        if(!isEmptyById('price', '级别价格不能为空')){
            return false;
        };
        $('#loadingToast').show();
        $.ajax({
            type:'POST',
            url:'/agency/add',
            data:formParam,
            cache:false,
            dataType:'json',
        }).done(function(data) {
            if(data.code == 200) {
                showDialogOneMsg('添加成功','添加代理成功，点击‘继续添加’继续添加代理，点击‘返回’返回上一级','继续添加','返回', '/agency/list');
            } else if(data.code == 2) {
                showWarnMsg('代理名称、产品、代理级别、代理价格不能为空');
            } else if(data.code == 3) {
                showDialogTwoMsg('添加失败','当前产品已存在这个代理名称','确定');
            } else{
                showDialogTwoMsg('添加失败','请稍后重试','确定');
            }
        }).fail(function() {
            showDialogTwoMsg('添加失败','请稍后重试','确定');
        }).always(function() {
            $('#loadingToast').hide();
        });
    });
    //修改内容
    $('#edit').click(function() {
        var formParam = $("form").serialize();//序列化表格内容为字符串
        if(!isEmptyById('name', '代理名称不能为空')){
            return false;
        };
        if(!isEmptyById('product', '产品名称不能为空')){
            return false;
        };
        if(!isEmptyById('level', '代理级别不能为空')){
            return false;
        };
        if(!isEmptyById('price', '级别价格不能为空')){
            return false;
        };
        $('#loadingToast').show();
        $.ajax({
            type:'POST',
            url:'/agency/edit',
            data:formParam,
            cache:false,
            dataType:'json',
        }).done(function(data) {
            if(data.code == 200) {
                showDialogOneMsg('修改成功','已生成的订单不受影响','留在本页','返回上一级', '/agency/list');
            } else if(data.code == 2) {
                showWarnMsg('代理名称、产品、代理级别、代理价格不能为空');
            } else if(data.code == 3) {
                showDialogTwoMsg('添加失败','当前产品已存在这个代理名称','确定');
            } else{
                showDialogTwoMsg('修改失败','请稍后重试','确定');
            }
        }).fail(function() {
            showDialogTwoMsg('修改失败','请稍后重试','确定');
        }).always(function() {
            $('#loadingToast').hide();
        });
    });
    //点击页面空白区域隐藏下拉框内容
    $('body').click(function($event){
        $tmp = $('#productList','#levelList');
        if( $tmp.filter($event.target).length > 0|| $tmp.find($event.target).length>0){
            return false;
        }
        $('#productList').hide();
    });
    $('#product').click(function(e){
        e = e || event;
        e.stopPropagation();  //阻止事件冒泡
        $('#productList').show();
    });
    $('#productList li').click(function(){
        $('#product').val(this.innerHTML);
        $('#productList').hide();
    });
    $('#level').click(function(e){
        e = e || event;
        e.stopPropagation();  //阻止事件冒泡
        $('#levelList').show();
    });
    $('#levelList li').click(function(){
        $('#level').val(this.innerHTML);
        $('#levelList').hide();
    });
    /*var oProductList = $('#productList').find('li');
    console.log(oProductList[1].html())
    for(var i=0; i<oProductList.length; i++) {
        oProductList[i].click(function(){
            console.log(11)
            $('#productList').val(this.html());
            $('#productList').hide();
        });
    }*/

})