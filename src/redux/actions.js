import {
  ADD_PAGE,
  REMOVE_PAGE,
  EDIT_PAGE,
  ADD_BLOCK,
  REMOVE_BLOCK,
  EDIT_BLOCk,
  EDIT_BLOCK,
  TAB_BLOCK,
  REORDER_BLOCK,
} from "./actionTypes";

let nextPageId = 1;

export const addPage = (pageName) => ({
  type: ADD_PAGE,
  payload: { pageId: nextPageId++, pageName, blocks: [] },
});

let blockId = 9;

export const addBlock = (pageId, parentId, contents) => ({
  type: ADD_BLOCK,
  payload: {
    pageId,
    parentId, // -1이면 root에다 추가하는 것
    blockId: blockId++, // 현재 추가될 blockId
    contents,
  },
});

export const updateCurrentBlock = (blockId, updatedValue) => ({
  type: EDIT_BLOCK,
  payload: { blockId, updatedValue },
});

export const addTab = (pageId, targetBlockId, currentBlockId, parentId) => ({
  type: TAB_BLOCK,
  payload: {
    pageId,
    targetBlockId,
    currentBlockId,
    parentId, // // -1이면 root에 있던 block임
  },
});

export const updateOrder = (
  pageId,
  parentId,
  sourceIndex,
  destinationIndex
) => ({
  type: REORDER_BLOCK,
  payload: {
    pageId,
    parentId,
    sourceIndex,
    destinationIndex,
  },
});
