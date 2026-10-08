/**
 * Company-level content, sourced from the official Airlink Aviation Pvt Ltd presentation.
 */

export const company = {
  name: 'Airlink Aviation Pvt Ltd',
  address: '#526, 3rd Floor, 7th Cross Rd, HAL 3rd Stage, Jeevan Bima Nagar, Bengaluru, Karnataka 560075',
  emails: ['sales@airlinkaviation.in', 'info@airlinkaviation.in'],
  phones: [
    { label: '+91-8700454009', href: 'tel:+918700454009' },
    { label: '+91-8277908949', href: 'tel:+918277908949' },
  ],
  linkedin: 'https://in.linkedin.com/company/airlink-aviation-pvt-ltd',
  statement: 'Works for defence, aerospace, naval and military applications.',
};

export const primaryNav: { label: string; href: string }[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Capabilities', href: '/capabilities' },
  { label: 'Products', href: '/products' },
  { label: 'Resources', href: '/resources' },
  { label: 'Contact', href: '/contact' },
];

/** The four stages of Airlink’s engineering and production approach. */
export const lifecycle: { number: string; title: string; text: string }[] = [
  {
    number: '01',
    title: 'Design',
    text: 'We design in-house with dedicated engineers.',
  },
  {
    number: '02',
    title: 'Development',
    text: 'Product development, prototyping, testing and qualification.',
  },
  {
    number: '03',
    title: 'Manufacturing',
    text: 'Design and in-house manufacturing, with capability across all types of harness.',
  },
  {
    number: '04',
    title: 'Integration',
    text: 'System integration of avionics, LRUs, chassis and other electronic panels.',
  },
];

export const manufacturingModels = {
  builtToPrint: {
    label: 'Customer-defined design',
    title: 'Built to Print',
    summary: 'EMS: end-to-end solutions for cable and wire harnesses and electronic sub-systems.',
    text: 'A manufacturing model where the provider builds complex electronic systems, components or assemblies precisely following a client’s detailed designs and specifications.',
  },
  builtToSpecification: {
    label: 'Requirement-defined solution',
    title: 'Built to Specification',
    summary: 'Re-design and upgrade, made more efficient as per needs.',
    text: 'A manufacturing model where the customer provides performance and functional requirements, and the manufacturer handles the entire design, engineering, production and assembly of a finished electronic product.',
  },
};

export const services: { title: string; text: string }[] = [
  { title: 'Cable Harness Assembly', text: 'Simple, complex, multi-branch, EMI/EMC protected and RF cable assemblies.' },
  { title: 'Simulator and Boards', text: 'We design and manufacture radio simulators and other simulator boards.' },
  { title: 'Multifunctional Displays', text: 'We design and manufacture all kinds of multifunctional displays and consoles.' },
  { title: 'Control Panels', text: 'Design and development of all kinds of control panels for navy, aerospace and defence.' },
  { title: 'Integration Assemblies', text: 'Panel integration of avionics, LRUs, chassis and other electronic panels.' },
  { title: 'Sourcing and Distribution', text: 'Connectors sourced directly from OEMs, cables, and other readymade solutions.' },
];

/** Market and application areas listed in the Airlink presentation. */
export const industries: { title: string; image: string }[] = [
  { title: 'Aerospace', image: '/images/industries/aerospace.jpg' },
  { title: 'Defence', image: '/images/industries/defence.jpg' },
  { title: 'UAV', image: '/images/industries/uav.jpg' },
  { title: 'EV', image: '/images/industries/ev.jpg' },
];

export const additionalMarkets = ['Naval', 'Military applications'];

/** Harness capability tiles, reused on Home and About. */
export const harnessCapabilities: { title: string; text: string }[] = [
  { title: 'In-house harness capability', text: 'Harness design and manufacture carried out in-house.' },
  { title: 'Custom & OEM harnesses', text: 'Custom solutions of any make and any OEM.' },
  { title: 'Standard MIL cables & connectors', text: 'Standard MIL cable with specific cable and connector solutions.' },
  { title: 'EWIS', text: 'Electrical Wiring Interconnection Systems.' },
  { title: 'Electromechanical systems', text: 'High-precision electromechanical systems.' },
  { title: 'Electronic control systems', text: 'Mission-critical electronic control systems.' },
  { title: 'RF & flat cable', text: 'RF and flat cable interconnections.' },
  { title: 'Rugged airborne systems', text: 'Rugged compact systems for airborne applications.' },
];

export const harnessTypes: { title: string; items: string[] }[] = [
  { title: 'Simple Harness', items: ['Pig tail harness', 'Back-to-back harness', 'Non-EMI/EMC harness', 'Lacing and bundling'] },
  { title: 'Medium Harness', items: ['Connecting with backshell', 'Metal braiding', 'Backpotting solution', 'Soldering process'] },
  {
    title: 'Complex Harness',
    items: [
      'Multiple branch harness with routings',
      '1:1 drawing creation, used in routings',
      'Big looms with all types of connector, along with soldering and critical processes',
    ],
  },
];
