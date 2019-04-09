import React from 'react'
import { connect } from 'redux-zero/react'
import { Grid, Container } from 'component/utility'
import { UNLOCK_WALLET_METHODS } from 'service/constant'
import * as blk from 'service/blockchain'
import { $getUnlocked, $confirmAddress } from '../actions'


const BrowserWallet = ({
  address,
  balance,
  unlockingMethod,
  $getUnlocked,
  $confirmAddress,
}) => (
  <div>
    {blk.validateAddress(address, balance) && unlockingMethod === UNLOCK_WALLET_METHODS.BrowserWallet ? (
       <Container padded>
         <Grid className="justify-space-between">
           <Grid className="justify-start direction-column m-0 mr-1">
             <div>
               <span className="text-bold mr-1">
                 Address:
               </span>
               <span>
                 {address}
               </span>
             </div>
             <div>
               <span>
                 <span className="text-bold mr-1">
                   Balance:
                 </span>
                 <span className="text-alert mr-1">
                   {balance}
                 </span>
               </span>
               <span className="text-bold">
                 TOMO
               </span>
             </div>
           </Grid>
           <button onClick={$confirmAddress} className="btn btn-unlock">
             Use this Wallet!
           </button>
         </Grid>
       </Container>
    ) : (
       <div>
         <h3>Please install & login Metamask Extension then connect it to Tomochain Mainnet or Testnet.</h3>
         <button onClick={$getUnlocked} className="btn btn-unlock">
           Unlock Wallet
         </button>
       </div>
    )}
  </div>
)

const mapProps = store => ({
  address: store.authStore.user_meta.address,
  balance: store.authStore.user_meta.balance,
  unlockingMethod: store.authStore.user_meta.unlockingMethod,
})

const actions = store => ({
  $confirmAddress,
  $getUnlocked: state => $getUnlocked(state, store),
})

export default connect(mapProps, actions)(BrowserWallet)
