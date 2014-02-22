;(function(){
  var TextSelection = {};

    /**
     * [selectText description]
     * @param  {[type]} text [description]
     * @return {[type]}      [description]
     */
  TextSelection.selectText = function (text){
    var selection = window.getSelection();
    var range = document.createRange();
    range.selectNodeContents(text);
    range.setStart(text,0);
    range.setEnd(text,1);
    selection.removeAllRanges();
    selection.addRange(range);
  },

  TextSelection.setRange = function(range){
    TextSelection.range = range;
  }

  _replacer = function(className){
    var start = _getStart();
    var end = _getEnd();
    start.parentNode.className = className;
    if(!start.isEqualNode(end)){
      var child = start.parentNode;
      while(!child.contains(end)){
        if(child.nextSibling){
          child = child.nextSibling;
        }else{
          child = child.parentNode.nextSibling
        }
      }
    }
    TextSelection.clear();
  }


  _travers = function(node, match, className){
    
  }


  /**
   * [appends the target node text to the text selection ]
   * @param  {[type]} target [description]
   * @return {[type]}        [description]
   */
  TextSelection.appendPosition = function (position){
    var target = document.elementFromPoint(position.left, position.top);
    TextSelection.append(target);
  },
 
  /**
   * [Pre appends the node at the given position]
   * @param  {[type]} target [description]
   * @return {[type]}        [description]
   */
  TextSelection.prependPosition = function (position){
    var target = document.elementFromPoint(position.left, position.top);
    //try and find the node that is next to our start position
    TextSelection.prepend(target);
  },

  TextSelection.prepend = function(target){
    var selObj = window.getSelection();
    var selRange = selObj.getRangeAt(0);
    selRange.setStart(target,0);
    selObj.removeAllRanges();
    selObj.addRange(selRange);
  },

  /**
   * [ append a specific target to the selected text range]
   * @param target 
   *
   */
  TextSelection.append = function(target){
    var selObj = window.getSelection();
    var selRange = selObj.getRangeAt(0);
    selRange.setEnd(target,1);
    selObj.removeAllRanges();
    selObj.addRange(selRange);
  },

  /**
   * [clears the current text selection in the window]
   * @return {[type]}        [description]
   */
  TextSelection.clear = function(){
    var selObj = window.getSelection();
    selObj.removeAllRanges();
  },


  /**
   * [ underlines the currently selected text ] 
   */
  TextSelection.underline = function(){
    var span = document.createElement("span");
    span.style.textDecoration = "underline";
    _wrapSelection(span);
  },

  TextSelection.highlight = function(color){
    var highlight = document.createElement("span");
    highlight.style.backgroundColor = color || "yellow";
    _wrapSelection(highlight);
  },

  _wrapSelection = function(element){
    var wrapStart = document.createRange();
    var range = _getRange();
    if(!range.startContainer.isEqualNode(range.endContainer)){ 
      wrapStart.setStart(range.startContainer, range.startOffset);
      wrapStart.setEnd(range.startContainer, range.startContainer.length);
      var tmp = range.startContainer; 
      while(tmp.nextSibling === null){
        tmp = tmp.parentNode;   
      }
      tmp = tmp.nextSibling;
      while(!tmp.contains(range.endContainer)){
        var middle = document.createRange();
        var old = tmp;
        if(tmp.nextSibling === null){
          tmp = tmp.parentNode;
        }else{
          tmp = tmp.nextSibling;
        }
        middle.selectNode(old);
        middle.surroundContents(element.cloneNode());
      }
      var wrapEnd = document.createRange();
      wrapEnd.setStart(range.endContainer, 0);
      wrapEnd.setEnd(range.endContainer, range.endOffset);
      wrapEnd.surroundContents(element.cloneNode());
      wrapStart.surroundContents(element.cloneNode());
    }else{
      range.surroundContents(element.cloneNode());
    }
  }, 

  /**
   * [get the cloned range of nodes in the selection]
   * @return {[type]}        [description]
   */
  TextSelection.get = function(){
    return _getRange().cloneRange();
  } 
  /**
   * [ Gets the end node of the range]
   * @return {[Node]} [description]
   */
  _getEnd = function(){
    return _getRange().endContainer;
  }
  /**
   * [ Gets the starting node of the range]
   * @return {[Node]} [description]
   */
  _getStart = function(){
    return _getRange().startContainer;
  }

  _getRange = function(){
    if(typeof TextSelection.range == "undefined"){
      var selObj = window.getSelection();
      return selObj.getRangeAt(0);
    } else {
      return TextSelection.range;
    }
  }

  /**
   * Makes a xpath from the node
   */
  _makeXPath = function(node, currentPath) {
    /* this should suffice in HTML documents for selectable nodes, XML with namespaces needs more code */
    currentPath = currentPath || '';
    switch (node.nodeType) {
      case 3:
      case 4:
        return _makeXPath(node.parentNode, 'text()[' + (document.evaluate('preceding-sibling::text()', node, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength + 1) + ']');
      case 1:
        return _makeXPath(node.parentNode, node.nodeName + '[' + (document.evaluate('preceding-sibling::' + node.nodeName, node, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength + 1) + ']' + (currentPath ? '/' + currentPath : ''));
      case 9:
        return '/' + currentPath;
      default:
        return '';
    }
  }

  TextSelection.restoreSelection = function(){
    var selection = window.getSelection();
    selection.removeAllRanges();
    var range = document.createRange();
    range.setStart(document.evaluate(selectionDetails[0], document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue, Number(selectionDetails[1]));
    range.setEnd(document.evaluate(selectionDetails[2], document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue, Number(selectionDetails[3]));
    selection.addRange(range);
  }

  /**
   * Stores off the range as a jsonable object.
   */
  TextSelection.getStorableSelection = function() {
    var range = _getRange();
    var selectObj = { 
      'startXPath': _makeXPath(range.startContainer), 
      'startOffset': range.startOffset, 
      'endXPath': _makeXPath(range.endContainer), 
      'endOffset': range.endOffset 
    }
    return selectObj
  }


  var all;
  if (typeof self !== 'undefined') {
    all = self; // Web Worker
  } else if (typeof window !== 'undefined') {
    all = window; // Browser
  } else if (typeof global !== 'undefined') {
    all = global; // NodeJS
  }
  all.TextSelection = TextSelection;
  
  if (typeof module !== 'undefined') {
    module.exports = TextSelection;
  }

})();
