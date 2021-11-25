import React, { useState, useEffect } from "react";
import Styled from "styled-components";

import MuiButton from "@material-ui/core/Button";
import { styled } from "@material-ui/core/styles";
import { spacing } from '@mui/system';
import { useRouter } from 'next/router';

import FloorBox from "../components/FloorBox";

import GetETHprice from "../utils/getETHprice";

const Button = styled(MuiButton)(spacing);

const pudgy_url = "/prices/penguins";
const cool_cats_url = "/prices/coolcats";
const KIA_url = "/prices/kia";
const sappy_seal_url = "/prices/seals";
const BAYC_url = "/prices/bayc";
const MAYC_url = "/prices/mayc";

// var ipfsAPI = require('ipfs-api');
// const ipfs = ipfsAPI('ipfs.infura.io', '5001', { protocol: 'https' })

const place_holder = [
    {
        id: "1",
        price: 13.37,
    },
    {
        id: "2",
        price: 13.37
    },
    {
        id: "3",
        price: 13.37
    },
    {
        id: "4",
        price: 13.37
    },
    {
        id: "5",
        price: 13.37
    },
    {
        id: "6",
        price: 13.37
    }
    ,
    {
        id: "7",
        price: 13.37
    },
    {
        id: "8",
        price: 13.37
    },
    {
        id: "9",
        price: 13.37
    }
];

const max_list = 8;

const NavBar = Styled.div`
    p {
        padding-top: 10px;
        padding-bottom: 10px;
    }
    width: 380px;
`

const FloorRow = Styled.div`
  width: 342px;
  display: inline-block;
`

// const FloorBox = Styled.div`
//     text-align: center;
//     background-color: #fcf7f7;
//     border-radius: 15px;

//     margin-top: 40px;
//     margin-right: 30px;

//     padding-top: 1px;
//     padding-bottom: 10px;

//     filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));

//     p {
//         font-size: 16px;

//         padding-top: 2px;
//         padding-bottom: 2px;
//     }
// `

const ImageBox = Styled.div`
    text-align: center;
`

const catImageURLs: string[] = [];
const BAYCImageURLs: string[] = [];

