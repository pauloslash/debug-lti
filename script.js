var pageOnReady = {
    'perfisAcesso/cadastro': function() {
        addViewPermRead("Exibir Permissões", "dev/showPerm", $('#permissoesAcesso').val().includes('dev/showPerm'));
    }
}
var sessionArray = null;
var requestSuccess = {};
var isDebugMode = false;

function foot_inner() {
    formatDebugPermissionView();
    preventLinkClickDebugInfo();
}

function debugShowRequestPermission(e){
    $(document).ajaxComplete(function(event, jqxhr, settings) {
        var url = settings.url.replace(/\/[0-9]+/, "")
        if(pageOnReady.hasOwnProperty(url)) pageOnReady[url]();
        var contentType = jqxhr.getResponseHeader('content-type');
        if(contentType && contentType.includes("text/html")) foot_inner()

        var permissao = jqxhr.getResponseHeader('permissao');
        if(permissao) {
            $.smallBox({
                title: "Permissão",
                content: permissao,
                color: "#c2ac0c",
                timeout: 1000,
                icon: "fa fa-check"
            });
        }
    });
}

function debugPermissionBtn(e) {
    if(!isDebugMode) return;
    $.ajax({
        dataType: "json",
        url: "dev/removerPermissoes",
        success: function(e) {
            var html = "<button id='btn-debug-permission' class='btn btn-primary btn-xs' title='{{desc}}'>{{txt}}</button>";
            var desc = "";
            if(e.status) {
                desc = "Habilitar Permissões";
                icon = "thumbs-o-up";
            } else {
                desc = "Desabilitar Permissões";
                icon = "thumbs-o-down"
            }
            addLeftBtn('permission', desc, icon, function(){
                var btn = $(this);
                btn.html("<i class='fa fa-lg fa-fw fa-refresh'></i> Carregando...");
                btn.prop("disabled", true);
                $.ajax({
                    dataType: "json",
                    url: "dev/removerPermissoes",
                    data: {'change':true},
                    success: function(e) {
                        if(e.status) {
                            btn.html("<i class='fa fa-lg fa-fw fa-thumbs-o-up'></i> Habilitar Permissões");
                        } else {
                            btn.html("<i class='fa fa-lg fa-fw fa-thumbs-o-down'></i> Desabilitar Permissões");
                        }
                        btn.prop("disabled", false);
                    }
                });
            }, false, "#sub-group-debug-lti ul");

            $.ajax({
                dataType: "json",
                url: "dev/permList",
                success: function(e) {
                    addLeftBtn('restart', "Restaurar Permissões", "undo", function(){
                        restaurarPermDev("read");
                        restaurarPermDev("write");
                    }, false, "#sub-group-debug-lti ul");
                    addLeftBtn('perm-list', "Permissões", "list-ul", function(){
                        $('#list-permissions').modal();
                        var active = (($('#content .debug-permission:nth(0)').size())?$('#content .debug-permission:nth(0)').html().replace(/[()]+/g, "").replace(/<span[^>]+>/g, "").replace(/<\/span>/g, "|").replace(/(\|)?:.*/, ""):null);
                        $('#list-permissions label.checkbox').removeClass('active');
                        if(active) {
                            if(active.match(/|/)) {
                                $.each(active.split('|'), function(idx, item){
                                    $('#list-permissions label.checkbox[data-desc="' + item + '"]').addClass('active');
                                });
                            } else {
                                $('#list-permissions label.checkbox[data-desc="' + active + '"]').addClass('active');
                            }
                        }
                    }, false, "#sub-group-debug-lti ul");
                    $('#main').append(e.html);
                    $('body').append(e.script);
                    $.each(e.read, function (idx, key){
                        $('#list-permissions .read input[name="'+key+'-read"]').prop('checked', true);
                    });
                    $.each(e.write, function (idx, key){
                        $('#list-permissions .write input[name="'+key+'-write"]').prop('checked', true);
                    });
                    $('#list-permissions .read').data('perm-padrao', e.padrao.read);
                    $('#list-permissions .write').data('perm-padrao', e.padrao.write);
                    if(Object.values(e.padrao.read).length == e.read.length && Object.values(e.padrao.write).length == e.write.length) {
                        $('#sub-debug-restart a').data('cursor', $('#sub-debug-restart a').css('cursor'));
                        $('#sub-debug-restart a').css('cursor', 'not-allowed');
                        $('#sub-debug-restart a').css('opacity', .5);
                    }
                }
            });
        }
    });
}

