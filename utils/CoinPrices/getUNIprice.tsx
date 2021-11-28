import React, { useState, useEffect } from "react";

export function GetUNIPrice() {
    const [price, setETHprice] = useState(0.00);

    useEffect(() => {
        fetch("https://api.coingecko.com/api/v3/simple/price?ids=uniswap&vs_currencies=usd")
            .then(res => res.json())
            .then(data => {
                setETHprice(data.uniswap.usd);
            })
    }, [price])

    return (price);
}

export default GetUNIPrice;