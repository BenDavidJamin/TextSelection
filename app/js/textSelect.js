//var TextSelection = (function () {

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

  TextSelection.highlight = function(color){
    var highlight = document.createElement("span");
    highlight.style.backgroundColor = color || "yellow";
    TextSelection._replacer(highlight);
   },


   TextSelection.underline = function(){
    var underline = document.createElement("span");
    underline.style.textDecoration = "underline";
    TextSelection._replacer(underline);

   },

  TextSelection._replacer = function(replacement){
    var node = TextSelection._getStart();
    while(node && !node.isEqualNode(TextSelection._getEnd())){
      $(replacement).append($(node).clone());
      var next = node.nextSibling;
      $(node).remove();
      node = next;
    }
    var next = node.nextSibling;
    $(replacement).append($(node).clone());
    $(node).remove();
    $(replacement).insertBefore(next);
    TextSelection.clear();
   }

  /**
   * [appends the target node text to the text selection ]
   * @param  {[type]} target [description]
   * @return {[type]}        [description]
   */
  TextSelection.appendPosition = function (position){
    var target = document.elementFromPoint(position.left, position.top);
    if(target == null){
      var node = TextSelection._getEnd();
      // /---^---/ in between word boundaries
      var i = 0;
      while(i < 100){
        if(node.offsetLeft <= position.left &&
         position.left <= (node.offsetLeft + node.offsetWidth)&&
          position.top >= node.offsetTop &&
          position.top <= (node.offsetTop + node.offsetHeight)){
          TextSelection.append(node);
          return; // end loop 
        }else{
          node = TextSelection._findNode(node, position);
        }
        i++;
      }
    }else {
      TextSelection.append(target);
    }
  },
  /**
   * [Pre appends the node at the given position]
   * @param  {[type]} target [description]
   * @return {[type]}        [description]
   */
  TextSelection.preappendPosition = function (position){
    var target = document.elementFromPoint(position.left, position.top);
    //try and find the node that is next to our start position
    if(target == null){
      var node = TextSelection._getStart();
      // /---^---/ in between word boundaries
      var i = 0;
      while(i < 100){
        if(
          node.offsetLeft <= position.left &&
          position.left <= (node.offsetLeft + node.offsetWidth) &&
          position.top >= node.offsetTop &&
          position.top <= (node.offsetTop + node.offsetHeight)){
          TextSelection.preappend(node);
          return;
        }else{
          node = TextSelection._findNode(node, position);
        }
        i++;
      }
    }else{
      TextSelection.preappend(target);
    }
  },

  TextSelection.preappend = function(target){
    if(target.nodeName == "SPAN"){
      var selObj = window.getSelection();
      var selRange = selObj.getRangeAt(0);
      selRange.setStart(target,0);
      selObj.removeAllRanges();
      selObj.addRange(selRange);
    }
  },

  TextSelection.append = function(target){
    if(target.nodeName == "SPAN"){
      var selObj = window.getSelection();
      var selRange = selObj.getRangeAt(0);
      selRange.setEnd(target,1);
      selObj.removeAllRanges();
      selObj.addRange(selRange);
    }
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
   * [get the cloned range of nodes in the selection]
   * @return {[type]}        [description]
   */
  TextSelection.get = function(){
    var selObj = window.getSelection();
    var selRange = selObj.getRangeAt(0);
    return selRange.cloneRange();
  } 
  /**
   * [ Gets the end node of the range]
   * @return {[Node]} [description]
   */
  TextSelection._getEnd = function(){
    var selObj = window.getSelection();
    var endNode = selObj.getRangeAt(0).endContainer;
    //Firefox contains the span as the container
    //Chrome contains the text node as the container
    if(endNode.nodeName != "SPAN"){
      endNode = endNode.parentNode;
    }
    return endNode;
  }
  /**
   * [ Gets the starting node of the range]
   * @return {[Node]} [description]
   */
  TextSelection._getStart = function(){
    var selObj = window.getSelection();
    var startNode = selObj.getRangeAt(0).startContainer;
    //Firefox contains the span as the container
    //Chrome contains the text node as the container
    if(startNode.nodeName != "SPAN"){
      startNode = startNode.parentNode;
    }
    return startNode;
  }
  /**
   * [ white space text nodes present an issue when
   *  walking through the siblings. This is just a loop
   *  that checks for those nasty white spaces and steps over them]
   * @param  {[type]} node     [description]
   * @param  {[type]} position [description]
   * @return {[type]}          [Node]
   */
  TextSelection._findNode = function(node, position){
    var previous = node.previousSibling;
    var next = node.nextSibling;
    // TODO test and make these work with 
    // multiple nodes containing white space. 
    do {
      next = next.nextSibling;
    }while(next.innerText == "" ||
        next.nodeValue == " ");

    do{
      previous = previous.previousSibling;
    }
    while(previous.innerText == "" ||
      previous.nodeValue == " ");

    if(
      (node.offsetLeft + node.offsetWidth) <= position.left && 
      position.left <= next.offsetLeft 
      ||
      (previous.offsetLeft + previous.offsetWidth) <= position.left &&
      position.left <= node.offsetLeft 
      ){
      return null;
    }else if(position.top <= previous.offsetTop){
      return previous;
    }else if(position.top >= next.offsetTop + next.offsetHeight){
      return next;
    }else if(next.offsetLeft <= position.left){
      return next;
    }else if(previous.offsetLeft <=  position.left){
      return previous;
    }else{
      return null;
    } 
  }

/*
  return TextSelection;
}());
*/

