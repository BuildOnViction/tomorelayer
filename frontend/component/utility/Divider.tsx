import styled from 'styled-components'

const Divider = styled.hr`
  border: inset 1px ${props => props.color || 'gray'};
  opacity: .2;
  margin: ${props => props.vertical ? '2px 0' : '0 20px'};
`

export default Divider
