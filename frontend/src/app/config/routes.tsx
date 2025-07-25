import { WelcomePage } from "../components/WelcomePage";
import { LoginPage } from "../components/LoginPage";
import { SignupPage } from "../components/SignupPage";
import { MyPage } from "../components/MyPage";
import { AssetPage } from "../components/AssetPage";
import AccountsPage from "../accounts/page";
import { GoalPage } from "../components/GoalPage";

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
  },
  {
    path: "/accounts",
    component: AccountsPage,
    layout: "full"
  },
  {
    path: "/asset",
    component: AssetPage,
    layout: "full"
  },
  {
    path: "/goal",
    component: GoalPage,
    layout: "full"
  },
];