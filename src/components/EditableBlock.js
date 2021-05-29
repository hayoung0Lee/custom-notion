import ContentEditable from "react-contenteditable";
import { useRef, useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getBlockState, getCurrentBlockInfo } from "../redux/selectors";
import { updateCurrentBlock } from "../redux/actions";
import { addTab } from "../redux/actions";
import { addBlock } from "../redux/actions";
import MainStore from "../utils/store";

const EditableBlock = ({
  depth, // tab횟수 제한용
  blockId, // 현재의 blockId
  parentId, // 어디에서 현재 블록을 호출했는지를 체크한다, -1은 root에서 불렀단 것
  isLast, //  한 loop의 마지막 노드에는 일단 마지막일지도 모르니까 isLast를 true로 넘긴다.
}) => {
  const dispatch = useDispatch();
  const blockInfo = useSelector((state) => getCurrentBlockInfo(state, blockId));
  const ref = useRef();

  const [firstLoaded, setFirstLoaded] = useState(false);

  const [blockValue, setBlockValue] = useState(blockInfo.contents);
  const { pageId } = useContext(MainStore);

  useEffect(() => {
    // isLast === true이면 마지막일지도 모르는것

    if (isLast && blockInfo.blocks.length === 0) {
      ref.current.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (firstLoaded === false) {
      setFirstLoaded(true); // 첫번째 로드되었다고 체크
    } else {
      // 다 로드된 상태
      // 새로 뭔가 blockInfo의 길이에 변화가 있다면 마지막 원소에 체크해주기
      if (ref.current.nextSibling) {
        ref.current.nextSibling.lastChild.firstChild.focus();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockInfo.blocks]);

  const onKeyDownHandler = (e, pageId, blockId) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // ref.current.nextSibiling가 있다는건 subBlocks가 있다는 것
      if (ref.current.nextSibling) {
        ref.current.nextSibling.firstChild.firstChild.focus();
      } else if (ref.current.parentElement.nextSibling) {
        // 부모의 nextSibling이 있다는건, 형재 노드가 있다는 것
        ref.current.parentElement.nextSibling.firstChild.focus();
      } else {
        // console.log("끝까지 다 들어온것, subBlock도 형제 노드도 없다");
        dispatch(addBlock(pageId, parentId, "something")); // 형제노드로 추가됨
      }
    }
  };

  const onBlurHandler = () => {
    if (blockInfo.contents.trim() !== ref.current.innerText.trim()) {
      dispatch(updateCurrentBlock(blockId, ref.current.innerText));
    }
  };

  return (
    <div data-block-id={blockId} data-parent-id={parentId}>
      <ContentEditable
        innerRef={ref}
        html={blockValue}
        disabled={false}
        onChange={(e) => setBlockValue(e.target.value)}
        onKeyDown={(e) => onKeyDownHandler(e, pageId, blockId)}
        onBlur={(e) => onBlurHandler(e)}
        className={`my-5 p-2 w-3/4 hover:bg-gray-100`}
        tabIndex="-1"
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
