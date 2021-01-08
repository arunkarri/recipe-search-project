//reusable functions created for DOM manipulations
function createElement(element) {
    return document.createElement(element);
  }
  
  function append(element) {
    return document.body.append(element);
  }
  
  function appendChild(element, child) {
    return element.appendChild(child);
  }
  
  function setAttribute(element, attribute, value) {
    element.setAttribute(attribute, value);
  }