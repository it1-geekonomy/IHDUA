import cors from "cors";
import express from "express";

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());

interface KnowledgeDoc {
  id: string;
  title: string;
  category: string;
  keywords: string[];
  summary: string;
  content: string;
  url?: string;
  actions?: { label: string; href?: string; action?: string }[];
  suggestedFollowUps?: string[];
}

const KNOWLEDGE_BASE: KnowledgeDoc[] = [
  {
    id: "about_ihdua",
    title: "About IHDUA (International Human Development & Uplifting Academy)",
    category: "about",
    keywords: ["ihdua", "about", "who we are", "organization", "history", "mission", "vision", "values", "ngo"],
    summary:
      "IHDUA is a registered non-profit working with rural and underserved communities through education, healthcare, livelihoods, and sustainable development.",
    content:
      "The International Humanitarian Development & Upliftment Association (IHDUA) is a grassroots not-for-profit organisation founded to empower underserved and rural communities. For over 20 years, IHDUA has spearheaded transformative interventions in Karnataka, India, and through its USA chapter in Chicago. Core Values: Compassion, Integrity, Inclusivity, Sustainability, Community Ownership, and Accountability.",
    url: "/about",
    actions: [
      { label: "About Us Page", href: "/about", action: "navigate" },
      { label: "Our Leadership", href: "/about#leadership", action: "navigate" },
    ],
    suggestedFollowUps: [
      "What are IHDUA's key focus areas?",
      "What is IHDUA's overall impact?",
      "Where are your offices located?",
    ],
  },
  {
    id: "impact_numbers",
    title: "Key Impact & Statistics",
    category: "about",
    keywords: ["impact", "numbers", "stats", "statistics", "achievements", "results", "villages", "shg", "trained"],
    summary:
      "202+ villages reached, 697+ SHGs formed, 7,578+ women members, ₹9.14+ Cr loans facilitated, 5,000+ people trained, 28 health camps.",
    content:
      "IHDUA's verified achievements:\n• 202+ Villages Reached\n• 697+ Self-Help Groups (SHGs) Formed across 18 Federations\n• 7,578+ Active Women SHG Members\n• ₹9.14+ Crores in bank loans and credit linkages facilitated\n• 5,000+ People Trained (2,174+ in tailoring, 514+ in computers, 267+ in nursing care)\n• 663+ Micro-enterprises launched\n• 135 Schools Reached & 28 Free Health Camps with 3,487+ beneficiaries",
    url: "/#our-impact",
    actions: [
      { label: "View Impact Section", href: "/#our-impact", action: "navigate" },
      { label: "Stories from the Field", href: "/blogs", action: "navigate" },
    ],
    suggestedFollowUps: [
      "Tell me about women empowerment programs",
      "What education initiatives do you run?",
      "How do health camps work?",
    ],
  },
  {
    id: "education_schools",
    title: "Education Initiatives & Schools",
    category: "education",
    keywords: ["education", "school", "schools", "vinayaka", "adarsha", "krs", "mysore", "children", "students"],
    summary:
      "IHDUA operates Vinayaka Jnana Vidyashale in Mysore and Adarsha Academy in KRS, providing rural and underprivileged children with quality holistic education.",
    content:
      "IHDUA runs two flagship educational institutions:\n1. Vinayaka Jnana Vidyashale (Mysore): Dedicated to underprivileged children, offering STEM labs, digital classrooms, sports, arts, and nutrition.\n2. Adarsha Academy (KRS): Progressive rural education in Krishnarajasagara with academic excellence, digital learning, and life skills.\nSubsidized fees and child sponsorships ensure no child is left behind.",
    url: "/education",
    actions: [
      { label: "Vinayaka Vidyashale", href: "/vinayakagnana-vidyashale-mysore", action: "navigate" },
      { label: "Adarsha Academy KRS", href: "/adarsha-academy-krs", action: "navigate" },
      { label: "Sponsor a Child", href: "/#donate", action: "donate" },
    ],
    suggestedFollowUps: [
      "How can I sponsor a child's education?",
      "Can I volunteer as a teacher?",
      "What is the curriculum at IHDUA schools?",
    ],
  },
  {
    id: "women_shg_microfinance",
    title: "Women Empowerment, SHGs & Microfinance",
    category: "women",
    keywords: ["women", "shg", "self help", "federation", "microfinance", "loans", "credit", "stitching", "tailoring"],
    summary:
      "IHDUA mobilizes 7,578+ women across 697+ SHGs, facilitated ₹9.14+ Cr in loans, and trained 2,174+ women in the Stitching Unit.",
    content:
      "Our women empowerment ecosystem comprises:\n• 697+ Self-Help Groups (SHGs) under 18 Federations fostering savings habits and leadership.\n• Microfinance Linkages: Over ₹9.14 Crores in fair institutional credit disbursed without predatory interest.\n• Stitching & Garment Unit: Vocational center where 2,174+ women have learned garment manufacturing, earning regular incomes.",
    url: "/women-empowerment",
    actions: [
      { label: "SHG Federation", href: "/self-help-group-federation", action: "navigate" },
      { label: "Stitching Unit", href: "/stitching-unit", action: "navigate" },
    ],
    suggestedFollowUps: [
      "Can we order bulk garments from the stitching unit?",
      "What micro-enterprises do women run?",
      "How do bank linkages work?",
    ],
  },
  {
    id: "donations_tax",
    title: "Donations, 80G (India) & 501(c)(3) (USA) Tax Deductions",
    category: "donation",
    keywords: ["donate", "donation", "tax", "80g", "501c3", "exemption", "deduction", "receipt", "upi", "csr"],
    summary:
      "Donations to IHDUA are eligible for 80G tax exemption in India (50% deduction) and 501(c)(3) tax deductions in the US.",
    content:
      "Tax Deductions:\n• India: Eligible for 50% deduction under Section 80G of the Income Tax Act. Instant 80G receipt issued.\n• USA: Eligible for 501(c)(3) tax deductions via IHDUA Chicago chapter.\n\nWays to Give: Donate online through our website via UPI, Cards, Netbanking, or sponsor specific programs (Educate a Child, Sewing Machine, Medical Camps).",
    url: "/#donate",
    actions: [
      { label: "Donate Online", href: "/#donate", action: "donate" },
      { label: "CSR Inquiry", href: "/contact", action: "navigate" },
    ],
    suggestedFollowUps: [
      "How do I receive my 80G certificate?",
      "Can US residents donate and get tax deductions?",
      "What is the cost to sponsor a student?",
    ],
  },
  {
    id: "offices_contact",
    title: "Offices, Location & Contact",
    category: "contact",
    keywords: ["contact", "office", "address", "location", "phone", "email", "mysore", "chicago", "hours"],
    summary:
      "Headquarters in Mysore (Phone: +91 821 248 1234, info@ihdua.org) and US Office in Chicago (+1 312 819-0691).",
    content:
      "📍 India Headquarters (Mysore):\nIHDUA Center, Mysore-Ooty Road / 18 & 19 Hebbal Industrial Estate, near Bharath Cancer Hospital, Hebbalu, Mysore 570016.\nPhone: +91 821 248 1234 | Email: info@ihdua.org\nHours: Mon-Sat, 9:00 AM - 5:00 PM\n\n📍 USA Chapter (Chicago):\n360 E Randolph St, Apt 3701, Chicago, IL 60601 | Phone: +1 (312) 819-0691",
    url: "/contact",
    actions: [
      { label: "Contact Us", href: "/contact", action: "navigate" },
    ],
    suggestedFollowUps: [
      "What are the Mysore office timings?",
      "How do I apply for volunteering?",
      "Who manages CSR partnerships?",
    ],
  },
  {
    id: "farmers_agriculture",
    title: "Farmer Empowerment & Sustainable Agriculture",
    category: "farmers",
    keywords: ["farmer", "farmers", "agriculture", "sustainable", "soil", "turmeric", "millet", "fodder", "livestock"],
    summary:
      "IHDUA empowers farmers through soil health (48+), turmeric cultivation (32+), foxtail millet (15), and green fodder (3,290+ farmers).",
    content:
      "IHDUA supports rural smallholder farmers through practical training and sustainable agricultural practices:\n• 48+ Farmers completed Soil Health training.\n• 32+ Farmers participated in Turmeric Cultivation awareness.\n• 15 Farmers adopted drought-resilient Foxtail Millet.\n• 3,290+ Farmers received high-yield green maize fodder for cattle.\n• 43 Farmer SHGs supported with organic methods and water conservation.",
    url: "/farmers",
    actions: [
      { label: "Farmers Support", href: "/farmers", action: "navigate" },
      { label: "Donate (80G)", href: "/#donate", action: "donate" },
    ],
    suggestedFollowUps: [
      "What agricultural training does IHDUA provide?",
      "How does green fodder help livestock?",
      "Tell me about the Model Village project",
    ],
  },
  {
    id: "youth_skills",
    title: "Youth Skills & Vocational Opportunities",
    category: "youth",
    keywords: ["youth", "skills", "computer", "gda", "nursing", "vocational", "jobs", "training"],
    summary:
      "IHDUA trains youth in computer courses (514+), GDA nursing care (265+), and tailoring (2,161+) across 3,290+ participants.",
    content:
      "IHDUA’s Skill Development Project prepares rural youth for careers:\n• 514+ Rural youth completed Computer Training courses.\n• 265+ (267+) Certified as General Duty Healthcare Assistants (GDA).\n• 2,161+ Trained in Tailoring and garment manufacturing.\n• 3,290+ Total learners recorded across IHDUA's skill development programmes.",
    url: "/youth",
    actions: [
      { label: "Youth Programs", href: "/youth", action: "navigate" },
      { label: "Skills & Employment", href: "/skills-and-employment", action: "navigate" },
    ],
    suggestedFollowUps: [
      "What is the duration of the GDA nursing course?",
      "How can youth enroll in computer training?",
    ],
  },
  {
    id: "model_village_rejuvenation",
    title: "Model Village & Village Rejuvenation",
    category: "model_village",
    keywords: ["model village", "rejuvenation", "solar", "toilet", "sanitation", "green cover", "gram swaraj"],
    summary:
      "Model Village Gram Swaraj: 16+ solar lights, 14+ toilet beneficiaries, 5 fruit saplings/family, 81+ cattle fodder.",
    content:
      "IHDUA's Model Village and Rejuvenation projects implement Gram Swaraj:\n• 16+ Solar street lights installed.\n• 14+ People benefited from toilet construction.\n• 5 Fruit saplings distributed per family.\n• 81+ Cattle supported with green fodder.\n• 34+ Leaders participated in sustainable agriculture exposure visits.",
    url: "/model-village",
    actions: [
      { label: "Model Village", href: "/model-village", action: "navigate" },
      { label: "Village Rejuvenation", href: "/rejuvenation-of-villages", action: "navigate" },
    ],
    suggestedFollowUps: [
      "How does solar street lighting help villages?",
      "Tell me about Increase the Green Cover",
    ],
  },
  {
    id: "legal_certifications_12a_80g_fcra",
    title: "12A, 80G and FCRA Approval Certificates",
    category: "governance",
    keywords: ["12a", "12ab", "80g", "fcra", "form 10ac", "form 10be", "urn", "tax deduction", "foreign contribution"],
    summary:
      "IHDUA holds 12A/12AB registration (URN: AAATI3426LE20216, dated 22 Mar 2022), 80G approval (URN: AAATI3426LF20214, dated 23 Mar 2022) valid through AY 2026-27, and renewed FCRA registration (No: 094590127) valid through 2028.",
    content:
      "IHDUA is officially certified and registered under Indian non-profit and tax regulations:\n\n1. Section 12A / 12AB Registration:\n• Order Form 10AC under Section 12A/12AB.\n• URN: AAATI3426LE20216 | Order Date: 22-03-2022 | Valid: AY 2022-23 to AY 2026-27.\n\n2. Section 80G Approval & Form 10BE:\n• Order Form 10AC under Section 80G.\n• URN: AAATI3426LF20214 | Order Date: 23-03-2022 | Valid: AY 2022-23 to AY 2026-27.\n• Tax Benefit: 50% deduction on taxable income for donors.\n• Form 10BE: Issued to donors for income tax filing.\n\n3. FCRA Registration:\n• Registration No: 094590127 (Educational and Social).\n• Renewal Date: 01-04-2023, valid through 31-03-2028 (5 years).",
    url: "/about",
    actions: [
      { label: "About IHDUA", href: "/about", action: "navigate" },
      { label: "Donate (80G)", href: "/#donate", action: "donate" },
    ],
    suggestedFollowUps: [
      "How do donors claim 80G tax deductions with Form 10BE?",
      "Can foreign residents donate under FCRA?",
    ],
  },
  {
    id: "trust_deed_charitable_objectives",
    title: "IHDUA Trust Deed & Charitable Objectives",
    category: "about",
    keywords: ["trust deed", "charitable objectives", "aims", "objects", "history", "founding", "child welfare", "sports", "culture"],
    summary:
      "The IHDUA Trust Deed outlines 9 charitable objectives: Education, Child Welfare, Culture & Heritage, Social Welfare, Health, Environment, Sports, Skill Development, and Community Empowerment.",
    content:
      "The IHDUA Trust Deed outlines 9 founding charitable objectives:\n1. Education: Rural schools (Vinayaka Vidyashale & Adarsha Academy KRS), scholarships, digital labs.\n2. Child Welfare: Support for destitute children, orphan care, child nutrition.\n3. Culture & Heritage: Preserving folk arts, Indian traditions, cultural programmes.\n4. Social Welfare: Support for underprivileged individuals, widows, and vulnerable rural families.\n5. Health & Sanitation: Rural health camps, eye clinics, cancer screening, hygiene awareness.\n6. Environment: Tree planting (Increase Green Cover), wildlife protection, solar lighting.\n7. Sports: Rural youth athletics, coaching, and equipment.\n8. Skill Development: Stitching Unit, computer literacy, GDA nursing care, and SHG microfinance.\n9. Community: Lectures, exhibitions, and Gram Swaraj empowerment.",
    url: "/about",
    actions: [
      { label: "About IHDUA", href: "/about", action: "navigate" },
      { label: "Our Impact", href: "/#our-impact", action: "navigate" },
    ],
    suggestedFollowUps: [
      "What schools does IHDUA run?",
      "Tell me about the Stitching Unit",
    ],
  },
];

