import React, { useState, useEffect } from "react";
import Styled from "styled-components";

import MuiButton from "@material-ui/core/Button";
import { styled } from "@material-ui/core/styles";
import { spacing } from '@mui/system';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField } from '@material-ui/core';

import { useRouter } from 'next/router';

import Image from "next/image";

import ENSlogo from "../static/icons/ensLogo.jpeg";
import UNIlogo from "../static/icons/UniswapLogo.png";
import GTClogo from "../static/icons/GitCoinLogo.png";

import FloorBox from "../components/FloorBox";
import CoinPriceBox from "../components/CoinPriceBox";

import GetNftInfo from "../utils/getNftInfo";

import GetGTCprice from "../utils/CoinPrices/getGTCprice";
import GetETHprice from "../utils/CoinPrices/getETHprice";
import GetENSprice from "../utils/CoinPrices/getENSprice";
import GetUNIprice from "../utils/CoinPrices/getUNIprice";

import Web3 from 'web3';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';

import tokenAddresses from "../static/tokens/tokenContracts";

import ENS, { getEnsAddress } from '@ensdomains/ensjs';

const Button = styled(MuiButton)(spacing);

const pudgy_url = "/prices/penguins";
const cool_cats_url = "/prices/coolcats";
const KIA_url = "/prices/kia";
const sappy_seal_url = "/prices/seals";
const BAYC_url = "/prices/bayc";
const MAYC_url = "/prices/mayc";

const API_KEY = "SGJRWYUZK9QJH2UUQ96JKTZAY4RAPIB5PK";

const providerOptions = {
    walletconnect: {
        package: WalletConnectProvider, // required
        options: {
            infuraId: '43b86485d3164682b5d703fd1d39fe1c', // required
        },
    },
};

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

const ImageBox = Styled.div`
    text-align: center;
`

const catImageURLs: string[] = [];
const BAYCImageURLs: string[] = [];

// The minimum ABI to get ERC20 Token balance
const ERC_20_ABI = [
    // balanceOf
    {
        "constant": true,
        "inputs": [{ "name": "_owner", "type": "address" }],
        "name": "balanceOf",
        "outputs": [{ "name": "balance", "type": "uint256" }],
        "type": "function"
    },
    // decimals
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [{ "name": "", "type": "uint8" }],
        "type": "function"
    }
];

const tokenMeta = [
    {
        name: "test",
        amount: "888"
    }
]


