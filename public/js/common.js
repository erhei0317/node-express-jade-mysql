/**
 * Created by user on 2016/9/5.
 */
var setFootOn = function(tagId){        //���õײ�ѡ�е�ģ��
    $(tagId).addClass('icon-active');
};

var showDialogOneMsg = function(title, body, ok, cancel, backUrl){          //������ʾdialog1����ʾ����
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
    $('#dialog1ok').click(function(){       //dialog1���ȷ���ر���ʾ��
        $('#dialog1').css('display','none');
    });
});