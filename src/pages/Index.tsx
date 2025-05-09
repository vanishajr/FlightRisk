
import React from 'react';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Dashboard />
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
