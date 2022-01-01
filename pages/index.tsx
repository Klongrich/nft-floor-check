import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import Search from "./Search";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>NFT-Alpha</title>
        <meta name="NFT-Alpha" content="Next Generation Information Exchange" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <Search />
      </div>

    </div>
  )
}

export default Home
