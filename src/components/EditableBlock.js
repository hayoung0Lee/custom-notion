import ContentEditable from "react-contenteditable";
import { useState, useRef } from "react";

const EditableBlock = ({ block }) => {
  console.log("block", block);
  const [state, setState] = useState({ html: block.contents, tagName: "div" });
  const ref = useRef();

  return (
    <ContentEditable
      innerRef={ref}
      html={state.html}
      disabled={false}
      onChange={(e) => setState((prev) => ({ ...prev, html: e.target.value }))}
    />
  );
};

export default EditableBlock;
