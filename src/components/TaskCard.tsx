
import { useState } from "react";
import { Task } from "@/contexts/TaskContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { edit, trash2 } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onUpdate: (updatedTask: Task) => void;
  onDelete: () => void;
  onDragStart: () => void;
}

const TaskCard = ({ task, onUpdate, onDelete, onDragStart }: TaskCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Task>(task);
  
  const tagColors: Record<string, string> = {
    blue: "bg-task-blue text-blue-700",
    green: "bg-task-green text-green-700",
    yellow: "bg-task-yellow text-yellow-700",
    purple: "bg-task-purple text-purple-700",
    pink: "bg-task-pink text-pink-700",
    orange: "bg-task-orange text-orange-700",
  };

  const handleSubmit = () => {
    onUpdate(editedTask);
    setIsEditing(false);
  };

  return (
    <>
      <Card
        className={`p-4 mb-2.5 task-card cursor-grab ${task.tag ? `border-l-4 border-l-${task.tag}-400` : ''}`}
        draggable
        onDragStart={onDragStart}
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-sm">{task.title}</h3>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setIsEditing(true)}
            >
              <edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-destructive"
              onClick={onDelete}
            >
              <trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {task.description}
        </p>
        <div className="flex justify-between items-center">
          <Badge variant="outline" className={`${tagColors[task.tag] || ''} text-xs px-2`}>
            {task.tag.charAt(0).toUpperCase() + task.tag.slice(1)}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {new Date(task.createdAt).toLocaleDateString()}
          </span>
        </div>
      </Card>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Title</label>
              <Input
                id="title"
                value={editedTask.title}
                onChange={(e) =>
                  setEditedTask({ ...editedTask, title: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Textarea
                id="description"
                value={editedTask.description}
                onChange={(e) =>
                  setEditedTask({ ...editedTask, description: e.target.value })
                }
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="tag" className="text-sm font-medium">Tag</label>
              <Select
                value={editedTask.tag}
                onValueChange={(value) =>
                  setEditedTask({ ...editedTask, tag: value })
                }
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
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskCard;
