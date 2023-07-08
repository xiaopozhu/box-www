import { Inter } from "next/font/google";
import { Avatar } from "antd";
import {
  LogoutOutlined,
  SettingOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

import styles from "@/styles/layout.module.css";
import Footer from "./footer";

const navMenu = [
  {
    href: "/#mybox",
    text: "我的工具箱",
  },
  {
    href: "/#codec",
    text: "字符编解码",
  },
  {
    href: "/#crypto",
    text: "对称加解密",
  },
  {
    href: "/#pkica",
    text: "PKI / CA / x509",
  },
  {
    href: "/#other",
    text: "实验小工具",
  },
];

interface Props {
  children: React.ReactNode;
  profile: any;
}

export default function Layout(props: Props) {
  const { profile } = props;
  return (
    <div
      style={{ maxWidth: "1440px", margin: "0 auto" }}
      className={inter.className}
    >
      <div className={styles.container}>
        <header className={styles.menu}>
          <div>
            <Link href="/">
              <div className={styles.avatarContainer}>
                <Avatar size={130} src={profile?.avatar || "/avatar.png"} />
              </div>
            </Link>
            <h1 className={styles.menuTitle}>你好，游客</h1>

            <nav className={styles.menuNav}>
              <ul>
                {navMenu.map((item) => {
                  return (
                    <li key={item.href}>
                      <Link href={item.href}>{item.text}</Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
          <ul>
            {profile ? (
              <>
                <li>
                  <Link href="/settings">
                    <SettingOutlined style={{ marginRight: "4px" }} />
                    个人设置
                  </Link>
                </li>
                <li>
                  <Link href="/logout" style={{ color: "red" }}>
                    <LogoutOutlined style={{ marginRight: "4px" }} />
                    退出登录
                  </Link>
                </li>
              </>
            ) : (
              <li>
                <Link href="/login">
                  <LoginOutlined style={{ marginRight: "4px" }} />
                  注册/登录
                </Link>
              </li>
            )}
          </ul>
        </header>
        <main className={styles.content}>{props.children}</main>
      </div>
      <Footer />
    </div>
  );
}
