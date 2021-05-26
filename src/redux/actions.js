import {
  ADD_PAGE,
  REMOVE_PAGE,
  EDIT_PAGE,
  ADD_BLOCK,
  REMOVE_BLOCK,
  EDIT_BLOC,
} from "./actionTypes";

let nextPageId = 0;

export const addPage = (pageName) => ({
  type: ADD_PAGE,
  payload: { pageId: nextPageId++, pageName, blocks: [] },
});

export const addBlock = (pageId, isRoot, contents) => ({
  type: ADD_BLOCK,
  payload: { pageId, isRoot, contents },
});
