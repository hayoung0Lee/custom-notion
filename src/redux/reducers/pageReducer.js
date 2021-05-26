import { ADD_PAGE, REMOVE_PAGE, EDIT_PAGE } from "../actionTypes";

const initialState = {
  pageIds: [],
  pageById: {},
};

const pageReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_PAGE:
      const { pageId, pageName } = action.payload;
      return {
        ...state,
        pageIds: [...state.pageIds, pageId],
        pageById: { ...state.pageById, [pageId]: { pageName, blocks: [] } },
      };

    default:
      return state;
  }
};

export default pageReducer;
