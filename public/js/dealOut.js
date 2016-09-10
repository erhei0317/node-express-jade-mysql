/**
 * Created by ZYZ on 2016/9/3.
 */
$(function(){
    setFootOn('#deal');  //设置底部选中
    $('#add').click(function() {       //保存添加的内容
        var formParam = $("form").serialize();//序列化表格内容为字符串
        formParam += "&totalPrice=" + $('#totalPrice').html();
        console.log(formParam)
        if($('#product').val() == 0){
            showWarnMsg('请选择产品');
            return false;
        };
        if($('#agent').val() == 0){
            showWarnMsg('请选择代理');
            return false;
        };
        if(!isEmptyById('count', '数量不能为空')){
            return false;
        };
        if(!isEmptyById('realTotalPrice', '实际成交总额不能为空')){
            return false;
        };
        if(!isEmptyById('receipt', '已收款不能为空')){
            return false;
        };
        $('#loadingToast').show();
        $.ajax({
            type:'POST',
            url:'/deals/out',
            data:formParam,
            cache:false,
            dataType:'json',
        }).done(function(data) {
            if(data.code == 200) {
                showDialogOneMsg('添加成功','添加出货单成功，点击‘继续添加’继续添加出货单，点击‘返回’返回上一级','继续添加','返回', '/agency/list');
            } else if(data.code == 2) {
                showWarnMsg('代理名称、产品、数量、成交总额、已收款不能为空');
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
    //数字输入框改变时，计算代理价格总额
    $('#count').keyup(function(){
        $('#totalPrice').html((parseInt($('#count').val())||0) * parseInt($('#price').val()));
        $('#realPrice').val($('#totalPrice').html());
    });
    //点击选择代理，如果还没选择产品，则提示先选择产品
    var oAgent = $("#agent").find("option");
    oAgent.hide();
    $("#product").change(function(){       //根据产品id筛选代理等级
        var pName = $("#product").val();        //产品Name
        for(var i=0; i<oAgent.length; i++){
            oAgent[i].style.display = 'none';
        }
        for(var i=0; i<oAgent.length; i++){
            if(oAgent[i].getAttribute('pName')=='0'||oAgent[i].getAttribute('pName')==pName){
                oAgent[i].style.display = 'block';
            }
        }
        $("#agent")[0].selectedIndex = 0;   //改变产品时，代理默认初始化选择第一个
        if(pName == 0 || pName == undefined || pName == null){      //如果产品选择第一个，那么代理的下拉框无数据
            oAgent.hide();
        }
    });
    $('#agent').click(function(){
        var pName = $("#product").val();        //产品Name
        if(pName == 0 || pName == undefined || pName == null){
            oAgent.hide();
            showWarnMsg('请先选择产品');
        }
    });
    $('#agent').change(function(){      //选择代理的时候，获取代理价格
        $('#price').val($('#agent').find("option:selected").attr('aPrice'));
        $('#totalPrice').html((parseInt($('#count').val())||0) * parseInt($('#price').val()));
        $('#realPrice').val($('#totalPrice').html());
    });
})