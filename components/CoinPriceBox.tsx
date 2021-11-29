import { deprecatedPropType, Icon } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import styled from 'styled-components';
import Image from "next/image";

interface CoinMeta {
    name: string
    price: string
    marketCap: string
    Icon: StaticImageData
    chart_url: string
}

const Container = styled.div`
    text-align: center;
    background-color: #fcf7f7;
    border-radius: 15px;
  
    margin-top: 40px;
    margin-right: 50px;

    padding-top: 1px;
    padding-bottom: 10px;
    padding-left: 20px;
    padding-right: 20px;
  
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));

    p {
        font-size: 16px;
    
        padding-top: 2px;
        padding-bottom: 2px;
    }

    width: 300px;
    display: inline-block;

    :hover{
        box-shadow: 0 0 10px black;
        cursor: pointer;
        transition-timing-function: ease-in;
        transition: 0.2s;
        transform: scale(1.03);
    }
`

export default function CoinPrice(
    Data: CoinMeta
) {
    return (
        <>
            <a href={Data.chart_url}>
                <Container>
                    <h2> {Data.name} </h2>
                    <Image src={Data.Icon}
                        width={35}
                        height={35}
                        alt=""
                    />
                    <p> Price : ${Data.price}</p>
                    <p> MarketCap : ${Data.marketCap}</p>
                    {/* <h2> Total: ${(parseFloat(Data.price) * Data.coins).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </h2> */}
                </Container>

            </a>
        </>
    );
};
