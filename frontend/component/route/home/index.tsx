import { Component } from 'react'

const Stuff = () => (
  <div>
    <p>
      yolo
    </p>
  </div>
)

export default class Home extends Component {
  render() {
    return (
      <div>
        Home
        <hr />
        <Stuff />
      </div>
    )
  }
}
