import { useState, useEffect, useRef } from "react";
import { addBlock } from "../redux/actions";
import { getThisPage } from "../redux/selectors";
import { useDispatch, useSelector } from "react-redux";
import EditableBlock from "./EditableBlock";

const Main = ({ pageId }) => {
  const dispatch = useDispatch();
  const mainRef = useRef();

  useEffect(() => {
    window.history.replaceState(null, null, `pageID_${pageId}`);
  });

  const currentPageData = useSelector((state) => getThisPage(state, pageId));
  // console.log(currentPageData);

  const addBlockHandler = (callerRef) => {
    if (callerRef.current.nextSibling) {
      // 다음 element로 focus만 잡아준다
      callerRef.current.nextSibling.focus();
    } else {
      dispatch(addBlock(pageId, true, "", -1));
    }
  };

  useEffect(() => {
    if (currentPageData.blocks.length > 0) {
      mainRef.current.lastElementChild.focus();
    }
  }, [currentPageData.blocks]);

  return (
    <main className="col-span-10 bg-pink-100 min-h-screen p-3.5" ref={mainRef}>
      {currentPageData.blocks.map((b) => {
        return (
          <EditableBlock block={b} key={b.id} addBlock={addBlockHandler} />
        );
      })}
    </main>
  );
};

export default Main;
