import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Navbar from "./components/Navbar";
import UniSwapWidget from "./components/Uniswap-widget";
import UserContext from "./context";
import UniswapClone from "./abi/UniswapClone.json";
import "./App.css";

function App() {
  const CONTRACT_ADDRESS = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';
  const [contract, setContract] = useState();
  const [provider, setProvider] = useState();
  const [userNetwork, setUserNetwork] = useState();
  const [signerAddress, setSignerAddress] = useState("");
  const [loginWaiter, setLoginWaiter] = useState(false);
  const [section, setSection] = useState("swap");
  const [inputTokenValue, setInputTokenValue] = useState(0.0);
  const [outputTokenValue, setOutputTokenValue] = useState(0.0);
  const [fetchPriceWaiter, setFetchPriceWaiter] = useState(false);

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
    const uniswapCloneContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      UniswapClone.abi,
      provider
    );
    setContract(uniswapCloneContract);
    setUserNetwork("80001");
    setSignerAddress(await signer.getAddress());
    setProvider(provider);
    setLoginWaiter(false);
  };
  useEffect(() => {
    if (signerAddress === "") {
      const fetchUserAccount = async () => {
        window.ethereum?.request({ method: "eth_accounts" }).then((e) => {
          if (e?.length === 1) {
            if (
              window.ethereum.networkVersion !== "80001" &&
              process.env.NODE_ENV === "production"
            ) {
              // this production line can cause bug
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
        });
        if (process.env.NODE_ENV !== "production") {
          const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
          setProvider(provider);
          setContract(
            new ethers.Contract(
              CONTRACT_ADDRESS,
              UniswapClone.abi,
              provider
            )
          );
        }
      };
      fetchUserAccount();
    }
  }, []);
  async function fetchDepositTokenAmount() {
    console.log(contract);
    const depositAmount = await contract.getTokenDepositAmount(
      ethers.utils.parseEther("1")
    );
    console.log("deposit amount: ", depositAmount);
  }
  const onHandleInputTokenSwapValueChange = (e) => {
    e.preventDefault();
    setInputTokenValue(e.target.value);
    // setFetchPriceWaiter(true);
  };
  const onHandleInputeTokenDepositValueChange = async (e) => {
    setInputTokenValue(e.target.value);
    console.log("fetching...")
    await fetchDepositTokenAmount();
    console.log("fetched");
  };
  return (
    <UserContext.Provider
      value={{ userNetwork, signerAddress, logIn, loginWaiter }}
    >
      <div className="App">
        <Navbar setSection={setSection} section={section} />
        {section === "swap" && (
          <UniSwapWidget
            buttonText={"SWAP"}
            onHandleInputTokenValueChange={onHandleInputTokenSwapValueChange}
            inputTokenValue={inputTokenValue}
            fetchPriceWaiter={fetchPriceWaiter}
            outputTokenValue={outputTokenValue}
          />
        )}
        {section === "pool" &&(
          <UniSwapWidget
          buttonText={"Deposit"}
          onHandleInputTokenValueChange={onHandleInputeTokenDepositValueChange}
          inputTokenValue={inputTokenValue}
          fetchPriceWaiter={fetchPriceWaiter}
          outputTokenValue={outputTokenValue}
        />
        )}
      </div>
    </UserContext.Provider>
  );
}

export default App;
