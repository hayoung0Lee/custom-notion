import { useState } from "react";
import { addBlock } from "../redux/actions";

const Main = () => {
  const [input, setInput] = useState("");

  return (
    <main className="col-span-9 bg-pink-100 min-h-screen">
      Main <input onChange={(e) => setInput(e.target.value)} value={input} />
    </main>
  );
};

export default Main;
