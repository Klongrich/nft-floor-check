import React, { useState, useEffect } from "react";

export function GetENSprice() {
    const [price, setENSprice] = useState(0.00);

    useEffect(() => {
        fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum-name-service&vs_currencies=usd")
            .then(res => res.text())
            .then(data => {
                var temp = data.split(":")[2];
                setENSprice(parseFloat(temp.split("}")[0]));
            })
    }, [price])

    return (price);
}

export default GetENSprice;