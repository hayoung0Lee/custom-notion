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

export const getBlockList = (state) => {
  const blockState = getBlockState(state);
  return blockState ? blockState.blockIds : [];
};

export const getBlockContents = (state) => {
  const blockState = getBlockState(state);
  return getBlockList(state).map((id) => ({ ...blockState.blockById[id], id }));
};

export const getThisPage = (state, pageId) => {
  const pageState = getPageState(state);
  const currentPageData = pageState.pageById[pageId];
  const currentPageDataWithBlockData = {
    ...currentPageData,
    blocks: currentPageData.blocks.map((id) => ({
      id,
      ...state.blocks.blockById[id],
    })),
  };
  return currentPageDataWithBlockData;
};

// 사용중
export const getPageState = (state) => {
  return state.pages;
};

export const getBlockState = (state) => {
  return state.blocks;
};

export const getRootBlocks = (state, pageId) => {
  const pageState = getPageState(state);
  return pageState.pageById[pageId] ? pageState.pageById[pageId].blocks : [];
};

export const getCurrentBlockInfo = (state, blockId) => {
  const blockState = getBlockState(state);
  return blockState.blockById[blockId] ? blockState.blockById[blockId] : {};
};

// 해당 id의 하위 블럭들을 모아서 보내준다
const blockToSubBlock = {};
const ordersFromTopToDown = []; // 그냥 위에서부터 순서

// 이 reference로 모든 애들이 접근할거라, 얘는 그대로 고정. react-contentEditable이 콜백을 한번 렌더링하고나면 안바꾸는것 같다
export const getBlockOrder = (state, pageId) => {
  Object.getOwnPropertyNames(blockToSubBlock).forEach(function (prop) {
    delete blockToSubBlock[prop];
  });

  ordersFromTopToDown.splice(0, ordersFromTopToDown.length);

  const recursive = (blockList) => {
    for (let i = 0; i < blockList.length; i++) {
      ordersFromTopToDown.push(blockList[i]);
      const getSubBlock = getCurrentBlockInfo(state, blockList[i]).blocks;
      blockToSubBlock[blockList[i]] = getSubBlock;
      if (getSubBlock.length > 0) {
        recursive(getSubBlock);
      }
    }
  };

  blockToSubBlock[-1] = getPageState(state).pageById[pageId].blocks;
  recursive(blockToSubBlock[-1]);
  return { blockToSubBlock, ordersFromTopToDown };
};
