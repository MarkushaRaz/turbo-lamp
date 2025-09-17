import { WindowRoute } from '_shared/enums';

export const DashboardComponentRoute = {
  Library: WindowRoute.DashboardWindow,
  Settings: `${WindowRoute.DashboardWindow}/settings`,
  Help: `${WindowRoute.DashboardWindow}/help`,
  About: `${WindowRoute.DashboardWindow}/about`,
};
