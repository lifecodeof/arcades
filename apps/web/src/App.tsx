import { FC, useEffect, useState } from 'react'
import dapp from './dapp'
import axios, { AxiosError } from 'axios'
import { Container, Tabs, Tab, Alert, Snackbar } from '@mui/material'
import NavBar from './components/NavBar'
import NftList from './components/NftList'
import { Nft } from "./meta"
import MintForm from "./components/forms/MintForm"
import SubmitForm from './components/forms/SubmitForm'
import RecycleForm from './components/forms/RecycleForm'

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
    if (nfts === undefined) setNfts([])
    getNfts().then(setNfts)
  }
  if (nfts === undefined) refreshNfts()
  const handleClose = () => setError(null)

  useEffect(() => {
    dapp.events.on("connect", setMe)

    dapp.events.on("error", e => {
      console.error(e)
      setError(e as any)
    })
  })
  const getOwnedIds = () => nfts?.filter(nft => nft.owner == me).map(nft => nft.id) || []

  return (
    <>
      <NavBar />

      <Snackbar open={error != null} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {error?.isAxiosError ? error.response?.data : error?.message}
        </Alert>
      </Snackbar>

      <Container sx={{ my: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: 620 }}>
          <Tabs value={tab} onChange={(e, v) => setTab(v)} variant="fullWidth">
            <Tab label="Mint" id="mintTab" />
            <Tab label="Submit" id="submitTab" />
            <Tab label="Recycle" id="recycleTab" />
          </Tabs>
          <div hidden={tab != 0}><MintForm onSubmit={refreshNfts} /></div>
          <div hidden={tab != 1}><SubmitForm ids={getOwnedIds()} onSubmit={refreshNfts} /></div>
          <div hidden={tab != 2}><RecycleForm ids={getOwnedIds()} onSubmit={refreshNfts} /></div>
        </div>

        <NftList nfts={nfts || []} />

      </Container>
    </>
  )
}

export default App
