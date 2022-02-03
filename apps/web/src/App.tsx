import { FC, useEffect, useState } from 'react'
import dapp from './dapp'
import MintForm from "./components/MintForm"
import axios, { AxiosError } from 'axios'
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
  const [me, setMe] = useState("")
  const [tab, setTab] = useState(0)
  const [nfts, setNfts] = useState<Nft[]>()
  const [error, setError] = useState<AxiosError & Error | null>(null)
  const refreshNfts = () => {
    if(nfts === undefined) setNfts([])
    getNfts().then(setNfts)
  }
  if (nfts === undefined) refreshNfts()
  const handleClose = () => setError(null)
  dapp.error.listener = e => {
    console.error(e)
    setError(e)
  }

  useEffect(() => { dapp.signer.getAddress().then(setMe) })

  return (
    <>
      <NavBar />

      <Snackbar open={error != null} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {error?.isAxiosError ? error.response?.data : error?.message}
        </Alert>
      </Snackbar>

      <Container sx={{ my: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div>
          <Tabs value={tab} onChange={(e, v) => setTab(v)} variant="fullWidth">
            <Tab label="Mint" id="mintTab" />
            <Tab label="Submit" id="submitTab" />
          </Tabs>
          <div hidden={tab != 0}><MintForm onSubmit={refreshNfts} /></div>
          <div hidden={tab != 1}>
            <SubmitForm ids={nfts?.filter(nft => nft.owner == me).map(nft => nft.id) || []} onSubmit={refreshNfts}  />
            </div>
        </div>

        <NftList nfts={nfts || []} />

      </Container>
    </>
  )
}

export default App
