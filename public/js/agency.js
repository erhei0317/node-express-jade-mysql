/**
 * Created by ZYZ on 2016/9/3.
 */
$(function(){
    setFootOn('#manage');  //设置底部选中
    $('#add').click(function() {       //保存添加的内容
        var formParam = $("form").serialize();//序列化表格内容为字符串
        formParam += '&productName=' + $("#productId").find("option:selected").text()+'&levelName=' + $("#levelId").find("option:selected").text();   //将选择框的文本（即产品的名称）加入提交的参数中
        if(!isEmptyById('name', '代理名称不能为空')){
            return false;
        };
        if($("#productId").val() == 0){       //必须选择产品
            showWarnMsg('请选择产品名称');
            return false;
        };
        if($("#levelId").val() == 0){       //必须选择产品
            showWarnMsg('请选择代理级别名称');
            return false;
        };
        $('#loadingToast').show();
        $.ajax({
            type:'POST',
            url:'/agents/add',
            data:formParam,
            cache:false,
            dataType:'json',
        }).done(function(data) {
            if(data.code == 200) {
                showDialogOneMsg('添加成功','添加代理成功，点击‘继续添加’继续添加代理，点击‘返回’返回上一级','继续添加','返回', '/agents/list');
            } else if(data.code == 2) {
                showDialogTwoMsg('添加失败','当前产品已存在这个代理名称','确定');
            } else if(data.code == 3) {
                showWarnMsg('级别名称不能为空');
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
        formParam += '&productName=' + $("#productId").find("option:selected").text();   //将选择框的文本（即产品的名称）加入提交的参数中
        if(!isEmptyById('name', '代理名称不能为空')){
            return false;
        };
        if($("#productId").val() == 0){       //必须选择产品
            showWarnMsg('请选择产品名称');
            return false;
        };
        if(!isEmptyById('price', '价格不能为空')){
            return false;
        };
        if(isNaN($("#price").val())){       //价格只能输入数字
            showWarnMsg('价格只能输入数字');
            return false;
        };
        $('#loadingToast').show();
        $.ajax({
            type:'POST',
            url:'/levels/edit',
            data:formParam,
            cache:false,
            dataType:'json',
        }).done(function(data) {
            if(data.code == 200) {
                showDialogOneMsg('修改成功','已生成的订单不受影响','留在本页','返回上一级', '/agents/list');
            } else if(data.code == 2) {
                showDialogTwoMsg('修改失败','当前代理不存在','确定');
            } else if(data.code == 3) {
                showWarnMsg('级别名称、产品、价格不能为空');
            } else{
                showDialogTwoMsg('修改失败','请稍后重试','确定');
            }
        }).fail(function() {
            showDialogTwoMsg('修改失败','请稍后重试','确定');
        }).always(function() {
            $('#loadingToast').hide();
        });
    });
    var oLevel = $("#levelId").find("option");
    oLevel.hide();
    /*for(var i=0; i<oLevel.length; i++){
        oLevel[i].style.display = 'none';
    }*/
    $("#productId").change(function(){       //根据产品id筛选代理等级
        var pId = $("#productId").val();        //产品id
        //var oLevel = $("#levelId").find("option");
        for(var i=0; i<oLevel.length; i++){
            oLevel[i].style.display = 'none';
        }
        for(var i=0; i<oLevel.length; i++){
            if(oLevel[i].getAttribute('pid')==0||oLevel[i].getAttribute('pid')==pId){
                oLevel[i].style.display = 'block';
            }
        }
    });
    $("#levelId").click(function(){       //点击选择代理级别，如果没选择产品，弹出提示
        var pId = $("#productId").val();        //产品id
        if(pId == 0 || pId == undefined || pId == null){
            showWarnMsg('请先选择产品');
        }
    });
})