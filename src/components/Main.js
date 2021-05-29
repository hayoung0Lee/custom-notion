import { useState, useEffect, useRef } from "react";
import { addBlock } from "../redux/actions";
import { getRootBlocks } from "../redux/selectors";
import { useDispatch, useSelector } from "react-redux";
import EditableBlock from "./EditableBlock";

const Main = ({ pageId }) => {
  const dispatch = useDispatch();
  const mainRef = useRef();

  useEffect(() => {
    window.history.replaceState(null, null, `pageID_${pageId}`);
  });

  const rootBlock = useSelector((state) => getRootBlocks(state, pageId));

  return (
    <main className="col-span-10 bg-pink-100 min-h-screen p-3.5" ref={mainRef}>
      {rootBlock.map((blockId) => {
        return (
          <EditableBlock
            key={blockId}
            depth={1} // tab횟수 제한용
            blockId={blockId} // 현재의 blockId
            parentId={-1} // -1은 root에서 호출했다는 뜻
          />
        );
      })}
    </main>
  );
};

export default Main;
