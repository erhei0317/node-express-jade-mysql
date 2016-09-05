/**
 * Created by ZYZ on 2016/9/3.
 */
$(function(){
    setFootOn('#manage');  //设置底部选中
    $('#save').click(function() {
        var formParam = $("form").serialize();//序列化表格内容为字符串
        console.log(formParam);
        console.log($("[name='name']").val());
        $.ajax({
            type:'POST',
            url:'/products/submit',
            data:formParam,
            cache:false,
            dataType:'json',
            /*success :function(data){
                /!*if(data.code == 200) {
                    alert('保存成功！')
                }*!/
                alert(data.msg);
            },
            error :function(XMLHttpRequest, textStatus, errorThrown) {
                alert("请求出错");
            }*/
        }).done(function(data) {
            if(data.code == 200) {
                showDialogOneMsg('添加成功','添加产品成功，点击‘继续填写’继续添加产品，点击‘返回上一级’返回上一级','继续填写','返回上一级', '/products/list');
            }else{
                showDialogOneMsg('添加失败','添加产品失败，点击‘继续填写’继续添加产品，点击‘返回上一级’返回上一级','继续填写','返回上一级', '/products/list');
            }
        }).fail(function() {
            showDialogOneMsg('添加失败','添加产品失败，点击‘继续填写’继续添加产品，点击‘返回上一级’返回上一级','继续填写','返回上一级', '/products/list');
        })
        .always(function() {
            //console.log("complete");
        });
    });

})