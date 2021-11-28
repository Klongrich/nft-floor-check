import React, { useState, useEffect } from "react";

export function GetGTCPrice() {
    const [price, setETHprice] = useState(0.00);

    useEffect(() => {
        fetch("https://api.coingecko.com/api/v3/simple/price?ids=gitcoin&vs_currencies=usd")
            .then(res => res.json())
            .then(data => {
                setETHprice(data.gitcoin.usd);
            })
    }, [price])

    return (price);
}

export default GetGTCPrice;