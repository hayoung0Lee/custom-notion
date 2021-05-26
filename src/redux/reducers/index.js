import { combineReducers } from "redux";
import pages from "./pageReducer";
import blocks from "./blockReducer";

export default combineReducers({ pages, blocks });
