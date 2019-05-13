import React from 'react'
import { connect } from 'redux-zero/react'
import { Container } from 'component/utility'
import ProgressBar from './ProgressBar'


class Register extends React.Component {

  componentDidMount() {
    console.log('hello register');
  }

  render() {
    return (
      <Container center>
        <ProgressBar />
        <div className="register-form--container">
          {this.props.step}
        </div>
      </Container>
    )
  }
}


const mapProps = store => ({
  step: store.RelayerForm.step
})

export default connect(mapProps)(Register)
