import React from 'react'
import {
  Button,
  Grid,
  Typography,
} from '@material-ui/core'


export const TransferNotice = ({ confirm }) => (
  <Grid container>
    <Grid item sm={12} md={10} container spacing={5}>
      <Grid item sm={12}>
        <Typography variant="h6">
          What you need to know about Relayer-Transfer
        </Typography>
      </Grid>
      <Grid item sm={12} md={4}>
        <img alt="" src="https://picsum.photos/300/300" width="100%" />
      </Grid>
      <Grid item sm={12} md={8}>
        It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
      </Grid>
      <Grid item sm={12} container justify="center" className="mt-3">
        <Button onClick={confirm} color="primary" variant="contained">
          Yes, I understand
        </Button>
      </Grid>
    </Grid>
  </Grid>
)


export const ResignNotice = ({ confirm }) => (
  <Grid container>
    <Grid item sm={12} md={10} container spacing={5}>
      <Grid item sm={12}>
        <Typography variant="h6">
          What you need to know about Relayer-Resign
        </Typography>
      </Grid>
      <Grid item sm={12} md={4}>
        <img alt="" src="https://picsum.photos/300/300" width="100%" />
      </Grid>
      <Grid item sm={12} md={8}>
        It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
      </Grid>
      <Grid item sm={12} container justify="center" className="mt-3">
        <Button onClick={confirm} color="primary" variant="contained">
          Yes, I understand
        </Button>
      </Grid>
    </Grid>
  </Grid>
)
