import React from "react";
import styled from "styled-components";

import getFloorPrice from "../utils/getFloorPirce";

interface nftMeta {
    id: string;
    price: number;
}

//Hot Fix
interface FloorBoxData {
    Collection: string;
    NFTmeta: nftMeta[];
    max_list: number;
    opensea_url: string;
    ethPrice: number;
    start: number;
}

const Container = styled.div`
    text-align: center;
    background-color: #fcf7f7;
    border-radius: 15px;
  
    margin-top: 40px;
    margin-right: 30px;

    padding-top: 1px;
    padding-bottom: 10px;
  
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));

    p {
        font-size: 16px;
    
        padding-top: 2px;
        padding-bottom: 2px;
    }
`

export default function FloorBox(
    Data: FloorBoxData
) {
    return (
        <>
            <Container>
                <h2> {Data.Collection} Floor Check </h2>
                {Data.NFTmeta.slice(Data.start, Data.start + 1).map((data, id) => (
                    <h3 key={id}> Floor: ${getFloorPrice(data.price, Data.ethPrice)} </h3>
                ))}
                {Data.NFTmeta.slice(Data.start, Data.max_list + Data.start).map((data, id) => (
                    <p key={id} > ID : <a href={Data.opensea_url + data.id} > #{data.id} </a> -- Price : {data.price} </p>
                ))}
            </Container>
        </>
    )


}