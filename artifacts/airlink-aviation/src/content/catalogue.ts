/**
 * Product catalogue content for the Airlink Aviation website.
 *
 * Every statement in this file is taken from the official Airlink Aviation Pvt Ltd
 * presentation (attached_assets/AAPL-New_Version_V1_2026). Nothing here is invented.
 * The product records themselves (name, description, features, specifications) are
 * still served by the API / database; this file adds catalogue ordering, imagery and
 * the structured technical detail used on the product pages.
 */

export type ImageTone = 'light' | 'dark';

export type Block =
  | {
      type: 'tiles';
      kicker: string;
      title: string;
      intro?: string;
      columns?: 2 | 3 | 4;
      items: { title: string; text?: string }[];
    }
  | {
      type: 'columns';
      kicker: string;
      title: string;
      intro?: string;
      columns: {
        label?: string;
        title: string;
        items: string[];
        image?: string;
        imageTone?: ImageTone;
        imageAlt?: string;
      }[];
    }
  | {
      type: 'steps';
      kicker: string;
      title: string;
      intro?: string;
      steps: { title: string; text?: string }[];
    }
  | {
      type: 'chips';
      kicker: string;
      title: string;
      intro?: string;
      groups: { label: string; items: string[] }[];
    }
  | {
      type: 'figure';
      kicker: string;
      title: string;
      intro?: string;
      image: string;
      alt: string;
      caption: string;
      tone?: ImageTone;
      facts?: { label: string; value: string }[];
    }
  | {
      type: 'table';
      kicker: string;
      title: string;
      intro?: string;
      rows: { label: string; value: string }[];
    };

export type CatalogueEntry = {
  slug: string;
  number: string;
  displayName: string;
  /** Short category label shown on cards and in the product hero. */
  label: string;
  /** One-line summary shown under the product title. */
  tagline: string;
  image: string;
  imageTone: ImageTone;
  /** Three short points shown inside catalogue cards. */
  highlights: string[];
  /** Quick facts shown in the product hero. */
  facts: { label: string; value: string }[];
  blocks: Block[];
  related: string[];
};

export const HARNESS_SLUG = 'cable-wire-harness-solutions';

const IMG = '/images/products';

