import {FPS, OUTPUT_FPS} from './theme';
import {PartId} from './parts';

/** Fallback narration pace when no generated voice-over timing is available. */
export const WORDS_PER_SECOND = 1.65;
export const PLAYBACK_RATE = 3;
/** Sequence rate that keeps the same visual speed at OUTPUT_FPS (local frames advance by this per rendered frame). */
export const SEQ_RATE = (PLAYBACK_RATE * FPS) / OUTPUT_FPS;
export const NARRATION_PLAYBACK_RATE = 1.3;
export const COMBINED_NARRATION_PLAYBACK_RATE = 1.4;
export const COMBINED_VOICEOVER_SOURCE_RATE = 1.6;
export const COMBINED_VOICEOVER_PLAYBACK_RATE = COMBINED_NARRATION_PLAYBACK_RATE / COMBINED_VOICEOVER_SOURCE_RATE;
/** Voice-over files in public/audio are timed to each scene. */
export const USE_AUDIO = true;

export type Kind =
  | 'intro' | 'idea' | 'anatomy' | 'cycle' | 'stroke' | 'multi'
  | 'fuel' | 'lube' | 'exhaust' | 'other' | 'numbers' | 'outro';

export interface Scene {
  id: string;
  chapter: string;
  kind: Kind;
  narration: string[];
  highlights?: PartId[];
  /** For kind === 'stroke': 0 intake, 1 compression, 2 power, 3 exhaust. */
  stroke?: 0 | 1 | 2 | 3;
  /** Override the duration in seconds when no generated voice-over timing is available. */
  seconds?: number;
}

