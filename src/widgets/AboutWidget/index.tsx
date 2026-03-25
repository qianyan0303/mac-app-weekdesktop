import styles from './style.module.css';

export function AboutWidget() {
  return (
    <div className={styles.about}>
      <div className={styles.header}>
        <div className={styles.icon}>📅</div>
        <h1 className={styles.title}>WeekDesktop</h1>
        <p className={styles.version}>版本 0.1.0</p>
      </div>

      <div className={styles.divider} />

      <div className={styles.info}>
        <div className={styles.infoItem}>
          <span className={styles.label}>开发者</span>
          <span className={styles.value}>qianyan0303</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>技术栈</span>
          <span className={styles.value}>Tauri + React</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>平台</span>
          <span className={styles.value}>macOS</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>许可证</span>
          <span className={styles.value}>MIT</span>
        </div>
      </div>

      <div className={styles.divider} />

      <p className={styles.description}>
        一款简洁优雅的 macOS 桌面小部件，
        <br />
        实时展示日期信息和年度进度。
      </p>

      <div className={styles.footer}>
        <a
          href="https://github.com/qianyan0303/mac-app-weekdesktop"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          🌐 GitHub
        </a>
      </div>
    </div>
  );
}
