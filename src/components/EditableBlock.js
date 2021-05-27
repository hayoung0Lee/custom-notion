import ContentEditable from "react-contenteditable";
import { useState, useRef } from "react";

const EditableBlock = ({ block, addBlock }) => {
  const [state, setState] = useState({ html: block.contents, tagName: "div" });
  const ref = useRef();

  const onKeyDownHandler = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addBlock(ref);
    }
  };
  return (
    <ContentEditable
      innerRef={ref}
      html={state.html}
      disabled={false}
      onChange={(e) => setState((prev) => ({ ...prev, html: e.target.value }))}
      onKeyDown={(e) => onKeyDownHandler(e)}
    />
  );
};

export default EditableBlock;
