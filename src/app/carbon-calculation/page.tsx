import styles from "../page.module.css";
import CarbonCalculator from "./_components/CarbonCalculator";

export default async function Page() {
  return (
    <div className={styles.page}>
      <CarbonCalculator />
    </div>
  );
}
