"use client";
import styles from "./page.module.css";
import ProgramPicker from "@/components/ProgramPicker/ProgramPicker";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.welcomeContainer}>
        <h1 className={styles.welcomeTitle}>Better Kronox</h1>
        <p className={styles.welcomeDescription}>
          Select a program to view its schedule
        </p>
        <ProgramPicker />
      </div>
    </main>
  );
}
