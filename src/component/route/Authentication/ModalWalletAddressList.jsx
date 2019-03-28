import React from 'react'
import { Dialog, Radio, Button, Slide } from '@material-ui/core';
import { Container, Grid } from 'component/utility'
import tomo from 'asset/tomo-logo.png'

const getBalance = add => {
  // TODO: get real balance from each addresses
  return 10
}

const Transition = props => <Slide direction="up" {...props} />

export default class ModalWalletAddressList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tempAddress: ''
    }
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
    } = this.state

    return (
      <Dialog fullScreen open={isOpen} TransitionComponent={Transition}>
        <Container full className="p-0 address-container">
          <Grid className="m-0 align-center justify-space-between p-1 address-container__header">
            <div className="text-bold font-4">Select Address</div>
            <Button variant="contained" color="primary" onClick={closeModal(tempAddress)} disabled={tempAddress ===  ''}>
              Confirm
            </Button>
          </Grid>
          <Grid className="direction-column address-container__body m-0 p-1">
            {addresses.map(addr => (
              <Grid className="align-center m-0 pointer address-info" key={addr} onClick={this.changeTempAddress(addr)}>
                <Radio
                  checked={addr === tempAddress}
                  name={`address-${addr}`}
                  aria-label={addr}
                />
                <div className="address-info__address text-bold">
                  {addr}
                </div>
                <div className="address-info__balance text-alert">
                  {getBalance(addr)}
                </div>
                <div className="address-info__currency">
                  <img alt="TOMO" src={tomo} width="30" />
                </div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Dialog>
    )
  }
}
