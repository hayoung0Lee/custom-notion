import Nav from "./components/Nav";
import Main from "./components/Main";

function App() {
  return (
    <div className="grid grid-cols-12">
      <Nav />
      <Main pageId={0} />
    </div>
  );
}

export default App;
