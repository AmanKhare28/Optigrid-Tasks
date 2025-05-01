import { useDroppable } from "@dnd-kit/core";

const DroppableColumn = ({ id, children }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`w-full md:w-1/2 p-4 rounded-xl transition border ${
        isOver ? "bg-blue-50 border-blue-300" : "bg-white border-gray-200"
      }`}
    >
      {id === "incomplete" ? (
        <h2 className="text-xl font-semibold mb-4">Incomplete Tasks</h2>
      ) : (
        <h2 className="text-xl font-semibold mb-4">Completed Tasks</h2>
      )}
      {children}
    </div>
  );
};

export default DroppableColumn;
