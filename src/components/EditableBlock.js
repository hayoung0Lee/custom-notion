import ContentEditable from "react-contenteditable";
import { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getBlockState, getCurrentBlockInfo } from "../redux/selectors";
import { updateCurrentBlock } from "../redux/actions";

const EditableBlock = ({ pageId, isRoot, blockId, addBlock, depth }) => {
  console.log("depth", depth);
  const dispatch = useDispatch();
  const blockInfo = useSelector((state) => getCurrentBlockInfo(state, blockId));
  const ref = useRef();

  const [blockValue, setBlockValue] = useState(blockInfo.contents);

  const onKeyDownHandler = (e, pageId, isRoot, blockId) => {
    if (e.key === "Enter") {
      e.preventDefault();
      console.log(
        "pageId ? pageId : -1, isRoot, pageId ? -1 : blockId",
        isRoot ? pageId : -1,
        isRoot,
        isRoot ? -1 : blockId
      );
      if (addBlock) {
        addBlock(ref, isRoot ? pageId : -1, isRoot, isRoot ? -1 : blockId);
      }
    }
  };

  const onBlurHandler = () => {
    if (blockInfo.contents.trim() !== ref.current.innerText.trim()) {
      dispatch(updateCurrentBlock(blockId, ref.current.innerText));
    }
  };

  return (
    <>
      <ContentEditable
        innerRef={ref}
        html={blockValue}
        disabled={false}
        onChange={(e) => setBlockValue(e.target.value)}
        onBlur={(e) => onBlurHandler(e)}
        onKeyDown={(e) => onKeyDownHandler(e, pageId, isRoot, blockId)}
        className={`ml-${(depth + 1) * 3} my-5`}
      />
      {/* subeditable */}
      {blockInfo.blocks.length > 0 &&
        blockInfo.blocks.map((blockId) => {
          return (
            <EditableBlock
              pageId={null}
              isRoot={false}
              blockId={blockId}
              key={blockId}
              addBlock={addBlock}
              depth={depth + 1}
            />
          );
        })}
    </>
  );
};

export default EditableBlock;
