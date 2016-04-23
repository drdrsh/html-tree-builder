function NodeToUi(node) {
    
    if(node == null) {
        $textarea.val('');
        $textarea.attr("disabled","disabled");
        grid.getAll().length = 0;
        grid.reload();
        $('#btn-add').attr("disabled","disabled");
        return;
    }
    
    $textarea.val(node.li_attr['data-inner-text']);
    $textarea.removeAttr('disabled');
    $('#btn-add').removeAttr("disabled");
    
    var attributes = [];
    
    try {
        attributes = JSON.parse(node.li_attr['data-attributes']);
    } catch(e) {}
    
    var gridData = grid.getAll();
    gridData.length = 0;
    for(var i=0; i<attributes.length; i++) {
        gridData.push(attributes[i]);
    }
    grid.reload();
}

function UiToNode() {
    var node = tree.get_selected(1)[0];
    node.li_attr['data-inner-text'] = $textarea.val();
    node.li_attr['data-attributes'] = JSON.stringify(grid.getAll());
}


function generateHTML(nodeId, level) {
    if(!nodeId) {
        nodeId = '#';   
        level  = -2
    }
    var nodes = tree._model.data;
    
    var node = nodes[nodeId];
    var len  = node.children.length;
    var html = '';
    if(node.text && node.text !== 'root' && nodeId !== '#') {
        var innerText = node.li_attr['data-inner-text']?node.li_attr['data-inner-text']:'';
        var attribs = node.li_attr['data-attributes']?node.li_attr['data-attributes']:'[]';
        attribs = JSON.parse(attribs);
        var attribArray = [];
        for(var i=0; i<attribs.length; i++) {
            attribArray.push(' ' + attribs[i].Attribute + '="' + attribs[i].Value + '"');
        }
        
        html   = '\t'.repeat(level)   + '<' + node.text + attribArray.join('') + '>\n';
        if(innerText) {
            html  += '\t'.repeat(level+1) + innerText + '\n';
        }
    }
    
    for(var i=0; i<len; i++) {
        html += generateHTML(node.children[i], level+1);
    }
    if(node.text && node.text !== 'root' && nodeId !== '#') {
        html += '\t'.repeat(level) + '</' + node.text + '>\n';
    }            
    return html;
}

function HTML2Tree(text) {
    var treeObject = {};
    
    if (window.DOMParser)
    {
          parser = new DOMParser();
          docNode = parser.parseFromString(text,"text/xml");
    }
    else // Microsoft strikes again
    {
          docNode = new ActiveXObject("Microsoft.XMLDOM");
          docNode.async = false;
          docNode.loadXML(text); 
    } 
    var element = docNode.firstChild;
    
    //Recursively loop through DOM elements and assign properties to object
    function treeHTML(element, object) {
        object['type'] = 'default';
        object['text'] = element.nodeName;
        
        var nodeList = element.childNodes;
        if (nodeList != null) {
            var textContent = '';
            if (nodeList.length) {
                object["children"] = [];
                for (var i = 0; i < nodeList.length; i++) {
                    if (nodeList[i].nodeType == 3) {
                        textContent += nodeList[i].nodeValue;
                        //object["children"].push(nodeList[i].nodeValue);
                    } else {
                        var newObject = {};
                        object["children"].push(newObject);
                        treeHTML(nodeList[i], newObject);
                    }
                }
            }
            object.li_attr = {};
            object.li_attr['data-inner-text'] = textContent;
            object.li_attr['data-attributes'] = '';
        }
        
        if (element.attributes != null) {
            if (element.attributes.length) {
                object["attributes"] = [];
                for (var i = 0; i < element.attributes.length; i++) {
                    object["attributes"].push({
                        'Attribute': element.attributes[i].nodeName,
                        'Value': element.attributes[i].nodeValue
                    });
                }
            }
            object.li_attr['data-attributes'] = JSON.stringify(object["attributes"]);
            delete object["attributes"];
        }
        
    }
    
    treeHTML(element, treeObject);
    var rootObject = {
        type: 'default',
        text: 'root',
        children: [treeObject]
    }
    
    return rootObject;
}
