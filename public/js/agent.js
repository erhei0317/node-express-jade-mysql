/**
 * Created by ZYZ on 2016/9/3.
 */
$(function(){
    setFootOn('#manage');  //���õײ�ѡ��
    $('#add').click(function() {       //������ӵ�����
        var formParam = $("form").serialize();//���л��������Ϊ�ַ���
        formParam += '&productName=' + $("#productId").find("option:selected").text();   //��ѡ�����ı�������Ʒ�����ƣ������ύ�Ĳ�����
        if(!isEmptyById('name', '�������Ʋ���Ϊ��')){
            return false;
        };
        if($("#productId").val() == 0){       //����ѡ���Ʒ
            showWarnMsg('��ѡ���Ʒ����');
            return false;
        };
        if(!isEmptyById('price', '�۸���Ϊ��')){
            return false;
        };
        if(isNaN($("#price").val())){       //�۸�ֻ����������
            showWarnMsg('�۸�ֻ����������');
            return false;
        };
        $('#loadingToast').show();
        $.ajax({
            type:'POST',
            url:'/levels/add',
            data:formParam,
            cache:false,
            dataType:'json',
        }).done(function(data) {
            if(data.code == 200) {
                showDialogOneMsg('��ӳɹ�','��Ӵ���ɹ��������������ӡ�������Ӵ�����������ء�������һ��','�������','����', '/levels/list');
            } else if(data.code == 2) {
                showDialogTwoMsg('���ʧ��','��ǰ�����Ѵ���','ȷ��');
            } else if(data.code == 3) {
                showWarnMsg('�������Ʋ���Ϊ��');
            } else{
                showDialogTwoMsg('���ʧ��','���Ժ�����','ȷ��');
            }
        }).fail(function() {
            showDialogTwoMsg('���ʧ��','���Ժ�����','ȷ��');
        }).always(function() {
            $('#loadingToast').hide();
        });
    });
    //�޸�����
    $('#edit').click(function() {
        var formParam = $("form").serialize();//���л��������Ϊ�ַ���
        formParam += '&productName=' + $("#productId").find("option:selected").text();   //��ѡ�����ı�������Ʒ�����ƣ������ύ�Ĳ�����
        if(!isEmptyById('name', '�������Ʋ���Ϊ��')){
            return false;
        };
        if($("#productId").val() == 0){       //����ѡ���Ʒ
            showWarnMsg('��ѡ���Ʒ����');
            return false;
        };
        if(!isEmptyById('price', '�۸���Ϊ��')){
            return false;
        };
        if(isNaN($("#price").val())){       //�۸�ֻ����������
            showWarnMsg('�۸�ֻ����������');
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
                showDialogOneMsg('�޸ĳɹ�','�����ɵĶ�������Ӱ��','���ڱ�ҳ','������һ��', '/levels/list');
            } else if(data.code == 2) {
                showDialogTwoMsg('�޸�ʧ��','��ǰ�����Ѵ���','ȷ��');
            } else if(data.code == 3) {
                showWarnMsg('�������Ʋ���Ϊ��');
            } else{
                showDialogTwoMsg('�޸�ʧ��','���Ժ�����','ȷ��');
            }
        }).fail(function() {
            showDialogTwoMsg('�޸�ʧ��','���Ժ�����','ȷ��');
        }).always(function() {
            $('#loadingToast').hide();
        });
    });
    console.log(11)
    $("#productId").click(function(){       //���ݲ�Ʒidɸѡ����ȼ�
        alert(1)
        var pId = $("#productId").val();        //��Ʒid
        console.log($("#productId").find("option"))
        $("#productId").find("option").hide();
    });
})