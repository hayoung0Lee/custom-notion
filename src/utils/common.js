export const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",

  // change background colour if dragging
  background: isDragging ? "#D1D5DB" : null,

  // styles we need to apply on draggables
  ...draggableStyle,
});

export const getDomElement = (blockId) => {
  const target = document.querySelectorAll(`[data-block-id="${blockId}"]`)[0];
  return target;
};

export const focusTargetDomElement = (target) => {
  try {
    target.firstChild.firstChild.focus();
    setEndOfContenteditable(target.firstChild.firstChild);
  } catch (e) {
    console.error(`focusing error: ${e.message}`);
  }
};

export const getBlockIdIndex = (array, value) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === value) {
      return i;
    }
  }
  return 0;
};

// ref: https://stackoverflow.com/questions/1125292/how-to-move-cursor-to-end-of-contenteditable-entity/3866442#3866442
export const setEndOfContenteditable = (contentEditableElement) => {
  var range, selection;
  if (document.createRange) {
    //Firefox, Chrome, Opera, Safari, IE 9+
    range = document.createRange(); //Create a range (a range is a like the selection but invisible)
    range.selectNodeContents(contentEditableElement); //Select the entire contents of the element with the range
    range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
    selection = window.getSelection(); //get the selection object (allows you to change selection)
    selection.removeAllRanges(); //remove any selections already made
    selection.addRange(range); //make the range you have just created the visible selection
  } else if (document.selection) {
    //IE 8 and lower
    range = document.body.createTextRange(); //Create a range (a range is a like the selection but invisible)
    range.moveToElementText(contentEditableElement); //Select the entire contents of the element with the range
    range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
    range.select(); //Select the range (make it the visible selection
  }
};
