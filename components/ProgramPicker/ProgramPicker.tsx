"use client";
import { useRouter } from "next/navigation";
import { Program } from "@/utils/constants/Programs";
import styles from "./program-picker.module.css";
import ProgramType from "@/components/ProgramPicker/ProgramType";

interface ProgramPickerProps {
  selectedProgram?: Program;
  onProgramSelect?: (program: Program) => void;
}

export default function ProgramPicker({
  selectedProgram,
  onProgramSelect,
}: ProgramPickerProps) {
  const router = useRouter();

  const handleProgramSelect = (program: Program) => {
    router.push(`/${program.id}`);

    if (onProgramSelect) {
      onProgramSelect(program);
    }
  };

  return (
    <div className={styles.programPicker}>
      <div className={styles.programsContainer}>
        <ProgramType
          type="bachelor"
          selectedProgram={selectedProgram}
          handleProgramSelect={handleProgramSelect}
        />
        <ProgramType
          type="master1"
          selectedProgram={selectedProgram}
          handleProgramSelect={handleProgramSelect}
        />
        <ProgramType
          type="master2"
          selectedProgram={selectedProgram}
          handleProgramSelect={handleProgramSelect}
        />
      </div>
    </div>
  );
}
