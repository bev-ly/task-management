
import { useTaskContext } from "@/contexts/TaskContext";
import TaskColumn from "@/components/TaskColumn";

const TaskBoard = () => {
  const { activeBoard } = useTaskContext();

  if (!activeBoard) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
        <p className="text-center text-muted-foreground">
          No active board selected. Create or select a board to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 overflow-x-auto h-[calc(100vh-10rem)]">
      <h1 className="text-2xl font-bold mb-6">{activeBoard.title}</h1>
      
      <div className="flex gap-4 h-[calc(100vh-14rem)]">
        {activeBoard.columns.map((column) => (
          <TaskColumn
            key={column.id}
            columnId={column.id}
            title={column.title}
            tasks={column.tasks}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskBoard;
