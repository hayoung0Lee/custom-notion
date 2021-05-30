import {
  ADD_PAGE,
  REMOVE_PAGE,
  EDIT_PAGE,
  ADD_BLOCK,
  TAB_BLOCK,
  REORDER_BLOCK,
  REMOVE_BLOCK,
} from "../actionTypes";

const initialState = {
  pageIds: [0],
  pageById: { 0: { pageName: "Intro Page", blocks: [0, 1, 8] } },
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
    case REORDER_BLOCK: {
      const { pageId, parentId, sourceIndex, destinationIndex } =
        action.payload;

      if (parentId === -1) {
        const sourceValue = state.pageById[pageId].blocks[sourceIndex];

        const newOrder = [...state.pageById[pageId].blocks];

        if (sourceIndex < destinationIndex) {
          // 원래 위치보다 뒤로 추가
          newOrder.splice(destinationIndex + 1, 0, sourceValue);
          newOrder.splice(sourceIndex, 1);
        } else if (sourceIndex > destinationIndex) {
          // 원래 위치보다 앞에 추가
          newOrder.splice(destinationIndex, 0, sourceValue);
          newOrder.splice(sourceIndex + 1, 1);
        }
        return {
          ...state,
          pageById: {
            ...state.pageById,
            [pageId]: {
              ...state.pageById[pageId],
              blocks: newOrder,
            },
          },
        };
      } else {
        return state;
      }
    }
    case REMOVE_BLOCK: {
      const { pageId, parentId, blockId } = action.payload;
      if (parentId === -1) {
        return {
          ...state,
          pageIds: state.pageIds.filter((b) => b !== blockId),
          pageById: {
            ...state.pageById,
            [pageId]: {
              ...state.pageById[pageId],
              blocks: state.pageById[pageId].blocks.filter(
                (b) => b !== blockId
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
