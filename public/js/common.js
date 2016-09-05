/**
 * Created by user on 2016/9/5.
 */
var setFootOn = function(tagId){        //设置底部选中的模块
    $(tagId).addClass('icon-active');
};

var showDialogOneMsg = function(title, body, ok, cancel, backUrl){          //设置显示dialog1的显示内容
    $('#dialog1').css('display','block');
    $('#dialog1title').html(title);
    $('#dialog1body').html(body);
    $('#dialog1ok').html(ok);
    $('#dialog1cancel').html(cancel);
    $('#dialog1cancel').attr("href", backUrl);
};

var jumpToUrl = function(url){
  window.location.href = url;
};

var closeDialog = function(dialog) {
  $(dialog).css('display', 'none');
};

$(function(){
    $('#dialog1ok').click(function(){       //dialog1点击确定关闭提示框
        $('#dialog1').css('display','none');
    });
});