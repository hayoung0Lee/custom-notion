import ContentEditable from "react-contenteditable";
import { useRef, useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getBlockState, getCurrentBlockInfo } from "../redux/selectors";
import { updateCurrentBlock } from "../redux/actions";
import { addTab } from "../redux/actions";
import { addBlock } from "../redux/actions";
import MainStore from "../utils/store";
import Dot from "../dot.svg";
import { Droppable, Draggable } from "react-beautiful-dnd";
import {
  getItemStyle,
  getDomElement,
  focusTargetDomElement,
} from "../utils/common";

const EditableBlock = ({
  depth, // tab횟수 제한용
  blockId, // 현재의 blockId
  parentId, // 어디에서 현재 블록을 호출했는지를 체크한다, -1은 root에서 불렀단 것
  isLast, //  한 loop의 마지막 노드에는 일단 마지막일지도 모르니까 isLast를 true로 넘긴다.
  forHandle,
  nth, // 형제노드 체크할때
}) => {
  const dispatch = useDispatch();
  const blockInfo = useSelector((state) => getCurrentBlockInfo(state, blockId));
  const ref = useRef();

  const [blockValue, setBlockValue] = useState(blockInfo.contents);
  const { pageId, lastAction, setLastAction, getOrderedList } =
    useContext(MainStore);

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
    if (lastAction.action === "Enter" && blockInfo.blocks.length > 0) {
      const newBlockId = blockInfo.blocks[blockInfo.blocks.length - 1];
      const target = getDomElement(newBlockId);
      target.firstChild.firstChild.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockInfo.blocks]);

  const handleEnter = (e, pageId, blockId, nth) => {
    e.preventDefault();

    const target = getDomElement(blockId);
    const itsParent = +target.dataset.parentId; // 나의 부모 id
    // blockId : 나의 id

    // 나한테 형제가 있는지 거기로 이동
    // 없으면 enter해서 새로운 블럭 생성
    if (getOrderedList[blockId].length > 0) {
      // 내 id밑에 subBlock이 있으면 거기로 이동
      const focusTarget = getDomElement(getOrderedList[blockId][0]);
      focusTargetDomElement(focusTarget);
    } else if (nth < getOrderedList[itsParent].length - 1) {
      // 내가 지금 마지막 형제 노드가 아닌것을 확인
      const focusTarget = getDomElement(getOrderedList[itsParent][nth + 1]);
      focusTargetDomElement(focusTarget);
    } else {
      console.log("끝까지 다 들어온것, subBlock도 형제 노드도 없다");
      dispatch(addBlock(pageId, parentId, "something")); // 형제노드로 추가됨
    }
    setLastAction({ action: "Enter" });
  };

  const handleTab = (e, pageId, blockId, depth, nth) => {
    e.preventDefault();
    if (depth > 3) {
      console.log("no more tab", depth);
      return;
    }

    const target = getDomElement(blockId);
    const itsParent = +target.dataset.parentId; // 나의 부모 id

    // 이전 형제노드가 있을때만 가능하다
    // 있으면 갖다 옮긴다.
    if (nth > 0) {
      const previousSiblingId = getOrderedList[itsParent][nth - 1];
      // // // 현재 pageId, 옮길대상, 현재의 blockId, 현재의 parentId,
      dispatch(addTab(pageId, previousSiblingId, blockId, itsParent));
      setLastAction({ action: "Tab" });
    } else {
      console.log("can't tab");
    }
  };

  const onKeyDownHandler = (e, pageId, blockId, depth, nth) => {
    if (e.key === "Enter") {
      handleEnter(e, pageId, blockId, nth);
    } else if (e.key === "Tab") {
      handleTab(e, pageId, blockId, depth, nth);
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
          onKeyDown={(e) => onKeyDownHandler(e, pageId, blockId, depth, nth)}
          onBlur={(e) => onBlurHandler(e)}
          className={`w-full p-2 rounded-md hover:bg-gray-200`}
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
        <Droppable droppableId={`droppable${blockId}`} type={`${blockId}`}>
          {(provided, snapshot) => (
            <div
              className="ml-7 subBlock"
              data-parent-id={blockId}
              ref={provided.innerRef}
            >
              {blockInfo.blocks.map((subBlockId, index) => {
                return (
                  <Draggable
                    key={`${blockId}_${subBlockId}`}
                    draggableId={`${blockId}_${subBlockId}`}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        {/* <span {...provided.dragHandleProps}>Btn</span> */}
                        <EditableBlock
                          key={subBlockId}
                          blockId={subBlockId}
                          parentId={blockId}
                          depth={depth + 1}
                          isLast={
                            isLast === true &&
                            index === blockInfo.blocks.length - 1
                          } // 마지막일지도 모르는 중에서도 마지막인것들한테만 true를 넘겨준다
                          nth={index} // 형제노드 체크할때
                          forHandle={{ ...provided.dragHandleProps }}
                        />
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      )}
    </div>
  );
};

export default EditableBlock;
