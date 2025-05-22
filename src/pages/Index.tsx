
import { useTaskContext } from "@/contexts/TaskContext";
import AppLayout from "@/components/AppLayout";
import TaskBoard from "@/components/TaskBoard";
import AuthForm from "@/components/AuthForm";

const Index = () => {
  const { isAuthenticated } = useTaskContext();

  if (!isAuthenticated) {
    return <AuthForm />;
  }

  return (
    <AppLayout>
      <TaskBoard />
    </AppLayout>
  );
};

export default Index;
