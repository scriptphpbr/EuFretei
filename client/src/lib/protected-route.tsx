import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

interface ProtectedRouteProps {
  path: string;
  component: () => React.JSX.Element;
  requiredRole?: "admin" | "driver" | "user";
}

export function ProtectedRoute({
  path,
  component: Component,
  requiredRole
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Route>
    );
  }

  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  // Verificar se o usuário tem a função necessária
  if (requiredRole && user.role !== requiredRole) {
    return (
      <Route path={path}>
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Acesso Negado</h1>
          <p className="mb-4">Você não tem permissão para acessar esta página.</p>
          <p className="text-sm text-gray-500">
            Esta página requer a função {requiredRole}, mas você tem a função {user.role}.
          </p>
          <button 
            className="mt-6 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            onClick={() => window.history.back()}
          >
            Voltar
          </button>
        </div>
      </Route>
    );
  }

  return <Route path={path} component={Component} />;
}
