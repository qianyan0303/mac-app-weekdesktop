import { useDateInfo } from '../../hooks/useDateInfo';
import styles from './style.module.css';

function getDayOfYear(year: number): number {
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  return isLeap ? 366 : 365;
}

export function WeekWidget() {
  const info = useDateInfo();
  const totalDays = getDayOfYear(info.year);
  const progress = Math.round((info.dayOfYear / totalDays) * 100);

  return (
    <div className={styles.widget}>

      {/* 日期行 */}
      <div className={styles.dateRow}>
        <span className={styles.dateText}>{info.date}</span>
        <span className={styles.weekdayBadge}>{info.weekday}</span>
      </div>

      {/* 三格数据 */}
      <div className={styles.grid}>
        <div className={styles.cell} style={{ animationDelay: '0.05s' }}>
          <span className={styles.value}>{info.weekOfYear}</span>
          <span className={styles.unitLabel}><span className={styles.unit}>W</span> 本年第几周</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.cell} style={{ animationDelay: '0.1s' }}>
          <span className={styles.value}>{info.dayOfYear}</span>
          <span className={styles.unitLabel}><span className={styles.unit}>D</span> 本年第几天</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.cell} style={{ animationDelay: '0.15s' }}>
          <span className={styles.value}>{info.weekOfMonth}</span>
          <span className={styles.unitLabel}><span className={styles.unit}>W</span> 本月第几周</span>
        </div>
      </div>

      {/* 年度进度条 */}
      <div className={styles.progressSection}>
        <div className={styles.progressHeader}>
          <span className={styles.progressLabel}>{info.year} 年度进度</span>
          <span className={styles.progressPct}>{progress}%</span>
        </div>
        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 距年底剩余 */}
      <div className={styles.remaining}>
        <div className={styles.remainingItem}>
          <span className={styles.remainingValue}>{info.daysLeftInYear}</span>
          <span className={styles.remainingUnit}>天</span>
          <span className={styles.remainingLabel}>距年底</span>
        </div>
        <div className={styles.remainingDot} />
        <div className={styles.remainingItem}>
          <span className={styles.remainingValue}>{info.weeksLeftInYear}</span>
          <span className={styles.remainingUnit}>周</span>
          <span className={styles.remainingLabel}>距年底</span>
        </div>
      </div>

    </div>
  );
}
