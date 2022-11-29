import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./util/routes";
import UserContext from './context/user';
import useAuthListener from './hooks/use-auth-listener';


function App() {

  const user = useAuthListener();

  return (

    <UserContext.Provider value={user}  >
      <BrowserRouter>
        <div className="App">
          <AppRoutes />
        </div>
      </BrowserRouter>
    </UserContext.Provider>

  );
}

export default App;
