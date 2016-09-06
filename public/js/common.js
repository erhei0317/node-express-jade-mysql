/**
 * Created by user on 2016/9/5.
 */
var msgOverTime = 1500;

var setFootOn = function(tagId){        //设置底部选中的模块
    $(tagId).addClass('icon-active');
};

var showDialogOneMsg = function(title, body, ok, cancel, backUrl){          //设置显示dialog1的显示内容
    $('#dialog1').show();
    $('#dialog1title').html(title);
    $('#dialog1body').html(body);
    $('#dialog1ok').html(ok);
    $('#dialog1cancel').html(cancel);
    $('#dialog1cancel').attr("href", backUrl);
};
var showDialogTwoMsg = function(title, body, ok){       //设置显示dialog2的显示内容
    $('#dialog2').show();
    $('#dialog2title').html(title);
    $('#dialog2body').html(body);
    $('#dialog2ok').html(ok);
};

//显示提示信息，1.5秒后隐藏，某个name为参数name的输入框为空的时候
var isEmptyById = function(id, msg){
    console.log(id)
    console.log($("#"+id).val())
    if($("#"+id).val()=='' || $("#"+id).val()=='undefined'){
        $('#toast').show();
        $('#toast p').html(msg);
        window.setTimeout(function(){
            $('#toast').hide();
        }, msgOverTime);
        return false;
    }
    return true;
};
//显示提示信息，1.5秒后隐藏
var showWarnMsg = function(msg){
    $('#toast').show();
    $('#toast p').html(msg);
    window.setTimeout(function(){
        $('#toast').hide();
    }, msgOverTime);
};
//显示提示信息，1.5秒后隐藏
var jumpToUrl = function(url){
    window.location.href = url;
};

$(function(){
    $('#dialog1ok').click(function(){       //dialog1点击确定关闭提示框
        $('#dialog1').hide();
    });
    $('#dialog2ok').click(function(){       //dialog2点击确定关闭提示框
        $('#dialog2').hide();
    });
    $('#toast').click(function(){       //toast点击周围关闭提示框
        $('#toast').hide();
    });
});