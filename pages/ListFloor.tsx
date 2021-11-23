import React, { useState, useEffect } from "react";
import Styled from "styled-components";

import MuiButton from "@material-ui/core/Button";
import { styled } from "@material-ui/core/styles";
import { spacing } from '@mui/system';

const Button = styled(MuiButton)(spacing);

const pudgy_url = "/prices/penguins";
const cool_cats_url = "/prices/coolcats";
const KIA_url = "/prices/kia";
const sappy_seal_url = "/prices/seals";
const BAYC_url = "/prices/bayc";
const MAYC_url = "/prices/mayc";

const place_holder = [
    {
        id: "0",
        price: 13.37,
    },
    {
        id: "0",
        price: 13.37
    }
];

const max_list = 8;

const FloorRow = Styled.div`
  width: 342px;
  display: inline-block;
`

const FloorBox = Styled.div`
  background-color: #fcf7f7;
  border-radius: 15px;
  
  margin-top: 40px;
  margin-right: 30px;

  padding-left: 15px;
  padding-top: 1px;
  padding-bottom: 10px;
  
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));

  p {
    font-size: 16px;
    
    padding-top: 2px;
    padding-bottom: 2px;
  }
`

export function ListFloor() {

    const [ethPrice, setETHprice] = useState(0.00);

    const [pudgyPrice, setPudgyPrice] = useState(place_holder);
    const [coolCatsPrice, setCoolCatsPrice] = useState(place_holder);
    const [KIAPrice, setKIAPrice] = useState(place_holder);
    const [sappySealPrice, setSappySealPrice] = useState(place_holder);
    const [BAYCPrice, setBAYCPrice] = useState(place_holder);
    const [MAYCPrice, setMAYCprice] = useState(place_holder);

    const [state, setState] = useState("home");
    const [catImage, setCatImage] = useState("");

    function getFloorPrice(floor_value: any) {
        return ((floor_value * ethPrice).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    }

    async function getETHPrice() {
        fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd")
            .then(res => res.json())
            .then(data => {
                setETHprice(data.ethereum.usd);
            })
    }

    function updateState(selected_collection: string) {
        if (selected_collection == "BAYC") {
            setState("BAYC");
        }
    }

    // function getCoolCatsImage(url) {
    //   fetch(url)
    //     .then(res => res.json())
    //     .then(data => {
    //       console.log(data.image);
    //       setCatImage(data.image)
    //     })
    // }

    useEffect(() => {
        async function getInfo(url: string, setDataPrice: any) {
            try {
                fetch(url, {
                    headers: {
                        "test": "test",
                    }
                })
                    .then(res => res.json())
                    .then(rawdata => {

                        var price_data = [];

                        for (var i = 1; i < 10000; i++) {
                            var number = i.toString();

                            if (rawdata.prices[number]) {

                                var data_id = number;
                                var data_price = rawdata.prices[number][1];

                                var new_object = {
                                    id: data_id,
                                    price: data_price
                                };

                                price_data.push(new_object);
                            }
                        }

                        console.log(price_data);
                        setDataPrice(price_data);
                        setDataPrice([...price_data].sort((b, a) => b.price - a.price));
                    });
            } catch (err) {
                console.log(err);
            };
        }

        getETHPrice();
        getInfo(pudgy_url, setPudgyPrice);
        getInfo(KIA_url, setKIAPrice);
        getInfo(cool_cats_url, setCoolCatsPrice);
        getInfo(sappy_seal_url, setSappySealPrice);
        getInfo(BAYC_url, setBAYCPrice);
        getInfo(MAYC_url, setMAYCprice);
    }, [])

    return (
        <>
            <div>
                <div>
                    <h1> NFT Scalpers Dream</h1>
                    <p> ETH Price : ${ethPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </p>

                    <Button onClick={() => setState("home")} style={{ minWidth: '112px' }} mr={5} size="large" variant="outlined"> ETH </Button>
                    <Button style={{ minWidth: '112px' }} mr={5} size="large" variant="outlined"> MATIC </Button>


                    <Button style={{ minWidth: '112px' }} mr={5} size="large" variant="outlined"> SOL </Button>
                    <Button style={{ minWidth: '112px' }} mr={5} size="large" variant="outlined"> EOS </Button>


                    {/* {window.innerWidth < 999 && <>
                        <Button style={{ minWidth: '112px' }} mr={5} mt={2} size="large" variant="outlined"> SOL </Button>
                        <Button style={{ minWidth: '112px' }} mr={5} mt={2} size="large" variant="outlined"> EOS </Button>
                    </>} */}
                </div>

                {state == "home" && <>
                    <FloorRow>
                        <FloorBox onClick={() => setState("PUDGY")}>
                            <h2> Pudgy Floor Check </h2>
                            {pudgyPrice.slice(0, 1).map((data, id) => (
                                <h3 key={id}> Floor: ${getFloorPrice(data.price)} </h3>
                            ))}
                            {pudgyPrice.slice(0, max_list).map((data, id) => (
                                <p key={id} > ID : <a href={"https://opensea.io/assets/0xbd3531da5cf5857e7cfaa92426877b022e612cf8/" + data.id} > #{data.id} </a> -- Price : {data.price} </p>
                            ))}
                        </FloorBox>

                        <FloorBox onClick={() => setState("KIA")}>
                            <h2> KIA Floor Check </h2>
                            {KIAPrice.slice(1, 2).map((data, id) => (
                                <h3 key={id}> Floor: ${getFloorPrice(data.price)} </h3>
                            ))}
                            {KIAPrice.slice(0, max_list).map((data, id) => (
                                <p key={id} > ID: <a href={"https://opensea.io/assets/0x3f5fb35468e9834a43dca1c160c69eaae78b6360/" + data.id}> #{data.id} </a> -- Price : {data.price}</p>
                            ))}
                        </FloorBox>
                    </FloorRow>

                    <FloorRow>
                        <FloorBox onClick={() => setState("COOLCATS")}>
                            <h2> Cool Cats Floor Check </h2>
                            {coolCatsPrice.slice(0, 1).map((data, id) => (
                                <h3 key={id} > Floor: ${getFloorPrice(data.price)} </h3>
                            ))}
                            {coolCatsPrice.slice(0, max_list).map((data, id) => (
                                <p key={id} > ID:  <a href={"https://opensea.io/assets/0x1a92f7381b9f03921564a437210bb9396471050c/" + data.id}> #{data.id} </a> -- Price : {data.price}</p>
                            ))}
                        </FloorBox>

                        <FloorBox onClick={() => setState("SAPPY")}>
                            <h2> Sappy Seal Floor Check </h2>
                            {sappySealPrice.slice(0, 1).map((data, id) => (
                                <h3 key={id} > Test: ${getFloorPrice(data.price)} </h3>
                            ))}
                            {sappySealPrice.slice(0, max_list).map((data, id) => (
                                <p key={id} > ID:  <a href={"https://opensea.io/assets/0x364c828ee171616a39897688a831c2499ad972ec/" + data.id} > #{data.id} </a> -- Price : {data.price}</p>
                            ))}
                        </FloorBox>
                    </FloorRow>

                    <FloorRow>
                        <FloorBox onClick={() => updateState("BAYC")}>
                            <h2> BAYC Floor Check </h2>
                            {BAYCPrice.slice(0, 1).map((data, id) => (
                                <h3 key={id}> Test: ${getFloorPrice(data.price)} </h3>
                            ))}
                            {BAYCPrice.slice(0, max_list).map((data, id) => (
                                <p key={id}> ID: <a href={"https://opensea.io/assets/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/" + data.id} > #{data.id} </a> -- Price : {data.price}</p>
                            ))}
                        </FloorBox>

                        <FloorBox>
                            <h2> MAYC Floor Check </h2>
                            {MAYCPrice.slice(0, 1).map((data, id) => (
                                <h3 key={id} > Test: ${getFloorPrice(data.price)} </h3>
                            ))}
                            {MAYCPrice.slice(0, max_list).map((data, id) => (
                                <p key={id} > ID: <a href={"https://opensea.io/assets/0x60e4d786628fea6478f785a6d7e704777c86a7c6/" + data.id} > #{data.id} </a> -- Price : {data.price}</p>
                            ))}
                        </FloorBox>
                    </FloorRow>
                </>}

                {state == "KIA" && <>
                    {KIAPrice.slice(0, max_list).map((data) => (
                        <>
                            <h3> Price: {data.price} </h3>
                            <img width="200px" height="200px" src={"https://koala-intelligence-agency.s3.us-east-2.amazonaws.com/koalas/" + data.id + ".png"} alt="" />
                        </>
                    ))}
                </>}

                {state == "PUDGY" && <>
                    {pudgyPrice.slice(0, max_list).map((data) => (
                        <>
                            <h3> Price: {data.price} </h3>
                            <a href={"https://opensea.io/assets/0xbd3531da5cf5857e7cfaa92426877b022e612cf8/" + data.id} >
                                <img width="200px" height="200px" src={"https://ipfs.io/ipfs/QmNf1UsmdGaMbpatQ6toXSkzDpizaGmC9zfunCyoz1enD5/penguin/" + data.id + ".png"} alt="" />
                            </a>
                        </>
                    ))}
                </>}

                {state == "SAPPY" && <>
                    {sappySealPrice.slice(0, max_list).map((data) => (
                        <>
                            <h3> Price: {data.price} </h3>
                            <a href={"https://opensea.io/assets/" + data.id} >
                                <img width="200px" height="200px" src={" https://bafybeida6b2f54lassxtg2subbm2n5uoltcg5kqvklalmrrfch7nxipiwi.ipfs.dweb.link/" + data.id + ".png"} alt="" />
                            </a>
                        </>
                    ))}
                </>}

                {/* {state == "COOLCATS" && <>
          {coolCatsPrice.slice(0, max_list).map((data) => (
            <>
              <h3> Price: {data.price} </h3>
              <a href={"https://opensea.io/assets/0x364c828ee171616a39897688a831c2499ad972ec/" + data.id} >

                <p> {getCoolCatsImage("https://api.coolcatsnft.com/cat/" + data.id)} </p>

                <img widht="200px" height="200px" src={catImage} alt="" />

              </a>
            </>
          ))}
        </>} */}

            </div>
        </>
    );
}

export default ListFloor;