const ALL_SCENES: Scene[] = [
  {
    id: '01-intro',
    chapter: 'Introduction',
    kind: 'intro',
    narration: [
      'Every day, billions of people turn a key or press a button, and a complex machine comes to life under the hood. In a fraction of a second, it turns liquid fuel into motion. The internal combustion engine has been around for more than 130 years, and its basic principle has hardly changed.',
      'Today, we will take it apart down to the last bolt: we will see what every part looks like, what it does, and how all the parts work together.',
      'We will focus on the most common type: the four-stroke gasoline engine. We will also touch on diesel engines, turbocharging, and hybrids near the end.',
    ],
  },
  {
    id: '02-idea',
    chapter: 'The Big Idea',
    kind: 'idea',
    narration: [
      'Gasoline contains a lot of energy. One liter holds as much energy as a person produces during several days of hard work. But how do we make that energy turn the wheels? The idea is simple: burn the fuel in an enclosed space. As it burns, the gas heats up rapidly and expands. It needs more room, so it pushes hard against everything around it.',
      'If one of the walls can move, the gas pushes it outward. That is the basic idea: expanding gas pushes a piston. But one push is not enough to drive a car. We need a mechanism that repeats the process hundreds of times a minute. We also need to turn the piston’s straight-line motion into rotation, because wheels turn.',
      'That is what all the parts we are about to explore are for. Let’s start with the foundation.',
    ],
  },
  {
    id: '03-block',
    chapter: 'Engine Anatomy · Cylinder Block',
    kind: 'anatomy',
    highlights: ['block', 'jacket', 'sump'],
    narration: [
      'The foundation of the engine is the cylinder block. It is a heavy casting made of iron or lightweight aluminum alloy. Smooth, round bores inside the block are called cylinders. This is where the most important action takes place. Their walls are machined to within thousandths of a millimeter because the piston slides along them constantly.',
      'Notice the passages around the cylinders. Coolant flows through some of them, and engine oil flows through others. The block is not just a housing; it is also part of the cooling and lubrication systems. The oil pan is attached underneath, where the oil is stored.',
    ],
  },
  {
    id: '04-piston',
    chapter: 'Engine Anatomy · Piston',
    kind: 'anatomy',
    highlights: ['piston', 'rings', 'pin'],
    narration: [
      'The main character is the piston. Its shape is like an upside-down cup. The top, called the crown, takes the pressure of the burning gases. Pistons are made from aluminum alloy: they are light, so they can change direction quickly, and they dissipate heat well.',
      'Grooves in the side of the piston hold the piston rings. The top two are compression rings. They press against the cylinder wall and keep hot gases from leaking down. The lower oil-control ring scrapes excess oil off the wall so it does not enter the combustion chamber.',
      'A short steel rod called the piston pin passes through holes inside the piston. It connects the piston to the connecting rod and lets the joint pivot as it moves through different angles.',
    ],
  },
  {
    id: '05-crank',
    chapter: 'Engine Anatomy · Connecting Rod and Crankshaft',
    kind: 'anatomy',
    highlights: ['rod', 'crank', 'flywheel'],
    narration: [
      'The connecting rod is a steel beam with an I-shaped cross-section, like a construction beam: light but very strong. Its small end connects to the piston. Its larger, split big end wraps around a crankshaft journal using thin bearing shells.',
      'The crankshaft is one of the most heavily loaded parts. Its bends are called crank throws. When the piston moves down, the connecting rod pushes on a crank throw like a foot on a bicycle pedal, turning the shaft. This converts straight-line motion into rotation.',
      'A heavy steel flywheel sits at the end of the shaft. It stores energy during the power stroke and gives it back when the pistons are not pushing the shaft. This keeps the rotation smooth instead of jerky. When the engine starts, the starter gear engages the flywheel’s toothed rim.',
    ],
  },
  {
    id: '06-head',
    chapter: 'Engine Anatomy · Cylinder Head',
    kind: 'anatomy',
    highlights: ['head', 'gasket', 'chamber'],
    narration: [
      'The cylinder head closes off the cylinders from above. A head gasket sits between the head and the block. It is thin, but essential: it seals the cylinders, oil passages, and coolant passages. The hollow above the piston, inside the head, is the combustion chamber—the enclosed space where fuel becomes pressure.',
    ],
  },
  {
    id: '07-valves',
    chapter: 'Engine Anatomy · Valves and Camshaft',
    kind: 'anatomy',
    highlights: ['valves', 'cam', 'timing'],
    narration: [
      'The combustion chamber has openings. A fresh air-fuel mixture enters through some of them, while exhaust gases leave through others. Valves open and close these ports: intake valves and exhaust valves. A valve looks like a metal mushroom: its head fits tightly into a seat, while its stem extends upward. A spring keeps it closed.',
      'The camshaft opens the valves. It has lobes—oval bumps—along its length. As the shaft turns, a lobe pushes a valve open; as it moves away, the spring closes the valve again. The shape of the lobe determines how far and how long the valve opens.',
      'A belt or chain connects the camshaft to the crankshaft. The camshaft gear is twice the size of the crankshaft gear, so the camshaft turns at half the speed. Timing marks on the gears must line up during assembly. If the belt slips by even a few teeth, the valves open at the wrong time. In the worst case, a piston can hit a valve and severely damage the engine.',
    ],
  },
  {
    id: '08-cycle',
    chapter: 'The Four-Stroke Cycle',
    kind: 'cycle',
    narration: [
      'Now let’s put it all together. A four-stroke engine’s operating cycle has four strokes, or four piston movements. During one complete cycle, the crankshaft makes two full turns and the piston travels up or down four times.',
    ],
  },
  {
    id: '09-intake',
    chapter: 'The Four-Stroke Cycle · Stroke 1',
    kind: 'stroke',
    stroke: 0,
    narration: [
      'The piston moves down from top dead center to bottom dead center. The intake valve is open and the exhaust valve is closed. A vacuum forms above the piston, and the cylinder draws in air like a syringe. In modern engines, an injector adds tiny droplets of gasoline to the air, forming a fuel mixture: about 14.5 parts air to one part fuel by mass. This ratio is considered ideal for complete combustion.',
    ],
  },
  {
    id: '10-compression',
    chapter: 'The Four-Stroke Cycle · Stroke 2',
    kind: 'stroke',
    stroke: 1,
    narration: [
      'The shaft keeps turning, and the piston moves up. Both valves are closed, so the mixture has nowhere to go and its volume shrinks by about ten times. This is called the compression ratio. The more the mixture is compressed, the more energy we can get from it—but the risk of uncontrolled ignition, called knocking, also increases. That is why high-performance engines need gasoline with a higher octane rating. The mixture heats up noticeably as it is compressed.',
    ],
  },
  {
    id: '11-power',
    chapter: 'The Four-Stroke Cycle · Stroke 3',
    kind: 'stroke',
    stroke: 2,
    narration: [
      'Right at the end of compression, the spark plug produces a spark. The mixture ignites and burns quickly, but it does not explode: the flame front travels across the chamber in a few thousandths of a second. The gases expand, cylinder pressure rises several times over, and the piston moves rapidly downward.',
      'This is the stroke that does useful work. The other three prepare for it or use up some of that energy. The spark happens slightly early so peak pressure arrives at just the right moment, when the connecting rod is at a good angle to the crank throw.',
    ],
  },
  {
    id: '12-exhaust-stroke',
    chapter: 'The Four-Stroke Cycle · Stroke 4',
    kind: 'stroke',
    stroke: 3,
    narration: [
      'The piston moves up again, this time with the exhaust valve open. It pushes the spent gases into the exhaust manifold. Near the end of the stroke, the intake valve opens before the exhaust valve has fully closed. This is called valve overlap, and it helps clear the cylinder more effectively. Then the cycle repeats. At 2,000 revolutions per minute, each cylinder completes about 1,000 cycles a minute.',
    ],
  },
  {
    id: '12b-watch',
    chapter: 'The Four-Stroke Cycle · In Motion',
    kind: 'cycle',
    seconds: 40,
    narration: [
      'Let’s watch the whole cycle without stopping. Notice the valves: the intake valve opens on the first stroke, and the exhaust valve opens on the fourth. The spark fires at the end of compression, and the pressure graph rises sharply right after it.',
    ],
  },
  {
    id: '13-multi',
    chapter: 'Multiple Cylinders',
    kind: 'multi',
    narration: [
      'A single cylinder produces a power stroke only once every two crankshaft turns, so it runs unevenly. To make an engine smoother and more powerful, manufacturers use several cylinders—usually three to twelve. Their power strokes are staggered so the pushes come almost continuously. The order in which the cylinders fire is called the firing order. A common inline-four firing order is one, three, four, two.',
      'Cylinders can be arranged in different ways. In an inline engine, they sit in a single row, which is simple and inexpensive. In a V engine, two banks sit at an angle, making the engine shorter and more compact. In a boxer engine, the cylinders face each other horizontally. The pistons move like boxers throwing punches, and the engine has a very low center of gravity.',
    ],
  },
  {
    id: '14-fuel',
    chapter: 'Fuel, Air, and Ignition',
    kind: 'fuel',
    narration: [
      'Where does the fuel come from? An electric pump sends it from the tank. Gasoline passes through a filter and enters the fuel rail, a tube that supplies all the injectors. An injector is a small electromagnetic valve. The engine electronics open it for a few milliseconds to spray finely atomized fuel. The longer it stays open, the richer the mixture.',
      'Air enters through an air filter that traps dust. A throttle controls how much air flows in. When you press the accelerator, you are really opening the throttle, allowing more air into the cylinders; the electronics add the right amount of fuel. The air then travels through the intake manifold, a set of passages that distributes it among the cylinders.',
      'The engine control unit—the engine’s “brain”—manages all of this. It gets signals from dozens of sensors: how fast the crankshaft is turning, how much air is flowing through the engine, the coolant temperature, and how much oxygen remains in the exhaust. Based on that information, the control unit decides hundreds of times a second how much fuel to inject and when to produce a spark.',
      'The spark plug creates the spark. The ignition coil is essentially a transformer that turns the vehicle’s electrical voltage into tens of thousands of volts. The current jumps across a tiny gap between the plug’s electrodes, creating a spark thousands of degrees hot inside the combustion chamber.',
    ],
  },
  {
    id: '15-lube-cool',
    chapter: 'Lubrication and Cooling',
    kind: 'lube',
    narration: [
      'Metal cannot rub against metal at these speeds without the parts quickly wearing out. That is why the engine has a lubrication system. The oil pan sits at the bottom of the block. A pump sends oil from the pan through a filter and passages to the crankshaft bearings, cylinder walls, and camshaft. The oil creates a thin film that lets the parts slide past one another without touching. It also carries away heat and tiny wear particles, which collect in the filter.',
      'Heat is another problem. Gas temperature inside the cylinder reaches 2,000 degrees, and only about a third of the fuel’s energy becomes motion. About the same amount leaves through the exhaust; the rest becomes heat that must be carried away. Coolant flows around the cylinders. A water pump sends it through the cooling jackets in the block and head, then to the radiator, where oncoming air or a fan cools it. A thermostat keeps coolant out of the radiator while the engine is cold, helping it reach operating temperature faster.',
    ],
  },
  {
    id: '16-exhaust',
    chapter: 'The Exhaust System',
    kind: 'exhaust',
    narration: [
      'Exhaust gases collect in the exhaust manifold. Then they pass through the catalytic converter, which contains ceramic honeycomb coated with precious metals. It converts harmful substances—carbon monoxide, unburned hydrocarbons, and nitrogen oxides—into carbon dioxide, water, and nitrogen. The muffler comes last. Its chambers and baffles dampen sound waves, so instead of a loud bang we hear a steady hum.',
    ],
  },
  {
    id: '17-other',
    chapter: 'Diesel, Turbocharging, and Hybrid Engines',
    kind: 'other',
    narration: [
      'A diesel engine has no spark plugs. It compresses air alone by more than twenty times, heating it so much that fuel ignites on its own as soon as it is injected. Thanks to its high compression ratio, a diesel engine is more fuel-efficient than a gasoline engine.',
      'Turbocharging uses energy from the exhaust. The gases spin a turbine, and a compressor on the same shaft forces more air into the cylinders. More air means more fuel can be burned, producing more power from the same engine size.',
      'In a hybrid, an electric motor works alongside the engine. It helps during acceleration and lets the engine run in its most fuel-efficient range.',
    ],
  },
  {
    id: '17b-numbers',
    chapter: 'A Few Numbers',
    kind: 'numbers',
    narration: [
      'Let’s add a few numbers to get a sense of the scale. A gasoline engine’s compression ratio is about ten to one: the volume above the piston at the bottom is about ten times larger than at the top. At 2,000 revolutions per minute, each cylinder fires about 1,000 times a minute—that is, 16 or 17 times a second. With every revolution, the piston stops and accelerates again twice.',
      'Gas temperature during combustion reaches 2,000 degrees, and cylinder pressure reaches several dozen atmospheres. Coolant keeps the engine near 90 degrees. Air and gasoline are mixed at a ratio of about 14.5 to one by mass.',
      'Finally, there is efficiency. A typical gasoline engine turns about a third of the fuel’s energy into motion; the best designs reach up to 40 percent. The rest is lost as heat through the exhaust and cooling system. That is why engineers keep improving engines: even a one-percent gain saves billions of liters of fuel.',
    ],
  },
  {
    id: '18-outro',
    chapter: 'Summary',
    kind: 'outro',
    narration: [
      'Let’s recap. An engine is based on a simple idea: burn a mixture in an enclosed space and use the pressure to push a piston. The connecting rod and crankshaft turn that motion into rotation. Valves let the mixture in and the gases out at the right time, the camshaft controls the valves, and the engine control unit makes sure everything happens at the right moment. Oil lubricates the parts, and coolant carries away excess heat.',
      'Intake, compression, power, exhaust—and then intake again. Now, when you hear an engine running, you will know what is behind that sound: thousands of precise movements every second. Thanks for watching!',
    ],
  },
];

