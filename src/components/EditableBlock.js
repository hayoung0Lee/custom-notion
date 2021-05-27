import ContentEditable from "react-contenteditable";
import { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getBlockState, getCurrentBlockInfo } from "../redux/selectors";
import { updateCurrentBlock } from "../redux/actions";
import { addTab } from "../redux/actions";

const EditableBlock = ({
  pageId,
  isRoot,
  blockId,
  addBlock,
  depth,
  parentId,
  mainRef,
}) => {
  const dispatch = useDispatch();
  const blockInfo = useSelector((state) => getCurrentBlockInfo(state, blockId));
  const ref = useRef();

  const [blockValue, setBlockValue] = useState(blockInfo.contents);

  const onKeyDownHandler = (e, pageId, isRoot, blockId, previousBlock) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (addBlock) {
        addBlock(
          ref,
          isRoot ? pageId : -1,
          isRoot,
          isRoot ? -1 : blockId,
          ref.current.dataset.parentId
        );
      }
      return;
    } else if (e.key === "Tab") {
      e.preventDefault();

      if (depth >= 3 || !previousBlock) {
        return;
      }

      dispatch(addTab(pageId, isRoot, previousBlock.dataset.blockId, blockId));
      return;
    }
  };

  const onBlurHandler = () => {
    if (blockInfo.contents.trim() !== ref.current.innerText.trim()) {
      dispatch(updateCurrentBlock(blockId, ref.current.innerText));
    }
  };

  const fromBlock = blockId;

  useEffect(() => {
    if (blockInfo.blocks.length > 0) {
      mainRef.current.lastElementChild.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockInfo.blocks]);
  return (
    <>
      <ContentEditable
        innerRef={ref}
        html={blockValue}
        disabled={false}
        onChange={(e) => setBlockValue(e.target.value)}
        onBlur={(e) => onBlurHandler(e)}
        onKeyDown={(e) =>
          onKeyDownHandler(
            e,
            pageId,
            isRoot,
            blockId,
            ref.current.previousSibling
          )
        }
        className={`ml-${(depth + 1) * 3} my-5`}
        data-block-id={blockId}
        data-parent-id={isRoot ? -1 : parentId}
      />
      {/* subeditable */}
      {blockInfo.blocks.length > 0 &&
        blockInfo.blocks.map((blockId) => {
          return (
            <EditableBlock
              pageId={pageId}
              isRoot={false}
              blockId={blockId}
              key={blockId}
              addBlock={addBlock}
              depth={depth + 1}
              parentId={fromBlock}
              mainRef={mainRef}
            />
          );
        })}
    </>
  );
};

export default EditableBlock;
