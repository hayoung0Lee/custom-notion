import ContentEditable from "react-contenteditable";
import { useRef, useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getBlockState, getCurrentBlockInfo } from "../redux/selectors";
import { updateCurrentBlock } from "../redux/actions";
import { addTab } from "../redux/actions";
import { addBlock } from "../redux/actions";
import MainStore from "../utils/store";
import Dot from "../dot.svg";

const EditableBlock = ({
  depth, // tab횟수 제한용
  blockId, // 현재의 blockId
  parentId, // 어디에서 현재 블록을 호출했는지를 체크한다, -1은 root에서 불렀단 것
  isLast, //  한 loop의 마지막 노드에는 일단 마지막일지도 모르니까 isLast를 true로 넘긴다.
  forHandle,
}) => {
  const dispatch = useDispatch();
  const blockInfo = useSelector((state) => getCurrentBlockInfo(state, blockId));
  const ref = useRef();

  const [blockValue, setBlockValue] = useState(blockInfo.contents);
  const { pageId, lastAction, setLastAction } = useContext(MainStore);

  useEffect(() => {
    // isLast === true이면 마지막일지도 모르는것
    if (
      (isLast && blockInfo.blocks.length === 0) ||
      lastAction.action === "Tab" // 마지막 action이 Tab이었으면 focus
    ) {
      ref.current.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // 다 로드된 상태
    // 새로 뭔가 blockInfo의 길이에 변화가 있다면 마지막 원소에 체크해주기
    if (
      lastAction.action === "Enter" &&
      ref.current.parentElement.nextSibling
    ) {
      console.log("updated enter");
      ref.current.parentElement.nextSibling.lastChild.firstChild.firstChild.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockInfo.blocks]);

  const handleEnter = (e, pageId, blockId) => {
    e.preventDefault();
    // ref.current.nextSibiling가 있다는건 subBlocks가 있다는 것
    if (ref.current.parentElement.nextSibling) {
      ref.current.parentElement.nextSibling.firstChild.firstChild.firstChild.focus();
    } else if (ref.current.parentElement.parentElement.nextSibling) {
      // 부모의 nextSibling이 있다는건, 형재 노드가 있다는 것
      ref.current.parentElement.parentElement.nextSibling.firstChild.firstChild.focus();
    } else {
      // console.log("끝까지 다 들어온것, subBlock도 형제 노드도 없다");
      dispatch(addBlock(pageId, parentId, "something")); // 형제노드로 추가됨
    }
    setLastAction({ action: "Enter" });
  };

  const handleTab = (e, pageId, blockId, depth) => {
    e.preventDefault();
    if (depth > 3) {
      console.log("no more tab", depth);
      return;
    }

    // 이전 형제노드가 있을때만 가능하다
    // 있으면 갖다 옮긴다.
    if (ref.current.parentElement.parentElement.previousSibling) {
      const targetBlockId =
        +ref.current.parentElement.parentElement.previousSibling.dataset
          .blockId;

      const parentId =
        +ref.current.parentElement.parentElement.dataset.parentId;

      // // 현재 pageId, 옮길대상, 현재의 blockId, 현재의 parentId,
      dispatch(addTab(pageId, targetBlockId, blockId, parentId));
      setLastAction({ action: "Tab" });
    } else {
      console.log("can't tab");
    }
  };

  const onKeyDownHandler = (e, pageId, blockId, depth) => {
    if (e.key === "Enter") {
      handleEnter(e, pageId, blockId);
    } else if (e.key === "Tab") {
      handleTab(e, pageId, blockId, depth);
    }
  };

  const onBlurHandler = () => {
    if (blockInfo.contents.trim() !== ref.current.innerText.trim()) {
      dispatch(updateCurrentBlock(blockId, ref.current.innerText));
    }
  };

  return (
    <div data-block-id={blockId} data-parent-id={parentId}>
      <div className="flex justify-center align-center">
        <ContentEditable
          innerRef={ref}
          html={blockValue}
          disabled={false}
          onChange={(e) => setBlockValue(e.target.value)}
          onKeyDown={(e) => onKeyDownHandler(e, pageId, blockId, depth)}
          onBlur={(e) => onBlurHandler(e)}
          className={`w-full p-2 rounded-md hover:bg-gray-100`}
          tabIndex="-1"
        />
        <span
          {...forHandle}
          className="w-8 block hover:bg-gray-400 flex justify-center align-center"
        >
          <img src={Dot} className="dot" alt="logo" width="10px" />
        </span>
      </div>
      {/* subeditable */}
      {blockInfo.blocks.length > 0 && (
        <div className="ml-7" data-parent-id={blockId}>
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
