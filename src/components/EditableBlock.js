import ContentEditable from "react-contenteditable";
import { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getBlockState, getCurrentBlockInfo } from "../redux/selectors";
import { updateCurrentBlock } from "../redux/actions";
import { addTab } from "../redux/actions";

const EditableBlock = ({
  depth, // tab횟수 제한용
  blockId, // 현재의 blockId
  parentId, // 어디에서 현재 블록을 호출했는지를 체크한다, -1은 root에서 불렀단 것
}) => {
  const dispatch = useDispatch();
  const blockInfo = useSelector((state) => getCurrentBlockInfo(state, blockId));
  const ref = useRef();

  const [blockValue, setBlockValue] = useState(blockInfo.contents);

  // const onKeyDownHandler = (e, pageId, isRoot, blockId, previousBlock) => {
  //   if (e.key === "Enter") {
  //     e.preventDefault();
  //     if (addBlock) {
  //       addBlock(
  //         ref,
  //         isRoot ? pageId : -1,
  //         isRoot,
  //         isRoot ? -1 : blockId,
  //         ref.current.dataset.parentId
  //       );
  //     }
  //     return;
  //   } else if (e.key === "Tab") {
  //     e.preventDefault();

  //     if (depth >= 3 || !previousBlock) {
  //       return;
  //     }

  //     dispatch(addTab(pageId, isRoot, previousBlock.dataset.blockId, blockId));
  //     return;
  //   }
  // };

  // const onBlurHandler = () => {
  //   if (blockInfo.contents.trim() !== ref.current.innerText.trim()) {
  //     dispatch(updateCurrentBlock(blockId, ref.current.innerText));
  //   }
  // };

  // useEffect(() => {
  //   if (blockInfo.blocks.length > 0) {
  //     // FIXME: focusing이거 제일 마지막에 되는것말고, 중간에 Block을 추가하더라도 되도록 만들어야함
  //     mainRef.current.lastElementChild.focus();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [blockInfo.blocks]);

  return (
    <div data-block-id={blockId} data-parent-id={parentId}>
      <ContentEditable
        innerRef={ref}
        html={blockValue}
        disabled={false}
        onChange={(e) => setBlockValue(e.target.value)}
        className={`my-5 p-2 w-3/4 hover:bg-gray-100`}
      />
      {/* subeditable */}
      {blockInfo.blocks.length > 0 && (
        <div className="ml-3" data-parent-id={blockId}>
          {blockInfo.blocks.map((subBlockId) => {
            return (
              <EditableBlock
                key={blockId}
                blockId={subBlockId}
                parentId={blockId}
                depth={depth + 1}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EditableBlock;
