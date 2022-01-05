import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import Styled from "styled-components";

import GetNftInfo from "../utils/getNftInfo";
import FloorBox from "../components/FloorBox";
import Image from "next/image";

import MuiButton from "@material-ui/core/Button";
import { styled } from "@material-ui/core/styles";
import { spacing } from '@mui/system';

import GetETHprice from "../utils/CoinPrices/getETHprice";

import PudgyLogo from "../static/icons/pudgypenguins.png";
import KIALogo from "../static/icons/KIA.png";
import CoolCatsLogo from "../static/icons/CoolCatsLogo.jpeg";
import SappySealsLogo from "../static/icons/SappySeals.jpeg";
import BAYCLogo from "../static/icons/BAYC.png";
import MAYCLogo from "../static/icons/MAYC.png";

const Button = styled(MuiButton)(spacing);

const pudgy_url = "/prices/penguins";
const cool_cats_url = "/prices/coolcats";
const KIA_url = "/prices/kia";
const sappy_seal_url = "/prices/seals";
const BAYC_url = "/prices/bayc";
const MAYC_url = "/prices/mayc";

const max_list = 8;

const catImageURLs: string[] = [];
const BAYCImageURLs: string[] = [];

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

const NavBar = Styled.div`
    p {
        padding-top: 10px;
        padding-bottom: 10px;
    }

    @media (max-width: 2500px) {
        width: 750px;
    }

        @media (max-width: 999px) {
            width: 380px;
    }
`

const FloorRow = Styled.div`
  width: 342px;
  display: inline-block;
`

const ImageBox = Styled.div`
    text-align: center;
`

