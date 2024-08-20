// ==UserScript==
// @name         Debug LTI
// @namespace    http://paulo.lti.net.br/
// @version      2024-08-20
// @description  Ferramentas para auxiliar nos teste
// @author       pauloslash
// @updateURL    https://raw.githubusercontent.com/pauloslash/debug-lti/master/update.meta.js
// @downloadURL  https://raw.githubusercontent.com/pauloslash/debug-lti/master/install.user.js
// @include      /https?:\/\/([^.]+).localhost(:80[0-9]+)?/
// @include      /https?:\/\/([^.]+).sisgr.com/
// @include      /https?:\/\/fin\.wee\.bet/
// @require      https://raw.githubusercontent.com/pauloslash/debug-lti/master/template.js
// @require      https://raw.githubusercontent.com/pauloslash/debug-lti/master/helper.js
// @require      https://raw.githubusercontent.com/pauloslash/debug-lti/master/script.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sisgr.localhost
// @grant        none
// ==/UserScript==
(function() {
    'use strict';

    addLeftGroupBtn('lti', "Debug", function(){
        $('#sub-group-debug-lti').click(function(e){
            var checkGroupClick = ($(e.target.parentElement).closest('li').attr('id') == "sub-group-debug-lti");
            if(checkGroupClick) {
                if($(this).hasClass('open')) {
                    $('#sub-group-debug-lti').removeClass('open');
                    $('#sub-group-debug-lti > ul').css('display', 'none');
                    $('#sub-group-debug-lti > a em').addClass('fa-plus-square-o').removeClass('fa-minus-square-o');
                } else {
                    $('#sub-group-debug-lti').addClass('open');
                    $('#sub-group-debug-lti > ul').css('display', 'block');
                    $('#sub-group-debug-lti > a em').addClass('fa-minus-square-o').removeClass('fa-plus-square-o');
                }
            }
        });
        jQuery.each(jQuery._data(document, "events" )['click'], function(idx, item){
            if(item.selector == 'nav a[href!="#"]') {
                jQuery._data(document, "events" )['click'].splice(idx, 1);
                $(document).on("click",'nav > ul > li:not(#sub-group-debug-lti) a[href!="#"]',function(a){a.preventDefault();var b=$(a.currentTarget);b.parent().hasClass("active")||b.attr("target")||($.root_.hasClass("mobile-view-activated")?($.root_.removeClass("hidden-menu"),$("html").removeClass("hidden-menu-mobile-lock"),window.setTimeout(function(){window.location.search?window.location.href=window.location.href.replace(window.location.search,"").replace(window.location.hash,"")+"#"+b.attr("href"):window.location.hash=b.attr("href")},150)):window.location.search?window.location.href=window.location.href.replace(window.location.search,"").replace(window.location.hash,"")+"#"+b.attr("href"):window.location.hash=b.attr("href"))});
            }
        });
    });
    addLeftBtn('show-log', "Ultimas Alterações", "eye", function(){
        $.ajax({
            dataType: "json",
            url: "dev/lastChanges",
            success: function(e) {
                $('#debug-show-logModal .modal-body').html("<table class='table' style='overflow: auto;display: block;'><thead></thead><tbody></tbody></table>");
                var html = "<tr><th>New</th><th>Old</th><th>#</th><th>Usuário</th><th>Entidade</th><th>Entidade ID</th><th>IP</th><th>Ação</th><th>Data Registro</th></tr>";
                $('#debug-show-logModal .modal-body table thead').append(html);
                $.each(e.entities, function(idx, item){
                    var html = "<tr><td><pre>"+JSON.stringify(item.new, null, 2)+"</pre></td><td><pre>"+JSON.stringify(item.old, null, 2)+"</pre></td><td>"+item.id+"</td><td>"+((item.usuario_id)?"Usuário":"Sistema")+"</td><td>"+item.entidade+"</td><td>"+item.entidadeId+"</td><td>"+item.ip+"</td><td>"+item.acao+"</td><td>"+item.dataRegistro+"</td></tr>";
                    $('#debug-show-logModal .modal-body table tbody').append(html);
                });
                $('#debug-show-logModal .modal-dialog').css("width", "1500px");
            },
            error: function(e) {
                if(e.status == 404) leftBtnStatus("#sub-debug-show-log", false);
            }
        });
    }, true, "#sub-group-debug-lti ul");
    addLeftBtn('refresh', "Refresh", "refresh", function(){
        var param = "?";
        if(location.href.includes("?")) {
            var param = "&"
        }
        if(location.href.includes(param+"refresh")) {
            location.href = location.href.replace(param+"refresh", "");
        } else {
            location.href += param+"refresh";
        }
    }, false, "#sub-group-debug-lti ul");
})();