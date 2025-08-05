'use client';

import { WelcomePage } from "@/app/components/WelcomePage";
import { LoginPage } from "@/app/auth/login/page";
import { SignupPage } from "@/app/auth/signup/page";
import { ForgotPasswordPage } from "@/app/auth/forgot-password/page";
import { MyPage } from "@/app/mypage/page";
import { ProfilePage } from "@/app/mypage/profile/page";
import { AssetPage } from "@/app/mypage/assets/page";
import { AssetDetailPage } from "@/app/mypage/assets/AssetDetailPage";
import { AccountsPage }  from "@/app/mypage/accounts/page";
import { GoalPage } from "@/app/mypage/goals/page";

export interface RouteConfig {  
  path: string;
  component: React.ComponentType;
  layout?: "auth" | "full";
}

export const routes: RouteConfig[] = [
  {
    path: "/",
    component: WelcomePage,
    layout: "auth",
  },
  {
    path: "/auth/login",
    component: LoginPage,
    layout: "auth",
  },
  {
    path: "/auth/signup",
    component: SignupPage,
    layout: "auth",
  },
  {
    path: "/auth/forgot-password",
    component: ForgotPasswordPage,
    layout: "auth",
  },
  {
    path: "/mypage",
    component: MyPage,
    layout: "full"
  },
  {
    path: "/mypage/profile",
    component: ProfilePage,
    layout: "full"
  },
  {
    path: "/mypage/goals",
    component: GoalPage,
    layout: "full",
  },
  {
    path: "/mypage/accounts",
    component: AccountsPage,
    layout: "full",
  },
  {
    path: "/mypage/assets",
    component: AssetPage,
    layout: "full",
  },
  {
    path: "/mypage/assets/:id",
    component: AssetDetailPage,
    layout: "full"
  }
];
