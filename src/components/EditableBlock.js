import ContentEditable from "react-contenteditable";
import { useRef, useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getBlockState, getCurrentBlockInfo } from "../redux/selectors";
import { updateCurrentBlock } from "../redux/actions";
import { addTab } from "../redux/actions";

const EditableBlock = ({
  depth, // tab횟수 제한용
  blockId, // 현재의 blockId
  parentId, // 어디에서 현재 블록을 호출했는지를 체크한다, -1은 root에서 불렀단 것
  isLast, //  한 loop의 마지막 노드에는 일단 마지막일지도 모르니까 isLast를 true로 넘긴다.
}) => {
  const dispatch = useDispatch();
  const blockInfo = useSelector((state) => getCurrentBlockInfo(state, blockId));
  const ref = useRef();

  const [blockValue, setBlockValue] = useState(blockInfo.contents);

  useEffect(() => {
    // isLast === true이면 마지막일지도 모르는것
    if (isLast && blockInfo.blocks.length === 0) {
      ref.current.focus();
    }
  }, []);

  return (
    <div data-block-id={blockId} data-parent-id={parentId}>
      <ContentEditable
        innerRef={ref}
        html={blockValue}
        disabled={false}
        onChange={(e) => setBlockValue(e.target.value)}
        className={`my-5 p-2 w-3/4 hover:bg-gray-100`}
        tabindex="-1"
      />
      {/* subeditable */}
      {blockInfo.blocks.length > 0 && (
        <div className="ml-3" data-parent-id={blockId}>
          {blockInfo.blocks.map((subBlockId, index) => {
            return (
              <EditableBlock
                key={subBlockId}
                blockId={subBlockId}
                parentId={blockId}
                depth={depth + 1}
                isLast={
                  isLast === true && index === blockInfo.blocks.length - 1
                } // 마지막일지도 모르는 중에서도 마지막인것들한테만 true를 넘겨준다
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EditableBlock;
