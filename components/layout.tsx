import { Inter } from "next/font/google";
import { Avatar, message } from "antd";
import {
  LogoutOutlined,
  SettingOutlined,
  LoginOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

import styles from "@/styles/layout.module.css";
import Footer from "./footer";
import { useEffect, useState } from "react";
import { request } from "@/utils/request";
import { ipInfo } from "@/model/model";
import Login from "./login";

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
  const [ipInfo, setIPInfo] = useState<ipInfo>();
  const [showLogin, setShowLogin] = useState(false);

  const router = useRouter();

  useEffect(() => {
    request("/api/v1/other/geoip", {
      method: "POST",
      body: JSON.stringify({}),
    })
      .then((resp) => {
        if (resp.code !== 0) {
          message.error(resp.error);
          return;
        }
        setIPInfo(resp.data);
      })
      .catch((err) => {
        console.log(`${err}`);
      });
  }, []);

  const handleLogout = () => {
    request("/api/v1/user/logout").then((resp) => {
      if (resp.code === 0) {
        router.reload();
      }
    });
  };

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
            <small style={{ color: "#898c8c" }}>
              <GlobalOutlined />
              {ipInfo && ` ${ipInfo.country}·${ipInfo.state}·${ipInfo.city}`}
            </small>

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
                  <div
                    onClick={handleLogout}
                    style={{ color: "red", cursor: "pointer" }}
                  >
                    <LogoutOutlined style={{ marginRight: "4px" }} />
                    退出登录
                  </div>
                </li>
              </>
            ) : (
              <li>
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowLogin(true)}
                >
                  <LoginOutlined style={{ marginRight: "4px" }} />
                  注册/登录
                </div>
              </li>
            )}
          </ul>
        </header>
        <main className={styles.content}>{props.children}</main>
      </div>
      <Footer />
      <Login show={showLogin} setShow={setShowLogin} />
    </div>
  );
}
