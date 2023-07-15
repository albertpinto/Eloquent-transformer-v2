import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import BasicTasks from "./pages/BasicTasks";
import Search from "./components/Search";
import AdvancedTasks from "./pages/AdvancedTasks";
import AdvancedSearch from "./components/AdvancedSearch";
import SearchGenerator from "./components/SearchGenerator";
import TextVideo from "./components/TextVideo";
import EnterpriseSearch from "./components/EnterpriseSearch";


function App() {
  return (
    <Router>
      <Navbar />
        <main className="container mx-auto px-3 pb-12">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Search />
                </>
              }
            />
            <Route path="/about" element={<About />} />
            <Route
              path="/basictasks"
              element={
                <>
                  <Search />
                </>
              }
            />
            <Route path="/advancedtasks" element={<AdvancedSearch />} />
            <Route path="/generation" element={<SearchGenerator />} />
            <Route path="/textvideo" element={<TextVideo />} />
            <Route path="/search" element={<EnterpriseSearch />} />
            <Route path="/notfound" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
    </Router>
  );
}

export default App;
