function onImportDialogOk() {
    $( this ).dialog( "close" );
    var data = null;
    try {
        data = HTML2Tree($('#import').val())
    } catch(e) {
        console.log(e);
        alert('Invalid HTML');
        return;
    }
    tree.settings.core.data = data;
    tree.refresh();    
}
            
            
function onCellDataChanged() {
    UiToNode();
}

function onAddClicked() {
    grid.addRow({ 'Attribute': 'property', 'Value': 'value' });
    UiToNode();
}

function onExportClicked() {
    $('#export').val(generateHTML());
    $( "#dialog-export" ).dialog('open');
}

function onImportClicked() {
    $( "#dialog-import" ).dialog('open');
}

function onNodeDehover(event, data) {
    hoveredId = null;
    var node = tree.get_selected(true)[0];
    if(node.parent == '#') {
        node = null;
    }
    NodeToUi(node);
}
function onNodeHover(event, data) {
    
    hoveredId = null;
    //Save textarea
    if($textarea.is(':focus') || isMultipleSelection) {
        return;
    }
    
    if(data.node.parent == '#') {
        NodeToUi(null);
        return;
    }
    
    hoveredId = data.node.id;
    NodeToUi(data.node)
}

function onNodeSelected(event, data) {
    
    if(data.selected.length > 1) {
        isMultipleSelection = true;
    } else {
        isMultipleSelection = false;
    }
    
    if(data.node.parent == '#' || isMultipleSelection) {
        NodeToUi(null);
        return;
    }
    
    NodeToUi(data.node);
    $textarea.focus();
    
}

function onTextareaChange(e) {
    UiToNode();
}

function onTextareaKeyDown(e) { 
    if(e.keyCode == 27 || e.keyCode == 9) {
        UiToNode();
        e.preventDefault();
        $tree.focus();
    }
}

function onTextareaKeyup(e) {
    UiToNode();
}

function onTreeKeyDown(e) {

     if(e.keyCode == 9) {
        e.preventDefault();
        if(hoveredId) {
            console.log(hoveredId);
            tree.deselect_all(true);
            tree.select_node(hoveredId);
        }
    }   
    
    if (e.keyCode == ctrlKey) {
        ctrlDown = true;
        return;
    }
    
}

function onTreeKeyUp(e) {

    if (e.keyCode == ctrlKey) {
        ctrlDown = false;
        return;
    }
    
    if (e.keyCode == delKey) {
        var nodes = tree.get_selected(1);
        var len = nodes.length;
        for(var i=0; i<len; i++) {
            if(nodes[i].parent === '#') {
                return;
            }
        }
        tree.delete_node(tree.get_selected(0));
        return;
    }
    
    if (ctrlDown && e.keyCode == xKey) {
        internalBuffer = tree.get_selected(0);
        tree.cut(tree.get_selected(0));
        return;
    }
    
    if (ctrlDown && e.keyCode == cKey) {
        internalBuffer = tree.get_selected(0);
        tree.copy(tree.get_selected(0));
        return;
    }
    
    if (ctrlDown && e.keyCode == vKey) {
        var parent = tree.get_selected(0);
        if(parent.equals(internalBuffer)) {
            parent = tree.get_selected(1)[0].parents[0];
        }
        tree.paste(parent, 'last');
        tree.copy(internalBuffer);
        return;
    }

}