import styles from "../page.module.css";
import CarbonCalculator from "./_components/carbon-calculator";

export default async function Page() {
  return (
    <div className={styles.page}>
      <CarbonCalculator />
    </div>
  );
}
