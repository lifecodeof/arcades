import { FC, useEffect, useState } from 'react'
import dapp from './dapp'
import MintForm from "./components/MintForm"
import axios from 'axios'
import { Container, Tabs, Tab, Alert, Snackbar } from '@mui/material'
import NavBar from './components/NavBar'
import SubmitForm from './components/SubmitForm'
import NftList from './components/NftList'
import { Nft } from "meta"

async function getNfts() {
  let nfts: Nft[] = []
  const length = (await dapp.arcades.getCount()).toNumber()
  for (let i = 0; i < length; i++) {
    try {
      const owner = await dapp.arcades.ownerOf(i)
      const res = await axios.get(dapp.assetBase + "assets/" + i)
      nfts.push({ id: i++, owner, meta: res.data })
    } catch (error) {
      continue
    }
  }
  return nfts
}

const App: FC = () => {
  const [tab, setTab] = useState(0)
  const [nfts, setNfts] = useState<Nft[]>()
  const [error, setError] = useState(false)// new Error
  const refreshNfts = () => getNfts().then(setNfts)
  if (!nfts) refreshNfts()
  const handleClose = () => setError(false)

  useEffect(() => {
    dapp.event.listener = x => console.log({ x })
    // return dapp.
  })

  return (
    <>
      <NavBar />

      <Snackbar open={error} autoHideDuration={10000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          This is a error message!
        </Alert>
      </Snackbar>

      <Container sx={{ my: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
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
