import { KnowledgeDocument } from "./types";

export const KNOWLEDGE_BASE: KnowledgeDocument[] = [
  {
    id: "about_ihdua",
    title: "About IHDUA (International Human Development and Uplifting Academy)",
    category: "about",
    keywords: [
      "ihdua",
      "about",
      "who we are",
      "organization",
      "history",
      "background",
      "mission",
      "vision",
      "values",
      "trust",
      "non profit",
      "ngo",
    ],
    summary:
      "IHDUA is a registered not-for-profit organisation working with rural and underserved communities to improve quality of life through education, healthcare, livelihood support, and sustainable development.",
    content:
      "The International Humanitarian Development & Upliftment Association (IHDUA) is a people-led not-for-profit organisation founded to uplift rural and marginalized populations. For over two decades, IHDUA has worked at the grassroots level in Karnataka, India, and internationally through its USA chapter in Chicago. Our mission is to empower rural communities through sustainable and inclusive development initiatives. Our vision is a just and equitable society where every individual has the opportunity to live a healthy, dignified, and productive life. Our core values are Compassion, Integrity, Inclusivity, Sustainability, Community Ownership, and Accountability.",
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
    keywords: [
      "impact",
      "numbers",
      "stats",
      "statistics",
      "achievements",
      "results",
      "villages",
      "shg",
      "trained",
      "beneficiaries",
    ],
    summary:
      "IHDUA has reached 202+ villages, supported 600+ SHGs with 7,578+ women members, facilitated ₹9.14+ Cr in loans, trained 5,000+ learners, and supported 3,480+ healthcare beneficiaries.",
    content:
      "IHDUA's grassroots footprint includes:\n• 202+ Villages Reached across Karnataka\n• 697+ Self-Help Groups (SHGs) Formed across 18 Federations\n• 7,578+ Active Women SHG Members\n• ₹9.14+ Crores in low-interest bank loans & credit linkages facilitated (218+ credit linkages)\n• 5,000+ Total People & Learners Trained\n  - 2,174+ Women trained in Tailoring & Garment Stitching\n  - 514+ Rural Youth trained in Computers & Digital Literacy\n  - 267+ Trained as General Duty Nursing Care Assistants (GDA)\n• 663+ Income Generation Micro-Enterprises launched\n• 43 Farmer SHGs supported\n• 135 Schools Reached & 28 Free Health Camps conducted with 3,487+ beneficiaries",
    url: "/#our-impact",
    actions: [
      { label: "View Impact Section", href: "/#our-impact", action: "navigate" },
      { label: "Stories from the Field", href: "/blogs", action: "navigate" },
    ],
    suggestedFollowUps: [
      "Tell me about the women empowerment programs",
      "What education initiatives do you run?",
      "How do health camps work?",
    ],
  },
  {
    id: "education_vinayaka",
    title: "Vinayaka Jnana Vidyashale (Mysore School)",
    category: "education",
    keywords: [
      "vinayaka",
      "jnana",
      "vidyashale",
      "school",
      "mysore school",
      "education",
      "children",
      "students",
      "mysore",
    ],
    summary:
      "Vinayaka Jnana Vidyashale in Mysore provides quality English and Kannada medium education to rural and economically underprivileged children with holistic development.",
    content:
      "Vinayaka Jnana Vidyashale is IHDUA's flagship rural school in Mysore. It is dedicated to bridging the educational divide by offering quality education to children from vulnerable and low-income backgrounds. The school provides state-of-the-art classrooms, STEM laboratories, computer education, comprehensive sports and arts curricula, and midday nourishment programs. Subsidized education and scholarships ensure that no deserving child is deprived of schooling due to financial hardship.",
    url: "/vinayakagnana-vidyashale-mysore",
    actions: [
      { label: "Vinayaka School Details", href: "/vinayakagnana-vidyashale-mysore", action: "navigate" },
      { label: "Sponsor a Child", href: "/#donate", action: "donate" },
    ],
    suggestedFollowUps: [
      "Tell me about Adarsha Academy KRS",
      "How can I sponsor a child's education?",
      "What is the curriculum at IHDUA schools?",
    ],
  },
  {
    id: "education_adarsha",
    title: "Adarsha Academy KRS",
    category: "education",
    keywords: [
      "adarsha",
      "academy",
      "krs",
      "krishnarajasagara",
      "school",
      "rural education",
      "stem",
      "digital learning",
    ],
    summary:
      "Adarsha Academy KRS delivers progressive rural education blending academic excellence, experiential STEM learning, arts, and value education for holistic student development.",
    content:
      "Located in Krishnarajasagara (KRS), Adarsha Academy is an educational model institution providing rural children with equal learning opportunities on par with urban standards. The academy emphasizes STEM learning, digital literacy, life skills, sports, and cultural arts. The institution focuses on nurturing confidence, critical thinking, and social consciousness in young minds, preparing them for higher education and modern careers.",
    url: "/adarsha-academy-krs",
    actions: [
      { label: "Adarsha Academy Details", href: "/adarsha-academy-krs", action: "navigate" },
      { label: "Explore Education Overview", href: "/education", action: "navigate" },
    ],
    suggestedFollowUps: [
      "How can I visit Adarsha Academy?",
      "Can I volunteer as a teacher or tutor?",
      "What other schools does IHDUA run?",
    ],
  },
  {
    id: "women_empowerment_shg",
    title: "Women Empowerment & Self-Help Group (SHG) Federation",
    category: "women",
    keywords: [
      "women",
      "empowerment",
      "shg",
      "self help groups",
      "federation",
      "women savings",
      "rural women",
      "solidarity",
    ],
    summary:
      "IHDUA has mobilized 7,578+ rural women into 697+ Self-Help Groups across 18 Federations, fostering financial autonomy, leadership, and community decision-making.",
    content:
      "IHDUA's women empowerment model revolves around grassroots Self-Help Groups (SHGs). By organizing women into weekly savings and mutual support collectives, the initiative instills financial discipline, reduces dependence on exploitative local moneylenders, and elevates women's status as household financial decision-makers. The groups are unified under 18 registered Federations that negotiate community needs, run micro-enterprises, and actively intervene in local governance and social issues.",
    url: "/self-help-group-federation",
    actions: [
      { label: "SHG & Federation Details", href: "/self-help-group-federation", action: "navigate" },
      { label: "Women Empowerment Overview", href: "/women-empowerment", action: "navigate" },
    ],
    suggestedFollowUps: [
      "How does IHDUA's microfinance program work?",
      "What is the Stitching Unit for women?",
      "How can I support rural women entrepreneurs?",
    ],
  },
  {
    id: "microfinance_initiatives",
    title: "Microfinance & Bank Credit Linkages",
    category: "microfinance",
    keywords: [
      "microfinance",
      "loans",
      "credit",
      "bank linkages",
      "interest",
      "capital",
      "entrepreneurship",
      "business",
      "finance",
    ],
    summary:
      "IHDUA has facilitated over ₹9.14 Crores in bank loans and credit linkages for rural women and small businesses across 218+ credit partnerships.",
    content:
      "Through official institutional partnerships with nationalized and cooperative banks, IHDUA helps women-led SHGs access formal credit at fair interest rates without predatory collateral requirements. Over ₹9.14 Crores in loans have been disbursed, funding micro-enterprises such as dairy farming, tailoring shops, grocery kiosks, handicraft manufacturing, and agricultural equipment. This provides sustainable livelihoods and protects vulnerable families from intergenerational debt cycles.",
    url: "/micro-finance-initiatives",
    actions: [
      { label: "Microfinance Details", href: "/micro-finance-initiatives", action: "navigate" },
      { label: "Partner With Us", href: "/contact", action: "navigate" },
    ],
    suggestedFollowUps: [
      "What businesses do women start with microfinance?",
      "How does bank credit linkage work?",
      "Tell me about the Stitching Unit",
    ],
  },
  {
    id: "skills_stitching_unit",
    title: "Stitching & Garment Production Unit",
    category: "skills",
    keywords: [
      "stitching",
      "garment",
      "tailoring",
      "sewing",
      "women skills",
      "apparel",
      "textiles",
      "employment",
      "job",
    ],
    summary:
      "The IHDUA Stitching Unit has trained over 2,174 women in professional garment tailoring, providing direct livelihood, order manufacturing, and market access.",
    content:
      "The IHDUA Stitching Unit is an operational vocational production hub located in Karnataka. It equips rural women with industry-grade sewing, cutting, pattern making, and quality control skills. More than 2,174 women have graduated from this program. Many work directly at IHDUA's production center making uniforms, tote bags, and garments, while others run independent home tailoring businesses, earning independent monthly incomes that uplift their families.",
    url: "/stitching-unit",
    actions: [
      { label: "Stitching Unit Details", href: "/stitching-unit", action: "navigate" },
      { label: "Skills & Employment", href: "/skills-and-employment", action: "navigate" },
    ],
    suggestedFollowUps: [
      "Can we order bulk garments or uniforms from the stitching unit?",
      "What other vocational training does IHDUA offer?",
      "How can I donate a sewing machine?",
    ],
  },
  {
    id: "skills_youth_and_farmers",
    title: "Youth Vocational Training & Farmers Support",
    category: "skills",
    keywords: [
      "youth",
      "farmers",
      "agriculture",
      "computer training",
      "nursing",
      "gda",
      "employment",
      "vocational",
      "organic farming",
    ],
    summary:
      "IHDUA trains youth in computer courses (514+) and nursing care (267+), and supports 43 farmer SHGs with soil conservation and sustainable organic farming methods.",
    content:
      "IHDUA’s Skills & Employment division provides multi-faceted vocational pathways:\n• Youth Computer Literacy: 514+ students trained in MS Office, digital communications, accounting software, and typing.\n• General Duty Nursing Care (GDA): 267+ youth certified as healthcare and geriatric nursing assistants, securing placements in hospitals and clinics.\n• Farmers Support: 43 Farmer SHGs guided in organic agriculture, drip irrigation, compost making, seed banks, and direct market linkage to protect local biodiversity and enhance farm profitability.",
    url: "/skills-and-employment",
    actions: [
      { label: "Youth Programs", href: "/youth", action: "navigate" },
      { label: "Farmers Support", href: "/farmers", action: "navigate" },
    ],
    suggestedFollowUps: [
      "What is the duration of the nursing course?",
      "Tell me about the Model Village project",
      "How can companies support with CSR?",
    ],
  },
  {
    id: "model_village_green_cover",
    title: "Model Village & Increase the Green Cover",
    category: "model_village",
    keywords: [
      "model village",
      "green cover",
      "environment",
      "tree plantation",
      "afforestation",
      "village rejuvenation",
      "sanitation",
      "solar",
      "clean water",
    ],
    summary:
      "IHDUA transforms rural hamlets into sustainable Model Villages with clean sanitation, solar lighting, drinking water facilities, and extensive tree plantation drives.",
    content:
      "Inspired by the concept of Gram Swaraj (self-reliant village communities), IHDUA’s Model Village initiative rejuvenates underserved villages through holistic infrastructure:\n• Community Sanitation & Waste Management: Constructing individual and community toilet facilities to eliminate open defecation.\n• Safe Drinking Water: Installation of filtration units and water replenishment structures.\n• Renewable Solar Energy: Solar street lights for safe village pathways.\n• Increase the Green Cover: Large-scale afforestation campaigns planting thousands of native fruit and shade trees across school grounds, roadsides, and village commons.",
    url: "/increase-the-green-cover",
    actions: [
      { label: "Increase Green Cover", href: "/increase-the-green-cover", action: "navigate" },
      { label: "Village Rejuvenation", href: "/rejuvenation-of-villages", action: "navigate" },
    ],
    suggestedFollowUps: [
      "How can I sponsor a tree planting drive?",
      "Which villages have been transformed?",
      "Tell me about health camps",
    ],
  },
  {
    id: "healthcare_camps",
    title: "Healthcare Initiatives & Free Medical Camps",
    category: "health",
    keywords: [
      "health",
      "medical camps",
      "healthcare",
      "doctor",
      "checkups",
      "eye camp",
      "cancer screening",
      "medicine",
      "hygiene",
      "maternal health",
    ],
    summary:
      "IHDUA has organized 28+ free healthcare camps treating 3,487+ rural patients with diagnostic screenings, vision checkups, free medicines, and maternal nutrition workshops.",
    content:
      "Access to quality medical care is a severe challenge in remote rural hamlets. IHDUA brings qualified specialist doctors, nurses, and diagnostics directly to village doorsteps through regular Medical Camps. Services include general medical consultations, pediatric checkups, geriatric care, eye examinations with free spectacles distribution, and cancer screenings. IHDUA also conducts health awareness workshops educating rural mothers on hygiene, menstrual health, and childhood nutrition.",
    url: "/health-camps",
    actions: [
      { label: "Health Camps Details", href: "/health-camps", action: "navigate" },
      { label: "Health Awareness", href: "/health-awareness", action: "navigate" },
    ],
    suggestedFollowUps: [
      "Can doctors volunteer at IHDUA health camps?",
      "How do I sponsor a village medical camp?",
      "What are the upcoming health camp dates?",
    ],
  },
  {
    id: "donations_tax_exemption",
    title: "Donations, Payment Modes & 80G / 501(c)(3) Tax Benefits",
    category: "donation",
    keywords: [
      "donate",
      "donation",
      "tax",
      "80g",
      "501c3",
      "tax exemption",
      "tax deduction",
      "receipt",
      "contribute",
      "upi",
      "payment",
      "csr",
      "how to donate",
    ],
    summary:
      "Donations to IHDUA qualify for 80G tax exemption in India (50% tax deduction) and 501(c)(3) tax deductions in the United States. Secure online donation is available on our website.",
    content:
      "Your support transforms rural lives. All donations to IHDUA are eligible for official tax benefits:\n\n• For Indian Donors: Donations are eligible for tax deductions under Section 80G of the Income Tax Act (50% deduction on taxable income). An official 80G receipt and certificate are issued upon receipt.\n• For US Donors: Donations are tax-deductible under Section 501(c)(3) through our registered Chicago non-profit office.\n\nWays to Contribute:\n1. Online via Website: Click the 'Donate' button to contribute via UPI (Google Pay, PhonePe, Paytm), Net Banking, Debit/Credit Cards, or international cards.\n2. Sponsorship Tiers: Sponsor a child's school education for a year, fund a woman's sewing machine kit, sponsor a free village health camp, or plant a green grove.\n3. Corporate CSR: IHDUA is registered and eligible for Corporate Social Responsibility (CSR) partnerships under MCA guidelines.",
    url: "/#donate",
    actions: [
      { label: "Donate Online Now", href: "/#donate", action: "donate" },
      { label: "Contact for CSR Partnerships", href: "/contact", action: "navigate" },
    ],
    suggestedFollowUps: [
      "How do I receive my 80G tax receipt?",
      "Can US residents donate and get tax deductions?",
      "What is the cost to sponsor a child's education?",
    ],
  },
  {
    id: "contact_offices",
    title: "Offices, Location & Contact Details",
    category: "contact",
    keywords: [
      "contact",
      "office",
      "address",
      "location",
      "phone",
      "email",
      "timings",
      "hours",
      "mysore",
      "chicago",
      "directions",
      "map",
    ],
    summary:
      "IHDUA Headquarters is in Mysore, Karnataka (Phone: +91 821 248 1234, Email: info@ihdua.org) and its US Chapter is in Chicago, IL (Phone: +1 312 819-0691).",
    content:
      "You are always welcome to connect with us or visit our centers:\n\n📍 India Headquarters (Mysore):\n• Address: IHDUA Center, Mysore-Ooty Road, Mysore, Karnataka 570008, India\n• Registered Office: 18 & 19, Hebbal Industrial Estate, near Bharath Cancer Hospital, Hebbalu, Mysore, Karnataka 570016\n• Phone: +91 821 248 1234\n• Email: info@ihdua.org\n• Office Hours: Monday to Saturday, 9:00 AM – 5:00 PM (Closed Sundays & National Holidays)\n\n📍 United States Chapter (Chicago):\n• Address: IHDUA - 360 E Randolph St, Apt 3701, Chicago, IL 60601, USA\n• Phone: +1 (312) 819-0691\n\nDirections: You can view Google Maps directions directly on our Contact page.",
    url: "/contact",
    actions: [
      { label: "View Contact Page & Map", href: "/contact", action: "navigate" },
      {
        label: "Get Google Maps Directions",
        href: "https://www.google.com/maps/dir/?api=1&destination=Internation+Human+Development+%26+Upliftment+Academy+Trust%2C+18+%26+19%2C+Hebbal+Industrial+Estate%2C+near+Bharath+Cancer+Hospital%2C+Hebbalu%2C+Karnataka+570016",
        action: "external",
      },
    ],
    suggestedFollowUps: [
      "What are the office visiting hours in Mysore?",
      "How do I apply for volunteering?",
      "Who can I speak to regarding CSR projects?",
    ],
  },
  {
    id: "volunteering_and_careers",
    title: "Volunteering, Internships & Getting Involved",
    category: "about",
    keywords: [
      "volunteer",
      "volunteering",
      "internship",
      "join",
      "career",
      "get involved",
      "students",
      "help",
      "teach",
    ],
    summary:
      "Join IHDUA as a volunteer or intern! We welcome educators, medical professionals, social workers, corporate volunteers, and youth mentors.",
    content:
      "IHDUA actively invites volunteers, student interns, and professionals passionate about social upliftment. Opportunities include:\n• Education & Mentorship: Teaching English, math, science, art, or computers at Vinayaka Jnana Vidyashale or Adarsha Academy KRS.\n• Healthcare: Doctors, optometrists, dentists, and nurses can participate in our weekend rural health camps.\n• Women & Youth Skills: Mentoring women entrepreneurs, conducting soft-skill or resume workshops for youth.\n• Digital & Content: Assisting with photography, storytelling, social media, and research.\n\nVolunteers receive mentorship and certificates of completion.",
    url: "/contact",
    actions: [
      { label: "Volunteer Application", href: "/contact", action: "navigate" },
      { label: "Read Volunteer Stories", href: "/blogs", action: "navigate" },
    ],
    suggestedFollowUps: [
      "Can university students do an internship at IHDUA?",
      "Do you provide volunteer certificates?",
      "How can companies partner for employee volunteering?",
    ],
  },
  {
    id: "leadership_ajaikumar",
    title: "Meet Our Leadership (Dr. B.S. Ajaikumar & Bhagya Ajaikumar)",
    category: "governance",
    keywords: [
      "ajaikumar",
      "dr ajaikumar",
      "dr. b.s. ajaikumar",
      "b.s. ajaikumar",
      "founder",
      "chairperson",
      "bhagya ajaikumar",
      "trustee",
      "trustees",
      "leadership",
      "team",
      "who founded",
      "who started",
      "board",
    ],
    summary:
      "IHDUA is led by Dr. B.S. Ajaikumar (Chairperson & Founder) and Bhagya Ajaikumar (Trustee), working to empower rural communities through education, healthcare, and sustainable development.",
    content:
      "IHDUA Leadership brings together a shared commitment to empowering rural communities:\n\n• **Dr. B.S. Ajaikumar (Chairperson & Founder):** A globally renowned surgical oncologist, healthcare visionary, humanitarian, and philanthropist. Dr. Ajaikumar founded IHDUA over two decades ago to address rural poverty and lack of healthcare and educational infrastructure in Karnataka. His visionary stewardship has guided IHDUA to reach 202+ villages, establish two flagship rural schools, organize 697+ Self-Help Groups, and deliver 28+ free medical camps.\n\n• **Bhagya Ajaikumar (Trustee):** Actively steers grassroots execution, women's empowerment initiatives, and institutional governance to ensure deep community ownership and sustainable change.",
    url: "/about",
    actions: [
      { label: "Meet Our Leadership", href: "/about", action: "navigate" },
      { label: "About IHDUA", href: "/about", action: "navigate" },
    ],
    suggestedFollowUps: [
      "What is Dr. B.S. Ajaikumar's vision for IHDUA?",
      "What programs does IHDUA run?",
      "Where is IHDUA located?",
    ],
  },
  {
    id: "shanthamma_ripple_effect",
    title: "The Ripple Effect of a Single Opportunity (How Shanthamma Secured Her Family's Future)",
    category: "women",
    keywords: [
      "shanthamma",
      "ripple effect",
      "the ripple effect of a single opportunity",
      "how shanthamma strengthened her family's future",
      "how shanthamma secured her family's future",
      "field story",
      "stories",
      "blog",
      "blogs",
      "beneficiary",
      "farmer story",
      "drip irrigation",
    ],
    summary:
      "How targeted drip-irrigation infrastructure, microfinance, and self-help training helped Shanthamma increase crop yields by 140% and secure her family's future.",
    content:
      "**The Ripple Effect of a Single Opportunity: How Shanthamma Secured Her Family's Future**\n\n• **The Challenge:** Farming with erratic monsoons led Shanthamma's small landholding into critical debt, threatening her children's secondary education.\n• **IHDUA's Intervention:** IHDUA provided direct drip-irrigation infrastructure combined with intensive organic multi-cropping bio-nutrient training, microfinance support, and Self-Help Group (SHG) membership.\n• **The Outcome:** Agricultural yields increased by 140%, household income stabilized year-round, and her eldest daughter successfully enrolled in college in Mysore!\n\nShanthamma's story illustrates the catalytic impact of targeted rural empowerment: empowering one woman creates lasting prosperity for the entire family and village.",
    url: "/blogs/the-ripple-effect-of-a-single-opportunity",
    actions: [
      { label: "Read Shanthamma's Story", href: "/blogs/the-ripple-effect-of-a-single-opportunity", action: "navigate" },
      { label: "More Field Stories", href: "/blogs", action: "navigate" },
      { label: "Support Rural Women", href: "/#donate", action: "donate" },
    ],
    suggestedFollowUps: [
      "How does IHDUA empower women through Self-Help Groups?",
      "What microfinance initiatives does IHDUA offer?",
      "How can I donate to support women farmers?",
    ],
  },
];
