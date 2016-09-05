/**
 * Created by ZYZ on 2016/9/3.
 */
$(function(){
    setFootOn('#manage');  //设置底部选中
    $('#save').click(function() {
        var formParam = $("form").serialize();//序列化表格内容为字符串
        if(!isEmptyByName('name', '产品名称')){
            return false;
        }
        $('#loadingToast').show();
        $.ajax({
            type:'POST',
            url:'/products/submit',
            data:formParam,
            cache:false,
            dataType:'json',
        }).done(function(data) {
            if(data.code == 200) {
                showDialogOneMsg('添加成功','添加产品成功，点击‘继续填写’继续添加产品，点击‘返回’返回上一级','继续填写','返回', '/products/list');
            } else if(data.code == 2) {
                showDialogTwoMsg('添加失败','当前产品名称已存在','确定');
            } else{
                showDialogTwoMsg('添加失败','请联系管理员','确定');
            }
        }).fail(function() {
            showDialogTwoMsg('添加失败','请联系管理员','确定');
        })
        .always(function() {
            $('#loadingToast').hide();
            //console.log("complete");
        });
    });

})