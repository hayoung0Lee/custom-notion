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
      const { pageId, blockId, isRoot } = action.payload;
      // root일때는 page에 넣어준다.
      if (isRoot) {
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
      const { pageId, isRoot, previousBlockId, currentBlockId } =
        action.payload;
      if (isRoot) {
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
        // FIXME Tab한번 더 되게
        return state;
      }
    }
    default:
      return state;
  }
};

export default pageReducer;
