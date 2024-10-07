import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { LoaderCircle } from 'lucide-react';

const ProductionLayout = () => {
  const { user, loading } = useContext(AuthContext);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <header className="mb-4 sm:mb-10">
        <Header />
      </header>
      <main className="container mx-auto flex flex-1">
        <section className="p-1 w-full mx-auto max-w-screen-xl">
          {loading ? (
            <div className="flex justify-center items-center h-screen">
              <LoaderCircle className="animate-spin text-blue-500" size={48} />
            </div>
          ) : !user || (user.role !== 'admin' && user.role !== 'emine') ? (
            <div className="container mx-auto p-4">
              <h1>Unauthorized Access</h1>
              <p>Sorry, you don't have permission to view this page. Only administrators and Emine can access this area.</p>
            </div>
          ) : (
            <>
              <h1>Production</h1>
              <Outlet />
            </>
          )}
        </section>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default ProductionLayout;