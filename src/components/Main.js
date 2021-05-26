import { useState } from "react";
import { addBlock } from "../redux/actions";
import { getBlockContents } from "../redux/selectors";

import { useDispatch, useSelector } from "react-redux";
const Main = ({ pageId }) => {
  const [input, setInput] = useState("");
  const dispatch = useDispatch();
  const blocks = useSelector((state) => getBlockContents(state));
  console.log("blocks", blocks);
  const handleBlock = () => {
    dispatch(addBlock(pageId, true, input));
  };

  return (
    <main className="col-span-9 bg-pink-100 min-h-screen">
      Main {pageId}
      <input onChange={(e) => setInput(e.target.value)} value={input} />
      <button onClick={handleBlock}>Add</button>
      {blocks.map((b, index) => {
        return <div key={index}>{b.contents}</div>;
      })}
    </main>
  );
};

export default Main;
