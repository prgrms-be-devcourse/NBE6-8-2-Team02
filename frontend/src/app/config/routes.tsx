import { WelcomePage } from "../components/WelcomePage";
import { LoginPage } from "../components/LoginPage";
import { SignupPage } from "../components/SignupPage";
import { AccountRecoveryPage } from "../components/AccountRecoveryPage";
import { MyPage } from "../components/MyPage";
import { AssetPage } from "../components/AssetPage";
import { AssetDetailPage } from "../components/AssetDetailPage";
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
    path: "/forgot-password",
    component: AccountRecoveryPage,
    layout: "auth"
  },
  {
    path: "/mypage",
    component: MyPage,
    layout: "full"
  },
  {
    path: "/mypage/assets",
    component: AssetPage,
    layout: "full"
  },
  {
    path: "/accounts",
    component: AccountsPage,
    layout: "full"
  },
  {
    path: "/mypage/assets",
    component: AssetPage,
    layout: "full"
  },
  {
    path: "/mypage/assets/:id",
    component: AssetDetailPage,
    layout: "full"
  },
    path: "/goals",
    component: GoalPage,
    layout: "full"
  },
];