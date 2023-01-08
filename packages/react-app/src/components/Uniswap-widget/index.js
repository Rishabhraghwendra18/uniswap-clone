import React, { useContext, useRef, useCallback, useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  TextField,
  Button,
  CardHeader,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { alpha, styled } from "@mui/material/styles";
import UserContext from "../../context";
import polygonLogo from "../../assets/polygon-matic-token-icon.png";
import usdcTokenLogo from "../../assets/usdc-token-icon.png";
import "./index.css";

function UniSwapWidget() {
  const [inputToken, setInputToken] = useState("Matic");
  const [outputToken, setOutputToken] = useState("USDC");
  const [inputTokenValue, setInputTokenValue] = useState("0.0");
  const [outputTokenValue, setOutputTokenValue] = useState(0.0);
  const [fetchPriceWaiter, setFetchPriceWaiter] = useState(false);
  const { signerAddress, logIn, loginWaiter } = useContext(UserContext);
  const UNI = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";
  const connectors = useRef(null);
  const focusConnectors = useCallback(() => connectors.current?.focus(), []);

  const CustomCard = styled(Card)(({ theme }) => ({
    borderRadius: "24px",
    padding: "8px",
    boxShadow:
      "rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px, rgb(0 0 0 / 4%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px",
  }));
  const CustomCardContent = styled(CardContent)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: "0.3rem",
  }));

  const CustomButton = styled(Button)(({ theme }) => ({
    backgroundColor: "rgb(253, 234, 241)",
    color: "rgb(213, 0, 102)",
    width: "100%",
    boxShadow: "none",
    fontWeight: 500,
    padding: "16px",
    borderRadius: 20,
    "&:hover": {
      backgroundColor: "rgb(252, 220, 232)",
      boxShadow: "none",
    },
  }));
  const CustomSelect = styled(Select)(({ theme }) => ({
    borderRadius: "16px",
    height: "fit-content",
    backgroundColor: "rgb(237, 238, 242)",
    borderColor: "white",
    "#demo-simple-select": {
      display: "flex",
      alignItems: "center",
      gap: "0.3rem",
      fontSize: "18px",
      fontWeight: 500,
    },
    "&:hover": {
      backgroundColor: "rgb(232, 0, 111)",
    },
  }));
  const onHandleInputTokenValueChange = (e)=>{
    e.preventDefault();
    setInputTokenValue(()=>e.target.value);
    // setFetchPriceWaiter(true);
  }
  return (
    <div className="uniswap">
      <CustomCard sx={{ minWidth: 275 }}>
        <CardHeader
          title={
            <span>
              <b>Swap</b>
            </span>
          }
        />
        <CustomCardContent>
          <div className="input-token-div">
            <TextField
              id="outlined-basic"
              placeholder="0.0"
              // label={inputTokenValue === "" ? "0.0" : ""}
              onChange={onHandleInputTokenValueChange}
              // value={inputTokenValue}
              fullWidth
              required
              variant="standard"
              type="number"
              InputLabelProps={{ shrink: false }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" sx={{ width: "10rem" }}>
                    <CustomSelect
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={inputToken}
                      InputLabelProps={{ shrink: false }}
                      sx={{
                        width: "100%",
                      }}
                      onChange={(e) => {
                        setInputToken(e.target.value);
                        setOutputToken(
                          e.target.value === "Matic" ? "USDC" : "Matic"
                        );
                      }}
                    >
                      <MenuItem
                        value={"Matic"}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.3rem",
                        }}
                      >
                        <img src={polygonLogo} className="token-logo"></img>
                        Matic
                      </MenuItem>
                      <MenuItem
                        value={"USDC"}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.3rem",
                        }}
                      >
                        <img src={usdcTokenLogo} className="token-logo"></img>
                        USDC
                      </MenuItem>
                    </CustomSelect>
                  </InputAdornment>
                ),
                disableUnderline: true,
              }}
            />
          </div>
          <div className="output-token-div">
            <TextField
              placeholder="0.0"
              id="outlined-basic"
              variant="standard"
              type="number"
              InputLabelProps={{ shrink: false }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" sx={{ width: "10rem" }}>
                    <CustomSelect
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={outputToken}
                      InputLabelProps={{ shrink: false }}
                      sx={{
                        width: "100%",
                        backgroundColor: "rgb(232, 0, 111)",
                        color: "white",
                      }}
                      onChange={() => console.log("chaning")}
                    >
                      <MenuItem
                        value={"Matic"}
                        disabled={inputToken === "Matic" ? true : false}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.3rem",
                        }}
                      >
                        <img src={polygonLogo} className="token-logo"></img>
                        Matic
                      </MenuItem>
                      <MenuItem
                        value={"USDC"}
                        disabled={inputToken === "USDC" ? true : false}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.3rem",
                        }}
                      >
                        <img src={usdcTokenLogo} className="token-logo"></img>
                        USDC
                      </MenuItem>
                    </CustomSelect>
                  </InputAdornment>
                ),
                disableUnderline: true,
              }}
            />
          </div>
          {fetchPriceWaiter ? (
            <div className="price-div">
              <CircularProgress sx={{ margin:0 }} size={25} />
              Fetching Best Price...
            </div>
          ) : null}
        </CustomCardContent>
        <CardActions>
          {signerAddress !== "" ? (
            <CustomButton variant="contained">
              Swap
            </CustomButton>
          ) : (
            <CustomButton
              variant="contained"
              disabled={loginWaiter}
              onClick={logIn}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {loginWaiter ? (
                <CircularProgress sx={{ marginRight: 1 }} size={25} />
              ) : null}
              Connect Wallet
            </CustomButton>
          )}
        </CardActions>
      </CustomCard>
    </div>
  );
}

export default UniSwapWidget;
