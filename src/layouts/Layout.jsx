// Layout.jsx
import { Outlet } from "react-router-dom"; // Outlet import edildi
import Header from "../components/Header";
import Footer from "../components/Footer";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";

const Layout = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <header className="mb-4 sm:mb-10">
        <Header />
      </header>
      <main className="container mx-auto flex flex-1">

        <section className="p-1 w-full mx-auto max-w-screen-lg">
          
          <Outlet />
        </section>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;
