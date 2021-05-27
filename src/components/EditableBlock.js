import ContentEditable from "react-contenteditable";
import { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getBlockState, getCurrentBlockInfo } from "../redux/selectors";
import { updateCurrentBlock } from "../redux/actions";

const EditableBlock = ({ blockId, addBlock }) => {
  const dispatch = useDispatch();
  const blockInfo = useSelector((state) => getCurrentBlockInfo(state, blockId));
  const ref = useRef();

  console.log(blockInfo);
  const [blockValue, setBlockValue] = useState(blockInfo.contents);

  const onKeyDownHandler = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (addBlock) {
        addBlock(ref);
      }
    }
  };

  const onBlurHandler = () => {
    if (blockInfo.contents.trim() !== ref.current.innerText.trim()) {
      dispatch(updateCurrentBlock(blockId, ref.current.innerText));
    }
  };

  return (
    <div className="m-5">
      <ContentEditable
        innerRef={ref}
        html={blockValue}
        disabled={false}
        onChange={(e) => setBlockValue(e.target.value)}
        onBlur={(e) => onBlurHandler(e)}
        onKeyDown={(e) => onKeyDownHandler(e)}
      />
      {/* subeditable */}
      <div className="ml-3">
        {blockInfo.blocks.length > 0 &&
          blockInfo.blocks.map((blockId) => {
            return <EditableBlock blockId={blockId} key={blockId} />;
          })}
      </div>
    </div>
  );
};

export default EditableBlock;
