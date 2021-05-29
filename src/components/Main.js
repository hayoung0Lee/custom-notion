import { useState, useEffect, useRef } from "react";
import { getRootBlocks } from "../redux/selectors";
import { useDispatch, useSelector } from "react-redux";
import EditableBlock from "./EditableBlock";
import MainStore from "../utils/store";

const Main = ({ pageId }) => {
  const mainRef = useRef();
  const [lastAction, setLastAction] = useState({ action: "" });
  useEffect(() => {
    window.history.replaceState(null, null, `pageID_${pageId}`);
  });

  const rootBlock = useSelector((state) => getRootBlocks(state, pageId));

  // TODO: Make it draggable
  return (
    <MainStore.Provider
      value={{
        pageId: pageId,
        lastAction: lastAction,
        setLastAction: setLastAction,
      }}
    >
      <main className="col-span-10 bg-pink-100 min-h-screen p-10" ref={mainRef}>
        {rootBlock.map((blockId, index) => {
          return (
            <EditableBlock
              key={blockId}
              depth={1} // tab횟수 제한용
              blockId={blockId} // 현재의 blockId
              parentId={-1} // -1은 root에서 호출했다는 뜻
              isLast={index === rootBlock.length - 1} // 한 loop의 마지막 노드에는 일단 마지막일지도 모르니까 isLast를 true로 넘긴다.
            />
          );
        })}
      </main>
    </MainStore.Provider>
  );
};

export default Main;
