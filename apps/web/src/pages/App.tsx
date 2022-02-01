import { FC, useState } from 'react'
import dapp from '../dapp'
import MintForm from "../components/MintForm"
import axios from 'axios'
import { Container, Tabs, Tab } from '@mui/material'
import NavBar from '../components/NavBar'
import SubmitForm from '../components/SubmitForm'
import NftList from '../components/NftList'
import { Nft } from "meta"

async function getNfts() {
  let nfts: Nft[] = []
  let i = 0
  while (true) {
    try {
      const owner = await dapp.arcades.ownerOf(i)
      const res = await axios.get(dapp.assetBase + "assets/" + i)
      nfts.push({ id: i++, owner, meta: res.data })
    } catch (error) {
      break
    }
  }
  return nfts
}

const App: FC = () => {
  const [tab, setTab] = useState(0)
  const [nfts, setNfts] = useState<Nft[]>()
  const refreshNfts = () => getNfts().then(setNfts)
  if (!nfts) refreshNfts()

  return (
    <>
      <NavBar />

      <Container sx={{ mt: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div>
          <Tabs value={tab} onChange={(e, v) => setTab(v)} variant="fullWidth">
            <Tab label="Mint" id="mintTab" />
            <Tab label="Submit" id="submitTab" />
          </Tabs>
          <div hidden={tab != 0}><MintForm onSubmit={refreshNfts} /></div>
          <div hidden={tab != 1}><SubmitForm /></div>
        </div>

        <NftList nfts={nfts || []} />

      </Container>
    </>
  )
}

export default App
