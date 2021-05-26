export const getPageState = (state) => {
  return state.pages;
};

export const getPageList = (state) => {
  const pageState = getPageState(state);
  return pageState ? pageState.pageIds : [];
};

export const getPageTitle = (state, pageId) => {
  return state[pageId];
};

export const getEveryPages = (state) => {
  const pageState = getPageState(state);
  return getPageList(state).map((id) => ({ ...pageState.pageById[id], id }));
};
