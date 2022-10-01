import React, { useState, useContext } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import CustomButton from "../Button";
import { alpha, styled } from "@mui/material/styles";
import { ethers } from "ethers";
import UserContext from "../../context";
import logo from "../../assets/logo.svg";
import polygonLogo from "../../assets/polygon-logo.svg";
import "./index.css";

const CustomNavbar = styled(AppBar)(({ theme }) => ({
  display: "flex",
  "background-color": "transparent",
  "box-shadow": "none",
  padding: "0.8rem",
  "& .MuiToolbar-gutters": {
    display: "flex",
    // 'grid-template-columns':'1fr auto auto 1fr',
    gap: "1.1rem",
  },
}));
function Navbar() {
  const [section, setSection] = useState("swap");
  const [signerAddress, setSignerAddress] = useState("");
  const [userNetwork, setUserNetwork] = useState();
  const { setProvider } = useContext(UserContext);
  const logIn = async () => {
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
  };
  return (
    <CustomNavbar position="static">
      <Toolbar>
        <img src={logo} alt="uniswap-logo" className="uniswap-logo" />
        {/* <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
        </IconButton> */}
        <Typography variant="h6" component="div">
          Uniswap Clone
        </Typography>
        <div className="header-sections">
          <div className="header-sections-buttons">
            <CustomButton
              color="inherit"
              onClick={() => setSection("swap")}
              className={section === "swap" ? "active" : null}
            >
              Swap
            </CustomButton>
            <CustomButton
              color="inherit"
              onClick={() => setSection("pool")}
              className={section === "pool" ? "active" : null}
            >
              Pool
            </CustomButton>
            <CustomButton
              color="inherit"
              onClick={() => setSection("vote")}
              className={section === "vote" ? "active" : null}
            >
              Vote
            </CustomButton>
            <CustomButton
              color="inherit"
              onClick={() => setSection("charts")}
              className={section === "charts" ? "active" : null}
            >
              Charts
            </CustomButton>
          </div>
        </div>
        <div className="action-buttons">
          <CustomButton color="inherit">
            {userNetwork === "80001" ? (
              <div className="netowrk-div">
                <img
                  src={polygonLogo}
                  alt={"Polygon Logo"}
                  className="network-logo"
                ></img>
                <span>Polygon</span>
              </div>
            ) : (
              "Network"
            )}
          </CustomButton>
          <CustomButton color="inherit" onClick={logIn}>
            {signerAddress !== ""
              ? `${signerAddress.slice(0, 5)}...${signerAddress.slice(38, 42)}`
              : "Connect Wallet"}
          </CustomButton>
        </div>
      </Toolbar>
    </CustomNavbar>
  );
}

export default Navbar;
