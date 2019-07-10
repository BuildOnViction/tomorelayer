import React from 'react'
import { QRCode } from 'react-qr-svg'
import {
  Container,
  Typography,
  Box,
  Grid,
} from '@material-ui/core'
import { CustomLink } from 'component/shared/Adapters'

const PendingLogin = ({ qrcode }) => (
  <Container maxWidth="xs">
    <Grid container direction="column" spacing={3}>
      <Grid item container justify="center">
        <QRCode
          bgColor="#FFFFFF"
          fgColor="#000000"
          level="Q"
          style={{ width: 250, padding: 10, background: 'white' }}
          value={qrcode}
        />
      </Grid>
      <Grid item container justify="center">
        <Typography variant="body1">Scan QR code using TomoWallet to unlock</Typography>
        <Box>
          Haven’t installed TomoWallet yet?
          <CustomLink to="/"> Click here</CustomLink>
        </Box>
      </Grid>
    </Grid>
  </Container>
)


export default class TomoWallet extends React.Component {
  render() {
    const {
      qrCode
    } = this.props

    return (
      <PendingLogin qrcode={qrCode} />
    )
  }
}