const INCLUDED_SCENE_IDS = new Set([
  '01-intro', '02-idea', '03-block', '04-piston', '05-crank',
  '06-head', '07-valves', '08-cycle', '09-intake', '10-compression',
  '11-power', '12-exhaust-stroke', '12b-watch', '13-multi', '18-outro',
]);

export const SCENES = ALL_SCENES.filter((scene) => INCLUDED_SCENE_IDS.has(scene.id));

/** Source audio durations; scene durations account for visual and narration playback rates. */
export const VOICEOVER_SECONDS: Record<string, number> = {
  '01-intro': 44.382,
  '02-idea': 56.372188,
  '03-block': 41.639125,
  '04-piston': 49.41356,
  '05-crank': 56.129342,
  '06-head': 23.25102,
  '07-valves': 70.237279,
  '08-cycle': 16.838594,
  '09-intake': 30.871293,
  '10-compression': 33.524671,
  '11-power': 39.134422,
  '12-exhaust-stroke': 29.964671,
  '12b-watch': 17.643492,
  '13-multi': 58.913741,
  '18-outro': 46.372472,
};

const wordCount = (s: string) => s.split(/\s+/).filter(Boolean).length;

export const sceneWords = (s: Scene) => s.narration.reduce((n, p) => n + wordCount(p), 0);

export const sceneFrames = (s: Scene) =>
  Math.round((VOICEOVER_SECONDS[s.id] !== undefined
    ? VOICEOVER_SECONDS[s.id] * PLAYBACK_RATE /
      (['01-intro', '02-idea', '03-block'].includes(s.id)
        ? NARRATION_PLAYBACK_RATE
        : COMBINED_NARRATION_PLAYBACK_RATE)
    : s.seconds ?? Math.max(8, sceneWords(s) / WORDS_PER_SECOND + 3)) * FPS);

export const TOTAL_FRAMES = SCENES.reduce((n, s) => n + sceneFrames(s), 0);

export const COMBINED_VOICEOVER_START_FRAME = SCENES
  .slice(0, 3)
  .reduce((total, scene) => total + sceneFrames(scene), 0);
