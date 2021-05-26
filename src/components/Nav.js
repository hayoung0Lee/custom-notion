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
    <nav className="col-span-3 bg-red-100 min-h-screen">
      <button onClick={handlePage}>Add Page</button>
      {pages.map((p, index) => {
        return (
          <div key={index}>
            {p.pageName} {index}
          </div>
        );
      })}
    </nav>
  );
};

export default Nav;
