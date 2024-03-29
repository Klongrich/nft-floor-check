import React, { useState, useEffect } from "react";
import Styled from "styled-components";

import MuiButton from "@material-ui/core/Button";
import { styled } from "@material-ui/core/styles";
import { spacing } from '@mui/system';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField } from '@material-ui/core';

import Image from "next/image";

import ENSlogo from "../static/icons/ensLogo.jpeg";
import UNIlogo from "../static/icons/UniswapLogo.png";
import GTClogo from "../static/icons/GitCoinLogo.png";
import AAVElogo from "../static/icons/aave-logo.png"

import CoinPriceBox from "../components/CoinPriceBoxDesktop";

import GetCoinPrice from "../utils/CoinPrices/getCoinPrice";
import GetETHprice from "../utils/CoinPrices/getETHprice";
import ParseUserAddress from "../utils/parseUserAddress";

import Web3 from 'web3';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';

import tokenAddresses from "../static/tokens/tokenContracts";

// @ts-ignore
import ENS, { getEnsAddress } from '@ensdomains/ensjs';
import { setEnvironmentData } from "worker_threads";
import { cachedDataVersionTag, DefaultDeserializer } from "v8";
import { RSA_NO_PADDING } from "constants";
import { ThemeContext } from "@mui/styled-engine";
import { AnyARecord } from "dns";

import ListFloor from "./FloorCheck";
import { setRequestMeta } from "next/dist/server/request-meta";

const Button = styled(MuiButton)(spacing);

const API_KEY = "SGJRWYUZK9QJH2UUQ96JKTZAY4RAPIB5PK";

const providerOptions = {
    walletconnect: {
        package: WalletConnectProvider, // required
        options: {
            infuraId: '43b86485d3164682b5d703fd1d39fe1c', // required
        },
    },
};

const Container = Styled.div`
    padding-left: 40px;
    padding-right: 40px;
`

const UserNftImageBox = Styled.div`
    margin-left: 40px;
    margin-bottom: 20px;
    float: left;
`

const UserMetaBox = Styled.div`
    background-color: #fcf7f7;
    text-align: center;
    @media (max-width: 2500px) {
        width: 450px;
    }
    @media (max-width: 999px) {
        width: 300px;
    }
    height: 60px;
    
    margin-top: 20px;
    margin-right: 30px;
    padding-top: 2px;
    padding-bottom :2px;
    padding-left: 20px;
    padding-right: 20px;
  
    display: inline-block;
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
    h3 {
        fonst-size: 10px;
    }
    :hover{
        box-shadow: 0 0 10px black;
        cursor: pointer;
        transition-timing-function: ease-in;
        transition: 0.2s;
        transform: scale(1.03);
    }
`

const TopNavBar = Styled.div`
    margin-top: -15px;
    h2 {
        float :left;
        margin-right: 20px;
        text-decoration: underline;
        :hover {
            cursor: pointer;
        }
    }
    @media (max-width: 999px) {
        padding-bottom: 25px;
    }
`

const ButtonBox = Styled.div`
    @media (max-width: 2500px) {
        text-align: right;
        margin-bottom: -60px;
        margin-top: 25px;
    }
    @media (max-width: 999px) {
        text-align: left;
        margin-top: 25px;
        margin-bottom: 5px;
    }
`

const MobileBox = Styled.div`
    @media (max-width: 999px) {
        
    }
`


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
        name: "0",
        balance: "0"
    },
    {
        name: "0",
        balance: "0"
    },
    {
        name: "0",
        balance: "0"
    }
]

interface imageURLs {
    image_url: string
    permalink: string
}

var nftMeta: imageURLs[] = [];

