import { addPage } from "../redux/actions";
import { getEveryPages } from "../redux/selectors";
import { useDispatch, useSelector } from "react-redux";

const Nav = () => {
  const dispatch = useDispatch();
  const pages = useSelector((state) => getEveryPages(state));

  const handlePage = () => {
    dispatch(addPage("title"));
  };

  return (
    <nav className="col-span-2 min-h-screen bg-indigo-100">
      <h1 className="text-lg m-2.5 text-center">Hayoung's Custom Notion</h1>
      {pages.map((p, index) => {
        return (
          <div
            key={index}
            className="w-full p-2.5 text-center hover:bg-gray-400"
          >
            {p.pageName} {index}
          </div>
        );
      })}
      <button
        className="w-full p-2.5 shadow-sm hover:shadow-md hover:bg-gray-400"
        onClick={handlePage}
      >
        + Add a page
      </button>
    </nav>
  );
};

export default Nav;
