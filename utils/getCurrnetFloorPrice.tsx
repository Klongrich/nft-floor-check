import React, { useState, useEffect } from "react";

var floor_holder = [{
    name: "holder",
    floorPriceETH: 0.00
}
]

export default function CurrentFloorPrice() {
    const [floorPrices, setFloorPrice] = useState(floor_holder);
    useEffect(() => {
        fetch("https://api.nftpricefloor.com/nfts")
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setFloorPrice(data);
            })
    }, []);
    return (floorPrices);
}