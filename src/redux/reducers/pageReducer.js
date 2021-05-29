import {
  ADD_PAGE,
  REMOVE_PAGE,
  EDIT_PAGE,
  ADD_BLOCK,
  TAB_BLOCK,
} from "../actionTypes";

const initialState = {
  pageIds: [0],
  pageById: { 0: { pageName: "Intro Page", blocks: [0, 1] } },
};

const pageReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_PAGE: {
      const { pageId, pageName } = action.payload;
      return {
        ...state,
        pageIds: [...state.pageIds, pageId],
        pageById: { ...state.pageById, [pageId]: { pageName, blocks: [] } },
      };
    }
    case ADD_BLOCK: {
      const {
        pageId,
        parentId, // -1이면 root에다 추가하는 것
        blockId, // 현재 추가될 blockId
        contents,
      } = action.payload;
      if (parentId === -1) {
        // root에 추가
        return {
          ...state,
          pageById: {
            ...state.pageById,
            [pageId]: {
              ...state.pageById[pageId],
              blocks: [...state.pageById[pageId].blocks, blockId],
            },
          },
        };
      } else {
        return state;
      }
    }
    case TAB_BLOCK: {
      const { pageId, targetBlockId, currentBlockId, parentId } =
        action.payload;
      if (parentId === -1) {
        return {
          ...state,
          pageById: {
            ...state.pageById,
            [pageId]: {
              ...state.pageById[pageId],
              blocks: state.pageById[pageId].blocks.filter(
                (block) => block !== currentBlockId
              ),
            },
          },
        };
      } else {
        return state;
      }
    }
    default:
      return state;
  }
};

export default pageReducer;
