import ProgramButton from "@/components/ProgramPicker/ProgramButton";
import { Program, PROGRAMS } from "@/utils/constants/Programs";
import styles from "./program-picker.module.css";

interface ProgramTypeProps {
  selectedProgram: Program | undefined;
  handleProgramSelect: (program: Program) => void;
  type: "bachelor" | "master1" | "master2";
}

export default function ProgramType({
  selectedProgram,
  handleProgramSelect,
  type,
}: ProgramTypeProps) {
  const typeDisplayName =
    type === "bachelor"
      ? "Bachelor's"
      : type === "master1"
        ? "One-year Master's"
        : "Two-year Master's";
  return (
    <div className={styles.typeContainer}>
      <h3>{typeDisplayName}</h3>
      <div className={styles.buttonGrid}>
        {PROGRAMS.filter((program) => program.type === type).map((program) => (
          <ProgramButton
            program={program}
            selectedProgram={selectedProgram}
            handleProgramSelect={handleProgramSelect}
            key={program.id}
          />
        ))}
      </div>
    </div>
  );
}