function restaurarPermDev(tipo) {
    var perms = $('#list-permissions .'+tipo).data('perm-padrao');
    var allItens = [];
    $.each($('#list-permissions .'+tipo+' :input'), function(idx, item){
        allItens.push($(item).attr('name').replace('-'+tipo, ""));
    });
    var removePerm = $(allItens).not(Object.values(perms)).get();
    $.each(removePerm, function (idx, key) {
        if($('#list-permissions .'+tipo+' input[name="'+key+'-'+tipo+'"]').prop('checked')) {
            $('#list-permissions .' + tipo + ' input[name="' + key + '-'+tipo+'"]').click();
        }
    });
    $.each(perms, function (idx, key) {
        if(!$('#list-permissions .'+tipo+' input[name="'+key+'-'+tipo+'"]').prop('checked')) {
            $('#list-permissions .' + tipo + ' input[name="' + key + '-'+tipo+'"]').click();
        }
    });
    setTimeout(function (){
        $('#sub-debug-restart a').data('cursor', $('#sub-debug-restart a').css('cursor'));
        $('#sub-debug-restart a').css('cursor', 'not-allowed');
        $('#sub-debug-restart a').css('opacity', .5);
    }, 200);
}

function selectAllPermDev(tipo) {
    var selected = $('#list-permissions .'+tipo+' :input:nth(0)').prop('checked');
    $.each($('#list-permissions .'+tipo+' :input'), function(idx, item){
        if((selected && $(item).prop('checked')) || (!selected && !$(item).prop('checked'))) {
            $(item).click();
        }
    });
}

function formatDebugPermissionView() {
    $.each($('.debug-permission:not(.move)'), function(idx, item){
        if($(item).hasClass('group') && $(item).is('[class*="debug-idx-"]')) {
            $('.debug-permission.debug-idx-'+$(item).attr('class').replace(/(.*)?debug-idx-([0-9]+)(.*)?/, "$2")).addClass("inicio");
        }
        if($(item).closest('ul').length != 0 && !$(item).next().is('li')) {
            $(item).after("<li style='text-align: right;min-height: 25px;padding: 3px 11px 3px 0px;background: #898d7e;border: 1px solid #000;'></li>");
            $(item).next().append($(item));
        }
    });
    $.each($('.debug-permission:not(.move)'), function(idx, item){
        $(item).addClass('move');
        if($(item).next().length != 0) {
            if ($(item).next().find("> a").size() > 0) {
                if($(item).hasClass("group")) {
                    $(item).prev().find("> a").prepend($(item));
                } else {
                    $(item).next().find("> a").prepend($(item));
                }
            } else if (!$(item).next().hasClass('debug-permission')) {
                $(item).next(':not(style):not(script)').prepend($(item));
            } else if ($(item).next().hasClass('debug-permission')) {
                if($(item).hasClass("group")) {
                    $(item).prev().find("> a").prepend($(item));
                } else {
                    $(item).css('float', "none").css('margin-top', "5px").css('display', "inline-block").next().css('float', "none").css('margin-top', "5px").css('display', "inline-block");
                }
            }
            if($(item).parent().hasClass('btn')) {
                $(item).css('float', "none");
            }
        }
    });
}

function preventLinkClickDebugInfo() {
    $('a:not(.prevent-click-debug)').click(function (e) {
        if ($(e.target).hasClass('debug-permission')) return false;
    }).addClass("prevent-click-debug");
}

