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
  } catch (e) {
    console.error(`focusing error: ${e.message}`);
  }
};
