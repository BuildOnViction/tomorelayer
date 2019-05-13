import React from 'react'
import { Container } from 'component/utility'

export default class Register extends React.Component {

  componentDidMount() {
    console.log('hello register');
  }

  render() {
    return (
      <Container full center>
        Hello register
      </Container>
    )
  }
}
