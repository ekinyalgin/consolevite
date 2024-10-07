import React, { useContext } from 'react';
import { Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { LoaderCircle } from 'lucide-react';

const Layout = () => {
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
          ) : !user ? (
            <div className="container mx-auto p-4">
    <h1 className="mt-16">Maintenance in Progress</h1>
<p>We are currently performing maintenance. Please check back later. Thank you for your understanding.</p>

<h1 className="mt-16">Bakımdayız</h1>
<p>Şu anda bakım yapıyoruz. Lütfen daha sonra tekrar kontrol edin. Anlayışınız için teşekkür ederiz.</p>
            </div>
          ) : user.role !== 'admin' ? (
            <div className="container mx-auto p-4">
              <h1>Unauthorized Access</h1>
              <p>Sorry, you don't have permission to view this page. Only administrators can access this area.</p>
            </div>
          ) : (
            <Outlet />
          )}
        </section>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;
