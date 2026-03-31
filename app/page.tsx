import Link from "next/link";
import { registry } from "@/lib/registry";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>Component Lab</h1>
        <p className={styles.subtitle}>A personal playground for UI experiments</p>
      </header>

      <div className={styles.grid}>
        {registry.map((component) => (
          <Link
            key={component.slug}
            href={`/${component.slug}`}
            className={styles.card}
          >
            <div className={styles.cardInner}>
              <h2 className={styles.cardTitle}>
                {component.name}
                {component.sample && <span className={styles.sampleBadge}>sample</span>}
              </h2>
              <p className={styles.cardDesc}>{component.description}</p>
              <div className={styles.tags}>
                {component.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
