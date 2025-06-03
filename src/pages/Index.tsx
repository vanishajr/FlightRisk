
import React from 'react';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import PassengerDashboard from '@/components/PassengerDashboard';
import LoginForm from '@/components/LoginForm';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {user.role === 'pilot' ? <Dashboard /> : <PassengerDashboard />}
      </main>
      <footer className="py-4 border-t bg-muted">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>Flight Risk Vision &copy; 2025 - Aviation Safety System</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
