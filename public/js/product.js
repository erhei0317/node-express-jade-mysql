/**
 * Created by ZYZ on 2016/9/3.
 */
$(function(){
    $('#manage').addClass('icon-active');
    $('#save').click(function() {
        var formParam = $("form").serialize();//序列化表格内容为字符串
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
            alert(data.msg);
        }).fail(function() {
            console.log("error");
        })
        .always(function() {
            console.log("complete");
        });
    });
})