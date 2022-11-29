import Test from "./pages/symptoms";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppRoutes from "./util/routes";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <p className='text-xl font-bold text-center'>Health Check in making</p>
        </header>
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;
