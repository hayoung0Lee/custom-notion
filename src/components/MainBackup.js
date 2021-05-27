import { useState, useEffect } from "react";
import { addBlock } from "../redux/actions";
import { getBlockContents } from "../redux/selectors";

import { useDispatch, useSelector } from "react-redux";
const Main = ({ pageId }) => {
  const [input, setInput] = useState("");
  const [nestedInput, setNestedInput] = useState("");
  const dispatch = useDispatch();
  const blocks = useSelector((state) => getBlockContents(state));

  const handleBlock = () => {
    dispatch(addBlock(pageId, true, input));
  };

  const handleNestedBlock = (parentId) => {
    dispatch(addBlock(pageId, false, nestedInput, parentId));
  };

  useEffect(() => {
    window.history.replaceState(null, null, `pageID_${pageId}`);
  });

  return (
    <main className="col-span-10 bg-pink-100 min-h-screen p-3.5">
      {/* root block */}
      <input onChange={(e) => setInput(e.target.value)} value={input} />
      <button onClick={handleBlock}>Add</button>
      {/* block */}
      {blocks.map((b, index) => {
        return (
          <div key={index}>
            {b.contents}
            <br />
            {/* nested block */}
            <div className="p-3">
              <input
                onChange={(e) => setNestedInput(e.target.value)}
                value={nestedInput}
              />
              <button onClick={() => handleNestedBlock(b.id)}>
                Add Nested Block
              </button>
            </div>
          </div>
        );
      })}
    </main>
  );
};

export default Main;
