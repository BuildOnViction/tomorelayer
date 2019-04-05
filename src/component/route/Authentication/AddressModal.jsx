import React from 'react'
import { connect } from 'redux-zero/react'
import { Dialog, Radio, Button, IconButton, Icon, Slide } from '@material-ui/core'
import { Container, Grid } from 'component/utility'
import { getBalance } from 'service/blockchain'
import tomo from 'asset/tomo-logo.png'
import { $confirmAddress, $changeHDWalletAddress, $toggleModal } from './actions'

const Transition = props => <Slide direction="up" {...props} />

class AddressModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      balance: {}
    }
  }

  tempBalance = {}

  componentDidUpdate() {
    const { wallet } = this.props

    if (!wallet || !wallet.otherAddresses) return
    if (Object.keys(this.state.balance).length === wallet.otherAddresses.length) return

    wallet.otherAddresses.forEach(async addr => {
      this.tempBalance[addr] = await getBalance(addr)
      if (Object.keys(this.tempBalance).length === wallet.otherAddresses.length) {
        this.setState({ balance: this.tempBalance })
      }
    })
  }

  render() {
    const {
      isOpen,
      address,
      wallet,
      $confirmAddress,
      $changeHDWalletAddress,
      $toggleModal,
    } = this.props

    const {
      balance,
    } = this.state

    const selectAddress = address => () => $changeHDWalletAddress({ address, balance: balance[address] })
    const addresses = (wallet && wallet.otherAddresses) || []

    return (
      <Dialog fullScreen open={isOpen} TransitionComponent={Transition}>
        <Container full className="p-0 address-container">
          <Grid className="m-0 align-center justify-space-between p-1 address-container__header">
            <div className="text-bold font-4">
              <span>
                <IconButton onClick={$toggleModal}>
                  <Icon className="text-white">clear</Icon>
                </IconButton>
              </span>
              <span className="ml-1 vertical-middle">
                Select Address
              </span>
            </div>
            <Button variant="contained" color="secondary" onClick={$confirmAddress} disabled={address ===  ''}>
              Confirm
            </Button>
          </Grid>
          <Grid className="direction-column address-container__body p-1">
            <Container>
              {addresses.map(addr => (
                <Grid className="align-center m-0 pointer address-info justify-space-between" key={addr} onClick={selectAddress(addr)}>
                  <div className="address-info__address">
                    <Radio
                      checked={addr === address}
                      name={`address-${addr}`}
                      aria-label={addr}
                    />
                    <div className="inline hidden-xs hidden-xxs text-alert mr-1">
                      Address:
                    </div>
                    <div className="inline">
                      {addr}
                    </div>
                  </div>
                  <div className="address-info__balance">
                    <div className="inline hidden-xs hidden-xxs text-alert mr-1">
                      Balance:{' '}
                    </div>
                    <div className="inline">
                      {balance[addr]}
                    </div>
                  </div>
                  <div className="address-info__currency mr-1 hidden-xxs">
                    <img alt="TOMO" src={tomo} width="30" />
                  </div>
                </Grid>
              ))}
            </Container>
          </Grid>
        </Container>
      </Dialog>
    )
  }
}

const mapProps = ({ toggle, authStore }) => ({
  method: authStore.method,
  isOpen: toggle.AddressModal,
  wallet: authStore.user_meta.wallet,
  address: authStore.user_meta.address,
})

export default connect(mapProps, {
  $confirmAddress,
  $changeHDWalletAddress,
  $toggleModal,
})(AddressModal)
