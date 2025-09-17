import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import SettingsIcon from '@mui/icons-material/Settings';
// import HelpIcon from '@mui/icons-material/Help';
import InfoIcon from '@mui/icons-material/Info';
import { i18n } from '_renderer/localization';
import { DashboardComponentRoute } from './dashboard-component-route';
import { DrawerItem } from '../types';

export const drawerItems: DrawerItem[] = [
  {
    route: DashboardComponentRoute.Library,
    text: i18n.t<string>('window.dashboard.library.drawerTitle'),
    icon: VideoLibraryIcon,
  },
  {
    route: DashboardComponentRoute.Settings,
    text: i18n.t<string>('window.dashboard.settings.drawerTitle'),
    icon: SettingsIcon,
  },
  // { route: DashboardComponentRoute.Help, text: i18n.t<string>('window.dashboard.help.drawerTitle'), icon: HelpIcon },
  { route: DashboardComponentRoute.About, text: i18n.t<string>('window.dashboard.about.drawerTitle'), icon: InfoIcon },
];
