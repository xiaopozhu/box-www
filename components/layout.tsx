import { Inter } from "next/font/google";
import { Avatar } from "antd";
import { AntDesignOutlined } from "@ant-design/icons";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

import styles from "@/styles/layout.module.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${styles.container} ${inter.className}`}>
      <header className={styles.menu}>
        <div className={styles.avatarContainer}>
          <Avatar size={120} icon={<AntDesignOutlined />} />
        </div>
        <h1 className={styles.menuTitle}>你好，游客</h1>

        <nav className={styles.menuNav}>
          <ul>
            <li>
              <Link href="/mybox">我的工具箱</Link>
            </li>
            <li>
              <Link href="/mybox">字符编解码</Link>
            </li>
            <li>
              <Link href="/mybox">对称加解密</Link>
            </li>
            <li>
              <Link href="/mybox">Hash摘要</Link>
            </li>
            <li>
              <Link href="/mybox">PKI/CA/x509</Link>
            </li>
            <li>
              <Link href="/mybox">其它密码技术</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main className={styles.content}>{children}</main>
    </div>
  );
}
