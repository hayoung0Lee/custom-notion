import { useState, useEffect, useRef } from "react";
import { getRootBlocks } from "../redux/selectors";
import { useDispatch, useSelector } from "react-redux";
import EditableBlock from "./EditableBlock";
import MainStore from "../utils/store";

const Main = ({ pageId }) => {
  const dispatch = useDispatch();
  const mainRef = useRef();

  useEffect(() => {
    window.history.replaceState(null, null, `pageID_${pageId}`);
  });

  const rootBlock = useSelector((state) => getRootBlocks(state, pageId));

  const addBlockHandler = () => {};

  return (
    <MainStore.Provider value={{ pageId: pageId }}>
      <main
        className="col-span-10 bg-pink-100 min-h-screen p-3.5"
        ref={mainRef}
      >
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
