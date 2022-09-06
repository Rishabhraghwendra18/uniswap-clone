import React, { useContext,useRef,useCallback } from "react";
import { SwapWidget } from "@uniswap/widgets";
import "@uniswap/widgets/fonts.css";
import UserContext from "../../context";

function UniSwapWidget() {
  const { provider } = useContext(UserContext);
  const UNI = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'
  const connectors = useRef(null)
  const focusConnectors = useCallback(() => connectors.current?.focus(), [])
  return (
    <div className="Uniswap">
      <SwapWidget
      jsonRpcEndpoint={'https://cloudflare-eth.com'}
        provider={provider}
        tokenList={"https://gateway.ipfs.io/ipns/tokens.uniswap.org"}
        locale={"en-US"}
        onConnectWallet={focusConnectors}
        defaultInputTokenAddress="NATIVE"
        defaultInputAmount="1"
        defaultOutputTokenAddress={UNI}
      />
    </div>
  );
}

export default UniSwapWidget;
