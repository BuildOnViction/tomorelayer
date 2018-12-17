import EmojiAtlassianIcon from '@atlaskit/icon/glyph/emoji/atlassian'
import {
  GlobalItem,
  LayoutManager,
  NavigationProvider,
} from '@atlaskit/navigation-next'
import AppSwitcherIcon from '@atlaskit/icon/glyph/app-switcher'
import GlobalNavigation from '@atlaskit/global-navigation'

const handler = text => () => window.alert(text)

const AppSwitcherComponent = props => (
  <GlobalItem
    {...props}
    icon={AppSwitcherIcon}
    onClick={handler('App switch..')}
  />
)

// TODO: make onClicks targets show up on page instead of console.logs
const Global = () => (
  <GlobalNavigation
    productIcon={EmojiAtlassianIcon}
    productHref="#"
    onProductClick={handler('product clicked')}
    onCreateClick={handler('Create project')}
    onSearchClick={handler('Search...')}
    onStarredClick={handler('Starring...')}
    onNotificationClick={handler('Notification')}
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
