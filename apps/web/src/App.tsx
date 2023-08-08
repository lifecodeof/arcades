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
import AddressInfoCard from './components/InfoCard'

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

function messageError(e: Error & AxiosError & any): string {
  if (e?.isAxiosError) return e.response?.data
  if (e?.reason == 'sending a transaction requires a signer')
    return "You must connect a wallet to interact with contract"
  return e?.message
}

const App: FC = () => {
  const [me, setMe] = useState("")
  const [tab, setTab] = useState(0)
  const [nfts, setNfts] = useState<Nft[]>()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const refreshNfts = () => {
    if (nfts === undefined) setNfts([])
    getNfts().then(setNfts)
  }
  if (nfts === undefined) refreshNfts()
  const handleClose = (_e: any, r: any = "") => r != "clickaway" && setErrorMsg(null)

  useEffect(() => {
    dapp.events.on("connect", setMe)

    dapp.events.on("error", e => {
      console.error(e)
      setErrorMsg(messageError(e))
    })
  })
  const getOwnedIds = () => nfts?.filter(nft => nft.owner == me).map(nft => nft.id) || []

  return (
    <>
      <NavBar />

      <Snackbar open={errorMsg != null} onClose={handleClose}>
        <Alert onClose={handleClose as any} severity="error" sx={{ width: '100%' }}>
          {errorMsg}
        </Alert>
      </Snackbar>

      <Container sx={{ my: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: "max-content" }}>
          <Tabs value={tab} onChange={(e, v) => setTab(v)} variant="fullWidth">
            <Tab label="Mint" id="mintTab" />
            <Tab label="Submit" id="submitTab" />
            <Tab label="Recycle" id="recycleTab" />
            <Tab label="Contracts" id="contractsTab" />
          </Tabs>
          <div hidden={tab != 0}><MintForm onSubmit={refreshNfts} /></div>
          <div hidden={tab != 1}><SubmitForm ids={getOwnedIds()} onSubmit={refreshNfts} /></div>
          <div hidden={tab != 2}><RecycleForm ids={getOwnedIds()} onSubmit={refreshNfts} /></div>
          <div hidden={tab != 3}><AddressInfoCard /></div>
        </div>

        <Alert severity="error" className={{ marginTop: "2rem" }}>Backend server is down.</Alert>

        {/* <NftList nfts={nfts || []} /> */}

      </Container>
    </>
  )
}

export default App
