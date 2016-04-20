var tree = null;
var grid = null;

var $textarea = null;
var $grid = null;
var $tree = null;

var isMultipleSelection = false;
var hoveredId = null;

var ctrlDown = false;
var ctrlKey  = 17;
var delKey   = 46;
var vKey     = 86;
var cKey     = 67;
var xKey     = 88;
var internalBuffer = [];


$(document).ready(function() {

    $textarea = $('#inner-html');
    $tree = $('#tree');
    $grid = $('#grid');
    
    grid = $grid.grid({
         dataSource: [],
         columns: [ { field: 'Attribute', editor: true }, { field: 'Value', editor: true } ]
    });

    $tree.jstree({
        "core" : {
            "animation" : 0,
            "check_callback" : true,
            "themes" : { "stripes" : true },
            'data' : HTML2Tree("<article><section class='myclass'><h1>Heading text</h1><p>Hello world</p></section></article>")
        },
        "types" : {
            "#" : { "valid_children" : ["tag"] },
            "tag" : {
              "icon" : "/static/3.3.0/assets/images/tree_icon.png",
              "valid_children" : ["tag"]
            }
        },
        "plugins" : ["contextmenu", "dnd", "state", "types", "wholerow"]
    });
    tree = jQuery.jstree.reference($tree);
        
    
    onExportClicked
    $('#btn-add').on('click', onAddClicked);
    $('#btn-export').on('click', onExportClicked);
    $('#btn-import').on('click', onImportClicked);

    $textarea.keyup(onTextareaKeyup);
    $textarea.keydown(onTextareaKeyDown);
    $textarea.change(onTextareaChange);
     
    grid.on('cellDataChanged', onCellDataChanged);
    

    $tree.on("select_node.jstree", onNodeSelected);
    $tree.on("hover_node.jstree", onNodeHover);
    $tree.on("dehover_node.jstree", onNodeDehover);
    $tree.on("keydown", onTreeKeyDown);
    $tree.on("keyup", onTreeKeyUp);
    
    
     $( "#dialog-export" ).dialog({
        modal: true,
        width:600,
        height:500,
        autoOpen: false,
        buttons: {
            Ok: function() {
                $( this ).dialog( "close" );
            }
        }
    });
    

     $( "#dialog-import" ).dialog({
        modal: true,
        autoOpen: false,
        width:600,
        height:500,
        buttons: {
            Ok: onImportDialogOk,
            Cancel: function() {
                $( this ).dialog( "close" );
            }
        }
    });
    
});
