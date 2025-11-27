import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Groups from "./pages/Groups";
import GroupDetails from "./pages/GroupDetails";
import AddGroup from "./pages/AddGroup";
import EditGroup from "./pages/EditGroup";
import AddStudent from "./pages/AddStudent";
import EditStudent from "./pages/EditStudent";
import StudentDetails from "./pages/StudentDetails";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import ModuleDetails from "./pages/ModuleDetails";


import ModuleForm from "./pages/ModuleForm";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/groups/add" element={<AddGroup />} />
          <Route path="/groups/:id" element={<GroupDetails />} />
          <Route path="/groups/:id/edit" element={<EditGroup />} />
          <Route path="/groups/:groupId/students/add" element={<AddStudent />} />
          <Route path="/groups/:groupId/students/:studentId" element={<StudentDetails />} />
          <Route path="/groups/:groupId/students/:studentId/edit" element={<EditStudent />} />
          <Route path="/groups/:id/modules/:moduleId" element={<ModuleDetails />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/groups/:id/modules/add" element={<ModuleForm />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