export const catalogue: CatalogueEntry[] = [
  /* ------------------------------------------------------------------ 01 */
  {
    slug: HARNESS_SLUG,
    number: '01',
    displayName: 'Cable & Wire Harness Solutions',
    label: 'Core capability',
    tagline: 'In-house harness capability, from simple pigtails to complex multi-branch looms.',
    image: `${IMG}/cable-harness-solutions-clean.jpg`,
    imageTone: 'light',
    highlights: [
      'Simple, medium and complex harnesses',
      'Custom harnesses for any make and any OEM',
      'Standard MIL cable and specified connectors',
    ],
    facts: [
      { label: 'Harness categories', value: 'Simple · Medium · Complex' },
      { label: 'Cable basis', value: 'Standard MIL and specified cables' },
      { label: 'Scope', value: 'Any make, any OEM' },
      { label: 'Production', value: 'In-house' },
    ],
    blocks: [
      {
        type: 'tiles',
        kicker: 'Capabilities',
        title: 'What the harness capability covers.',
        intro:
          'Airlink offers custom harness solutions of any make and any OEM, with standard MIL cable and specific cable and connector harness solutions, built to meet stringent environmental and operational standards.',
        columns: 4,
        items: [
          { title: 'In-house harness capability', text: 'Harness design and manufacture carried out in-house.' },
          { title: 'Custom & OEM harnesses', text: 'Custom harness solutions of any make and any OEM.' },
          { title: 'MIL cables & connectors', text: 'Standard MIL cable with specific cable and connector harness solutions.' },
          { title: 'EWIS', text: 'Electrical Wiring Interconnection Systems.' },
          { title: 'Electromechanical systems', text: 'High-precision electromechanical systems.' },
          { title: 'Electronic control systems', text: 'Mission-critical electronic control systems.' },
          { title: 'RF & flat cable', text: 'Specialty products: RF and flat cable interconnections.' },
          { title: 'Rugged airborne systems', text: 'Rugged compact systems for airborne applications.' },
        ],
      },
      {
        type: 'columns',
        kicker: 'Harness types',
        title: 'Simple, medium and complex.',
        intro:
          'Airlink’s harness work is organised into three categories, each with its own build characteristics.',
        columns: [
          {
            label: 'Category 01',
            title: 'Simple Harness',
            items: ['Pig tail harness', 'Back-to-back harness', 'Non-EMI/EMC harness', 'Lacing and bundling'],
            image: `${IMG}/cable-harness-solutions-clean.jpg`,
            imageTone: 'light',
            imageAlt: 'Simple cable harness with circular connector',
          },
          {
            label: 'Category 02',
            title: 'Medium Harness',
            items: ['Connecting with backshell', 'Metal braiding', 'Backpotting solution', 'Soldering process'],
            image: `${IMG}/cable-harness-medium.png`,
            imageTone: 'dark',
            imageAlt: 'Medium cable harness with backshell connectors',
          },
          {
            label: 'Category 03',
            title: 'Complex Harness',
            items: [
              'Multiple branch harness with routings',
              '1:1 drawing creation, used in routings',
              'Big looms with all types of connector, along with soldering and critical processes',
            ],
            image: `${IMG}/cable-harness-complex.jpg`,
            imageTone: 'light',
            imageAlt: 'Complex multi-branch cable harness',
          },
        ],
      },
      {
        type: 'chips',
        kicker: 'Related interconnect work',
        title: 'EMI/EMC, RF and flat cable interconnections.',
        intro:
          'Alongside standard harnesses, Airlink offers EMI/EMC protected harness assemblies and specialty RF and flat cable interconnections.',
        groups: [
          { label: 'Harness range', items: ['Simple', 'Complex', 'Multi-branch', 'EMI/EMC protected', 'RF cable assemblies'] },
          { label: 'Specialty products', items: ['RF interconnections', 'Flat cable interconnections'] },
          { label: 'Manufacturing models', items: ['Built to Print', 'Built to Specification', 'Customised'] },
        ],
      },
      {
        type: 'table',
        kicker: 'Technical characteristics',
        title: 'Harness characteristics at a glance.',
        rows: [
          { label: 'Harness categories', value: 'Simple, medium and complex' },
          { label: 'Cable', value: 'Standard MIL cable and specific cables' },
          { label: 'Connectors', value: 'Standard MIL and specific connector harness solutions' },
          { label: 'Make / OEM', value: 'Any make and any OEM' },
          { label: 'Systems', value: 'EWIS, high-precision electromechanical, mission-critical electronic control' },
          { label: 'Specialty', value: 'RF and flat cable interconnections' },
          { label: 'Environment', value: 'Built to meet stringent environmental and operational standards' },
          { label: 'Applications', value: 'Rugged compact systems for airborne applications' },
        ],
      },
    ],
    related: ['rf-cable-assemblies', 'fiber-optic-interconnect-solutions', 'aircraft-hmi-control-panels'],
  },

  /* ------------------------------------------------------------------ 02 */
  {
    slug: 'radio-simulators',
    number: '02',
    displayName: 'Radio Simulators & Boards',
    label: 'Radio simulation',
    tagline: 'Hardware platforms that simulate and route RF signals between radios and communication ports.',
    image: `${IMG}/radio-simulators.jpg`,
    imageTone: 'light',
    highlights: [
      '6 × 6 and 4 × 4 channel configurations',
      'MIL-grade circular connector',
      '10 TOS and 10 IOS station configuration',
    ],
    facts: [
      { label: 'Configurations', value: '6 × 6 and 4 × 4 channel' },
      { label: 'Connector', value: 'MIL-grade circular' },
      { label: 'Stations', value: '10 TOS and 10 IOS' },
      { label: 'Also offered', value: '16-channel radio simulator' },
    ],
    blocks: [
      {
        type: 'tiles',
        kicker: 'How it works',
        title: 'Simulating and routing RF signals.',
        intro:
          'Radio simulator boards are hardware platforms designed to simulate and route RF signals between multiple radios or communication ports.',
        columns: 3,
        items: [
          { title: 'Radio simulation', text: 'Simulates radios so that communication ports can be exercised.' },
          { title: 'RF signal routing', text: 'Routes RF signals between multiple radios or communication ports.' },
          {
            title: 'Matrix configuration',
            text: 'The matrix determines how many inputs (Tx/Rx ports) and outputs (antenna paths or radios) can be interconnected.',
          },
        ],
      },
      {
        type: 'table',
        kicker: 'Specification',
        title: 'Published configurations.',
        rows: [
          { label: 'Channel configurations', value: '(6 × 6) and (4 × 4) channel radio simulator' },
          { label: 'Connector', value: 'MIL-grade circular connector' },
          { label: 'Station configuration', value: '10 TOS station and 10 IOS station' },
          { label: 'Cross-talk', value: 'Configured for cross-talk with PTT' },
          { label: 'Related offering', value: '16-channel radio simulator, with simulation design, development and fabrication' },
        ],
      },
    ],
    related: [HARNESS_SLUG, 'rf-cable-assemblies', 'aircraft-hmi-control-panels'],
  },

  /* ------------------------------------------------------------------ 03 */
  {
    slug: 'rf-cable-assemblies',
    number: '03',
    displayName: 'RF Cable Assemblies',
    label: 'RF interconnect',
    tagline: 'Coaxial RF assemblies with connector options, EMI shielding and rigid or semi-rigid cable harnesses.',
    image: `${IMG}/rf-cable-assemblies.jpg`,
    imageTone: 'light',
    highlights: [
      'SMA, N-Type, BNC, MMCX, MCX and TNC',
      '50Ω and 75Ω cable harnesses',
      'Semi-rigid and rigid RF cable harnesses',
    ],
    facts: [
      { label: 'Impedance', value: '50Ω and 75Ω' },
      { label: 'Cable', value: 'Semi-rigid and rigid' },
      { label: 'Frequency', value: 'DC to 67+ GHz (semi-rigid and rigid)' },
      { label: 'Markets', value: 'Aerospace, defence, telecom' },
    ],
    blocks: [
      {
        type: 'tiles',
        kicker: 'Overview',
        title: 'Coaxial assemblies that link devices with different connectors.',
        intro:
          'A coaxial cable assembly links devices that use different connectors. High-frequency SMA suits compact equipment, while rugged, high-power N-Type suits antennas and base stations, offering 50Ω impedance, durability and signal integrity from DC up to several GHz.',
        columns: 3,
        items: [
          { title: 'SMA', text: 'High-frequency SubMiniature version A connector for compact gear.' },
          { title: 'N-Type', text: 'Rugged, high-power connector for antennas and base stations.' },
          { title: 'Different connector sizes', text: 'Assemblies can join connectors of different sizes.' },
        ],
      },
      {
        type: 'chips',
        kicker: 'Connector information',
        title: 'Connector combinations.',
        groups: [
          { label: 'Assembly examples', items: ['SMA to SMA', 'SMA to N-Type', 'N-Type to N-Type', 'BNC assembly'] },
          { label: 'Connector families', items: ['SMA', 'N-Type', 'BNC', 'MMCX', 'MCX', 'TNC', 'Other RF connectors'] },
          { label: 'Impedance', items: ['50Ω cable harness', '75Ω cable harness'] },
        ],
      },
      {
        type: 'tiles',
        kicker: 'Semi-rigid and rigid',
        title: 'Semi-rigid and rigid RF cable harnesses.',
        intro:
          'These harnesses use coaxial cables with solid metal jackets (copper or aluminium) and are suited to high-frequency work, DC to 67+ GHz, in aerospace, defence and telecom applications.',
        columns: 3,
        items: [
          { title: 'EMI shielding', text: 'Excellent EMI shielding from the solid metal jacket.' },
          { title: 'Phase stability', text: 'Phase stability for high-frequency applications.' },
          { title: 'Low loss', text: 'Low-loss signal transmission.' },
        ],
      },
      {
        type: 'figure',
        kicker: 'Connector reference',
        title: 'Common RF connector types.',
        image: `${IMG}/rf-cable-assemblies.png`,
        alt: 'Reference chart of N, SMA, TNC and BNC RF connector types',
        caption: 'Reference chart of N-Type, SMA, TNC and BNC connector families, including male, female and reverse-polarity variants.',
        tone: 'light',
      },
    ],
    related: [HARNESS_SLUG, 'fiber-optic-interconnect-solutions', 'radio-simulators'],
  },

  /* ------------------------------------------------------------------ 04 */
  {
    slug: 'fiber-optic-interconnect-solutions',
    number: '04',
    displayName: 'Fiber Optic Cable Assemblies',
    label: 'Fiber optic',
    tagline: 'Fiber optic connector and termini options, with multi-channel cable assemblies and fan-out.',
    image: `${IMG}/fiber-optic-interconnect-solutions.png`,
    imageTone: 'light',
    highlights: [
      'ST, FC, SC, EC, LC, MTP/MPO connector series',
      'D3899, ARINC-801 and expanded beam termini',
      'Multi-channel connector to pigtail fan-out',
    ],
    facts: [
      { label: 'Single-fiber contact', value: 'One fiber per contact' },
      { label: 'MT ferrule', value: '12 to 72 fibers' },
      { label: 'Fan-out length', value: '12 in typical, can be specified' },
      { label: 'Breakout behind plug', value: '6 in standard' },
    ],
    blocks: [
      {
        type: 'columns',
        kicker: 'Connector information',
        title: 'Connector and termini of fiber optics.',
        intro: 'Connector families are grouped by their coupling style.',
        columns: [
          { label: 'Coupling', title: 'Bayonets', items: ['ST series'] },
          { label: 'Coupling', title: 'Screw-in', items: ['FC series'] },
          { label: 'Coupling', title: 'Push-pull snap-in', items: ['SC series', 'EC series', 'MTP/MPO'] },
          { label: 'Coupling', title: 'Push-pull latched (RJ45)', items: ['LC series'] },
        ],
      },
      {
        type: 'tiles',
        kicker: 'Termini',
        title: 'Single-fiber contact and expanded beam.',
        columns: 3,
        items: [
          {
            title: 'Single-fiber contact',
            text: 'Only one fiber per contact. Easy termination, cost effective and easy maintenance. Includes the D3899 connector and ARINC-801 termini.',
          },
          { title: 'Expanded beam', text: 'EB termini.' },
          { title: 'MT expanded beam', text: 'MT EB ferrule.' },
        ],
      },
      {
        type: 'tiles',
        kicker: 'MT ferrule',
        title: 'High-density fiber in one ferrule.',
        intro: 'An MT ferrule carries from 12 to 72 fibers inside one ferrule.',
        columns: 4,
        items: [
          { title: '12 to 72 fibers', text: 'Inside one ferrule.' },
          { title: 'High density', text: 'High density of fiber.' },
          { title: 'Compact', text: 'A very compact solution.' },
          { title: 'Considerations', text: 'High cost and complex termination.' },
        ],
      },
      {
        type: 'chips',
        kicker: 'Colour coding',
        title: 'Colour coding for adapters and contacts.',
        intro: 'The colour coding is the same for the adapters and for the contacts.',
        groups: [
          {
            label: 'Fiber type',
            items: ['Blue: Single-Mode PC', 'Green: Single-Mode APC', 'Beige: Multimode PC', 'Aqua: Multimode PC with OM3 or OM4 fiber'],
          },
        ],
      },
      {
        type: 'figure',
        kicker: 'Cable assembly',
        title: 'Multi-channel connector to pigtail (fan-out).',
        intro:
          'Fiber optic cable assemblies run from a multi-channel connector (plug or receptacle) to pigtails. Lengths are measured from the front face of the insert cap on the multi-channel connector to the ferrule tips of the individual connectors.',
        image: `${IMG}/fiber-optic-breakout.png`,
        alt: 'Multi-channel connector breaking out to four individual fiber pigtails',
        caption: 'Multi-channel connector to individual fiber pigtails (fan-out).',
        tone: 'light',
        facts: [
          { label: 'Fan-out length', value: '12 inches typical; can be specified' },
          { label: 'Fan-out tolerance', value: '+2.0 in / −0.0 in typical' },
          { label: 'Breakout behind plug / receptacle', value: '6 inches standard' },
          { label: 'Breakout tolerance', value: '±1.0 in typical' },
        ],
      },
      {
        type: 'table',
        kicker: 'Assembly notes',
        title: 'Dimensioning and labelling.',
        rows: [
          { label: 'Longer pigtails', value: 'If the pigtail length exceeds the typical length, the tolerances in Table 1 apply' },
          { label: 'Dimension lines', value: 'Placed at the edge of the heat shrink' },
          { label: 'Labelling', value: 'Heat shrink tubing: character size, number of lines of information, orientation and location' },
        ],
      },
    ],
    related: [HARNESS_SLUG, 'rf-cable-assemblies', 'mil-grade-circular-connectors'],
  },

  /* ------------------------------------------------------------------ 05 */
  {
    slug: 'multifunctional-displays',
    number: '05',
    displayName: 'Multifunctional Displays',
    label: 'Display systems',
    tagline: 'Configurable displays for avionics, navy and ground systems.',
    image: `${IMG}/multifunctional-displays.png`,
    imageTone: 'light',
    highlights: [
      'Navigation, communication and system monitoring',
      'Data from GPS, radar, sonar, engines and autopilot',
      'Configurable views and data pages',
    ],
    facts: [
      { label: 'Functions', value: 'Navigation, communication, monitoring' },
      { label: 'Fields', value: 'Avionics, navy, ground systems' },
      { label: 'Data sources', value: 'GPS, radar, sonar, engines, autopilot' },
      { label: 'Views', value: 'Configurable' },
    ],
    blocks: [
      {
        type: 'tiles',
        kicker: 'Overview',
        title: 'One interface, many functions.',
        intro:
          'Multifunction Displays (MFDs) are versatile electronic screens that integrate multiple functions into a single interface. They are common in aviation (glass cockpits), marine electronics and industrial controls, replacing dedicated gauges with configurable digital displays for weather, radar, sonar or engine data.',
        columns: 3,
        items: [
          { title: 'Navigation' },
          { title: 'Communication' },
          { title: 'System monitoring' },
        ],
      },
      {
        type: 'tiles',
        kicker: 'Key characteristics',
        title: 'Integrated information, configurable views.',
        columns: 2,
        items: [
          {
            title: 'Integrated information',
            text: 'Combines data from various sensors and systems (GPS, radar, sonar, engines, autopilot) onto one screen.',
          },
          {
            title: 'Configurable views',
            text: 'Users can customise screens to show different data pages, for example moving maps, system status and weather.',
          },
        ],
      },
      {
        type: 'chips',
        kicker: 'Information shown',
        title: 'Weather, radar, sonar and engine data.',
        groups: [
          { label: 'Data pages', items: ['Moving maps', 'System status', 'Weather', 'Radar', 'Sonar', 'Engine data'] },
          { label: 'Fields of use', items: ['Avionics', 'Navy', 'Ground systems'] },
        ],
      },
    ],
    related: [HARNESS_SLUG, 'control-panels', 'aircraft-hmi-control-panels'],
  },

  /* ------------------------------------------------------------------ 06 */
  {
    slug: 'control-panels',
    number: '06',
    displayName: 'Control Panels',
    label: 'Control systems',
    tagline: 'Design, development and manufacturing of control panels for navy, aerospace and defence.',
    image: `${IMG}/control-panels.jpeg`,
    imageTone: 'light',
    highlights: [
      'Electrical schematics and layouts',
      'PLC, HMI, contactor and breaker selection',
      'Steel, aluminium or plastic enclosures',
    ],
    facts: [
      { label: 'Scope', value: 'Design, development, manufacturing' },
      { label: 'Components', value: 'PLCs, HMIs, contactors, breakers' },
      { label: 'Enclosures', value: 'Steel, aluminium, plastic' },
      { label: 'Applications', value: 'Aeronautics, tanks, defence, navy' },
    ],
    blocks: [
      {
        type: 'steps',
        kicker: 'Process',
        title: 'From system needs to tested panel.',
        intro: 'Airlink is capable of design, development and manufacturing of control panels.',
        steps: [
          { title: 'Define system needs' },
          { title: 'Electrical schematics and layouts', text: 'Created using software such as SolidWorks.' },
          { title: 'Select components', text: 'PLCs, HMIs, contactors and breakers.' },
          { title: 'Assemble hardware', text: 'In a protective enclosure: steel, aluminium or plastic.' },
          { title: 'Wiring' },
          { title: 'Rigorous testing', text: 'To ensure reliable automation for industrial systems.' },
        ],
      },
      {
        type: 'tiles',
        kicker: 'Integration',
        title: 'Electrical, mechanical and software.',
        intro: 'Control panel work requires expertise in electrical, mechanical and software integration for safety and performance.',
        columns: 3,
        items: [{ title: 'Electrical' }, { title: 'Mechanical' }, { title: 'Software' }],
      },
      {
        type: 'chips',
        kicker: 'Applications',
        title: 'Control panel applications.',
        groups: [{ label: 'Design and integration for', items: ['Aeronautics', 'Tanks', 'Defence', 'Navy', 'Aerospace'] }],
      },
    ],
    related: [HARNESS_SLUG, 'aircraft-hmi-control-panels', 'multifunctional-displays'],
  },

  /* ------------------------------------------------------------------ 07 */
  {
    slug: 'aircraft-hmi-control-panels',
    number: '07',
    displayName: 'System & Panel Integration',
    label: 'System integration',
    tagline: 'Panel integration of avionics, LRUs, chassis and other electronic panels.',
    image: `${IMG}/aircraft-hmi-control-panels.png`,
    imageTone: 'light',
    highlights: [
      'Panel integration as per the specification',
      'Design and development of LRUs and PDU systems',
      'Built to Print and Built to Specification',
    ],
    facts: [
      { label: 'Integration', value: 'Avionics, LRUs, chassis, panels' },
      { label: 'Modules', value: 'LRUs, PDU systems' },
      { label: 'Development', value: 'PDUs and PCBs' },
      { label: 'Models', value: 'Built to Print / Specification' },
    ],
    blocks: [
      {
        type: 'tiles',
        kicker: 'Design and development',
        title: 'Electronic modules, designed and developed in-house.',
        intro: 'Airlink designs and develops electronic modules such as LRUs, PDU systems and others.',
        columns: 3,
        items: [
          { title: 'Panel integration', text: 'Integration of panels as per the specification, designed as per the need.' },
          { title: 'LRUs and PDU systems', text: 'Design and development of electronic modules.' },
          { title: 'PCBs', text: 'Development of PDUs and PCBs.' },
        ],
      },
      {
        type: 'columns',
        kicker: 'Manufacturing models',
        title: 'Built to Print and Built to Specification.',
        columns: [
          {
            label: 'Customer-defined design',
            title: 'Built to Print',
            items: [
              'A manufacturing model where a provider builds complex electronic systems, components or assemblies',
              'Built precisely following a client’s detailed designs and specifications',
            ],
          },
          {
            label: 'Requirement-defined solution',
            title: 'Built to Specification',
            items: [
              'A manufacturing model where the customer provides performance and functional requirements',
              'The manufacturer handles the entire design, engineering, production and assembly of a finished electronic product',
            ],
          },
        ],
      },
    ],
    related: [HARNESS_SLUG, 'control-panels', 'radio-simulators'],
  },

  /* ------------------------------------------------------------------ 08 */
  {
    slug: 'microd-connectors',
    number: '08',
    displayName: 'Other Assemblies & BOM Parts',
    label: 'Assemblies & sourcing',
    tagline: 'Support for other assemblies, BOM part sourcing and readymade solutions.',
    image: `${IMG}/microd-connectors.jpeg`,
    imageTone: 'light',
    highlights: ['Support for other assemblies', 'Sourcing of any BOM parts', 'Electronic components, software and workstations'],
    facts: [
      { label: 'Assemblies', value: 'Other assemblies supported' },
      { label: 'Sourcing', value: 'Any other BOM parts' },
      { label: 'Readymade', value: 'Components, software, workstations' },
    ],
    blocks: [
      {
        type: 'tiles',
        kicker: 'Scope',
        title: 'Beyond harnesses and panels.',
        intro: 'Airlink supports other assemblies and supports sourcing of any other BOM parts.',
        columns: 3,
        items: [
          { title: 'Other assemblies', text: 'Support for other assemblies as required.' },
          { title: 'BOM part sourcing', text: 'Support for sourcing any other BOM parts.' },
          { title: 'Readymade solutions', text: 'Electronic components, software and workstations.' },
        ],
      },
    ],
    related: [HARNESS_SLUG, 'mil-grade-circular-connectors', 'aircraft-hmi-control-panels'],
  },

  /* ------------------------------------------------------------------ 09 */
  {
    slug: 'mil-grade-circular-connectors',
    number: '09',
    displayName: 'Connector & Cable Sourcing',
    label: 'Sourcing & distribution',
    tagline: 'Connectors sourced directly from OEMs, and cables of different makes and types.',
    image: `${IMG}/mil-grade-circular-connectors.png`,
    imageTone: 'light',
    highlights: ['Connector varieties sourced directly from OEMs', 'Different makes and types of cable', 'Cables supplied to DRDO labs'],
    facts: [
      { label: 'Connectors', value: 'Sourced directly from OEM' },
      { label: 'Cables', value: 'Different make and type' },
      { label: 'Supplied to', value: 'DRDO labs' },
    ],
    blocks: [
      {
        type: 'tiles',
        kicker: 'Sourcing and distribution',
        title: 'Connectors and cables.',
        columns: 2,
        items: [
          { title: 'Connectors', text: 'We source varieties of connectors directly from the OEM and re-sell them.' },
          { title: 'Cables', text: 'We supply different makes and different types of cables to DRDO labs.' },
        ],
      },
    ],
    related: [HARNESS_SLUG, 'microd-connectors', 'fiber-optic-interconnect-solutions'],
  },
];

const bySlug = new Map(catalogue.map((entry) => [entry.slug, entry]));

export function getCatalogueEntry(slug: string): CatalogueEntry | undefined {
  return bySlug.get(slug);
}

/** Catalogue position for a product slug. Unknown slugs sort after the catalogue. */
export function catalogueRank(slug: string): number {
  const index = catalogue.findIndex((entry) => entry.slug === slug);
  return index === -1 ? catalogue.length : index;
}

export function orderBySlug<T extends { slug: string; name: string }>(products: T[]): T[] {
  return [...products].sort((a, b) => catalogueRank(a.slug) - catalogueRank(b.slug) || a.name.localeCompare(b.name));
}
