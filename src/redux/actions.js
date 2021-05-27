import {
  ADD_PAGE,
  REMOVE_PAGE,
  EDIT_PAGE,
  ADD_BLOCK,
  REMOVE_BLOCK,
  EDIT_BLOCk,
  EDIT_BLOCK,
} from "./actionTypes";

let nextPageId = 1;

export const addPage = (pageName) => ({
  type: ADD_PAGE,
  payload: { pageId: nextPageId++, pageName, blocks: [] },
});

let blockId = 2;

export const addBlock = (pageId, isRoot, contents, parentId) => ({
  type: ADD_BLOCK,
  payload: { pageId, isRoot, contents, blockId: blockId++, parentId },
});

export const updateCurrentBlock = (blockId, updatedValue) => ({
  type: EDIT_BLOCK,
  payload: { blockId, updatedValue },
});
