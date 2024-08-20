var btnGroupTemplate = '<li id="sub-{{:idBtn}}" class="open"><a href="#"><i class="fa fa-lg fa-fw fa-hotel"></i><span class="menu-item-parent"> {{:label}}</span><b class="collapse-sign"><em class="fa fa-minus-square-o"></em></b></a><ul style="display: block;"></ul></li>';
var btnLeftTemplate = '<li id="sub-{{:idBtn}}" class=""><a href="#"{{:data-modal}}><i class="fa fa-lg fa-fw fa-{{:icon}}"></i> <span class="menu-item-parent">{{:label}}</span></a></li>';
var modalTemplate = '<div class="modal fade" id="debug-{{:idModal}}Modal" tabindex="-1" role="dialog" aria-labelledby="{{:idModal}}Label" aria-hidden="true"><div class="modal-dialog modal-lg" role="document"><div class="modal-content"><div class="modal-header"><h5 class="modal-title" id="{{:idModal}}Label">{{:label}}</h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="modal-body">{{:conteudo}}</div><div class="modal-footer"><button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button></div></div></div></div>';