export function ListFloor() {

    // const [ethPrice, setETHprice] = useState(0.00);

    const [BAYCPrice, setBAYCPrice] = useState(place_holder);
    const [MAYCPrice, setMAYCprice] = useState(place_holder);

    const [pudgyPrice, setPudgyPrice] = useState(place_holder);
    const [coolCatsPrice, setCoolCatsPrice] = useState(place_holder);
    const [KIAPrice, setKIAPrice] = useState(place_holder);
    const [sappySealPrice, setSappySealPrice] = useState(place_holder);

    const [state, setState] = useState("home");

    const price = GetETHprice();

    const router = useRouter()

    // function getFloorPrice(floor_value: any) {
    //     return ((floor_value * ethPrice).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    // }

    // async function getETHPrice() {
    //     fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd")
    //         .then(res => res.json())
    //         .then(data => {
    //             setETHprice(data.ethereum.usd);
    //         })
    // }

    function updateState(state: string) {
        if (state == "PUDGY") {
            setState("PUDGY")
            router.push('/PUDGY');
        }
        else if (state == "KIA") {
            setState("KIA");
            router.push("/KIA");
        }
        else if (state == "SAPPY") {
            setState("SAPPY");
            router.push("SAPPY");
        }
        else if (state == "COOLCATS") {
            setState("COOLCATS");
            router.push("COOLCATS");
        } else if (state == "BAYC") {
            setState("BAYC");
            router.push("BAYC");
        }
    }

    useEffect(() => {

        window.addEventListener('popstate', function (event) {
            if (state != "") {
                setState("");
                router.push("/")
            }
        }, false);

        async function getInfo(url: string, setDataPrice: any) {
            try {
                fetch(url)
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
                        setDataPrice(price_data);
                        setDataPrice([...price_data].sort((b, a) => b.price - a.price));
                    });
            } catch (err) {
                console.log(err);
            };
        }

        async function getCoolCatsInfo(url: string, setDataPrice: any) {
            await getInfo(url, setDataPrice);

            if (coolCatsPrice.length > 0) {
                for (let i = 0; i < max_list; i++) {
                    if (coolCatsPrice[i].id) {
                        fetch("https://api.coolcatsnft.com/cat/" + coolCatsPrice[i].id)
                            .then(res => res.json())
                            .then(data => {
                                // console.log(data.image);
                                // console.log(coolCatsPrice[i].id);
                                catImageURLs.push(data.image)
                            })
                    }
                }
            }
        }

        async function getBAYCInfo(url: string, setDataPrice: any) {
            await getInfo(url, setDataPrice);

            if (BAYCPrice.length > 0) {
                for (let i = 0; i < max_list; i++) {
                    if (BAYCPrice[i].id) {
                        fetch("https://bafybeihpjhkeuiq3k6nqa3fkgeigeri7iebtrsuyuey5y6vy36n345xmbi.ipfs.dweb.link/" + BAYCPrice[i].id)
                            .then(res => res.json())
                            .then(data => {
                                // console.log(data.image);
                                // console.log(BAYCPrice[i].id);
                                BAYCImageURLs.push(data.image)
                            })
                    }
                }
            }

            // for (let i = 0; i < max_list; i++) {
            //     fetch(BAYCImageURLs[i])
            //         .then(res => res.json())
            //         .then(data => {
            //             console.log(data);
            //         })
            // }
        }

        setState(window.location.href.split('/')[3]);

        getCoolCatsInfo(cool_cats_url, setCoolCatsPrice);
        getBAYCInfo(BAYC_url, setBAYCPrice);

        getInfo(pudgy_url, setPudgyPrice);
        getInfo(KIA_url, setKIAPrice);
        getInfo(sappy_seal_url, setSappySealPrice);
        getInfo(BAYC_url, setBAYCPrice);
        getInfo(MAYC_url, setMAYCprice);

    }, [state])

    return (
        <>
            <div>
                <NavBar>
                    <h1> NFT Floor Check</h1>

                    <p> ETH Price : ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </p>

                    <Button onClick={() => setState("")} style={{ minWidth: '142px' }} mr={3} size="large" variant="outlined"> ETH </Button>
                    <Button style={{ minWidth: '142px' }} mr={5} size="large" variant="outlined"> MATIC </Button>

                    <Button style={{ minWidth: '142px' }} mr={3} mt={2} size="large" variant="outlined"> SOL </Button>
                    <Button style={{ minWidth: '142px' }} mr={5} mt={2} size="large" variant="outlined"> EOS </Button>


                    {/* {window.innerWidth < 999 && <>
                        <Button style={{ minWidth: '112px' }} mr={5} mt={2} size="large" variant="outlined"> SOL </Button>
                        <Button style={{ minWidth: '112px' }} mr={5} mt={2} size="large" variant="outlined"> EOS </Button>
                    </>} */}
                </NavBar>

                {state == "" && <>
                    <FloorRow>
                        <div onClick={() => updateState("PUDGY")}>
                            <FloorBox Collection="Pudgy"
                                NFTmeta={pudgyPrice}
                                max_list={8}
                                opensea_url="https://opensea.io/assets/0xbd3531da5cf5857e7cfaa92426877b022e612cf8/"
                                ethPrice={price}
                            />
                        </div>

                        <div onClick={() => updateState("KIA")}>
                            <FloorBox Collection="KIA"
                                NFTmeta={KIAPrice}
                                max_list={8}
                                opensea_url="https://opensea.io/assets/0x3f5fb35468e9834a43dca1c160c69eaae78b6360/"
                                ethPrice={price}
                            />
                        </div>

                    </FloorRow>

                    <FloorRow>
                        <div onClick={() => updateState("COOLCATS")}>
                            <FloorBox Collection="COOLCATS"
                                NFTmeta={coolCatsPrice}
                                max_list={8}
                                opensea_url="https://opensea.io/assets/0x1a92f7381b9f03921564a437210bb9396471050c/"
                                ethPrice={price}
                            />
                        </div>

                        <div onClick={() => updateState("SAPPY")}>
                            <FloorBox Collection="SAPPY"
                                NFTmeta={sappySealPrice}
                                max_list={8}
                                opensea_url="https://opensea.io/assets/0x364c828ee171616a39897688a831c2499ad972ec/"
                                ethPrice={price}
                            />
                        </div>
                    </FloorRow>

                    <FloorRow>

                        <div onClick={() => updateState("BAYC")}>
                            <FloorBox Collection="BAYC"
                                NFTmeta={BAYCPrice}
                                max_list={8}
                                opensea_url="https://opensea.io/assets/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/"
                                ethPrice={price}
                            />
                        </div>

                        <div onClick={() => updateState("MAYC")}>
                            <FloorBox Collection="MAYC"
                                NFTmeta={MAYCPrice}
                                max_list={8}
                                opensea_url="https://opensea.io/assets/0x60e4d786628fea6478f785a6d7e704777c86a7c6/"
                                ethPrice={price}
                            />
                        </div>

                    </FloorRow>

                </>}

                <ImageBox>
                    {state == "KIA" && <>
                        {KIAPrice.slice(0, max_list).map((data) => (
                            <>
                                <h3> Price: {data.price} </h3>
                                <img width="200px" height="200px" src={"https://koala-intelligence-agency.s3.us-east-2.amazonaws.com/koalas/" + data.id + ".png"} alt="" />
                            </>
                        ))}
                    </>}
                </ImageBox>


                <ImageBox>
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
                </ImageBox>

                <ImageBox>
                    {state == "SAPPY" && <>
                        {sappySealPrice.slice(0, max_list).map((data) => (
                            <>
                                <h3> Price: {data.price} </h3>
                                <a href={"https://opensea.io/assets/0x364c828ee171616a39897688a831c2499ad972ec/" + data.id} >
                                    <img width="200px" height="200px" src={" https://bafybeida6b2f54lassxtg2subbm2n5uoltcg5kqvklalmrrfch7nxipiwi.ipfs.dweb.link/" + data.id + ".png"} alt="" />
                                </a>
                            </>
                        ))}
                    </>}
                </ImageBox>

                <ImageBox>
                    {state == "COOLCATS" && <>
                        {coolCatsPrice.slice(0, max_list).map((data, key) => (
                            <>
                                <h3> Price: {data.price} </h3>
                                <a href={"https://opensea.io/assets/0x1a92f7381b9f03921564a437210bb9396471050c/" + data.id} >

                                    <img width="200px" height="200px" src={catImageURLs[key]} alt="" />

                                </a>
                            </>
                        ))}
                    </>}
                </ImageBox>

                <ImageBox>
                    {state == "BAYC" && <>
                        {BAYCPrice.slice(0, max_list).map((data, key) => (
                            <>
                                <h3> Price: {data.price} </h3>
                                <a href={"https://opensea.io/assets/0x1a92f7381b9f03921564a437210bb9396471050c/" + data.id} >

                                    <img width="200px" height="200px" src={"https://bafybeiasy6wuw4qtbnccjc62nwxfwsu3vd3gk3k3qmxcai45uygesio5hu.ipfs.dweb.link/"} alt="" />

                                </a>
                            </>
                        ))}
                    </>}
                </ImageBox>


            </div>
        </>
    );
}

export default ListFloor;
