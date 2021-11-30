import React, { useState, useEffect } from "react";

export function GetCoinPrice(name: string) {
    const [price, setPrice] = useState(0.00);

    useEffect(() => {
        fetch("https://api.coingecko.com/api/v3/simple/price?ids=" + name + "&vs_currencies=usd")
            .then(res => res.text())
            .then(data => {
                var temp = data.split(':')[2];
                setPrice(parseFloat(temp.split("}")[0]));
            })
    }, [price, name])

    return (price);
}

export default GetCoinPrice;