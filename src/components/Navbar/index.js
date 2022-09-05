import React, { useState } from "react";
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
import logo from "../../assets/logo.svg";
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
  const [signerAddress,setSignerAddress] = useState("");
  const logIn = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // Prompt user for account connections
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    setSignerAddress( await signer.getAddress());
    console.log("Account:", await signer.getAddress());
  };
  return (
    <CustomNavbar position="static">
      <Toolbar>
          <img src={logo} alt="uniswap-logo" className="uniswap-logo"/>
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
          <CustomButton color="inherit">Ethereum</CustomButton>
          <CustomButton color="inherit" onClick={logIn}>
            {signerAddress!== "" ?(`${signerAddress.slice(0,5)}...${signerAddress.slice(38,42)}`):"Connect Wallet"}
          </CustomButton>
        </div>
      </Toolbar>
    </CustomNavbar>
  );
}

export default Navbar;
