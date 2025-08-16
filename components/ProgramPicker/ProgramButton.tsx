import { Program } from "@/utils/constants/Programs";
import styles from "./program-picker.module.css";

interface ProgramButtonProps {
  program: Program;
  selectedProgram: Program | undefined;
  handleProgramSelect: (program: Program) => void;
}

export default function ProgramButton({
  program,
  selectedProgram,
  handleProgramSelect,
}: ProgramButtonProps) {
  return (
    <button
      key={program.id}
      className={`${styles.programButton} ${
        selectedProgram?.id === program.id ? styles.selected : ""
      }`}
      onClick={() => handleProgramSelect(program)}
      aria-pressed={selectedProgram?.id === program.id}
    >
      <div className={styles.programCode}>{program.name}</div>
    </button>
  );
}
