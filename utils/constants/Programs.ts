export interface Program {
  id: string;
  name: string;
  displayName: string;
  type: "bachelor" | "master1" | "master2";
}

export const PROGRAMS: Program[] = [
  {
    id: "tgide25h",
    name: "Year 1",
    displayName: "Interaction Design - Year 1",
    type: "bachelor",
  },
  {
    id: "tgide24h",
    name: "Year 2",
    displayName: "Interaction Design - Year 2",
    type: "bachelor",
  },
  {
    id: "tgide23h",
    name: "Year 3",
    displayName: "Interaction Design - Year 3",
    type: "bachelor",
  },
  {
    id: "taind25h",
    name: "Year 1",
    displayName: "Interaction Design - Year 1",
    type: "master2",
  },
  {
    id: "taind24h",
    name: "Year 2",
    displayName: "Interaction Design - Year 2",
    type: "master2",
  },
  {
    id: "taine25h",
    name: "Year 1",
    displayName: "Interaction Design - Year 1",
    type: "master1",
  },
];

export const getProgramById = (id: string): Program | undefined => {
  return PROGRAMS.find((program) => program.id === id);
};

export const getProgramByName = (name: string): Program | undefined => {
  return PROGRAMS.find((program) => program.name === name);
};
