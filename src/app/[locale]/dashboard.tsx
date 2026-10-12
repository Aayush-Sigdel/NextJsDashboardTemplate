"use client";

import { useState } from "react";
import { Avatar, Button, Drawer, Layout, Menu, Typography } from "antd";
import type { MenuProps } from "antd";
import {
  IconChartBar,
  IconFolder,
  IconHome,
  IconLogout,
  IconMenu2,
  IconMoon,
  IconSettings,
  IconSun,
  IconX,
} from "@tabler/icons-react";
import { useLocale, useTranslations } from "next-intl";
import { useThemeMode } from "./antd-theme-provider";
import { signOutAction } from "./(auth)/sign-in/actions";
import "./dashboard.css";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

type Tab = "home" | "analytics" | "projects" | "settings";

export default function Dashboard({ userName }: { userName: string }) {
  const t = useTranslations("Dashboard");
  const tAuth = useTranslations("Auth");
  const locale = useLocale();
  const { mode, toggleMode } = useThemeMode();
  const [tab, setTab] = useState<Tab>("home");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const items: MenuProps["items"] = [
    { key: "home", icon: <IconHome size={19} />, label: t("home") },
    { key: "analytics", icon: <IconChartBar size={19} />, label: t("analytics") },
    { key: "projects", icon: <IconFolder size={19} />, label: t("projects") },
    { key: "settings", icon: <IconSettings size={19} />, label: t("settings") },
  ];

  const sidebar = (mobile = false) => (
    <div className="dashboard-sidebar-inner">
      <div className="dashboard-brand">
        <span className="dashboard-brand-icon">D</span>
        <span className="dashboard-brand-name">Dashboard</span>
      </div>

      <div className="dashboard-nav-label">{t("menu")}</div>
      <Menu
        mode="inline"
        selectedKeys={[tab]}
        items={items}
        onClick={({ key }) => {
          setTab(key as Tab);
          if (mobile) setMobileOpen(false);
        }}
        className="dashboard-menu"
      />

      <div className="dashboard-sidebar-footer">
        <div className="dashboard-user">
          <Avatar className="dashboard-avatar">{userName.slice(0, 1).toUpperCase()}</Avatar>
          <span className="dashboard-user-name">{userName}</span>
        </div>
        <form action={signOutAction}>
          <input type="hidden" name="locale" value={locale} />
          <Button
            type="text"
            htmlType="submit"
            icon={<IconLogout size={18} />}
            className="dashboard-signout"
            aria-label={tAuth("signOut")}
          >
            <span className="dashboard-signout-label">{tAuth("signOut")}</span>
          </Button>
        </form>
      </div>
    </div>
  );

  return (
    <Layout className="dashboard-shell">
      <Sider
        width={240}
        collapsedWidth={72}
        collapsed={collapsed}
        trigger={null}
        className="dashboard-sider"
      >
        {sidebar()}
      </Sider>

      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        placement="left"
        width={260}
        closable={false}
        className="dashboard-drawer"
        styles={{ body: { padding: 0 } }}
      >
        <Button
          type="text"
          icon={<IconX size={20} />}
          aria-label={t("closeMenu")}
          className="dashboard-drawer-close"
          onClick={() => setMobileOpen(false)}
        />
        {sidebar(true)}
      </Drawer>

      <Layout className="dashboard-main-layout">
        <Header className="dashboard-header">
          <div className="dashboard-header-left">
            <Button
              type="text"
              icon={<IconMenu2 size={20} />}
              aria-label={t("toggleMenu")}
              className="dashboard-desktop-toggle"
              onClick={() => setCollapsed(!collapsed)}
            />
            <Button
              type="text"
              icon={<IconMenu2 size={20} />}
              aria-label={t("openMenu")}
              className="dashboard-mobile-toggle"
              onClick={() => setMobileOpen(true)}
            />
            <span>{t(tab)}</span>
          </div>
          <div className="dashboard-header-actions">
            <Button
              type="text"
              icon={mode === "dark" ? <IconSun size={19} /> : <IconMoon size={19} />}
              aria-label={mode === "dark" ? t("switchToLight") : t("switchToDark")}
              title={mode === "dark" ? t("switchToLight") : t("switchToDark")}
              onClick={toggleMode}
              className="dashboard-theme-toggle"
            />
            <Avatar className="dashboard-avatar">{userName.slice(0, 1).toUpperCase()}</Avatar>
          </div>
        </Header>

        <Content className="dashboard-content">
          <Title level={1}>{t(tab)}</Title>
        </Content>
      </Layout>
    </Layout>
  );
}
