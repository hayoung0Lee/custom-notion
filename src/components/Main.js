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

  const addBlockHandler = (callerRef, pageId, isRoot, parentId) => {
    if (callerRef.current.nextSibling) {
      // 다음 element로 focus만 잡아준다
      callerRef.current.nextSibling.focus();
    } else {
      // dispatch(addBlock(pageId, true, "", -1));
      dispatch(addBlock(pageId, isRoot, "", parentId));
    }
  };

  useEffect(() => {
    if (rootBlock.length > 0) {
      mainRef.current.lastElementChild.focus();
    }
  }, [rootBlock]);

  return (
    <main className="col-span-10 bg-pink-100 min-h-screen p-3.5" ref={mainRef}>
      {rootBlock.map((blockId) => {
        return (
          <EditableBlock
            pageId={pageId}
            isRoot={true}
            blockId={blockId}
            key={blockId}
            addBlock={addBlockHandler}
            depth={0}
          />
        );
      })}
    </main>
  );
};

export default Main;
