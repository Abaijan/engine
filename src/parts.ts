export type PartId =
  | 'block' | 'jacket' | 'sump'
  | 'piston' | 'rings' | 'pin'
  | 'rod' | 'crank' | 'flywheel'
  | 'head' | 'gasket' | 'chamber'
  | 'valves' | 'cam' | 'timing'
  | 'plug';

export interface PartInfo {
  name: string;
  look: string;
  role: string;
}

export const PARTS: Record<PartId, PartInfo> = {
  block: {
    name: 'Cylinder block',
    look: 'A massive gray casting made of iron or aluminum, with smooth round bores.',
    role: 'The engine housing: supports the cylinders, crankshaft, and other parts.',
  },
  jacket: {
    name: 'Cooling jacket',
    look: 'Narrow passages in the block walls surrounding each cylinder.',
    role: 'Coolant flows through these passages and carries heat away from the cylinders.',
  },
  sump: {
    name: 'Oil pan',
    look: 'A shallow steel or aluminum pan at the very bottom of the engine.',
    role: 'Stores the oil that the pump sends to all the moving parts.',
  },
  piston: {
    name: 'Piston',
    look: 'A silver aluminum cup turned upside down.',
    role: 'Takes the pressure of the gases and transfers it to the connecting rod.',
  },
  rings: {
    name: 'Piston rings',
    look: 'Thin, springy steel rings fitted into grooves around the piston.',
    role: 'Seal the gap against the cylinder wall and scrape away excess oil.',
  },
  pin: {
    name: 'Piston pin',
    look: 'A short, hollow steel cylinder passing through the piston.',
    role: 'Connects the piston to the connecting rod with a pivoting joint.',
  },
  rod: {
    name: 'Connecting rod',
    look: 'An I-beam-shaped steel rod with circular ends.',
    role: 'Transfers the piston’s force to the crankshaft throw.',
  },
  crank: {
    name: 'Crankshaft',
    look: 'A bent steel shaft with crank throws and heavy counterweights.',
    role: 'Turns the pistons’ up-and-down motion into rotation.',
  },
  flywheel: {
    name: 'Flywheel',
    look: 'A heavy steel disk with a toothed ring around its edge.',
    role: 'Stores energy, smooths engine rotation, and engages the starter through its ring gear.',
  },
  head: {
    name: 'Cylinder head',
    look: 'A cast cover with a complex network of passages, seats, and openings.',
    role: 'Closes the cylinders and carries the valves, spark plugs, and camshaft.',
  },
  gasket: {
    name: 'Head gasket',
    look: 'A thin, multilayer metal sheet with cutouts for the cylinders.',
    role: 'Seals the cylinders, oil passages, and coolant passages.',
  },
  chamber: {
    name: 'Combustion chamber',
    look: 'The small space between the head and piston at the top of the cylinder.',
    role: 'Fuel burns here, and the expanding gases create pressure.',
  },
  valves: {
    name: 'Valves',
    look: 'Metal mushroom-shaped parts with long stems and springs.',
    role: 'Open and close the intake and exhaust ports.',
  },
  cam: {
    name: 'Camshaft',
    look: 'A steel shaft with oval raised sections called lobes.',
    role: 'The lobes push the valves open; springs return them to their seats.',
  },
  timing: {
    name: 'Timing drive',
    look: 'A toothed belt or chain running around two gears.',
    role: 'Connects the crankshaft and camshaft at a 2:1 ratio.',
  },
  plug: {
    name: 'Spark plug',
    look: 'A white ceramic insulator, threaded steel body, and two electrodes.',
    role: 'Creates the spark that ignites the mixture.',
  },
};
