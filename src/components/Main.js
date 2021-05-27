import { useState, useEffect } from "react";
import { addBlock } from "../redux/actions";
import { getThisPage } from "../redux/selectors";
import { useDispatch, useSelector } from "react-redux";
import EditableBlock from "./EditableBlock";

const Main = ({ pageId }) => {
  useEffect(() => {
    window.history.replaceState(null, null, `pageID_${pageId}`);
  });

  const currentPageData = useSelector((state) => getThisPage(state, pageId));
  console.log(currentPageData);
  return (
    <main className="col-span-10 bg-pink-100 min-h-screen p-3.5">
      {currentPageData.blocks.map((b) => {
        return <EditableBlock block={b} key={b.id} />;
      })}
    </main>
  );
};

export default Main;
