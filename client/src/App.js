import { Navbar, Footer, Welcome, Transactions, Service } from "./components";

function App() {
  return (
    <div className="min-h-screen">
      <div className="gradient-bg-welcome">
        <Navbar />
        <Welcome />
      </div>
      <Service />
      <Transactions />
      <Footer />
    </div>
  );
}

export default App;
