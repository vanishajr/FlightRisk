
import React from 'react';
import { AlertCircle } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-primary text-primary-foreground py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <AlertCircle size={24} />
          <h1 className="text-xl font-semibold">Flight Risk Vision</h1>
        </div>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <a href="#" className="hover:text-secondary">Dashboard</a>
            </li>
            <li>
              <a href="#" className="hover:text-secondary">History</a>
            </li>
            <li>
              <a href="#" className="hover:text-secondary">Settings</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
