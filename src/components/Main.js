import { useState, useEffect } from "react";
import { addBlock } from "../redux/actions";
import { getBlockContents } from "../redux/selectors";

import { useDispatch, useSelector } from "react-redux";
const Main = ({ pageId }) => {
  useEffect(() => {
    window.history.replaceState(null, null, `pageID_${pageId}`);
  });

  return <main className="col-span-10 bg-pink-100 min-h-screen p-3.5"></main>;
};

export default Main;
