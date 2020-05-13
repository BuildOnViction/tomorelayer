import React from 'react'
import {
  Box,
  Container,
  Grid,
  Link,
} from '@material-ui/core'

const FooterLinks = [
  {
    text: 'Privacy Policy',
    link: 'https://docs.tomochain.com/legal/privacy',
  },
  {
    text: 'Terms of Use',
    link: 'https://docs.tomochain.com/legal/terms-of-use',
  }
]

const FooterButtons = [
  {
    className: 'tomorelayer-icon-facebook',
    link: 'https://www.facebook.com/tomochainofficial',
  },
  {
    className: 'tomorelayer-icon-twitter',
    link: 'https://twitter.com/TomoChainANN',
  },
  {
    className: 'tomorelayer-icon-telegram',
    link: 'https://t.me/tomochain',
  },
  {
    className: 'tomorelayer-icon-github',
    link: 'https://github.com/tomochain/',
  },
  {
    className: 'tomorelayer-icon-linkedin',
    link: 'https://www.linkedin.com/company/tomochain',
  },
  {
    className: 'tomorelayer-icon-reddit',
    link: 'https://www.reddit.com/r/Tomochain/',
  },
]

const PageFooter = () => (
  <Container>
    <Grid container>
      <Grid item sm={12} md={6}>
        <Box>
          TomoRelayer v1.0.0
        </Box>
        <Box className="footer-links">
          {FooterLinks.map(item => (
            <Link href={item.link} underline="none" rel="noopener noreferrer" target="_blank" key="item.link">
              {item.text}
            </Link>
          ))}
        </Box>
      </Grid>
      <Grid item sm={12} md={6}>
        <ul className="footer-buttons">
          {FooterButtons.map(item => (
            <li key={item.link}>
              <Link href={item.link} underline="none" rel="noopener noreferrer" target="_blank">
                <i className={item.className} />
              </Link>
            </li>
          ))}
        </ul>
      </Grid>
    </Grid>
  </Container>
)

export default PageFooter
