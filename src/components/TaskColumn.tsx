
import React, { useState } from "react";
import { Task, useTaskContext } from "@/contexts/TaskContext";
import TaskCard from "@/components/TaskCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { plus } from "lucide-react";

interface TaskColumnProps {
  columnId: string;
  title: string;
  tasks: Task[];
}

const TaskColumn = ({ columnId, title, tasks }: TaskColumnProps) => {
  const { addTask, updateTask, deleteTask, moveTask } = useTaskContext();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState<Omit<Task, 'id' | 'createdAt'>>({
    title: "",
    description: "",
    tag: "blue",
  });

  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragStart = (taskId: string) => (e: React.DragEvent) => {
    e.dataTransfer.setData("taskId", taskId);
    e.dataTransfer.setData("sourceColumnId", columnId);
    const target = e.target as HTMLElement;
    target.classList.add("task-dragging");
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.target as HTMLElement;
    target.classList.remove("task-dragging");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    const sourceColumnId = e.dataTransfer.getData("sourceColumnId");
    
    if (sourceColumnId !== columnId) {
      moveTask(sourceColumnId, columnId, taskId);
    }
    
    setIsDragOver(false);
  };

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      addTask(columnId, newTask);
      setNewTask({
        title: "",
        description: "",
        tag: "blue",
      });
      setIsAddingTask(false);
    }
  };

  return (
    <div 
      className="w-80 flex-shrink-0 bg-secondary/50 rounded-lg p-4 flex flex-col h-full"
    >
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-lg">{title}</h2>
        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-medium">
          {tasks.length}
        </span>
      </div>

      <div
        className={`flex-grow overflow-y-auto p-1 -m-1 rounded-md transition-colors ${
          isDragOver ? "column-drop-active" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onUpdate={(updatedTask) => updateTask(columnId, updatedTask)}
            onDelete={() => deleteTask(columnId, task.id)}
            onDragStart={() => handleDragStart(task.id)}
          />
        ))}
      </div>

      <div className="mt-2">
        <Button
          variant="ghost"
          className="w-full flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10"
          onClick={() => setIsAddingTask(true)}
        >
          <plus className="h-4 w-4 mr-1" />
          Add Task
        </Button>
      </div>

      <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Title</label>
              <Input
                id="title"
                placeholder="Task title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Textarea
                id="description"
                placeholder="Task description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="tag" className="text-sm font-medium">Tag</label>
              <Select
                value={newTask.tag}
                onValueChange={(value) => setNewTask({ ...newTask, tag: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blue">Blue</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                  <SelectItem value="yellow">Yellow</SelectItem>
                  <SelectItem value="purple">Purple</SelectItem>
                  <SelectItem value="pink">Pink</SelectItem>
                  <SelectItem value="orange">Orange</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingTask(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTask}>Add Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskColumn;