function ragSearch(query: string) {
  const q = query.toLowerCase().trim();

  if (/\b(pan card number|pan number|what is your pan|full pan)\b/i.test(q)) {
    return {
      reply:
        "**IHDUA Registration & PAN Status:**\n\nIHDUA is registered under Section 12A/12AB (URN: `AAATI3426LE20216`) and Section 80G (URN: `AAATI3426LF20214`) with a verified PAN. Official registration details and Form 10BE certificates are provided directly on donor receipts for tax filing.",
      sources: ["IHDUA Compliance Records"],
      actions: [
        { label: "Donate (80G)", href: "/#donate", action: "donate" },
        { label: "Contact Us", href: "/contact", action: "navigate" },
      ],
      suggestedFollowUps: [
        "How do I receive my 80G certificate?",
        "Can international donors contribute through FCRA?",
      ],
    };
  }

  if (/\b(fcra bank account|fcra account number|designated sbi account|sbi account number|bank account number)\b/i.test(q)) {
    return {
      reply:
        "**FCRA Foreign Contribution Guidelines:**\n\nIHDUA holds valid FCRA Registration No: `094590127` (Educational and Social). In compliance with FCRA banking security rules, designated remittance wire details are provided directly by our finance department. Please contact **info@ihdua.org** or visit our [Contact Page](/contact) for official wire transfer instructions.",
      sources: ["IHDUA FCRA Guidelines"],
      actions: [
        { label: "Contact Finance Team", href: "/contact", action: "navigate" },
        { label: "Donate Online", href: "/#donate", action: "donate" },
      ],
      suggestedFollowUps: [
        "What is IHDUA's FCRA registration number?",
        "Can US citizens donate with 501(c)(3) benefits?",
      ],
    };
  }

  if (/^(hi|hello|hey|namaste|greetings)(\s.*)?$/i.test(q)) {
    return {
      reply:
        "Hello! 👋 Welcome to IHDUA AI Assistant. I can help answer questions regarding our education institutions, women self-help groups, healthcare camps, 80G tax-exempt donations, and office locations. How can I help you today?",
      sources: ["IHDUA Knowledge Base"],
      actions: [
        { label: "Schools & Education", href: "/education", action: "navigate" },
        { label: "Women Empowerment", href: "/women-empowerment", action: "navigate" },
        { label: "Donate (80G Tax Exemption)", href: "/#donate", action: "donate" },
      ],
      suggestedFollowUps: [
        "Tell me about the schools in Mysore and KRS",
        "How do I donate with 80G tax benefit?",
        "Where is the IHDUA office located?",
      ],
    };
  }

  let bestDoc: KnowledgeDoc | null = null;
  let maxScore = 0;

  for (const doc of KNOWLEDGE_BASE) {
    let score = 0;
    for (const kw of doc.keywords) {
      if (q.includes(kw)) score += 5;
    }
    const words = q.split(/\s+/).filter((w) => w.length > 2);
    for (const word of words) {
      if (doc.title.toLowerCase().includes(word)) score += 3;
      if (doc.content.toLowerCase().includes(word)) score += 1;
    }
    if (score > maxScore) {
      maxScore = score;
      bestDoc = doc;
    }
  }

  if (bestDoc && maxScore >= 3) {
    return {
      reply: `### ${bestDoc.title}\n\n${bestDoc.content}`,
      sources: [bestDoc.title],
      actions: bestDoc.actions ?? [],
      suggestedFollowUps: bestDoc.suggestedFollowUps ?? [],
    };
  }

  return {
    reply:
      "I couldn't find an exact match in the knowledge base, but I can share details on:\n" +
      "• **Education:** Vinayaka Jnana Vidyashale & Adarsha Academy KRS\n" +
      "• **Women Empowerment:** 697+ SHGs & Stitching Unit\n" +
      "• **Healthcare:** 28+ Free Health Camps & 3,480+ beneficiaries\n" +
      "• **Donations:** 80G (India) & 501(c)(3) (USA) tax exemption\n" +
      "• **Offices:** Mysore & Chicago locations",
    sources: ["IHDUA Overview"],
    actions: [
      { label: "View Programs", href: "/#our-impact", action: "navigate" },
      { label: "Donate Online", href: "/#donate", action: "donate" },
      { label: "Contact Us", href: "/contact", action: "navigate" },
    ],
    suggestedFollowUps: [
      "Tell me about Adarsha Academy KRS",
      "How do donations qualify for 80G tax exemption?",
      "Where is the IHDUA office located?",
    ],
  };
}

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "ihdua-ai-chatbot" });
});

app.post("/chat", (req, res) => {
  const message = typeof req.body?.message === "string" ? req.body.message : "";

  if (!message.trim()) {
    return res.status(400).json({
      reply: "Please provide a message or question about IHDUA.",
    });
  }

  const result = ragSearch(message);
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`AI chatbot running at http://localhost:${PORT}`);
});
