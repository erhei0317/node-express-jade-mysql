/**
 * Created by ZYZ on 2016/9/3.
 */
$(function(){
    setFootOn('#deal');  //设置底部选中
    $('#add').click(function() {       //保存添加的内容
        var formParam = $("form").serialize();//序列化表格内容为字符串
        formParam += "&totalPrice=" + $('#totalPrice').html();
        if($('#product').val() == 0){
            showWarnMsg('请选择产品');
            return false;
        };
        if(!isEmptyById('count', '数量不能为空')){
            return false;
        };
        if(!isEmptyById('price', '进货单价不能为空')){
            return false;
        };
        /*if(!isEmptyById('realTotalPrice', '实际成交总额不能为空')){
            return false;
        };*/
        if(!isEmptyById('payment', '已付款不能为空')){
            return false;
        };
        $('#loadingToast').show();
        $.ajax({
            type:'POST',
            url:'/deals/in',
            data:formParam,
            cache:false,
            dataType:'json',
        }).done(function(data) {
            if(data.code == 200) {
                showDialogOneMsg('添加成功','添加出货单成功，点击‘继续添加’继续添加出货单，点击‘返回’返回上一级','继续添加','返回', '/agency/list');
            } else if(data.code == 2) {
                showWarnMsg('产品、数量、成交总额、已收款不能为空');
            } else{
                showDialogTwoMsg('添加失败','请稍后重试','确定');
            }
        }).fail(function() {
            showDialogTwoMsg('添加失败','请稍后重试','确定');
        }).always(function() {
            $('#loadingToast').hide();
        });
    });
    //备注输入框计算输入字数
    $("#remark").keyup(function(){
        $("#remark").next().find('span').html($("#remark").val().length);
    });
    //数字输入框改变时，计算价格总额
    $('#count').keyup(function(){
        $('#totalPrice').html((parseFloat($('#count').val())||0) * (parseFloat($('#price').val())||0));
        //$('#realPrice').val($('#totalPrice').html());
    });
    //价格输入框改变时，计算价格总额
    $('#price').keyup(function(){
        $('#totalPrice').html((parseFloat($('#count').val())||0) * (parseFloat($('#price').val())||0));
        //$('#realPrice').val($('#totalPrice').html());
    });
    //点击选择代理，如果还没选择产品，则提示先选择产品
})