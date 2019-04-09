import React from 'react'
import { Container } from 'component/utility'
import Menu from './Menu'
import RelayerFormModal from './RelayerFormModal'

const Main = () => (
  <React.Fragment>
    <Menu />
    <Container>
      body
    </Container>
    <RelayerFormModal />
  </React.Fragment>
)

export default Main