export function ListFloor() {

    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const [BAYCPrice, setBAYCPrice] = useState(place_holder);
    const [MAYCPrice, setMAYCprice] = useState(place_holder);

    const [pudgyPrice, setPudgyPrice] = useState(place_holder);
    const [coolCatsPrice, setCoolCatsPrice] = useState(place_holder);
    const [KIAPrice, setKIAPrice] = useState(place_holder);
    const [sappySealPrice, setSappySealPrice] = useState(place_holder);

    const [web3, setWeb3] = useState('');
    const [provider, setProvider] = useState('');
    const [userAddress, setUserAddress] = useState('');
    const [searchedAddress, setSearchedAddress] = useState('');

    const [erc20Tokens, setErc20Tokens] = useState(tokenMeta);

    const [state, setState] = useState("home");


    const price = GetETHprice();
    const gtc_price = GetGTCprice();
    const uni_price = GetUNIprice();
    const ens_price = GetENSprice();

    const gtcCirculatingSupply = 14198201.73
    const uniCirculatingSupply = 627857378.77
    const ensCirculatingSupply = 20244862.09

    const router = useRouter();

    async function getCoolCatsImages() {
        if (coolCatsPrice.length > 0) {
            for (let i = 0; i < max_list; i++) {
                if (coolCatsPrice[i].id) {
                    console.log(coolCatsPrice[i].id);
                    fetch("https://api.coolcatsnft.com/cat/" + coolCatsPrice[i].id)
                        .then(res => res.json())
                        .then(data => {
                            catImageURLs.push(data.image)
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

    async function getERC20tokens(publicKey: string) {
        const web3 = await new Web3(provider);

        for (let i = 0; i < tokenAddresses.length; i++) {
            const contract = new web3.eth.Contract(ERC_20_ABI, tokenAddresses[i].contract);
            var tokenBalance = await contract.methods.balanceOf(publicKey).call();
            var total = web3.utils.fromWei(tokenBalance, 'ether');

            // setErc20Tokens(erc20Tokens => [...erc20Tokens, {
            //     name: tokenAddresses[i].name,
            //     amount: total
            // }])

            console.log(tokenAddresses[i].name + " : " + total);
        }

    }

    //Move to "Resovle ETH function in utils" a.k.a raise money and hire someone .... 
    async function searchAddress(inputAddress: string) {
        //Check if input address ends in .eth or .crypto also if it's a valid address
        const ens = new ENS({ provider, ensAddress: getEnsAddress('1') })
        var address = await ens.name(inputAddress).getAddress() // 0x123
        setSearchedAddress(address);

        await getERC20tokens(address);

        console.log(address);
    }

    useEffect(() => {

        const web3Modal = new Web3Modal({
            cacheProvider: false, // optional
            providerOptions, // required
        });

        //Move to wrapper to use across scope of applaction
        async function loadWeb3() {
            const provider = await web3Modal.connect();
            const web3 = await new Web3(provider);

            setProvider(provider);

            if (web3) {
                const EthAccounts = await web3.eth.getAccounts();
                setUserAddress(EthAccounts[0]);
            } else {
                console.log('web3 not found');
            }
        }

        window.addEventListener('popstate', function (event) {
            console.log("window event")
            if (state != "home") {
                setState("home");
                router.push("/")
            }
        }, false);

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

        if (window.location.href.split('/')[3] != "") {
            setState(window.location.href.split('/')[3]);
        }

        GetNftInfo(cool_cats_url, setCoolCatsPrice);
        getBAYCInfo(BAYC_url, setBAYCPrice);

        GetNftInfo(pudgy_url, setPudgyPrice);
        GetNftInfo(KIA_url, setKIAPrice);
        GetNftInfo(sappy_seal_url, setSappySealPrice);
        GetNftInfo(BAYC_url, setBAYCPrice);
        GetNftInfo(MAYC_url, setMAYCprice);

        loadWeb3();

    }, [state])

    return (
        <>
            <div>

                <h1> DAO price check </h1>

                <Autocomplete
                    options={[]}
                    open={open}
                    onOpen={() => {
                        console.log("Open");
                    }}
                    inputValue={inputValue}
                    onInputChange={(e: any, value: any) => {
                        setInputValue(value);
                    }}
                    onChange={(e: any, value: any) => {
                        console.log("Do Something");
                        //Check_Collection_Input(value);
                    }}
                    // options={TopCollections}
                    renderInput={(params: any) => (
                        <TextField {...params}
                            label="Search ETH address"
                            variant="outlined"
                            onKeyDown={e => {
                                console.log(e.code);
                                if (e.code == "Enter") {
                                    searchAddress(inputValue);
                                    setOpen(false);
                                }
                            }}
                        />
                    )}
                />

                <h2>{searchedAddress} </h2>

                <CoinPriceBox
                    name={"GTC"}
                    price={gtc_price.toString()}
                    marketCap={(gtc_price * gtcCirculatingSupply).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    Icon={GTClogo}
                    chart_url={"https://coinmarketcap.com/currencies/gitcoin/"}
                />

                <CoinPriceBox
                    name={"UNI"}
                    price={uni_price.toString()}
                    marketCap={(uni_price * uniCirculatingSupply).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    Icon={UNIlogo}
                    chart_url={"https://coinmarketcap.com/currencies/uniswap/"}
                />

                <CoinPriceBox
                    name={"ENS"}
                    price={ens_price.toString()}
                    marketCap={(ens_price * ensCirculatingSupply).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    Icon={ENSlogo}
                    chart_url={"https://coinmarketcap.com/currencies/ethereum-name-service/"}
                />

                <br />
                <br />
                <br />

                <NavBar>
                    <h1> NFT Floor Check</h1>
                    <p> ETH Price : ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </p>

                    <Button style={{ minWidth: '142px' }} mr={3} size="large" variant="outlined"> ETH </Button>
                    <Button style={{ minWidth: '142px' }} mr={5} size="large" variant="outlined"> MATIC </Button>

                    <Button style={{ minWidth: '142px' }} mr={3} mt={2} size="large" variant="outlined"> SOL </Button>
                    <Button style={{ minWidth: '142px' }} mr={5} mt={2} size="large" variant="outlined"> EOS </Button>


                    {/* {window.innerWidth < 999 && <>
                        <Button style={{ minWidth: '112px' }} mr={5} mt={2} size="large" variant="outlined"> SOL </Button>
                        <Button style={{ minWidth: '112px' }} mr={5} mt={2} size="large" variant="outlined"> EOS </Button>
                    </>} */}
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
                            />
                        </div>

                        <div onClick={() => updateState("KIA")}>
                            <FloorBox Collection="KIA"
                                NFTmeta={KIAPrice}
                                max_list={8}
                                opensea_url="https://opensea.io/assets/0x3f5fb35468e9834a43dca1c160c69eaae78b6360/"
                                ethPrice={price}
                                start={1}
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
                            />
                        </div>

                        <div onClick={() => updateState("SAPPY")}>
                            <FloorBox Collection="SAPPY"
                                NFTmeta={sappySealPrice}
                                max_list={8}
                                opensea_url="https://opensea.io/assets/0x364c828ee171616a39897688a831c2499ad972ec/"
                                ethPrice={price}
                                start={0}
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
                            />
                        </div>

                        <div onClick={() => updateState("MAYC")}>
                            <FloorBox Collection="MAYC"
                                NFTmeta={MAYCPrice}
                                max_list={8}
                                opensea_url="https://opensea.io/assets/0x60e4d786628fea6478f785a6d7e704777c86a7c6/"
                                ethPrice={price}
                                start={0}
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


            </div>
        </>
    );
}

export default ListFloor;
