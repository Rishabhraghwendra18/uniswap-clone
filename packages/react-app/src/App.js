import { useState,useEffect } from "react";
import { ethers } from "ethers";
import Navbar from "./components/Navbar";
import UniSwapWidget from "./components/Uniswap-widget";
import UserContext from "./context";
import "./App.css";

function App() {
  const [provider,setProvider] = useState();
  const [userNetwork, setUserNetwork] = useState();
  const [signerAddress, setSignerAddress] = useState("");
  const [loginWaiter, setLoginWaiter] = useState(false);
  const logIn = async () => {
    setLoginWaiter(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // Prompt user for account connections
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    console.log("Account:", await signer.getAddress());
    if (window.ethereum.networkVersion !== "80001") {
      console.log("rpc endpoint");
      window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x13881",
            rpcUrls: ["https://matic-mumbai.chainstacklabs.com"],
            chainName: "Matic Testnet",
            nativeCurrency: {
              name: "MATIC",
              symbol: "MATIC",
              decimals: 18,
            },
            blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
          },
        ],
      });
    }
    setUserNetwork("80001");
    setSignerAddress(await signer.getAddress());
    setProvider(provider);
    setLoginWaiter(false);
  };
  useEffect(()=>{
    if(signerAddress === ""){
      const fetchUserAccount = async () =>{
        window.ethereum?.request({method:'eth_accounts'}).then(e=>{
          if(e?.length===1){
            if (window.ethereum.networkVersion !== "80001" && process.env.NODE_ENV === 'production') { // this production line can cause bug
              console.log("rpc endpoint");
              window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: "0x13881",
                    rpcUrls: ["https://matic-mumbai.chainstacklabs.com"],
                    chainName: "Matic Testnet",
                    nativeCurrency: {
                      name: "MATIC",
                      symbol: "MATIC",
                      decimals: 18,
                    },
                    blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
                  },
                ],
              });
              setUserNetwork("80001");
            }
            setSignerAddress(e[0]);
          }
        })
      }
      fetchUserAccount()
    }
  },[])
  return (
    <UserContext.Provider value={{userNetwork,signerAddress,logIn,loginWaiter}}>
      <div className="App">
        <Navbar />
        <UniSwapWidget/>
      </div>
    </UserContext.Provider>
  );
}

export default App;
