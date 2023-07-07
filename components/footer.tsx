import styles from "@/styles/footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footerContainer}>
      <div>Copyright © deepzz0 CryptoBox.</div>
      <div>
        <a
          href="https://status.deepzz.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Status Page
        </a>
        <a
          href="https://github.com/deepzz0/cryptobox"
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginLeft: "2rem" }}
        >
          开放文档
        </a>
        <a
          href="https://github.com/deepzz0/cryptobox"
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginLeft: "2rem" }}
        >
          GitHub
        </a>
        <a
          href="mailto: me@deepzz.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginLeft: "2rem" }}
        >
          联系我们
        </a>
      </div>
    </footer>
  );
}
