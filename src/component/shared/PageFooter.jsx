import React from 'react'
import {
  Container,
  Grid,
  Link,
} from '@material-ui/core'
import { AdapterLink } from 'component/shared/Adapters'

const FooterLinks = [
  {
    text: 'Need helps?',
    link: '/help',
  },
  {
    text: 'Privacy Policy',
    link: '/policy',
  },
  {
    text: 'Term of services',
    link: '/terms-and-services',
  },
  {
    text: 'API Documents',
    link: '/documents',
  },
]

const PageFooter = props => (
  <Container>
    <Grid container {...props}>
      <Grid item sm={12} md={6} container>
        <Grid item sm={12}>
          Tomorelayer 2019 - v1.0.0 - designed by TomoDesign
        </Grid>
        <Grid item sm={12} className="footer-links">
          {FooterLinks.map(item => (
            <Link to={item.link} key={item.link} component={AdapterLink}>
              {item.text}
            </Link>
          ))}
        </Grid>
      </Grid>
      <Grid item sm={12} md={6}>
        <ul className="footer-buttons">
          <li>facebook</li>
          <li>twitter</li>
          <li>telegram</li>
          <li>github</li>
          <li>linkedin</li>
          <li>mail</li>
        </ul>
      </Grid>
    </Grid>
  </Container>
)

export default PageFooter