export function FloorCheck() {

    const [state, setState] = useState("home");
    const [windowWidth, setWindowWidth] = useState(0.00);

    const [BAYCPrice, setBAYCPrice] = useState(place_holder);
    const [MAYCPrice, setMAYCprice] = useState(place_holder);

    const [pudgyPrice, setPudgyPrice] = useState(place_holder);
    const [coolCatsPrice, setCoolCatsPrice] = useState(place_holder);
    const [KIAPrice, setKIAPrice] = useState(place_holder);
    const [sappySealPrice, setSappySealPrice] = useState(place_holder);

    const router = useRouter();
    const price = GetETHprice();

    async function getCoolCatsImages() {
        if (coolCatsPrice.length > 0) {
            for (let i = 0; i < max_list; i++) {
                if (coolCatsPrice[i].id) {
                    // console.log(coolCatsPrice[i].id);
                    fetch("https://api.coolcatsnft.com/cat/" + coolCatsPrice[i].id)
                        .then(res => res.json())
                        .then(data => {
                            catImageURLs.push(data.image)
                        })
                }
            }
        }
    }

    async function getBAYCInfo(url: string, setDataPrice: any) {
        await GetNftInfo(url, setDataPrice);

        if (BAYCPrice.length > 0) {
            for (let i = 0; i < max_list; i++) {
                if (BAYCPrice[i].id) {
                    fetch("https://bafybeihpjhkeuiq3k6nqa3fkgeigeri7iebtrsuyuey5y6vy36n345xmbi.ipfs.dweb.link/" + BAYCPrice[i].id)
                        .then(res => res.json())
                        .then(data => {
                            BAYCImageURLs.push(data.image)
                        })
                }
            }
        }
    }

    async function updateState(state: string) {
        const window_height = 860;

        if (state == "PUDGY") {
            setState("PUDGY")
            await router.push('/PUDGY');
            window.scrollTo(0, window_height);
        }
        else if (state == "KIA") {
            setState("KIA");
            await router.push("/KIA");
            window.scrollTo(0, window_height);
        }
        else if (state == "SAPPY") {
            setState("SAPPY");
            await router.push("SAPPY");
            window.scrollTo(0, window_height);
        }
        else if (state == "COOLCATS") {
            await getCoolCatsImages();
            setState("COOLCATS");
            await router.push("COOLCATS");
            window.scrollTo(0, window_height);
        } else if (state == "BAYC") {
            setState("BAYC");
            await router.push("BAYC");
            window.scrollTo(0, window_height);
        }
    }

    // window.addEventListener('popstate', function (event) {
    //     if (state != "home") {
    //         setState("home");
    //         router.push("/")
    //     }
    // }, false);

    // if (window.location.href.split('/')[3] != "") {
    //     setState(window.location.href.split('/')[3]);
    // }

    useEffect(() => {

        setWindowWidth(window.innerWidth);

        GetNftInfo(pudgy_url, setPudgyPrice);
        GetNftInfo(cool_cats_url, setCoolCatsPrice);
        getBAYCInfo(BAYC_url, setBAYCPrice);

        GetNftInfo(KIA_url, setKIAPrice);
        GetNftInfo(sappy_seal_url, setSappySealPrice);
        GetNftInfo(BAYC_url, setBAYCPrice);
        GetNftInfo(MAYC_url, setMAYCprice);

    }, [])

    return (
        <>
            <NavBar>
                <p> ETH Price : ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </p>

                <Button style={{ minWidth: '142px' }} mr={3} size="large" variant="outlined"> ETH </Button>
                <Button style={{ minWidth: '142px' }} mr={5} size="large" variant="outlined"> MATIC </Button>


                {windowWidth >= 999 &&
                    <>
                        <Button style={{ minWidth: '142px' }} mr={3} mt={0} size="large" variant="outlined"> SOL </Button>
                        <Button style={{ minWidth: '142px' }} mr={5} mt={0} size="large" variant="outlined"> EOS </Button>
                    </>
                }

                {windowWidth < 999 && <>
                    <Button style={{ minWidth: '142px' }} mr={3} mt={2} size="large" variant="outlined"> SOL </Button>
                    <Button style={{ minWidth: '142px' }} mr={5} mt={2} size="large" variant="outlined"> EOS </Button>
                </>}
            </NavBar>

            {state == "home" && <>
                <FloorRow>
                    <div onClick={() => updateState("PUDGY")}>
                        <FloorBox Collection="Pudgy"
                            NFTmeta={pudgyPrice}
                            max_list={8}
                            opensea_url="https://opensea.io/assets/0xbd3531da5cf5857e7cfaa92426877b022e612cf8/"
                            ethPrice={price}
                            start={1}
                            icon={PudgyLogo}
                        />
                    </div>

                    <div onClick={() => updateState("KIA")}>
                        <FloorBox Collection="KIA"
                            NFTmeta={KIAPrice}
                            max_list={8}
                            opensea_url="https://opensea.io/assets/0x3f5fb35468e9834a43dca1c160c69eaae78b6360/"
                            ethPrice={price}
                            start={1}
                            icon={KIALogo}
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
                            start={1}
                            icon={CoolCatsLogo}
                        />
                    </div>

                    <div onClick={() => updateState("SAPPY")}>
                        <FloorBox Collection="SAPPY"
                            NFTmeta={sappySealPrice}
                            max_list={8}
                            opensea_url="https://opensea.io/assets/0x364c828ee171616a39897688a831c2499ad972ec/"
                            ethPrice={price}
                            start={1}
                            icon={SappySealsLogo}
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
                            start={0}
                            icon={BAYCLogo}
                        />
                    </div>

                    <div onClick={() => updateState("MAYC")}>
                        <FloorBox Collection="MAYC"
                            NFTmeta={MAYCPrice}
                            max_list={8}
                            opensea_url="https://opensea.io/assets/0x60e4d786628fea6478f785a6d7e704777c86a7c6/"
                            ethPrice={price}
                            start={0}
                            icon={MAYCLogo}
                        />
                    </div>

                </FloorRow>

            </>}

            <ImageBox>
                {state == "KIA" && <>
                    {KIAPrice.slice(1, max_list + 1).map((data) => (
                        <>
                            <h3> Price: {data.price} </h3>
                            <Image width={200}
                                height={200}
                                src={"https://koala-intelligence-agency.s3.us-east-2.amazonaws.com/koalas/" + data.id + ".png"}
                                alt="NFT Image" />
                        </>
                    ))}
                </>}
            </ImageBox>


            <ImageBox>
                {state == "PUDGY" && <>
                    {pudgyPrice.slice(1, max_list + 1).map((data) => (
                        <>
                            <h3> Price: {data.price} </h3>
                            <a href={"https://opensea.io/assets/0xbd3531da5cf5857e7cfaa92426877b022e612cf8/" + data.id} >
                                <Image width={200}
                                    height={200}
                                    src={"https://ipfs.io/ipfs/QmNf1UsmdGaMbpatQ6toXSkzDpizaGmC9zfunCyoz1enD5/penguin/" + data.id + ".png"}
                                    alt=""
                                />
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
                                <Image width={200}
                                    height={200}
                                    src={"https://bafybeida6b2f54lassxtg2subbm2n5uoltcg5kqvklalmrrfch7nxipiwi.ipfs.dweb.link/" + data.id + ".png"}
                                    alt=""
                                />
                            </a>
                        </>
                    ))}
                </>}
            </ImageBox>

            <ImageBox>
                {state == "COOLCATS" && <>
                    {coolCatsPrice.slice(1, max_list + 1).map((data, key) => (
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
        </>
    )

}

export default FloorCheck;