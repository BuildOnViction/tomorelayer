import React from 'react'
import {
  Container,
  Grid,
  Link,
  Box,
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
const FooterButtons = [
  {
    class: 'tomorelayer-icon-facebook',
    link: 'https://www.facebook.com/tomochainofficial',
  },
  {
    class: 'tomorelayer-icon-twitter',
    link: 'https://twitter.com/TomoChainANN',
  },
  {
    class: 'tomorelayer-icon-telegram',
    link: 'https://t.me/tomochain',
  },
  {
    class: 'tomorelayer-icon-github',
    link: 'https://github.com/tomochain/',
  },
  {
    class: 'tomorelayer-icon-linkedin',
    link: 'https://www.linkedin.com/company/tomochain',
  },
  {
    class: 'tomorelayer-icon-reddit',
    link: 'https://www.reddit.com/r/Tomochain/',
  },
]

const PageFooter = props => (
  <Container>
    <Grid container>
      <Grid item sm={12} md={6}>
        <Box>
          Tomorelayer 2019 - v1.0.0 - designed by TomoDesign
        </Box>
        <Box className="footer-links">
          {FooterLinks.map(item => (
            <Link to={item.link} key={item.link} component={AdapterLink}>
              {item.text}
            </Link>
          ))}
        </Box>
      </Grid>
      <Grid item sm={12} md={6}>
        <ul className="footer-buttons">
          {FooterButtons.map(item => (
            <li>
              <Link to={item.link} key={item.link} component={AdapterLink}>
                <i class={item.class}></i>
              </Link>
            </li>
          ))}
        </ul>
      </Grid>
    </Grid>
  </Container>
)

export default PageFooter
