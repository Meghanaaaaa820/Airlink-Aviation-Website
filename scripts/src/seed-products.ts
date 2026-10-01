import { db, productsTable, pool } from "@workspace/db";

const products = [
  {
    name: "System & Panel Integration",
    slug: "aircraft-hmi-control-panels",
    category: "System Integration",
    shortDescription:
      "Design, development and integration of electronic modules and panels to customer requirements.",
    image: "/images/products/control-panels.jpg",
    eyebrow: "Integration",
    featured: true,
    description:
      "Airlink integrates panels to specification and develops electronic modules including LRU and PDU systems and PCBs. The presentation describes both Built to Print and Built to Specification manufacturing models.",
    features: [
      "Panel integration to specification",
      "Electronic module design and development",
      "LRU and PDU system development",
      "PCB development",
      "Built to Print manufacturing",
      "Built to Specification manufacturing",
    ],
    applications: [
      "Electronic panels",
      "LRU systems",
      "PDU systems",
      "Electronic modules",
    ],
    specifications: [],
  },
  {
    name: "Multifunctional Displays",
    slug: "multifunctional-displays",
    category: "Displays",
    shortDescription:
      "Configurable displays bringing navigation, communication and system-monitoring information into one interface.",
    image: "/images/products/multifunctional-displays.jpg",
    eyebrow: "Display Systems",
    featured: true,
    description:
      "Multifunctional displays combine information such as navigation, communication and system monitoring in a single interface. The presentation describes configurable views for weather, radar, sonar, engine data, moving maps and system status, with applications in aviation, naval and ground systems.",
    features: [
      "Navigation, communication and system monitoring",
      "Configurable views and data pages",
      "Integrated information from GPS, radar, sonar, engines and autopilot",
      "Weather, radar, sonar and engine information",
    ],
    applications: ["Aviation", "Navy", "Ground systems"],
    specifications: [],
  },
  {
    name: "Radio Simulators & Boards",
    slug: "radio-simulators",
    category: "Radio Simulation",
    shortDescription:
      "Hardware platforms for simulating and routing RF signals between radios and communication ports.",
    image: "/images/products/radio-simulators.jpg",
    eyebrow: "Radio Simulation",
    featured: true,
    description:
      "Radio simulator boards route RF signals between multiple radios or communication ports. Matrix configuration determines how Tx/Rx inputs and antenna paths or radios can be interconnected.",
    features: [
      "6 × 6 and 4 × 4 channel configurations",
      "MIL-grade circular connector",
      "10 TOS and 10 IOS station configuration",
      "Cross-talk with PTT",
      "RF signal routing between radio and communication ports",
    ],
    applications: ["Radio simulation", "Communication-port interconnection"],
    specifications: [
      { label: "Channel configurations", value: "6 × 6 and 4 × 4" },
      { label: "Connector", value: "MIL-grade circular" },
      { label: "Station configuration", value: "10 TOS and 10 IOS" },
      { label: "Cross-talk", value: "With PTT" },
    ],
  },
  {
    name: "Cable & Wire Harness Solutions",
    slug: "cable-wire-harness-solutions",
    category: "Cable & Wire Harness",
    shortDescription:
      "In-house custom harness capability for OEM requirements, MIL cable, RF and flat-cable interconnections.",
    image: "/images/products/cable-harness-solutions.jpg",
    eyebrow: "Core Capability",
    featured: true,
    description:
      "Airlink presents an in-house harness capability offering custom solutions for different makes and OEMs, with standard MIL cable and specified cable and connector harness solutions. The work includes Electrical Wiring Interconnection Systems (EWIS), precision electromechanical systems and mission-critical electronic control systems, as well as RF and flat-cable interconnections and rugged compact systems for airborne applications.",
    features: [
      "Simple harnesses: pigtail, back-to-back, non-EMI/EMC, lacing and bundling",
      "Medium harnesses: backshell connections, metal braiding, backpotting and soldering",
      "Complex harnesses: multiple branches and routing, 1:1 drawing creation, large looms and critical processes",
      "Custom harness solutions for makes and OEMs",
      "Standard MIL cable and specified cable and connector solutions",
      "EWIS, precision electromechanical systems and mission-critical electronic control systems",
      "RF and flat-cable interconnections",
      "Rugged compact systems for airborne applications",
    ],
    applications: [
      "Airborne applications",
      "Aerospace",
      "Defence",
      "UAV",
      "EV",
      "Naval and military applications",
    ],
    specifications: [
      { label: "Harness categories", value: "Simple, medium and complex" },
      { label: "Interconnections", value: "RF and flat cable" },
      { label: "Scope", value: "Custom, OEM and standard MIL cable solutions" },
    ],
  },
  {
    name: "RF Cable Assemblies",
    slug: "rf-cable-assemblies",
    category: "RF Interconnect",
    shortDescription:
      "Coaxial RF assemblies with connector options, EMI shielding and rigid or semi-rigid cable harnesses.",
    image: "/images/products/rf-cable-assemblies.jpg",
    eyebrow: "RF Interconnect",
    featured: true,
    description:
      "The presentation describes coaxial assemblies that link devices with different connectors, including SMA, N-Type, BNC, MMCX, MCX and TNC. It lists 50Ω and 75Ω harnesses and semi-rigid and rigid RF cable harnesses. Solid metal jackets are described for EMI shielding, phase stability and low loss, for aerospace, defence and telecom applications.",
    features: [
      "SMA-to-SMA, SMA-to-N-Type and N-Type-to-N-Type assemblies",
      "BNC, MMCX, MCX, TNC and other RF connector combinations",
      "Coaxial cable assemblies",
      "EMI shielding, phase stability and low loss",
      "Semi-rigid and rigid RF cable harnesses",
    ],
    applications: ["Aerospace", "Defence", "Telecom"],
    specifications: [
      { label: "Impedance", value: "50Ω and 75Ω cable harnesses" },
      { label: "Frequency text in presentation", value: "DC to 67+ GHz" },
      { label: "Cable types", value: "Semi-rigid and rigid RF cable harnesses" },
      {
        label: "Connector examples",
        value: "SMA, N-Type, BNC, MMCX, MCX and TNC",
      },
    ],
  },
  {
    name: "Fiber Optic Interconnect Solutions",
    slug: "fiber-optic-interconnect-solutions",
    category: "Fiber Optic",
    shortDescription:
      "Fiber-optic cable assemblies spanning single-fiber contacts, multi-channel connectors and fan-out.",
    image: "/images/products/fiber-optic-solutions.jpg",
    eyebrow: "Fiber Optic",
    featured: false,
    description:
      "The presentation covers single-fiber contacts and multi-channel fiber-optic cable assemblies, including plug/receptacle-to-pigtail fan-out. Connector families shown include bayonet, ST, FC, SC, EC, MTP/MPO, LC, D3899 and ARINC-801, alongside expanded-beam and MT expanded-beam options.",
    features: [
      "Single-fiber contact with one fiber per contact",
      "Bayonet, ST, FC, SC, EC, MTP/MPO and LC connector families",
      "D3899 and ARINC-801 termini",
      "Expanded-beam and MT expanded-beam options",
      "Multi-channel connector to pigtail/fan-out assemblies",
      "MT ferrules with 12 to 72 fibers where applicable",
      "Typical 12-inch breakout length; can be specified",
    ],
    applications: ["Fiber-optic interconnections", "Multi-channel cable assemblies"],
    specifications: [
      { label: "Fiber per single-fiber contact", value: "One" },
      { label: "MT ferrule capacity", value: "12 to 72 fibers, as described" },
      { label: "Typical fan-out length", value: "12 inches; can be specified" },
      {
        label: "Typical fan-out tolerance",
        value: "+2.0 inches / −0.0 inch",
      },
      {
        label: "Breakout behind plug/receptacle",
        value: "6 inches standard; ±1.0 inch typical",
      },
    ],
  },
  {
    name: "Control Panels",
    slug: "control-panels",
    category: "Control Systems",
    shortDescription:
      "Control-panel design, development and manufacturing from system needs through wiring and testing.",
    image: "/images/products/control-panels.jpg",
    eyebrow: "Control Systems",
    featured: false,
    description:
      "Airlink describes defining system needs, creating electrical schematics and layouts, selecting components and assembling hardware in protective enclosures. The work includes wiring and testing, with electrical, mechanical and software integration.",
    features: [
      "Electrical schematics and layouts",
      "PLC, HMI, contactor and breaker component selection",
      "Protective steel, aluminium or plastic enclosures",
      "Wiring and testing",
      "Electrical, mechanical and software integration",
      "Design, development and manufacturing",
    ],
    applications: ["Navy", "Aerospace", "Defence"],
    specifications: [],
  },
  {
    name: "Connector & Cable Sourcing",
    slug: "mil-grade-circular-connectors",
    category: "Sourcing",
    shortDescription:
      "Connector sourcing from OEMs and supply of different makes and types of cable.",
    image: "/images/products/cable-harness-solutions.jpg",
    eyebrow: "Sourcing",
    featured: false,
    description:
      "The presentation states that Airlink sources connector varieties directly from OEMs for resale and supplies different makes and types of cable to DRDO laboratories.",
    features: [
      "Connector sourcing directly from OEMs",
      "Supply of different makes and types of cable",
    ],
    applications: ["OEM connector sourcing", "Cable supply to DRDO laboratories"],
    specifications: [],
  },
  {
    name: "Other Assemblies & BOM Parts",
    slug: "microd-connectors",
    category: "Assemblies & Sourcing",
    shortDescription:
      "Support for other assemblies, electronic components, software and workstations.",
    image: "/images/products/control-panels.jpg",
    eyebrow: "Assemblies & Sourcing",
    featured: false,
    description:
      "Airlink's presentation describes support for other assemblies, sourcing of BOM parts, and ready-made solutions such as electronic components, software and workstations.",
    features: [
      "Support for other assemblies",
      "BOM-part sourcing",
      "Electronic components",
      "Software and workstations",
    ],
    applications: ["Other assemblies", "BOM sourcing", "Readymade solutions"],
    specifications: [],
  },
];

async function seedProducts() {
  console.log(`Seeding ${products.length} products...`);

  for (const product of products) {
    await db
      .insert(productsTable)
      .values(product)
      .onConflictDoUpdate({
        target: productsTable.slug,
        set: {
          name: product.name,
          category: product.category,
          shortDescription: product.shortDescription,
          image: product.image,
          eyebrow: product.eyebrow,
          featured: product.featured,
          description: product.description,
          features: product.features,
          applications: product.applications,
          specifications: product.specifications,
          updatedAt: new Date(),
        },
      });
  }

  console.log("Products seeded successfully.");
}

seedProducts()
  .catch((error) => {
    console.error("Failed to seed products:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });