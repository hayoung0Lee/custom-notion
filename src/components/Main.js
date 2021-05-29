import { useState, useEffect, useRef } from "react";
import { getRootBlocks } from "../redux/selectors";
import { useDispatch, useSelector } from "react-redux";
import EditableBlock from "./EditableBlock";
import MainStore from "../utils/store";
import { updateOrder } from "../redux/actions";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: 250,
});

const Main = ({ pageId }) => {
  const [lastAction, setLastAction] = useState({ action: "" });

  useEffect(() => {
    window.history.replaceState(null, null, `pageID_${pageId}`);
  });

  const rootBlock = useSelector((state) => getRootBlocks(state, pageId));
  const [currentOrder, updateOrder] = useState([0, 1, 8]);

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      currentOrder,
      result.source.index,
      result.destination.index
    );

    console.log(items);
    updateOrder(items);
  };

  return (
    <MainStore.Provider
      value={{
        pageId: pageId,
        lastAction: lastAction,
        setLastAction: setLastAction,
      }}
    >
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <main
              className="col-span-10 bg-pink-100 min-h-screen p-10"
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {currentOrder.map((blockId, index) => {
                return (
                  <Draggable key={index} draggableId={`${index}`} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        {/* <EditableBlock
                          key={blockId}
                          depth={1} // tab횟수 제한용
                          blockId={blockId} // 현재의 blockId
                          parentId={-1} // -1은 root에서 호출했다는 뜻
                          isLast={index === rootBlock.length - 1} // 한 loop의 마지막 노드에는 일단 마지막일지도 모르니까 isLast를 true로 넘긴다.
                        /> */}
                        {blockId}
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </main>
          )}
        </Droppable>
      </DragDropContext>
    </MainStore.Provider>
  );
};

export default Main;
