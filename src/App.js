import { useState } from "react";
import Navbar from "./components/Navbar";
import UniSwapWidget from "./components/Uniswap-widget";
import UserContext from "./context";
import "./App.css";

function App() {
  const [provider,setProvider] = useState();
  return (
    <UserContext.Provider value={{provider,setProvider}}>
      <div className="App">
        <Navbar />
        {/* <UniSwapWidget/> */}
      </div>
    </UserContext.Provider>
  );
}

export default App;
