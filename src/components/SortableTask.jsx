import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import Task from "./task";

const SortableTask = ({ id, title, onDelete, onComplete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="flex items-center">
        <span
          {...listeners}
          style={{
            cursor: "grab",
            marginRight: "8px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <DragIndicatorIcon color="action" />
        </span>
        <Task
          id={id}
          title={title}
          onDelete={onDelete}
          onComplete={onComplete}
        />
      </div>
    </div>
  );
};

export default SortableTask;
