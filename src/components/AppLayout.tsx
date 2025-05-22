
import { useTaskContext } from "@/contexts/TaskContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { log_out } from "lucide-react";
import { useState } from "react";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const { logout } = useTaskContext();
  const [activeView, setActiveView] = useState("board");

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">TaskGlide</h1>
            <Tabs value={activeView} onValueChange={setActiveView}>
              <TabsList>
                <TabsTrigger value="board">Board</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <Button variant="ghost" size="sm" className="gap-2" onClick={logout}>
            <log_out className="h-4 w-4" />
            Logout
          </Button>
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
