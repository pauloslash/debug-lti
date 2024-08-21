function addModal(id_modal, label, conteudo, retorna) {
    conteudo = conteudo || "";
    var replace = {
        idModal: id_modal,
        label: label,
        conteudo: conteudo
    };
    $('#main').append(modalTemplate.replace(/{{:(\w+)}}/g, (match, p1) => replace[p1] || match));
    $('#debug-'+id_modal+'Modal').on('shown.bs.modal', function() {
        if(!$(this).find('.modal-body').data('ignore-clear')) {
            $(this).find('.modal-body').html("Carregando...");
        }
    }) ;
}
function addLeftBtn(id_btn, label, icon, fnt, add_modal, local) {
    local = local || null;
    add_modal = add_modal || false;
    var replace = {
        idBtn: "debug-"+id_btn,
        label: label,
        icon: icon
    };
    if(local) {
        var dataModal = ((add_modal)?' data-toggle="modal" data-target="#debug-'+id_btn+'Modal"':'');
        $(local).append(btnLeftTemplate.replace(/{{:data-modal}}/, dataModal).replace(/{{:(\w+)}}/g, (match, p1) => replace[p1] || match));
    } else {
        $('#left-panel nav > ul').prepend(btnLeftTemplate.replace(/{{:(\w+)}}/g, (match, p1) => replace[p1] || match));
    }
    $("#sub-debug-"+id_btn+" a").click(fnt);
    if(add_modal) addModal(id_btn, label);

    var funcIdx = id_btn.replace(/-([a-z])/g, function(match, p1) {
        return p1.toUpperCase();
    });
    if(typeof execAfterAddBtn[funcIdx] === 'function') execAfterAddBtn[funcIdx]();
}
function addLeftGroupBtn(id_btn, label, fnt) {
    var replace = {
        idBtn: "group-debug-"+id_btn,
        label: label
    };
    $('#left-panel nav > ul').prepend(btnGroupTemplate.replace(/{{:(\w+)}}/g, (match, p1) => replace[p1] || match));
    if(fnt) fnt();
}

function leftBtnStatus(seletor, enable) {
    enable = enable || false;
    if(enable) {
        $(seletor).find('a').css('cursor', $(seletor).find('a').data('cursor'));
        $(seletor).find('a').css('opacity', 1);
    } else {
        $(seletor).find('a').data('cursor', $(seletor).find('a').css('cursor'));
        $(seletor).find('a').css('cursor', 'not-allowed');
        $(seletor).find('a').css('opacity', .5);
    }
}

function post(url, data, success, showNofify) {
    showNofify = ((typeof showNofify == 'undefined')?true:showNofify);
    request(url, "POST", data, success, showNofify)
}

function get(url, data, success, showNofify, dataType) {
    showNofify = ((typeof showNofify == 'undefined')?true:showNofify);
    request(url, "GET", data, success, showNofify, dataType)
}

function request(url, method, data, success, showNofify, dataType) {
    showNofify = ((typeof showNofify == 'undefined')?true:showNofify);
    dataType = dataType || "json";
    $.ajax({
        dataType: dataType,
        url: url,
        data: data,
        method: method,
        success: function (dados) {
            if(typeof requestSuccess[success.name] === 'function') {
                if(dados.hasOwnProperty("erro")) {
                    requestSuccess[success.name](dados.erro, dados);
                } else {
                    requestSuccess[success.name](e);
                }
            }
            if(success) success(dados);
            if(showNofify) {
                if (dados.erro) {
                    $.bigBox({
                        title: "Aviso!",
                        content: dados.mensagem,
                        color: "#C46A69",
                        timeout: 7000,
                        icon: "fa fa-warning shake animated"
                    });
                } else {
                    $.smallBox({
                        title: "Sucesso",
                        content: dados.mensagem,
                        color: "#739E73",
                        timeout: 3000,
                        icon: "fa fa-check"
                    });
                }
            }
        }
    });
}