function addViewPermRead(title, perm, selected) {
    selected = selected || false;
    if($('#arvorePerfisAcesso .dynatree-container > .dynatree-lastsib > span > a:last-of-type').text() == "(dev)") {
        var onclick = `javascript:prompt('`+title+` (`+perm+`)', '`+perm+`'); setTimeout(function(){$(this).parent().find('.dynatree-title').click();}, 50);`;
        var html = `<a href="javascript:void(0)" onClick="`+onclick+`" className="prevent-click-debug">(`+perm+`)</a>`;
        var len = $('#arvorePerfisAcesso').dynatree("getTree").options.children.length;

        $('#arvorePerfisAcesso').dynatree("getTree").options.children[len-1].children.push({key: perm, title: title, select: selected})
        $('#arvorePerfisAcesso').dynatree("getTree").reload();
        $('#arvorePerfisAcesso .dynatree-container > .dynatree-lastsib ul .dynatree-lastsib > span.dynatree-node').append(html);
        $('#arvorePerfisAcesso .dynatree-container > .dynatree-lastsib ul .dynatree-lastsib').css("background-color", "#DBDBDB");
    }
}

function setSession(key, value, fnc) {
    post(
        "dev/setSession",
        {
            session_key: key,
            session_value: value
        },
        fnc
    );
}

function removeSession(key, fnc) {
    post(
        "dev/removeSession",
        { session_key: key },
        fnc
    );
}

function post(url, data, success, showNofify) {
    showNofify = showNofify || true
    request(url, "POST", data, success, showNofify)
}

function get(url, data, success, showNofify) {
    showNofify = showNofify || true
    request(url, "GET", data, success, showNofify)
}

function request(url, method, data, success, showNofify) {
    showNofify = showNofify || true
    $.ajax({
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

function updateSessionVar() {
    $.ajax({
        dataType: "json",
        url: "dev/getSession",
        success: function(e) {
            sessionArray = {};
            $.each(e, function(key, value){
                sessionArray[key] = value;
            });
            console.log("update session var");
            console.dir(sessionArray);
            isDebugMode = (typeof e.dev_habilitar !== "undefined");
            if(typeof updateSessionVarCallback === 'function') updateSessionVarCallback(e);
        }
    });
}

function addBtnViewPerm(e) {
    var hDevMode = ((e.hasOwnProperty("dev_habilitar") && e.dev_habilitar)?e.dev_habilitar:false);
    addLeftBtn('enable-dev-mode', ((hDevMode)?"Desabilitar DEV Mode":"Habilitar DEV Mode"), ((hDevMode)?"power-off":"bug"), function(){
        var btn = $(this);
        if(btn.text().trim() == "Habilitar DEV Mode") {
            setSession("dev_habilitar", true, function changeShowPerm(){ btn.html("<i class='fa fa-lg fa-fw fa-power-off'></i> Desabilitar DEV Mode"); });
        } else {
            removeSession("dev_habilitar", function changeShowPerm(){ btn.html("<i class='fa fa-lg fa-fw fa-bug'></i> Habilitar DEV Mode"); });
        }
    }, false, "#sub-group-debug-lti ul");

    if(!isDebugMode) return;

    var showPerm = ((e.hasOwnProperty("dev_show_perm") && e.dev_show_perm)?e.dev_show_perm:false);
    addLeftBtn('show-perm', ((showPerm)?"Hide Perm":"Show Perm"), ((showPerm)?"low-vision":"list-alt"), function(){
        var btn = $(this);
        if(btn.text().trim() == "Show Perm") {
            setSession("dev_show_perm", true, function changeShowPerm(){ btn.html("<i class='fa fa-lg fa-fw fa-low-vision'></i> Hide Perm"); });
        } else {
            removeSession("dev_show_perm", function changeShowPerm(){ btn.html("<i class='fa fa-lg fa-fw fa-list-alt'></i> Show Perm"); });
        }
    }, false, "#sub-group-debug-lti ul");
}

function updateSessionVarCallback(e) {
    addBtnViewPerm(e);
    debugPermissionBtn(e);
    debugShowRequestPermission(e);
}

$('head').append('<link rel="stylesheet" type="text/css" href="https://s3.amazonaws.com/dev.lti.net.br/paulo/debug/style.css">');
requestSuccess.changeShowPerm = function(){ location.reload(); };
updateSessionVar();
