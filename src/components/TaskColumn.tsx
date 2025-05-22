
import { useState } from "react";
import { useTaskContext } from "@/contexts/TaskContext";
import { Task } from "@/contexts/TaskContext";
import TaskCard from "@/components/TaskCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TaskColumnProps {
  columnId: string;
  title: string;
  tasks: Task[];
}

const TaskColumn = ({ columnId, title, tasks }: TaskColumnProps) => {
  const { addTask, moveTask } = useTaskContext();
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    tag: "green", // Default tag
  });
  const [isAddingTask, setIsAddingTask] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagChange = (value: string) => {
    setNewTask((prev) => ({ ...prev, tag: value }));
  };

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      addTask(columnId, newTask);
      setNewTask({
        title: "",
        description: "",
        tag: "green",
      });
      setIsAddingTask(false);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
    e.dataTransfer.setData("fromColumnId", columnId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    const fromColumnId = e.dataTransfer.getData("fromColumnId");
    
    if (fromColumnId !== columnId) {
      moveTask(fromColumnId, columnId, taskId);
    }
  };

  return (
    <div 
      className="flex flex-col w-72 min-w-72 bg-muted/30 rounded-lg p-2"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex justify-between items-center mb-3 px-2">
        <h2 className="font-semibold text-lg">{title}</h2>
        <span className="bg-muted text-muted-foreground text-xs font-medium px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 min-h-[200px]">
        {tasks.map((task) => (
          <div 
            key={task.id}
            draggable
            onDragStart={(e) => handleDragStart(e, task.id)}
            className="cursor-move"
          >
            <TaskCard task={task} columnId={columnId} />
          </div>
        ))}
      </div>

      <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
        <DialogTrigger asChild>
          <Button variant="ghost" className="w-full mt-2 border border-dashed border-muted-foreground/50">
            <Plus className="h-4 w-4 mr-1" /> Add Task
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={newTask.title}
                onChange={handleInputChange}
                placeholder="Task title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={newTask.description}
                onChange={handleInputChange}
                placeholder="Task description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tag">Priority</Label>
              <Select
                value={newTask.tag}
                onValueChange={handleTagChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blue">Low</SelectItem>
                  <SelectItem value="green">Normal</SelectItem>
                  <SelectItem value="yellow">Medium</SelectItem>
                  <SelectItem value="purple">High</SelectItem>
                  <SelectItem value="red">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAddTask}>Add Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskColumn;
