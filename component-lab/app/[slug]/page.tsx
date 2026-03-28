import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { registry } from "@/lib/registry";
import styles from "./page.module.css";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return registry.map((c) => ({ slug: c.slug }));
}

export default function DemoPage({ params }: Props) {
  const meta = registry.find((c) => c.slug === params.slug);
  if (!meta) notFound();

  const Demo = dynamic(() => import(`@/components/${meta.slug}/demo`));

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.back}>← Gallery</Link>
      </nav>

      <header className={styles.header}>
        {meta.sample && <span className={styles.sampleBadge}>sample — not my code</span>}
        <h1 className={styles.title}>{meta.name}</h1>
        <p className={styles.desc}>{meta.description}</p>
        <div className={styles.tags}>
          {meta.tags.map((tag) => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
      </header>

      <section className={styles.stage}>
        <Demo />
      </section>
    </div>
  );
}
