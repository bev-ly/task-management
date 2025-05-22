
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { toast } from "@/components/ui/sonner";

// Types for our task management app
export interface Task {
  id: string;
  title: string;
  description: string;
  tag: string;
  createdAt: string;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

interface Board {
  id: string;
  title: string;
  columns: Column[];
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface TaskContextType {
  currentUser: User | null;
  boards: Board[];
  activeBoard: Board | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  addTask: (columnId: string, task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (columnId: string, task: Task) => void;
  deleteTask: (columnId: string, taskId: string) => void;
  moveTask: (fromColumnId: string, toColumnId: string, taskId: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Sample data
const sampleBoard: Board = {
  id: "board-1",
  title: "My First Board",
  columns: [
    {
      id: "column-1",
      title: "To Do",
      tasks: [
        {
          id: "task-1",
          title: "Research competitors",
          description: "Analyze top 5 competitor products",
          tag: "blue",
          createdAt: new Date().toISOString(),
        },
        {
          id: "task-2",
          title: "Design landing page",
          description: "Create wireframes for homepage",
          tag: "purple",
          createdAt: new Date().toISOString(),
        },
      ],
    },
    {
      id: "column-2",
      title: "In Progress",
      tasks: [
        {
          id: "task-3",
          title: "Implement authentication",
          description: "Add login/signup functionality",
          tag: "green",
          createdAt: new Date().toISOString(),
        },
      ],
    },
    {
      id: "column-3",
      title: "Done",
      tasks: [
        {
          id: "task-4",
          title: "Project setup",
          description: "Initialize repository and configure tooling",
          tag: "yellow",
          createdAt: new Date().toISOString(),
        },
      ],
    },
  ],
};

const sampleUser: User = {
  id: "user-1",
  name: "Demo User",
  email: "demo@example.com",
};

export const TaskProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [boards, setBoards] = useState<Board[]>([sampleBoard]);
  const [activeBoard, setActiveBoard] = useState<Board | null>(sampleBoard);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Authentication functions
  const login = async (email: string, password: string) => {
    // For demo purposes, we're using a mock login
    if (email && password) {
      setCurrentUser(sampleUser);
      setIsAuthenticated(true);
      toast.success("Logged in successfully");
    } else {
      toast.error("Invalid email or password");
      throw new Error("Invalid email or password");
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    // For demo purposes, we're using a mock signup
    if (name && email && password) {
      const newUser = { ...sampleUser, name, email };
      setCurrentUser(newUser);
      setIsAuthenticated(true);
      toast.success("Account created successfully");
    } else {
      toast.error("Please fill all required fields");
      throw new Error("Please fill all required fields");
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    toast.success("Logged out successfully");
  };

  // Task management functions
  const addTask = (columnId: string, task: Omit<Task, 'id' | 'createdAt'>) => {
    if (!activeBoard) return;
    
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setActiveBoard((prevBoard) => {
      if (!prevBoard) return null;

      const updatedColumns = prevBoard.columns.map((col) => {
        if (col.id === columnId) {
          return {
            ...col,
            tasks: [...col.tasks, newTask],
          };
        }
        return col;
      });

      return {
        ...prevBoard,
        columns: updatedColumns,
      };
    });

    setBoards((prevBoards) => {
      return prevBoards.map((board) => {
        if (board.id === activeBoard.id) {
          const updatedColumns = board.columns.map((col) => {
            if (col.id === columnId) {
              return {
                ...col,
                tasks: [...col.tasks, newTask],
              };
            }
            return col;
          });

          return {
            ...board,
            columns: updatedColumns,
          };
        }
        return board;
      });
    });

    toast.success("Task added successfully");
  };

  const updateTask = (columnId: string, updatedTask: Task) => {
    if (!activeBoard) return;

    setActiveBoard((prevBoard) => {
      if (!prevBoard) return null;

      const updatedColumns = prevBoard.columns.map((col) => {
        if (col.id === columnId) {
          return {
            ...col,
            tasks: col.tasks.map((task) =>
              task.id === updatedTask.id ? updatedTask : task
            ),
          };
        }
        return col;
      });

      return {
        ...prevBoard,
        columns: updatedColumns,
      };
    });

    setBoards((prevBoards) => {
      return prevBoards.map((board) => {
        if (board.id === activeBoard.id) {
          const updatedColumns = board.columns.map((col) => {
            if (col.id === columnId) {
              return {
                ...col,
                tasks: col.tasks.map((task) =>
                  task.id === updatedTask.id ? updatedTask : task
                ),
              };
            }
            return col;
          });

          return {
            ...board,
            columns: updatedColumns,
          };
        }
        return board;
      });
    });

    toast.success("Task updated successfully");
  };

  const deleteTask = (columnId: string, taskId: string) => {
    if (!activeBoard) return;

    setActiveBoard((prevBoard) => {
      if (!prevBoard) return null;

      const updatedColumns = prevBoard.columns.map((col) => {
        if (col.id === columnId) {
          return {
            ...col,
            tasks: col.tasks.filter((task) => task.id !== taskId),
          };
        }
        return col;
      });

      return {
        ...prevBoard,
        columns: updatedColumns,
      };
    });

    setBoards((prevBoards) => {
      return prevBoards.map((board) => {
        if (board.id === activeBoard.id) {
          const updatedColumns = board.columns.map((col) => {
            if (col.id === columnId) {
              return {
                ...col,
                tasks: col.tasks.filter((task) => task.id !== taskId),
              };
            }
            return col;
          });

          return {
            ...board,
            columns: updatedColumns,
          };
        }
        return board;
      });
    });

    toast.success("Task deleted successfully");
  };

  const moveTask = (fromColumnId: string, toColumnId: string, taskId: string) => {
    if (!activeBoard) return;

    // Find the task in the source column
    const sourceColumn = activeBoard.columns.find((col) => col.id === fromColumnId);
    if (!sourceColumn) return;

    const taskIndex = sourceColumn.tasks.findIndex((task) => task.id === taskId);
    if (taskIndex === -1) return;
    
    // Clone the task to avoid direct mutation
    const taskToMove = { ...sourceColumn.tasks[taskIndex] };
    
    // Update task tag based on destination column
    if (fromColumnId !== toColumnId) {
      // Set tag color based on destination column
      if (toColumnId === "column-1") { // To Do column
        taskToMove.tag = "blue"; // Blue for to-do tasks
      } else if (toColumnId === "column-2") { // In Progress column
        taskToMove.tag = "green"; // Green for in-progress tasks
      } else if (toColumnId === "column-3") { // Done column
        taskToMove.tag = "yellow"; // Yellow for completed tasks
      }
    }

    // Create updated board with task moved
    setActiveBoard((prevBoard) => {
      if (!prevBoard) return null;

      const updatedColumns = prevBoard.columns.map((col) => {
        // Remove from source column
        if (col.id === fromColumnId) {
          return {
            ...col,
            tasks: col.tasks.filter((task) => task.id !== taskId),
          };
        }
        // Add to target column
        if (col.id === toColumnId) {
          return {
            ...col,
            tasks: [...col.tasks, taskToMove],
          };
        }
        return col;
      });

      return {
        ...prevBoard,
        columns: updatedColumns,
      };
    });

    // Update boards array as well
    setBoards((prevBoards) => {
      return prevBoards.map((board) => {
        if (board.id === activeBoard.id) {
          const updatedColumns = board.columns.map((col) => {
            // Remove from source column
            if (col.id === fromColumnId) {
              return {
                ...col,
                tasks: col.tasks.filter((task) => task.id !== taskId),
              };
            }
            // Add to target column
            if (col.id === toColumnId) {
              return {
                ...col,
                tasks: [...col.tasks, taskToMove],
              };
            }
            return col;
          });

          return {
            ...board,
            columns: updatedColumns,
          };
        }
        return board;
      });
    });

    toast.success("Task moved successfully");
  };

  return (
    <TaskContext.Provider
      value={{
        currentUser,
        boards,
        activeBoard,
        isAuthenticated,
        login,
        signup,
        logout,
        addTask,
        updateTask,
        deleteTask,
        moveTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
