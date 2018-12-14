import EmojiAtlassianIcon from '@atlaskit/icon/glyph/emoji/atlassian'
import {
  GlobalItem,
  LayoutManager,
  NavigationProvider,
} from '@atlaskit/navigation-next'
import AppSwitcherIcon from '@atlaskit/icon/glyph/app-switcher'

import GlobalNavigation from '@atlaskit/global-navigation'

const AppSwitcherComponent = props => (
  <GlobalItem
    {...props}
    icon={AppSwitcherIcon}
    onClick={() => console.log('AppSwitcher clicked')}
  />
)

// TODO: make onClicks targets show up on page instead of console.logs
const Global = () => (
  <GlobalNavigation
    productIcon={EmojiAtlassianIcon}
    productHref="#"
    onProductClick={() => console.log('product clicked')}
    onCreateClick={() => console.log('create clicked')}
    onSearchClick={() => console.log('search clicked')}
    onStarredClick={() => console.log('your work clicked')}
    onNotificationClick={() => console.log('notification clicked')}
    appSwitcherComponent={AppSwitcherComponent}
    appSwitcherTooltip="Switch to ..."
    helpItems={() => <div />}
    loginHref="#login"
  />
)

export default ({ children }) => (
  <NavigationProvider>
    <LayoutManager
      globalNavigation={Global}
      productNavigation={() => null}
      containerNavigation={() => null}
    >
      {children}
    </LayoutManager>
  </NavigationProvider>
)
