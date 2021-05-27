import ContentEditable from "react-contenteditable";
import { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getCurrentBlockInfo } from "../redux/selectors";
import { updateCurrentBlock } from "../redux/actions";

const EditableBlock = ({ blockId, addBlock }) => {
  const dispatch = useDispatch();
  const blockInfo = useSelector((state) => getCurrentBlockInfo(state, blockId));
  const ref = useRef();

  const [blockValue, setBlockValue] = useState(blockInfo.contents);

  const onKeyDownHandler = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addBlock(ref);
    }
  };

  const onBlurHandler = () => {
    dispatch(updateCurrentBlock(blockId, ref.current.innerText));
  };

  return (
    <ContentEditable
      innerRef={ref}
      html={blockValue}
      disabled={false}
      onChange={(e) => setBlockValue(e.target.value)}
      onBlur={(e) => onBlurHandler(e)}
      onKeyDown={(e) => onKeyDownHandler(e)}
    />
  );
};

export default EditableBlock;
