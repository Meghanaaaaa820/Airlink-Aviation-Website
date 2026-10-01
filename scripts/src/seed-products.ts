import { db, productsTable, pool } from "@workspace/db";

const products = [
  {
    name: "Aircraft HMI Control Panels",
    slug: "aircraft-hmi-control-panels",
    category: "Cockpit Controls",
    shortDescription:
      "Rugged human-machine interface control panels designed for mission-critical aircraft applications.",
    image: "",
    eyebrow: "Aircraft HMI",
    featured: true,
    description:
      "Aircraft HMI control panels for demanding aerospace and defense environments.",
    features: [
      "Rugged control interface",
      "Mission-critical aircraft applications",
      "Designed for demanding environments",
    ],
    applications: ["Aircraft cockpit systems", "Aerospace and defense"],
    specifications: [],
  },
  {
    name: "Multifunctional Displays (MFDs)",
    slug: "multifunctional-displays",
    category: "Rugged Displays",
    shortDescription:
      "Rugged multifunctional display systems designed for aerospace and defense applications.",
    image: "",
    eyebrow: "MFD Systems",
    featured: true,
    description:
      "Multifunctional display systems designed to provide reliable visual interfaces in demanding aerospace and defense environments.",
    features: [
      "Rugged display system",
      "Mission-critical applications",
      "Designed for demanding environments",
    ],
    applications: ["Aircraft systems", "Aerospace and defense"],
    specifications: [],
  },
  
   {
  name: "Radio Simulators & Boards",

  slug: "radio-simulators",

  category: "Simulation & Training",

  shortDescription:
    "Hardware platforms designed to simulate and route RF signals between multiple radios or communication ports for integrated simulation and test environments.",

  image: "",

  eyebrow: "Radio Simulation",

  featured: true,

  description:
    "Radio Simulator Boards are hardware platforms designed to simulate and route RF signals between multiple radios or communication ports. The matrix configuration determines how multiple Tx/Rx ports and antenna paths or radios can be interconnected.",

  features: [
    "6 × 6 channel radio simulator",
    "4 × 4 channel radio simulator",
    "MIL-grade circular connectors",
    "10 TOS station configuration",
    "10 IOS station configuration",
    "Cross-talk with PTT",
    "Radio simulation and signal routing",
  ],

  applications: [
    "Radio simulation",
    "Training systems",
    "Communication system testing",
    "Aerospace applications",
    "Defence applications",
  ],

  specifications: [
    "6 × 6 channel configuration",
    "4 × 4 channel configuration",
    "MIL-grade circular connector",
    "10 TOS station",
    "10 IOS station",
    "Cross-talk with PTT",
  ],
},
  {
    name: "RF Cable Assemblies",
    slug: "rf-cable-assemblies",
    category: "Cable & Harness",
    shortDescription:
      "Precision RF cable assembly solutions for demanding aerospace and defense applications.",
    image: "",
    eyebrow: "RF Interconnect",
    featured: true,
    description:
      "Precision RF cable assemblies designed for reliable interconnect applications in demanding environments.",
    features: [
      "Precision cable assembly",
      "RF interconnect solution",
      "Aerospace and defense applications",
    ],
    applications: ["RF systems", "Aerospace systems", "Defense systems"],
    specifications: [],
  },
  {
    name: "Fiber Optic Interconnect Solutions",
    slug: "fiber-optic-interconnect-solutions",
    category: "Fiber Optic",
    shortDescription:
      "Fiber optic interconnect solutions for high-performance aerospace and defense systems.",
    image: "",
    eyebrow: "Fiber Optic",
    featured: false,
    description:
      "Fiber optic interconnect solutions designed for demanding aerospace and defense system requirements.",
    features: [
      "Fiber optic interconnect",
      "High-performance systems",
      "Rugged applications",
    ],
    applications: ["Aerospace systems", "Defense systems"],
    specifications: [],
  },
  {
    name: "MIL-Grade Circular Connectors",
    slug: "mil-grade-circular-connectors",
    category: "Connectors",
    shortDescription:
      "Rugged circular connector solutions designed for demanding aerospace and defense environments.",
    image: "",
    eyebrow: "MIL-Grade",
    featured: false,
    description:
      "MIL-grade circular connector solutions for demanding aerospace and defense interconnect applications.",
    features: [
      "Rugged circular connector",
      "Aerospace applications",
      "Defense applications",
    ],
    applications: ["Aerospace interconnect", "Defense interconnect"],
    specifications: [],
  },
  {
    name: "Control Panels",
    slug: "control-panels",
    category: "Cockpit Controls",
    shortDescription:
      "Rugged control panel solutions for aerospace and defense applications.",
    image: "",
    eyebrow: "Control Systems",
    featured: false,
    description:
      "Control panel solutions designed for demanding aerospace and defense applications.",
    features: [
      "Rugged control interface",
      "Mission-critical applications",
      "Aerospace and defense use",
    ],
    applications: ["Aircraft systems", "Defense systems"],
    specifications: [],
  },
  {
    name: "MicroD Connectors",
    slug: "microd-connectors",
    category: "Connectors",
    shortDescription:
      "Compact aerospace-grade MicroD connector solutions for demanding interconnect applications.",
    image: "",
    eyebrow: "MicroD",
    featured: false,
    description:
      "MicroD connector solutions designed for compact, demanding aerospace and defense interconnect applications.",
    features: [
      "Compact connector design",
      "Aerospace-grade solution",
      "Custom configurations available",
    ],
    applications: ["Aerospace interconnect", "Defense systems"],
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