export function Search() {

    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [state, setState] = useState("home");

    const [provider, setProvider] = useState('');
    const [networkVersion, setNetworkVersion] = useState("0");

    const [userAddress, setUserAddress] = useState('CONNECT');
    const [cutUserAddress, setCutUserAddress] = useState("CONNECT");
    const [searchedAddress, setSearchedAddress] = useState('');

    const [userEthAmount, setUserEthAmount] = useState('ETH AMOUNT');
    const [userEthToUSD, setUserEthToUSD] = useState('USD AMOUNT OF ETH');

    const [gtcAmount, setGtcAmount] = useState('0.00');
    const [uniAmount, setUniAmount] = useState('0.00');
    const [ensAmount, setEnsAmount] = useState('0.00');
    const [aaveAmount, setAaveAmount] = useState('0.00');

    const [userNfts, setUserNfts] = useState(nftMeta);
    const [totalNfts, setTotalNfts] = useState(0);
    const [loadedNFTs, setLoadedNFTs] = useState(false);

    const [inputText, setInputText] = useState("");

    const price = GetETHprice();
    const gtc_price = GetCoinPrice("gitcoin");
    const uni_price = GetCoinPrice("uniswap");
    const ens_price = GetCoinPrice("ethereum-name-service");
    const aave_price = GetCoinPrice('AAVE');

    const gtcCirculatingSupply = 14198201.73
    const uniCirculatingSupply = 627857378.77
    const ensCirculatingSupply = 20244862.09
    const aaveCirculatingSupply = 13397359.74

    async function getERC20tokens(publicKey: string, web3: any) {
        for (let i = 0; i < tokenAddresses.length; i++) {
            // @ts-ignore
            const contract = new web3.eth.Contract(ERC_20_ABI, tokenAddresses[i].contract);
            var tokenBalance = await contract.methods.balanceOf(publicKey).call();
            var total = web3.utils.fromWei(tokenBalance, 'ether');

            var object = {
                name: tokenAddresses[i].name,
                balance: total
            }
            tokenMeta[i] = object;
        }
        setEnsAmount(tokenMeta[0].balance);
        setGtcAmount(tokenMeta[1].balance);
        setUniAmount(tokenMeta[2].balance);
        setAaveAmount(tokenMeta[3].balance);
    }

    async function getUserNFTS(userAddress: string, offset: number, totalNFTs: number) {
        fetch("https://api.opensea.io/api/v1/assets?order_direction=desc&offset=" + offset + "&limit=50&owner=" + userAddress)
            .then(res => res.json())
            .then(data => {
                for (let i = 0; i < data.assets.length; i++) {
                    nftMeta.push({
                        image_url: data.assets[i].image_url,
                        permalink: data.assets[i].permalink
                    })
                    totalNFTs += 1;
                }
                if (data.assets.length >= 50) {
                    getUserNFTS(userAddress, offset += 49, totalNFTs);
                }
                setTotalNfts(totalNFTs);
                setUserNfts(nftMeta)
                setLoadedNFTs(true);
            })
    }

    //Move to "Resovle ETH function in utils" a.k.a raise money and hire someone .... 
    async function searchAddress(event: any) {
        event.preventDefault();

        const web3 = await new Web3(provider);
        //Check if input address ends in .eth or .crypto also if it's a valid address
        const ens = new ENS({ provider, ensAddress: getEnsAddress('1') })
        var address = await ens.name(inputText).getAddress() // 0x123

        if (address == "0x0000000000000000000000000000000000000000") {
            alert("Address Not Found!");
        } else {

            const initAmount = await web3.eth.getBalance(address)
            const ethAmount = web3.utils.fromWei(initAmount, 'ether');

            setUserEthAmount(ethAmount);
            setUserEthToUSD('$' + (parseFloat(ethAmount) * price).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            setSearchedAddress(address);

            nftMeta = [];

            await getUserNFTS(address, 0, 0);
            await getERC20tokens(address, web3);
        }
    }

    async function loadWeb3() {
        var web3Modal = new Web3Modal({
            cacheProvider: true, // optional
            providerOptions, // required
        });

        if (networkVersion == "1") {
            setNetworkVersion("0");
            setCutUserAddress("CONNECT")
            await web3Modal.clearCachedProvider();
        } else {
            const Provider = await web3Modal.connect();
            const web3 = await new Web3(Provider);

            setProvider(Provider);
            setNetworkVersion(Provider.networkVersion);

            if (web3) {
                const EthAccounts = await web3.eth.getAccounts();
                setUserAddress(EthAccounts[0]);
                setCutUserAddress(EthAccounts[0].substring(0, 5) + " ..... " + EthAccounts[0].substring(EthAccounts[0].length - 5))
            } else {
                console.log('web3 not found');
            }
        }
    }

    useEffect(() => {
        loadWeb3();
        //TO DO

        //1.) Add .ens name not found / resloved. -> add link to purchase ENS name.
        //2.) Add link to buy ENS name here

        // async function test_api() {
        //     fetch('http://18.191.10.42:3010/Test')
        //         .then(res => res.json())
        //         .then(data => {
        //             console.log(data);
        //         })
        // }

        // test_api();

    }, [])

    return (
        <>
            <Container>
                <ButtonBox>
                    <Button style={{ minWidth: '182px', maxWidth: '100px' }}
                        size="large"
                        variant="outlined"
                        onClick={() => loadWeb3()}
                    >
                        {cutUserAddress}
                    </Button>
                </ButtonBox>


                <MobileBox>
                    {state == "home" &&
                        <>
                            <h1> Search ENS</h1>
                        </>
                    }

                    {state == "FloorCheck" &&
                        <>
                            <h1> NFT Floor Check</h1>
                        </>
                    }


                    <TopNavBar>
                        <h2 onClick={() => setState("home")}> Query </h2>
                        <h2 onClick={() => setState("FloorCheck")}> Floor Check </h2>
                    </TopNavBar>
                </MobileBox>


                <br /> <br /> <br />

                {state == "FloorCheck" &&
                    <>
                        <ListFloor />
                    </>
                }

                {state == "home" &&
                    <>
                        <div>
                            <form onSubmit={searchAddress} >
                                <Autocomplete
                                    options={[]}
                                    open={open}
                                    onOpen={() => {
                                        //console.log("Open");
                                    }}
                                    inputValue={inputValue}
                                    onInputChange={(e: any, value: any) => {
                                        setInputValue(value);
                                    }}
                                    onChange={(e: any, value: any) => {
                                        // console.log("Do Something");
                                        // Check_Collection_Input(value);
                                    }}
                                    // options={TopCollections}
                                    renderInput={(params: any) => (
                                        <TextField {...params}
                                            label="Search ENS Name"
                                            variant="outlined"
                                            onKeyPress={e => {
                                                setInputText(inputValue);
                                            }}
                                        />
                                    )}
                                />
                            </form>

                            <a href={"https://etherscan.io/address/" + searchedAddress}>
                                <UserMetaBox>
                                    <h3> {ParseUserAddress(searchedAddress)} </h3>
                                </UserMetaBox>
                            </a>

                            <UserMetaBox>
                                <h3> {userEthAmount} </h3>
                            </UserMetaBox>

                            <UserMetaBox>
                                <h3> {userEthToUSD} </h3>
                            </UserMetaBox>

                            <CoinPriceBox
                                name={"GTC"}
                                price={gtc_price.toString()}
                                marketCap={(gtc_price * gtcCirculatingSupply).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                Icon={GTClogo}
                                chart_url={"https://coinmarketcap.com/currencies/gitcoin/"}
                                coins={parseFloat(gtcAmount)}
                            />

                            <CoinPriceBox
                                name={"UNI"}
                                price={uni_price.toString()}
                                marketCap={(uni_price * uniCirculatingSupply).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                Icon={UNIlogo}
                                chart_url={"https://coinmarketcap.com/currencies/uniswap/"}
                                coins={parseFloat(uniAmount)}
                            />

                            <CoinPriceBox
                                name={"ENS"}
                                price={ens_price.toString()}
                                marketCap={(ens_price * ensCirculatingSupply).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                Icon={ENSlogo}
                                chart_url={"https://coinmarketcap.com/currencies/ethereum-name-service/"}
                                coins={parseFloat(ensAmount)}
                            />

                            <CoinPriceBox
                                name={"AAVE"}
                                price={aave_price.toString()}
                                marketCap={(aave_price * aaveCirculatingSupply).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                Icon={AAVElogo}
                                chart_url={"https://coinmarketcap.com/currencies/aave/"}
                                coins={parseFloat(aaveAmount)}
                            />

                        </div>

                        <br />
                        <br />
                        <br />

                        <h2> Total: ${((ens_price * parseFloat(ensAmount)) + (gtc_price * parseFloat(gtcAmount)) + (uni_price * parseFloat(uniAmount) + (price * parseFloat(userEthAmount)))).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </h2>

                        <h2> Total Nfts: {totalNfts} </h2>
                        {loadedNFTs && <>
                            {userNfts.map((data =>
                                <>
                                    {data.image_url &&
                                        <>
                                            <UserNftImageBox>
                                                <a href={data.permalink} >
                                                    <Image src={data.image_url}
                                                        alt="Image Not Found"
                                                        height={100}
                                                        width={100}
                                                    />
                                                </a>
                                            </UserNftImageBox>
                                        </>}
                                </>
                            ))}
                        </>
                        }

                    </>
                }
            </Container>
        </>
    );
}

export default Search;