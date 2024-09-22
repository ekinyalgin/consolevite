// Layout.jsx
import { Outlet } from "react-router-dom"; // Outlet import edildi
import Header from "../components/Header";
import Footer from "../components/Footer";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="shadow-sm">
        <Header />
      </header>
      <main className="container mx-auto flex flex-1">
        <aside className="w-2/12">
          <LeftSidebar />
        </aside>
        <section className="w-full">
          
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
