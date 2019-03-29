import React from 'react'
import { ethers } from 'ethers'
import { Dialog, Radio, Button, IconButton, Icon, Slide } from '@material-ui/core'
import { Container, Grid } from 'component/utility'
import tomo from 'asset/tomo-logo.png'


const Transition = props => <Slide direction="up" {...props} />

export default class ModalWalletAddressList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tempAddress: '',
      balance: {}
    }
  }

  tempBalance = {}

  componentDidUpdate() {
    const { addresses } = this.props

    if (addresses.length === 0) return
    if (addresses.length === Object.keys(this.tempBalance).length) return

    const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_RPC)
    this.props.addresses.forEach(async addr => {
      const weiBalance = await provider.getBalance(addr)
      const ethBalance = ethers.utils.formatEther(weiBalance, {commify: true, pad: true})
      this.tempBalance[addr] = ethBalance
      if (Object.keys(this.tempBalance).length === addresses.length) {
        this.setState({ balance: this.tempBalance })
      }
    })
  }

  changeTempAddress = tempAddress => () => this.setState({ tempAddress })

  render() {
    const {
      isOpen,
      closeModal,
      addresses,
    } = this.props

    const {
      tempAddress,
      balance,
    } = this.state

    return (
      <Dialog fullScreen open={isOpen} TransitionComponent={Transition}>
        <Container full className="p-0 address-container">
          <Grid className="m-0 align-center justify-space-between p-1 address-container__header">
            <div className="text-bold font-4">
              <span>
                <IconButton onClick={closeModal()}>
                  <Icon className="text-white">clear</Icon>
                </IconButton>
              </span>
              <span className="ml-1 vertical-middle">
                Select Address
              </span>
            </div>
            <Button variant="contained" color="secondary" onClick={closeModal(tempAddress)} disabled={tempAddress ===  ''}>
              Confirm
            </Button>
          </Grid>
          <Grid className="direction-column address-container__body p-1">
            <Container>
              {addresses.map(addr => (
                <Grid className="align-center m-0 pointer address-info justify-space-between" key={addr} onClick={this.changeTempAddress(addr)}>
                  <div className="address-info__address">
                    <Radio
                      checked={addr === tempAddress}
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
