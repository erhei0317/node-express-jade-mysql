/**
 * Created by ZYZ on 2016/9/3.
 */
$(function(){
    setFootOn('#manage');  //设置底部选中
    $('#add').click(function() {       //保存添加的内容
        var formParam = $("form").serialize();//序列化表格内容为字符串
        if(!isEmptyById('name', '产品名称不能为空')){
            return false;
        }
        $('#loadingToast').show();
        $.ajax({
            type:'POST',
            url:'/products/add',
            data:formParam,
            cache:false,
            dataType:'json',
        }).done(function(data) {
            if(data.code == 200) {
                showDialogOneMsg('添加成功','添加产品成功，点击‘继续填写’继续添加产品，点击‘返回’返回上一级','继续填写','返回', '/products/list');
            } else if(data.code == 2) {
                showDialogTwoMsg('添加失败','当前产品名称已存在','确定');
            } else if(data.code == 3) {
                showWarnMsg('产品名称不能为空');
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
        if(!isEmptyById('name', '产品名称不能为空')){
            return false;
        }
        $('#loadingToast').show();
        $.ajax({
            type:'POST',
            url:'/products/edit',
            data:formParam,
            cache:false,
            dataType:'json',
        }).done(function(data) {
            if(data.code == 200) {
                showDialogOneMsg('修改成功','修改产品成功，点击‘继续填写’继续添加产品，点击‘返回’返回上一级','继续填写','返回', '/products/list');
            } else if(data.code == 2) {
                showDialogTwoMsg('修改失败','当前产品名称不存在','确定');
            } else if(data.code == 3) {
                showWarnMsg('产品名称不能为空');
            } else{
                showDialogTwoMsg('修改失败','请稍后重试','确定');
            }
        }).fail(function() {
            showDialogTwoMsg('修改失败','请稍后重试','确定');
        }).always(function() {
            $('#loadingToast').hide();
        });
    });
    $('.del').click(function(e) {
        //e.preventDefault();
        e.stopPropagation();  //阻止事件冒泡
        var c = confirm("删除之后无法恢复，确定删除吗？");
        if(c == true) {       //确定删除
            var target = $(e.target);
            var id = target.data('id');
            var div = $('.item-id-' + id);
            $('#loadingToast').show();
            $.ajax({
                type: 'DELETE',
                url: '/products/delete/' + id
            }).done(function(data) {
                if(data.code == 200) {
                    if(div.length > 0) {
                        showDialogTwoMsg('删除成功','已生成的此产品订单不会被删除','确定');
                        div.remove();
                    }
                } else if(data.code == 2) {
                    showDialogTwoMsg('删除失败','请稍后重试','确定');
                }else{
                    showDialogTwoMsg('删除失败','请稍后重试','确定');
                }
            }) .fail(function() {
                showDialogTwoMsg('删除失败','请稍后重试','确定');
            }).always(function() {
                $('#loadingToast').hide();
            });
        }
    }) ;
})