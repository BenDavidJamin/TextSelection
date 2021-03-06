
define(["TextSelection"], function(){

  function createTextNode(text){
    var aDiv = document.createElement("div");
    var aSpan = document.createElement("span");
    var newContent = document.createTextNode(text);

    aSpan.appendChild(newContent);
    aDiv.appendChild(aSpan);
    return aDiv;
  }
  
  describe("Text Selection ", function(){
  
    it("select text range correct", function(){
      var theText = "Hi there and greetings!"
      var aDiv = createTextNode(theText);
  
      document.body.appendChild(aDiv);
  
      TextSelection.selectText(aDiv.firstChild);
      var selObj = window.getSelection();
      var selRange = selObj.getRangeAt(0);
      chai.assert.equal(selRange.startOffset,0);
      chai.assert.equal(selRange.endOffset, theText.length);
      document.body.removeChild(aDiv);  
    });
  
    it("clears selected text ", function(){
  
      var aDiv = createTextNode("Hi there and greetings!");
  
      document.body.appendChild(aDiv);
  
      TextSelection.selectText(aDiv.firstChild);
  
      TextSelection.clear();
      var selObj = window.getSelection();
      chai.assert.equal(selObj.rangeCount, 0);
      document.body.removeChild(aDiv);  
    });
  
    it(" can append a text node to selection", function(){
  
      var aDiv = createTextNode("Hi there and greetings!");
      var anotherDiv = createTextNode("another node");
      document.body.appendChild(aDiv);
      document.body.appendChild(anotherDiv);
  
      TextSelection.selectText(aDiv.firstChild);
      TextSelection.append(anotherDiv.firstChild);
  
      var selObj = window.getSelection();
  
      chai.assert.equal(selObj.baseNode, aDiv.firstChild.firstChild);
      chai.assert.equal(selObj.extentNode, anotherDiv.firstChild.firstChild);
      document.body.removeChild(aDiv);  
      document.body.removeChild(anotherDiv);  
    });
  
    it( " can prepend a text node to selection", function(){
      var aDiv = createTextNode("Hi there and greetings!");
      var anotherDiv = createTextNode("another node");
      document.body.appendChild(anotherDiv);
      document.body.appendChild(aDiv);
  
      TextSelection.selectText(aDiv.firstChild);
      TextSelection.prepend(anotherDiv.firstChild);
  
      var selObj = window.getSelection();
  
      chai.assert.equal(selObj.baseNode, anotherDiv.firstChild.firstChild);
      chai.assert.equal(selObj.extentNode, aDiv.firstChild.firstChild);
      document.body.removeChild(aDiv);  
      document.body.removeChild(anotherDiv);
    });
  
    it( " gets the selected text", function(){
      var aDiv = createTextNode("Hi there and greetings! ");
      var anotherDiv = createTextNode("another node ");
      var endDiv = createTextNode("end node ");
  
      document.body.appendChild(anotherDiv);
      document.body.appendChild(aDiv);
      document.body.appendChild(endDiv);
  
      TextSelection.selectText(anotherDiv.firstChild);
      TextSelection.append(endDiv.firstChild);
  
      var selObj = window.getSelection();
      var selRange = selObj.getRangeAt(0);
      document.body.removeChild(aDiv);  
      document.body.removeChild(anotherDiv);
      document.body.removeChild(endDiv);
    });
    xit("text highlighting of single node", function(){
      var aDiv = createTextNode("Hi there and greetings! ");
      var anotherDiv = createTextNode("another node ");
      var endDiv = createTextNode("end node ");
  
      document.body.appendChild(anotherDiv);
      document.body.appendChild(aDiv);
      document.body.appendChild(endDiv);
  
      TextSelection.selectText(aDiv);
      TextSelection.highlight();
  
      expect(aDiv.firstChild.nodeName).toBe("SPAN");
      //expect(aDiv.firstChild.style.backgroundColor).toBe("yellow")
  
      document.body.removeChild(aDiv);  
      document.body.removeChild(anotherDiv);
      document.body.removeChild(endDiv);
    });
  
    it("text highlighting of mulitple nodes", function(){
     var aDiv = createTextNode("Hi there and greetings! ");
      var anotherDiv = createTextNode("another node ");
      var endDiv = createTextNode("end node ");
  
      document.body.appendChild(anotherDiv);
      document.body.appendChild(aDiv);
      document.body.appendChild(endDiv);
  
      TextSelection.selectText(aDiv);
      TextSelection.append(endDiv);
      TextSelection.highlight();
      //expect(aDiv.firstChild.nodeName).toBe("SPAN");
      //expect(aDiv.firstChild.style.backgroundColor).toBe("yellow")
  
      //document.body.removeChild(aDiv);  
      //document.body.removeChild(anotherDiv);
      //document.body.removeChild(endDiv);
    });
  });
});
