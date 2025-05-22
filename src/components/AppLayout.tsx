
import { useTaskContext } from "@/contexts/TaskContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, User } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const { logout, currentUser } = useTaskContext();
  const [activeView, setActiveView] = useState("board");

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <h1 className="text-xl font-bold">TaskGlide</h1>
            </Link>
            <Tabs value={activeView} onValueChange={setActiveView}>
              <TabsList>
                <TabsTrigger value="board">Board</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {currentUser?.name || "Profile"}
              </Link>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2" onClick={logout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-grow container px-4">
        {children}
      </main>
      
      <footer className="border-t bg-background py-4">
        <div className="container px-4">
          <p className="text-sm text-muted-foreground text-center">
            TaskGlide &copy; {new Date().getFullYear()} - Task management made simple
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
