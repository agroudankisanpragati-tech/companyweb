import Link from 'next/link';
import { ReactNode } from 'react';
import styles from './FarmerDashboardOverview.module.css';

type DashboardStat = {
  label: string;
  value: string;
  hint: string;
};

type DashboardLink = {
  title: string;
  description: string;
  href: string;
  icon: ReactNode;
  background: string;
};

export default function FarmerDashboardOverview({
  stats,
  links,
}: {
  stats: DashboardStat[];
  links: DashboardLink[];
}) {
  return (
    <section className={`${styles.wrapper} p-6 md:p-8`}>
      <div className="relative z-10 space-y-6">
        <div className="space-y-3">
          <div className={styles.eyebrow}>Farmer workspace</div>
          <div className="space-y-2">
            <h2 className={styles.title}>Everything you need to manage the farm, in one place.</h2>
            <p className={styles.subtitle}>
              Track daily work, check weather, review recommendations, and jump to the most useful tools without hunting through menus.
            </p>
          </div>
        </div>

        <div className={styles.statsGrid}>
          {stats.map((stat) => (
            <div key={stat.label} className={styles.statCard}>
              <div className={styles.statLabel}>{stat.label}</div>
              <div className={styles.statValue}>{stat.value}</div>
              <div className={styles.statHint}>{stat.hint}</div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <h3 className={styles.sectionTitle}>Quick access</h3>
          <div className={styles.linksGrid}>
            {links.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className={styles.linkCard}
                style={{ backgroundImage: link.background }}
              >
                <div className={styles.linkIcon}>{link.icon}</div>
                <div>
                  <div className={styles.linkTitle}>{link.title}</div>
                  <div className={styles.linkDescription}>{link.description}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}