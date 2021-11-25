import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import ListFloor from "./ListFloor";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Nft Alpha Exchange</title>
        <meta name="NFT-Alpha" content="Next Generation NFT exchange" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <ListFloor />
      </div>

    </div>
  )
}

export default Home
