import ReactDOM from 'react-dom'
import SampleComponent from './component/SampleComponent'

import './style/app.scss'

const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc rutrum nisl ut ante dignissim, at tempor elit pellentesque. Donec cursus semper arcu semper vestibulum. Morbi et nibh quis nulla mollis vehicula nec luctus nulla. In eleifend rhoncus sagittis. Donec non odio vel neque laoreet aliquet vel quis dui. Duis id metus nisl. Aliquam a est in neque maximus maximus. Maecenas fringilla nibh porta libero eleifend, quis tempus leo auctor. Vestibulum non felis vel nibh laoreet semper vel eu nisi.'

const App = () => (
  <div>
    Hello React
    <SampleComponent text={text} />
  </div>
)

ReactDOM.render(<App />, document.getElementById('root'))
