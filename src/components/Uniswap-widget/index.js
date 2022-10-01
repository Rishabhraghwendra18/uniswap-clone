import React, { useContext, useRef, useCallback, useState } from "react";
import { SwapWidget } from "@uniswap/widgets";
import {
  Card,
  CardContent,
  CardActions,
  TextField,
  Button,
  CardHeader,
  Select,
  MenuItem,
  InputAdornment
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import "@uniswap/widgets/fonts.css";
import UserContext from "../../context";
import "./index.css";

function UniSwapWidget() {
  const [inputToken, setInputToken] = useState("Matic");
  const { provider } = useContext(UserContext);
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
              fullWidth
              required
              label="0.0"
              variant="outlined"
              type="number"
              InputLabelProps={{ shrink: true }}
              sx={{
                border: "0px !important",
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={inputToken}
                      label="Matic"
                      InputLabelProps={{ shrink: false }}
                      onChange={() => console.log("chaning")}
                    >
                      <MenuItem value={10}>Matic</MenuItem>
                      <MenuItem value={20}>WEth</MenuItem>
                      <MenuItem value={30}>1inch</MenuItem>
                    </Select>
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div className="output-token-div">
            <TextField
              id="outlined-basic"
              label="0.0"
              variant="outlined"
              type="number"
              InputLabelProps={{ shrink: false }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={inputToken}
                      label="Matic"
                      InputLabelProps={{ shrink: false }}
                      onChange={() => console.log("chaning")}
                    >
                      <MenuItem value={10}>Matic</MenuItem>
                      <MenuItem value={20}>WEth</MenuItem>
                      <MenuItem value={30}>1inch</MenuItem>
                    </Select>
                  </InputAdornment>
                ),
              }}
            />
          </div>
        </CustomCardContent>
        <CardActions>
          <CustomButton variant="contained">Connect Wallet</CustomButton>
        </CardActions>
      </CustomCard>
    </div>
  );
}

export default UniSwapWidget;
