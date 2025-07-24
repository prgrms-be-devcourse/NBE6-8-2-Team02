import { WelcomePage } from "../components/WelcomePage";
import { LoginPage } from "../components/LoginPage";
import { SignupPage } from "../components/SignupPage";
import { MyPage } from "../components/MyPage";

export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  layout?: "auth" | "full";
}

export const routes: RouteConfig[] = [
  {
    path: "/",
    component: WelcomePage,
    layout: "auth"
  },
  {
    path: "/login",
    component: LoginPage,
    layout: "auth"
  },
  {
    path: "/signup",
    component: SignupPage,
    layout: "auth"
  },
  {
    path: "/mypage",
    component: MyPage,
    layout: "full"
  }
];

// 새로운 페이지를 추가하려면 여기에 추가하면 됩니다:
// {
//   path: "/dashboard",
//   component: DashboardPage,
//   layout: "full"
// },
// {
//   path: "/settings",
//   component: SettingsPage,
//   layout: "full"
// }