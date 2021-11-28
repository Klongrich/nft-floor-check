import React, { useState, useEffect } from "react";

export function GetETHPrice() {
    const [ethPrice, setETHprice] = useState(0.00);

    useEffect(() => {
        fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd")
            .then(res => res.json())
            .then(data => {
                setETHprice(data.ethereum.usd);
            })
    }, [ethPrice])

    return (ethPrice);
}

export default GetETHPrice;