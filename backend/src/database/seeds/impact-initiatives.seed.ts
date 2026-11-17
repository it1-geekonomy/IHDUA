import * as dotenv from 'dotenv';
import { IsNull } from 'typeorm';
import AppDataSource from '../data-source';
import { ImpactCategory } from '../../modules/impact-categories/entities/impact-category.entity';
import { ImpactInitiative } from '../../modules/impact-initiatives/entities/impact-initiative.entity';
import { ContentStatus } from '../../common/enums/content-status.enum';

dotenv.config();

interface SeedInitiativeDef {
  categorySlug: string;
  name: string;
  slug: string;
  displayOrder: number;
  heroTitle: string;
  heroDescription: string;
  heroImageUrl: string;
  heroImageMobileUrl?: string;
  cardTitle: string;
  cardImageUrl: string;
  metaTitle?: string;
  metaDescription?: string;
  content: Record<string, unknown>;
}

const INITIATIVES: SeedInitiativeDef[] = [
  // ==========================================
  // 1. EDUCATION (layout: education)
  // ==========================================
  {
    categorySlug: 'education',
    name: 'Adarsha Academy',
    slug: 'adarsha-academy-krs',
    displayOrder: 1,
    metaTitle: 'Adarsha Academy | Rural Education | IHDUA',
    metaDescription:
      'Creating opportunities to learn, grow and build brighter futures for rural children and communities.',
    heroTitle: 'Adarsha Academy',
    heroDescription:
      'Creating opportunities to learn, grow and build brighter futures for rural children and communities.',
    heroImageUrl:
      'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/1793853875714-wfp0c-frame-648.webp',
    heroImageMobileUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/rural-education/frame-695.png',
    cardTitle: 'Adarsha Academy',
    cardImageUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/rural-education/rectangle-44-1.png',
    content: {
      intro: {
        eyebrow: 'EDUCATION',
        heading: 'Adarsha Academy',
        description:
          'A rural private school providing education to children from villages in the vicinity of the Krishnarajasagara (KRS) Dam.',
        button: { label: 'Visit School Website', href: '#' },
        highlights: [
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/icons/mission.png',
            heading: 'Mission',
            description:
              'Providing quality primary education for children in rural communities.',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/icons/benifit.png',
            heading: 'Beneficiaries',
            description: 'More than 380 students since 2010',
          },
        ],
      },
      storyImageRight: {
        heading: 'Education in a Rural Setting',
        paragraphs: [
          'The Adarsha Academy is a kindergarten through 8th grade rural private school providing full-time education to children from seven villages in the vicinity of the Krishnarajasagara (KRS) Dam.',
          'The school is situated in a rural setting overlooking the KRS reservoir, surrounded by an agricultural landscape. This setting forms an important part of the school environment and provides a peaceful space for learning. Students follow a state-approved Kannada-medium curriculum, while students in grades 6 through 8 also receive instruction in English.',
        ],
        image: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/rural-education/rectangle-51-2.png',
      },
      storyImageLeft: {
        heading: 'Education for Rural Children',
        paragraphs: [
          'In 1994, while IHDUA was conducting a cancer screening programme in Mullur, its field team was preparing to establish a clinic to address local healthcare needs.',
          'The community made a different request: could those resources instead help establish a school for local children?',
          'At the time, children from Mullur and nearby villages had to travel long distances to attend government schools. Recognising the need for accessible education, IHDUA responded by establishing a kindergarten programme and developing a school for the community.',
        ],
        image: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/rural-education/rectangle-52-2.png',
        button: {
          label: 'View All Photos',
          href: '/adarsha-academy-krs/gallery',
        },
      },
      communityStory: {
        heading: 'Learning in the Heart of the Community',
        paragraphs: [
          "The school grounds are situated on an outcrop overlooking the KRS reservoir, which is a vast and important fixture of the region's agricultural infrastructure. More than that, however, it serves as a tranquil backdrop for learning and contemplative reflection.",
        ],
        image: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/rural-education/rectangle-55-1.png',
        featureCard: {
          iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/rural-education/raphael_books-1.png',
          title: 'A Rural Learning Environment',
          description:
            'Students follow a state-approved Kannada-medium curriculum, while those in grades 6 through 8 also receive instruction in English.',
        },
      },
    },
  },
  {
    categorySlug: 'education',
    name: 'Vinayaka Jnana Vidyashale, Mysuru',
    slug: 'vinayakagnana-vidyashale-mysore',
    displayOrder: 2,
    metaTitle: 'Vinayaka Jnana Vidyashale, Mysuru | Rural Education | IHDUA',
    metaDescription:
      'Creating opportunities to learn, grow and build brighter futures for rural children and communities.',
    heroTitle: 'Vinayaka Jnana Vidyashale, Mysuru',
    heroDescription:
      'Creating opportunities to learn, grow and build brighter futures for rural children and communities.',
    heroImageUrl:
      'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/1793853875714-wfp0c-frame-648.webp',
    heroImageMobileUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/rural-education/mobile-frame-751.png',
    cardTitle: 'Vinayaka Jnana Vidyashale, Mysuru',
    cardImageUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/rural-education/rectangle-44.png',
    content: {
      intro: {
        eyebrow: 'EDUCATION',
        heading: 'Vinayaka Jnana Vidyashale, Mysuru',
        description:
          'Creating opportunities for rural children through accessible, quality education.',
        button: { label: 'Visit School Website', href: '#' },
        highlights: [
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/icons/mission.png',
            heading: 'Mission',
            description:
              'Provide excellent primary school instruction for rural students.',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/icons/benifit.png',
            heading: '3,000+',
            description:
              'Students have completed 10th grade since the school was founded in 1994.',
          },
        ],
      },
      storyImageRight: {
        heading: 'Education That Grew From a Community Need',
        paragraphs: [
          'The Vinayaka Jnana Vidya Shale, commonly known in English as the Mullur School, is a rural private school serving students from kindergarten through 10th grade. The school was established to respond to an educational need identified within the local community.',
          'The school was established in 1994 following a request from the local community during an IHDUA cancer screening programme in Mullur. Today, the school continues to provide educational instruction to more than 400 children each year, serving students from the surrounding rural community.',
        ],
        image:
          'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/1793854133542-shcwj-rectangle-51.webp',
      },
      storyImageLeft: {
        heading: 'From Cancer Screening to Classrooms',
        paragraphs: [
          'In 1994, while IHDUA was conducting a cancer screening programme in the village of Mullur, the field team was preparing to establish a clinic to address local healthcare needs.',
          'The community made a different request: could those resources instead help establish a school for local children?',
          'At the time, children from Mullur and nearby villages had to travel long distances to attend government schools. The community identified access to quality education as an important local need.',
        ],
        image:
          'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/1793854167732-03zlk-rectangle-52.webp',
        button: {
          label: 'View All Photos',
          href: '/vinayakagnana-vidyashale-mysore/gallery',
        },
      },
      communityStory: {
        heading: 'Building Foundations for the Future',
        paragraphs: [
          'Education creates opportunities for children to develop knowledge, discover their abilities, and prepare for the future. Vinayaka Jnana Vidyashale supports rural students through school-based learning.',
        ],
        image:
          'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/rural-education/vinayaka-jnana-vidyashale-mysuru/rectangle-55-2.png',
        featureCard: {
          iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/rural-education/raphael_books-1.png',
          title: 'Learning for Every Child',
          description:
            'A school environment that encourages curiosity, builds essential knowledge, and helps children progress in their education.',
        },
      },
      statsStrip: {
        items: [
          {
            iconUrl:
              'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/rural-education/vinayaka-jnana-vidyashale-mysuru/fi_14600942.png',
            value: '3,000+',
            label: 'Students completed 10th grade',
          },
          {
            iconUrl:
              'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/rural-education/vinayaka-jnana-vidyashale-mysuru/fi_158234.png',
            value: '32+',
            label: 'Years of Education',
          },
          {
            iconUrl:
              'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/rural-education/vinayaka-jnana-vidyashale-mysuru/fi_4733397.png',
            value: '400+',
            label: 'Children served each year',
          },
          {
            iconUrl:
              'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/rural-education/vinayaka-jnana-vidyashale-mysuru/fi_12885332.png',
            value: '20+',
            label: 'Classrooms and learning spaces',
          },
        ],
      },
    },
  },

  // ==========================================
  // 2. WOMEN EMPOWERMENT (layout: women_empowerment)
  // ==========================================
  {
    categorySlug: 'women-empowerment',
    name: 'Self-Help Group & Federation',
    slug: 'self-help-group-federation',
    displayOrder: 1,
    metaTitle: 'Self-Help Group & Federation | IHDUA',
    metaDescription:
      'IHDUA supports rural women through Self-Help Groups and federations that build savings, leadership and collective decision-making.',
    heroTitle: 'Self Help Group & Federation',
    heroDescription:
      'Village Self-Help Groups and federations where women save together, share decisions and grow as community leaders.',
    heroImageUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/selfhelpgroup/banner-desktop.png',
    heroImageMobileUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/selfhelpgroup/banner-mobile.png',
    cardTitle: 'Self-Help Group & Federation',
    cardImageUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/womenempowerment/self-help.png',
    content: {
      intro: {
        eyebrow: 'WOMEN EMPOWERMENT',
        heading: 'Self Help Group & Federation',
        description:
          'IHDUA supports rural communities through Self-Help Groups that encourage collective savings, shared decision-making and women’s leadership.',
        highlights: [
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/icons/mission.png',
            heading: 'Mission',
            description:
              'Empowering rural women through savings, skills and leadership.',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/icons/benifit.png',
            heading: 'Beneficiaries',
            description:
              'Building financial confidence, collaboration and stronger communities.',
          },
        ],
      },
      overview: {
        heading: 'The Power of Collective Action',
        paragraphs: [
          'Self-Help Groups (SHGs) bring together 10–20 women from the same village to build financial skills, shared responsibility and leadership. With IHDUA’s guidance, members contribute to shared savings, maintain group records and participate in collective decision-making.',
          'Through regular meetings and shared learning, members build confidence, strengthen their financial awareness and support one another in addressing common challenges. Federations bring SHG representatives together once a month to discuss community concerns, exchange experiences and identify possible solutions. These collective efforts encourage shared responsibility, stronger local networks and greater participation in community decision-making.',
        ],
        image: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/selfhelpgroup/collective.png',
      },
      howItWorks: {
        eyebrow: 'HOW SELF-HELP GROUPS WORK',
        heading: 'Small Steps. Shared Progress.',
        description:
          'IHDUA facilitates the formation of SHGs and provides guidance on group rules, meeting processes and recordkeeping. Two selected members receive additional training to maintain group records and coordinate with bank officials.',
        steps: [
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/icons/training-session.svg',
            title: 'Group Formation',
            description:
              '10–20 women from the same village come together to form a group.',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/icons/savings-fund.svg',
            title: 'Regular Savings',
            description:
              'Members contribute to a shared fund and build a savings habit.',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/icons/financial-literacy.svg',
            title: 'Financial Learning',
            description:
              'Members gain practical skills in recordkeeping and financial management.',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/icons/peer-support.svg',
            title: 'Leadership & Participation',
            description:
              'Members take part in decisions and community activities.',
          },
        ],
      },
      twoImageStories: [
        {
          heading: 'Creating Financial Independence for Rural Women',
          topDescription:
            'IHDUA’s Self-Help Groups help rural women save together, keep group records and take part in collective decisions. Regular meetings build financial confidence, while federations bring group representatives together to discuss village concerns and share solutions.',
          images: [
            'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/selfhelpgroup/financial-independence-1.jpg',
            'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/selfhelpgroup/financial-independence-2.jpg',
          ],
          bottomDescription:
            'IHDUA’s Microfinance Initiative makes it possible for rural women to become informed financial decision-makers who have access to loans at competitive rates, which they may use for their family’s health, education and livelihood needs. Microfinance also supports women through Self-Help Groups, where members can build savings, access loans, participate in income-generating activities and strengthen their role in household and community decision-making.',
        },
      ],
      featureGrid: {
        eyebrow: 'SELF-HELP GROUPS & FEDERATIONS',
        heading: 'Stronger Communities, Together',
        paragraphs: [
          'IHDUA supports village-based Self-Help Groups where members come together to build knowledge, share responsibilities and work towards common goals. Through group participation and leadership development, women can strengthen their role in community life.',
          'Federations connect SHG representatives, creating a space to discuss local challenges, exchange ideas and identify solutions together.',
        ],
        features: [
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/icons/piggy-bank.svg',
            title: 'Community Leadership',
            description: 'Encouraging women to lead group decisions.',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/icons/training-session.svg',
            title: 'Shared Responsibility',
            description: 'Working together towards common goals.',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/icons/peer-support.svg',
            title: 'Collective Voice',
            description: 'Sharing concerns and finding solutions.',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/icons/wallet.svg',
            title: 'Stronger Networks',
            description: 'Building connections through shared experiences.',
          },
        ],
      },
      impactStats: {
        heading: 'The Impact We Make',
        paragraphs: [
          'IHDUA’s Women Leadership Project has supported the formation of 697 Self-Help Groups (SHGs), bringing together 7,578 members. These groups encourage collective savings, financial awareness and shared responsibility among community members.',
          'The programme also reports 18 federations, where SHG representatives meet monthly to discuss common challenges and work towards solutions. Through these collective efforts, IHDUA promotes women’s leadership, stronger community connections and greater participation in decision-making.',
        ],
        bannerHeading: 'Creating Lasting Change',
        stats: [
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/icons/training-session.svg',
            iconBg: '#F1E7F4',
            value: '7,578+',
            label: 'SHG Members',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/icons/women-empowerment.svg',
            iconBg: '#FFEDCF',
            value: '697+',
            label: 'Self-Help Groups',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/icons/community-network.svg',
            iconBg: '#F1E7F4',
            value: '18',
            label: 'Federations Reported',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/icons/sustainable-livelihoods.svg',
            iconBg: '#FFEDCF',
            value: '43',
            label: 'Farmer SHGs',
          },
        ],
      },
    },
  },
  {
    categorySlug: 'women-empowerment',
    name: 'Microfinance Initiative',
    slug: 'micro-finance-initiatives',
    displayOrder: 2,
    metaTitle: 'Microfinance Initiative | IHDUA',
    metaDescription:
      'IHDUA’s Microfinance Initiative helps rural women build savings, access credit and strengthen financial decision-making through Self-Help Groups.',
    heroTitle: 'Micro-finance Initiative',
    heroDescription:
      'Community-based savings and fair credit that help rural women invest in health, education and livelihoods.',
    heroImageUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/microfinanceinitiatives/banner-desktop.png',
    heroImageMobileUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/microfinanceinitiatives/banner-mobile.png',
    cardTitle: 'Microfinance Initiative',
    cardImageUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/womenempowerment/microfinance.png',
    content: {
      intro: {
        eyebrow: 'WOMEN EMPOWERMENT',
        heading: 'Microfinance Initiative',
        description:
          'IHDUA supports community-based savings and access to financial learning so rural women can make informed decisions.',
        highlights: [
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/icons/mission.png',
            heading: 'Mission',
            description:
              'Supporting community-driven investment activities on behalf of rural women.',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/icons/benifit.png',
            heading: 'Beneficiaries',
            description:
              'More than 5,000 women have benefited from our programmes.',
          },
        ],
      },
      overview: {
        heading: 'Why Microfinance Matters',
        paragraphs: [
          'IHDUA’s Microfinance Initiative makes it possible for rural women to become informed financial decision-makers who have access to loans at competitive rates, which they may use for their family’s health, education and livelihood needs. Microfinance also supports women through Self-Help Groups, where members can build savings, access loans, participate in income-generating activities and strengthen their role in household and community decision-making.',
          'Self-Help Groups provide a community-based platform where women can save together, access financial support and participate in income-generating activities. Through these groups, IHDUA’s Microfinance Initiative encourages greater participation, shared responsibility and stronger financial decision-making within rural communities.',
        ],
        image: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/microfinanceinitiatives/why-microfinance-matters.png',
      },
      howItWorks: {
        eyebrow: 'HOW MICROFINANCE WORKS',
        heading: 'Small Steps. Shared Progress.',
        description:
          'IHDUA supports Self-Help Groups through shared savings, group rules, meeting processes and financial recordkeeping. Two selected members receive additional training to maintain records and coordinate with bank officials.',
        steps: [
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/icons/savings-fund.svg',
            title: 'Build a Savings Fund',
            description:
              'Members contribute ₹10 each week to grow their shared fund.',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/icons/financial-literacy.svg',
            title: 'Access Group Loans',
            description:
              'Members may apply for loans after three months of contributions.',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/icons/peer-support.svg',
            title: 'Review Loan Requests',
            description:
              "The group collectively discusses and approves members' loan requests.",
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/icons/wallet.svg',
            title: 'Build Bank Linkages',
            description:
              'After four lending rounds, groups can access bank loans directly.',
          },
        ],
      },
      twoImageStories: [
        {
          heading: 'Creating Financial Independence Through Microfinance',
          topDescription:
            'IHDUA’s Microfinance Initiative helps rural women access financial resources through Self-Help Groups (SHGs). Members build shared savings, learn financial recordkeeping and collectively review loan requests. After three months of contributions, members may become eligible to borrow from their group fund.',
          images: [
            'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/microfinanceinitiatives/financial-independence-1.png',
            'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/microfinanceinitiatives/financial-independence-2.png',
          ],
          bottomDescription:
            'The initiative supports women in managing finances, accessing credit and participating in income-generating activities. Through regular savings and group lending, members develop financial responsibility and strengthen their role in household and community decision-making.',
        },
        {
          heading: 'Creating Financial Independence for Rural Women',
          topDescription:
            'IHDUA’s Microfinance Initiative supports rural women through Self-Help Groups (SHGs), helping members build shared savings, develop financial management skills and access group loans. Members contribute regularly and participate in collective financial decisions.',
          images: [
            'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/microfinanceinitiatives/self-help-groups.png',
            'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/microfinanceinitiatives/field-household-visit.png',
          ],
          bottomDescription:
            'Groups that demonstrate consistent repayment discipline qualify for escalating credit tiers. After successfully completing four internal lending cycles, groups become eligible for formal bank credit lines, unlocking larger capital for micro-enterprises, agriculture, and family welfare.',
        },
      ],
      featureGrid: {
        eyebrow: 'SELF-HELP GROUPS',
        heading: 'Stronger Together',
        paragraphs: [
          'At the heart of this initiative are Self-Help Groups (SHGs), comprising 10 to 20 women from a single village. Members regularly contribute a small amount to a common fund, participate in training sessions and support each other in achieving their financial goals.',
          'These groups not only provide access to credit, but also create a safe space for women to learn, share experiences and build confidence.',
        ],
        features: [
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/icons/savings-fund.svg',
            title: 'Regular Savings',
            description: 'Small contributions create big opportunities.',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/icons/financial-literacy.svg',
            title: 'Training & Guidance',
            description:
              'Learn financial management and group responsibility.',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/icons/peer-support.svg',
            title: 'Peer Support',
            description: 'Grow together through shared knowledge.',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/icons/wallet.svg',
            title: 'Access to Credit',
            description: 'Fair and affordable loans for real needs.',
          },
        ],
      },
      impactStats: {
        heading: 'The Impact We Make',
        paragraphs: [
          'The programme’s records report 600 Self-Help Groups across 59 villages in Karnataka, including 492 groups composed entirely of women. Approximately 5,000 people have completed training seminars since the programme began in 2001. Historically, ₹10 crore in loans has been issued to SHGs, with a reported repayment rate of more than 90%. The records also report ₹4.36 crore in total SHG savings as of January 2022.',
        ],
        bannerHeading: 'Creating Lasting Change',
        stats: [
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/icons/training-session.svg',
            iconBg: '#F1E7F4',
            value: '5,000+',
            label: 'People Trained',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/icons/women-empowerment.svg',
            iconBg: '#FFEDCF',
            value: '600+',
            label: 'Self-Help Groups Reported',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/icons/community-network.svg',
            iconBg: '#F1E7F4',
            value: '₹4.36 Cr',
            label: 'SHG Savings (Jan 2022)',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/icons/sustainable-livelihoods.svg',
            iconBg: '#FFEDCF',
            value: '₹10 Cr+',
            label: 'Loans Historically Issued',
          },
        ],
      },
    },
  },

  // ==========================================
  // 3. SKILLS & EMPLOYMENT (layout: skills_employment)
  // ==========================================
  {
    categorySlug: 'skills-and-employment',
    name: 'Women',
    slug: 'women',
    displayOrder: 1,
    metaTitle: 'Women | Skills & Employment | IHDUA',
    metaDescription:
      'Supporting women to lead and grow through vocational training, self-help groups, and sustainable livelihood skills.',
    heroTitle: 'Women',
    heroDescription:
      'IHDUA promotes sustainable organic farming practices that support healthier soil, responsible agriculture and stronger rural communities',
    heroImageUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/skills-and-employement/womenbanner.png',
    heroImageMobileUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/skills-and-employement/womenmobilebg.png',
    cardTitle: 'Women',
    cardImageUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/skillsandemployment/women.png',
    content: {
      intro: {
        eyebrow: 'WOMEN EMPOWERMENT',
        heading: 'Supporting Women to Lead and Grow',
        description:
          'IHDUA empowers women through self-help groups, microfinance and vocational training to strengthen skills and livelihoods.',
        highlights: [
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/icons/mission.png',
            heading: 'Focus Areas',
            description:
              'Supporting women through self-help groups, microfinance and vocational training.',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/icons/benifit.png',
            heading: 'Programme Reach',
            description:
              '7,578 SHG members reported under IHDUA’s Women Leadership Project.',
          },
        ],
      },
      overview: {
        heading: 'Creating Opportunities for Brighter Futures',
        paragraphs: [
          'IHDUA works with women through community groups, access to financial resources and practical training programmes to help them build skills, participate in income-earning and strengthen their role in families and communities.',
          "Through Self-Help Groups, women build financial awareness, leadership and collective decision-making skills. Microfinance initiatives support access to financial resources, while vocational training develops practical skills in tailoring, Aari work and computer education. Together, these programmes support women's participation in income-generating activities and livelihood development.",
        ],
        image: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/skills-and-employement/women.png',
        button: { label: 'View All Photos', href: '/women/gallery' },
      },
      twoImageStory: {
        heading: 'Creating Opportunities for Women',
        topDescription:
          'IHDUA supports women through Self-Help Groups, microfinance initiatives and vocational training. These programmes encourage financial awareness, collective decision-making and participation in income-generating activities.',
        images: [
          'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/skills-and-employement/womenhelp1.png',
          'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/skills-and-employement/womenhelp2.png',
        ],
        bottomDescription:
          "The organisation's vocational training includes tailoring, Aari work, computer courses and other skill-based programmes. Through these initiatives, women can develop practical skills and strengthen their livelihood opportunities.",
      },
      impactStats: {
        heading: 'The Impact We Make',
        bannerHeading: 'Creating Lasting Change',
        style: 'strip',
        stats: [
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/skills-and-employement/697.png',
            iconBg: '#F1E7F4',
            value: '697+',
            label: 'Self-Help Groups formed',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/skills-and-employement/7578.png',
            iconBg: '#FFEDCF',
            value: '7,578+',
            label: 'SHG members',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/skills-and-employement/18.png',
            iconBg: '#F1E7F4',
            value: '18',
            label: 'Federations reported',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/skills-and-employement/3290.png',
            iconBg: '#FFEDCF',
            value: '3,290+',
            label: 'Skill development participants recorded',
          },
        ],
      },
    },
  },
  {
    categorySlug: 'skills-and-employment',
    name: 'Youth',
    slug: 'youth',
    displayOrder: 2,
    metaTitle: 'Youth | Skills & Employment | IHDUA',
    metaDescription:
      'Youth skill development and vocational training covering computers, GDA, tailoring, and practical trades.',
    heroTitle: 'Youth',
    heroDescription:
      'IHDUA promotes sustainable organic farming practices that support healthier soil, responsible agriculture and stronger rural communities',
    heroImageUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/skills-and-employement/youthbanner.png',
    heroImageMobileUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/skills-and-employement/youthmobilebg.png',
    cardTitle: 'Youth',
    cardImageUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/skillsandemployment/youth.png',
    content: {
      intro: {
        eyebrow: 'YOUTH EMPOWERMENT',
        heading: 'Youth Skills & Opportunities',
        description:
          'IHDUA supports rural youth through skill development and vocational training to build practical skills and future opportunities.',
        highlights: [
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/icons/mission.png',
            heading: 'Focus Areas',
            description:
              'Skill development, digital literacy and vocational training to enhance employability and future opportunities for rural youth.',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/icons/benifit.png',
            heading: 'Programme Reach',
            description:
              'Youth equipped with practical skills through computer training, GDA training and other vocational courses.',
          },
        ],
      },
      overview: {
        heading: 'Why Youth Skill Development Matters',
        paragraphs: [
          'IHDUA’s Skill Development Project provides rural students with opportunities to develop practical knowledge and prepare for employment. The programme includes computer training covering basic computer skills, Tally, GST and spoken English, alongside General Duty Assistant (GDA) training and other vocational courses. These initiatives aim to strengthen employability and make skill development more accessible to rural communities.',
          'Through structured training, students can develop useful abilities, explore different career pathways and prepare for future opportunities. IHDUA’s listed courses also include tailoring, Aari work, Lippan art, Vision Assistant training and Thanjavur painting, offering learners opportunities to explore different vocational skills.',
        ],
        image: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/youth/whyyouthskills.png',
      },
      twoImageStory: {
        heading: 'Building Skills for a Brighter Future',
        topDescription:
          'IHDUA’s Skill Development Project provides rural students with training in computer skills, Tally, GST and spoken English, alongside General Duty Assistant (GDA) and other vocational courses. These programmes aim to strengthen practical abilities and improve access to employment opportunities.',
        images: [
          'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/1793854937878-x0jtj-rectangle-35.webp',
          'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/1793854866964-pb50r-rectangle-34.webp',
        ],
        bottomDescription:
          'The organisation also offers vocational training in tailoring, Aari work, Lippan art, Vision Assistant training and Thanjavur painting. Through these courses, students can explore different skills, develop their capabilities and prepare for future livelihood opportunities.',
      },
      featureGrid: {
        eyebrow: 'Youth Skill Development',
        heading: 'Building Skills Together',
        paragraphs: [
          'IHDUA supports rural students through vocational training programmes that develop practical skills and prepare them for employment opportunities. Courses include computer training, General Duty Assistant (GDA), tailoring and other vocational disciplines.',
          'These programmes help rural youth develop practical skills, gain confidence and prepare for future employment opportunities.',
        ],
        features: [
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/skills-and-employement/practiclelearning.png',
            title: 'Practical Learning',
            description: 'Develop useful skills through hands-on training.',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/skills-and-employement/training.png',
            title: 'Training & Guidance',
            description: 'Learn through structured vocational programmes.',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/skills-and-employement/peersupport.png',
            title: 'Peer Support',
            description: 'Build confidence through shared learning.',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/skills-and-employement/credit.png',
            title: 'Access to Credit',
            description: 'Prepare for future employment opportunities.',
          },
        ],
      },
      impactStats: {
        heading: 'The Impact We Make',
        paragraphs: [
          'IHDUA’s Skill Development Project provides rural students with training in computer skills, General Duty Assistant (GDA) and other vocational courses. The report records participation across multiple training programmes, supporting practical skill development and employment opportunities.',
        ],
        bannerHeading: 'Creating Lasting Change',
        stats: [
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/healthawareness/160.png',
            iconBg: '#F1E7F4',
            value: '514+',
            label: 'Computer course participants',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/healthawareness/855.png',
            iconBg: '#FFEDCF',
            value: '265+',
            label: 'GDA course participants',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/healthawareness/988.png',
            iconBg: '#F1E7F4',
            value: '2,161',
            label: 'Tailoring training participants',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/healthawareness/34.png',
            iconBg: '#FFEDCF',
            value: '3,290+',
            label: 'Total skill development participants',
          },
        ],
      },
    },
  },
  {
    categorySlug: 'skills-and-employment',
    name: 'Farmers',
    slug: 'farmers',
    displayOrder: 3,
    metaTitle: 'Farmers | Skills & Employment | IHDUA',
    metaDescription:
      'Supporting rural farmers through sustainable agricultural practices, soil health improvement and livestock support to strengthen farming communities.',
    heroTitle: 'Farmers',
    heroDescription:
      'Supporting rural farmers through sustainable agricultural practices, soil health improvement and livestock support to strengthen farming communities.',
    heroImageUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/farmers/farmersbanner.png',
    heroImageMobileUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/farmers/farmersmobilebanner.png',
    cardTitle: 'Farmers',
    cardImageUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/skillsandemployment/farmers.png',
    content: {
      intro: {
        eyebrow: 'FARMER EMPOWERMENT',
        heading: 'Sustainable Farming',
        description:
          'IHDUA supports rural farmers through agricultural initiatives, practical training and sustainable farming practices that strengthen rural livelihoods.',
        highlights: [
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/icons/mission.png',
            heading: 'Focus Areas',
            description:
              'Sustainable agriculture, soil health, crop cultivation and livestock care.',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/icons/benifit.png',
            heading: 'Programme Reach',
            description:
              'Farmer support through agricultural training, demonstrations and Model Village initiatives.',
          },
        ],
      },
      overview: {
        heading: 'Why Sustainable Farming Matters',
        paragraphs: [
          'IHDUA’s Model Village project supports farmers through soil health training, composting, crop cultivation awareness and agricultural exposure visits. Documented activities include foxtail millet adoption, turmeric cultivation awareness and sunflower farming guidance.',
          'Through the Model Village project, farmers participate in activities such as composting, crop cultivation awareness and agricultural exposure visits. Initiatives include foxtail millet adoption, turmeric and sunflower cultivation awareness, fruit sapling distribution and livestock support. Together, these efforts encourage improved farming practices, strengthen agricultural knowledge and support rural communities.',
        ],
        image: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/farmers/sustainablefarming.png',
      },
      twoImageStory: {
        heading: 'Supporting Farmers Together',
        topDescription:
          'IHDUA’s Model Village project supports farmers through soil health training, composting, crop cultivation awareness and agricultural exposure visits. These activities encourage improved farming practices, promote sustainable agriculture and strengthen farmers’ knowledge.',
        images: [
          'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/1793946279960-2yxa9-rectangle-35-5-.webp',
          'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/farmers/supportfarmers2.png',
        ],
        bottomDescription:
          'The project also documents foxtail millet adoption, turmeric and sunflower cultivation awareness, fruit sapling distribution and vermicompost production. Livestock support includes veterinary camps, green fodder distribution and Azolla cultivation. These activities support animal health and sustainable farming practices.',
      },
      featureGrid: {
        eyebrow: 'SUSTAINABLE AGRICULTURE',
        heading: 'Supporting Farmers Together',
        paragraphs: [
          'IHDUA’s Model Village project supports farmers through soil health training, composting, crop cultivation awareness and agricultural exposure visits. These activities promote sustainable farming practices and strengthen agricultural knowledge.',
          'These initiatives help farmers improve farming practices, support livestock health and strengthen rural livelihoods.',
        ],
        features: [
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/skills-and-employement/practiclelearning.png',
            title: 'Soil Health',
            description: 'Develop useful skills through hands-on training.',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/skills-and-employement/training.png',
            title: 'Crop Awareness',
            description: 'Turmeric and sunflower cultivation awareness.',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/skills-and-employement/peersupport.png',
            title: 'Livestock Support',
            description: 'Veterinary camps and green fodder distribution.',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/skills-and-employement/credit.png',
            title: 'Farmer Learning',
            description:
              'Agricultural exposure visits and practical learning.',
          },
        ],
      },
      impactStats: {
        heading: 'The Impact We Make',
        paragraphs: [
          'IHDUA’s Skill Development Project provides rural students with training in computer skills, General Duty Assistant (GDA) and other vocational courses. The report records participation across multiple training programmes, supporting practical skill development and employment opportunities.',
        ],
        bannerHeading: 'Creating Lasting Change',
        stats: [
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/healthawareness/160.png',
            iconBg: '#F1E7F4',
            value: '48+',
            label: 'Soil health training participants.',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/healthawareness/855.png',
            iconBg: '#FFEDCF',
            value: '32+',
            label: 'Turmeric cultivation awareness participants.',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/healthawareness/988.png',
            iconBg: '#F1E7F4',
            value: '15',
            label: 'Farmers adopted foxtail millet.',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/healthawareness/34.png',
            iconBg: '#FFEDCF',
            value: '3,290+',
            label: 'Farmers received green maize fodder.',
          },
        ],
      },
    },
  },
  {
    categorySlug: 'skills-and-employment',
    name: 'Stitching Unit',
    slug: 'stitching-unit',
    displayOrder: 4,
    metaTitle: 'Stitching Unit | Skills & Employment | IHDUA',
    metaDescription:
      'A practical skills programme designed to provide vocational training opportunities for rural women.',
    heroTitle: 'Stitching Unit',
    heroDescription:
      'IHDUA promotes sustainable organic farming practices that support healthier soil, responsible agriculture and stronger rural communities',
    heroImageUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/stitchingunit/banner1.png',
    heroImageMobileUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/stitchingunit/mobilebanner1.png',
    cardTitle: 'Stitching Unit',
    cardImageUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/skillsandemployment/stitchingunit.png',
    content: {
      intro: {
        eyebrow: 'Women Empowerment',
        heading: 'Vocational Training',
        description:
          'A practical skills programme designed to provide vocational training opportunities for rural women.',
        highlights: [
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/icons/mission.png',
            heading: 'Mission',
            description:
              'Provide practical vocational training to rural women.',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/icons/benifit.png',
            heading: 'Beneficiaries',
            description:
              'More than 250 women have benefited from our programmes since 2005.',
          },
        ],
      },
      overview: {
        heading: 'Practical Skills. New Opportunities.',
        paragraphs: [
          'IHDUA’s vocational training programme provides rural women with practical tailoring skills that can support employment and additional livelihood opportunities. The programme was established to create another avenue for women to develop a commercially valuable skill alongside their existing responsibilities at home and in the fields.',
          'Each year, training workshops are conducted in two villages. Over six months, participants learn hand stitching, embroidery and the operation of modern sewing machines, developing skills that can be used for factory employment or home-based tailoring work.',
        ],
        image: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/stitchingunit/practicalskills.png',
      },
      video: {
        heading: 'Forging Paths to Economic Engagement',
        paragraphs: [
          'Village women are fully invested in the success of their family farms, and they perform multiple roles on a daily basis out in the fields and in the homes. But beyond the boundary lines of their family plots, these women find few opportunities to apply their farming and animal husbandry skills in supplementary money-generating activities.',
          'In order to provide an additional avenue for rural women to earn more money, we have established a vocational training program that provides instruction in tailoring, a craft that is in perennial demand in southern India',
        ],
        videos: [
          { url: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/stitchingunit/video1.mp4', title: 'Tailoring uniforms' },
          {
            url: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/stitchingunit/video2.mp4',
            title: 'Women learning tailoring',
          },
        ],
      },
      impactStats: {
        heading: 'The Impact We Make',
        paragraphs: [
          'IHDUA’s vocational training programme gives rural women the opportunity to develop practical tailoring skills that can be used for employment or home-based work. By learning within their own communities, participants can build skills while continuing to manage their existing family responsibilities.',
        ],
        bannerHeading: 'Turning Skills Into Opportunities',
        stats: [
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/healthawareness/160.png',
            iconBg: '#F1E7F4',
            value: '250+',
            label: 'Women Benefited',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/healthawareness/855.png',
            iconBg: '#FFEDCF',
            value: '06 Months',
            label: 'Training Duration',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/healthawareness/988.png',
            iconBg: '#F1E7F4',
            value: '02',
            label: 'Villages Per Year',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/healthawareness/34.png',
            iconBg: '#FFEDCF',
            value: 'Since 2005',
            label: 'Programme Running',
          },
        ],
      },
      gallery: {
        heading: 'Gallery',
        displayMode: 'inline',
        images: [
          'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/stitchingunit/gallerypic1.png',
          'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/stitchingunit/gallerypic2.png',
          'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/stitchingunit/gallerypic3.png',
          'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/stitchingunit/gallerypic4.png',
        ],
      },
    },
  },

  // ==========================================
  // 4. MODEL VILLAGE (layout: model_village)
  // ==========================================
  {
    categorySlug: 'model-village',
    name: 'Rejuvenation of villages',
    slug: 'rejuvenation-of-villages',
    displayOrder: 1,
    metaTitle: 'Rejuvenation of Villages | Model Village | IHDUA',
    metaDescription:
      'Supporting holistic village development through sustainable agriculture, livestock care and community infrastructure initiatives.',
    heroTitle: 'Rejuvenation of villages',
    heroDescription:
      'Supporting holistic village development through sustainable agriculture, livestock care and community infrastructure initiatives.',
    heroImageUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/modelvillage/rejuvenationbanner.png',
    heroImageMobileUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/modelvillage/rejuvenationmobilebg.png',
    cardTitle: 'Rejuvenation of villages',
    cardImageUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/modelvillage/villaged1.png',
    content: {
      intro: {
        eyebrow: 'VILLAGE DEVELOPMENT',
        heading: 'Building Better Rural Communities',
        description:
          'IHDUA supports rural farmers through agricultural initiatives, practical training and sustainable farming practices that strengthen rural livelihoods.',
        highlights: [
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/icons/mission.png',
            heading: 'Focus Areas',
            description:
              'Agriculture, livestock care, sanitation and village infrastructure improvements.',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/icons/benifit.png',
            heading: 'Programme Reach',
            description:
              'Village initiatives include soil health training, veterinary support and solar street-light installation.',
          },
        ],
      },
      textBlock: {
        eyebrow: 'WHY VILLAGE DEVELOPMENT MATTERS',
        heading: 'Supporting Holistic Village Development',
        paragraphs: [
          'IHDUA’s Model Village project combines agricultural, livestock and infrastructure initiatives to address local needs. Documented activities include soil health training, composting, crop cultivation awareness, veterinary camps and sanitation improvements. The project also includes fruit sapling distribution, green fodder support, toilet construction and solar street-light installation.',
        ],
      },
      imageGrid: {
        heading: 'Building a Sustainable Village',
        paragraphs: [
          'IHDUA’s Model Village project focuses on Chikkahundi village in Gundlupet taluk, supporting holistic development through sustainable agriculture, organic farming and eco-friendly activities. The project addresses community needs through agricultural, livestock and infrastructure initiatives.',
          'Documented activities include soil health training, vermicompost production, fruit sapling distribution, veterinary camps, toilet construction and solar street-light installation. These initiatives support farming practices, livestock well-being and village infrastructure.',
        ],
        images: [
          'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/1793855083670-yngwd-rectangle-35-1-.webp',
          'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/1793855119443-xxlen-rectangle-34-1-.webp',
          'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/1793855146655-ejch2-rectangle-35-2-.webp',
          'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/1793855184197-xhmu6-rectangle-34-2-.webp',
        ],
      },
      impactStats: {
        heading: 'The Impact We Make',
        paragraphs: [
          'IHDUA’s Model Village project records agricultural, livestock and village infrastructure initiatives. Activities include soil health training, composting, crop cultivation awareness, veterinary support and sanitation improvements.',
        ],
        bannerHeading: 'Creating Lasting Change',
        stats: [
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/healthawareness/160.png',
            iconBg: '#F1E7F4',
            value: '16+',
            label: 'Solar street lights installed',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/healthawareness/855.png',
            iconBg: '#FFEDCF',
            value: '14+',
            label: 'People benefited from toilet construction',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/healthawareness/988.png',
            iconBg: '#F1E7F4',
            value: '48',
            label: 'Soil health training participants',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/healthawareness/34.png',
            iconBg: '#FFEDCF',
            value: '81+',
            label: 'Cattle covered by green fodder distribution',
          },
        ],
      },
    },
  },
  {
    categorySlug: 'model-village',
    name: 'Increase the green cover',
    slug: 'increase-the-green-cover',
    displayOrder: 2,
    metaTitle: 'Increase the Green Cover | Model Village | IHDUA',
    metaDescription:
      'Encouraging greener rural communities through fruit sapling distribution, sustainable agriculture and eco-friendly village initiatives.',
    heroTitle: 'Increase the green cover',
    heroDescription:
      'Encouraging greener rural communities through fruit sapling distribution, sustainable agriculture and eco-friendly village initiatives.',
    heroImageUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/modelvillage/greencoverbanner.png',
    heroImageMobileUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/modelvillage/greencovermobile.png',
    cardTitle: 'Increase the green cover',
    cardImageUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/modelvillage/villaged2.png',
    content: {
      intro: {
        eyebrow: 'GREEN VILLAGE INITIATIVES',
        heading: 'Growing a Greener Future',
        description:
          'IHDUA supports rural farmers through agricultural initiatives, practical training and sustainable farming practices that strengthen rural livelihoods.',
        highlights: [
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/icons/mission.png',
            heading: 'Focus Areas',
            description:
              'Fruit sapling distribution, horticulture and sustainable farming practices.',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/icons/benifit.png',
            heading: 'Programme Reach',
            description:
              'Fruit saplings, agroforestry learning and eco-friendly agricultural initiatives.',
          },
        ],
      },
      textBlock: {
        eyebrow: 'WHY GREEN COVER MATTERS',
        heading: 'Supporting Greener Rural Communities',
        paragraphs: [
          'IHDUA’s documented horticulture activities include distributing five fruit saplings per family to support nutrition and low-cost cultivation. Agricultural exposure visits also introduce participants to agroforestry and other farming practices.',
          'These activities form part of the Model Village project’s broader focus on sustainable agriculture and eco-friendly village development.',
        ],
      },
      imageGrid: {
        heading: 'Growing Through Sustainable Practices',
        paragraphs: [
          'Horticulture and agroforestry are among the agricultural activities documented in IHDUA’s Model Village project. These initiatives connect farming practices with nutrition, resource use and sustainable rural development.',
          'Horticulture and agroforestry are among the agricultural activities documented in IHDUA’s Model Village project. These initiatives connect farming practices with nutrition, resource use and sustainable rural development.',
        ],
        images: [
          'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/modelvillage/growing1.png',
          'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/modelvillage/growing2.png',
          'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/modelvillage/growing3.png',
          'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/modelvillage/growing4.png',
        ],
      },
      impactStats: {
        heading: 'The Impact We Make',
        paragraphs: [
          'IHDUA’s Model Village project includes horticulture activities, fruit sapling distribution and agroforestry learning. These initiatives support nutrition, low-cost cultivation and sustainable agricultural practices.',
        ],
        bannerHeading: 'Creating Lasting Change',
        stats: [
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/healthawareness/160.png',
            iconBg: '#F1E7F4',
            value: '5/family',
            label: 'Fruit saplings distributed',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/healthawareness/855.png',
            iconBg: '#FFEDCF',
            value: '16',
            label: 'Participants in Model Village exposure visit',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/healthawareness/988.png',
            iconBg: '#F1E7F4',
            value: '18',
            label: 'Participants from other villages in exposure visit',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/healthawareness/34.png',
            iconBg: '#FFEDCF',
            value: '32',
            label: 'Farmers reached through sunflower cultivation awareness',
          },
        ],
      },
    },
  },

  // ==========================================
  // 5. HEALTH (layout: health)
  // ==========================================
  {
    categorySlug: 'health',
    name: 'Health Awareness',
    slug: 'health-awareness',
    displayOrder: 1,
    metaTitle: 'Health Awareness | Health | IHDUA',
    metaDescription:
      'Working alongside rural communities to create opportunities, strengthen livelihoods, and build brighter futures.',
    heroTitle: 'Health Awareness',
    heroDescription:
      'Working alongside rural communities to create opportunities, strengthen livelihoods, and build brighter futures.',
    heroImageUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/healthawareness/healthawarenessbg.png',
    heroImageMobileUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/healthawareness/healthawarenessmobilebg.png',
    cardTitle: 'Health Awareness',
    cardImageUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/health/health111.png',
    content: {
      intro: {
        eyebrow: 'HEALTH AWARENESS',
        heading: 'Building Healthier Communities',
        description:
          'IHDUA’s health education initiatives cover personal and environmental hygiene, nutrition, sanitation, reproductive health and common health concerns.',
        highlights: [
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/icons/mission.png',
            heading: 'Focus Areas',
            description:
              'Health education, hygiene practices, nutrition and reproductive health awareness.',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/icons/benifit.png',
            heading: 'Programme Reach',
            description:
              'Health education reached SHG members, schoolchildren and Anganwadi workers.',
          },
        ],
      },
      textBlock: {
        eyebrow: 'WHY HEALTH AWARENESS MATTERS',
        heading: 'Knowledge That Supports Well-being',
        paragraphs: [
          'IHDUA conducted health education sessions covering nutrition, anaemia, personal hygiene, menstruation, sanitation, communicable diseases and family planning. Training also addressed the role of village health workers and community health awareness.',
          'These programmes used local community networks to share practical health information with rural women and families.',
        ],
      },
      imageGrid: {
        heading: 'Creating Awareness Through Education',
        paragraphs: [
          'IHDUA’s documented activities include health education for women’s Self-Help Groups, training for Anganwadi workers and reproductive and child health awareness sessions. These programmes covered nutrition, hygiene and maternal and child health.',
          'Sessions also addressed anaemia, menstruation, sanitation and family planning, helping participants access essential health information.',
        ],
        images: [
          'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/1793855228960-qt5ei-rectangle-35-3-.webp',
          'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/1793855271830-qp5id-rectangle-34-3-.webp',
          'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/1793855308305-wvf5f-rectangle-35-4-.webp',
          'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/1793855335574-9w3eb-rectangle-34-4-.webp',
        ],
      },
      impactStats: {
        heading: 'The Impact We Make',
        paragraphs: [
          "IHDUA's health awareness programmes have covered nutrition, hygiene, anaemia and reproductive health. Historical records document educational sessions for women, schoolchildren and Anganwadi workers. These initiatives helped share essential health information with rural communities.",
        ],
        bannerHeading: 'Creating Lasting Change',
        stats: [
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/healthawareness/160.png',
            iconBg: '#F1E7F4',
            value: '160',
            label: 'Reproductive and child health sessions',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/healthawareness/855.png',
            iconBg: '#FFEDCF',
            value: '855',
            label: 'Women in nutrition & anaemia sessions',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/healthawareness/988.png',
            iconBg: '#F1E7F4',
            value: '988',
            label: 'Women reached through hygiene sessions',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/healthawareness/34.png',
            iconBg: '#FFEDCF',
            value: '34+',
            label: 'Anganwadi workers trained',
          },
        ],
      },
    },
  },
  {
    categorySlug: 'health',
    name: 'Health Camps',
    slug: 'health-camps',
    displayOrder: 2,
    metaTitle: 'Health Camps | Health | IHDUA',
    metaDescription:
      'Working alongside rural communities to create opportunities, strengthen livelihoods, and build brighter futures.',
    heroTitle: 'Health Camps',
    heroDescription:
      'Working alongside rural communities to create opportunities, strengthen livelihoods, and build brighter futures.',
    heroImageUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/healthcamps/healthcampsbanner.png',
    heroImageMobileUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/healthcamps/healthcampmobilebg.png',
    cardTitle: 'Health Camps',
    cardImageUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/health/health222.png',
    content: {
      intro: {
        eyebrow: 'HEALTH AWARENESS',
        heading: 'Promoting Healthier Communities',
        description:
          'IHDUA supports rural farmers through agricultural initiatives, practical training and sustainable farming practices that strengthen rural livelihoods.',
        highlights: [
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/icons/mission.png',
            heading: 'Focus Areas',
            description:
              'Nutrition, hygiene, sanitation and reproductive health awareness.',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/icons/benifit.png',
            heading: 'Programme Reach',
            description:
              'Historical programmes included health education for women, schoolchildren and Anganwadi workers.',
          },
        ],
      },
      textBlock: {
        eyebrow: 'WHY VILLAGE DEVELOPMENT MATTERS',
        heading: 'Supporting Community Well-being',
        paragraphs: [
          'IHDUA conducted health education sessions covering nutrition, anaemia, personal hygiene, menstruation, sanitation and family planning. Training also addressed community health awareness and the role of village health workers. These initiatives shared essential health information with rural women and families through local community networks.',
        ],
      },
      imageGrid: {
        heading: 'Building Healthier Communities',
        paragraphs: [
          'IHDUA’s health awareness initiatives cover nutrition, hygiene, sanitation and reproductive health. The programmes address common health concerns and share essential health information with rural women and families.',
          'Documented activities include health education sessions, Anganwadi worker training, nutrition awareness and reproductive and child health programmes. These initiatives promote health knowledge and well-being in rural communities.',
        ],
        images: [
          'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/healthcamps/camps1.png',
          'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/healthcamps/camps2.png',
          'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/healthcamps/camps3.png',
          'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/healthcamps/camps4.png',
        ],
      },
      impactStats: {
        heading: 'The Impact We Make',
        paragraphs: [
          "IHDUA's health awareness programmes have covered nutrition, hygiene, anaemia and reproductive health. Historical records document educational sessions for women, schoolchildren and Anganwadi workers. These initiatives helped share essential health information with rural communities.",
        ],
        bannerHeading: 'Creating Lasting Change',
        stats: [
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/healthawareness/160.png',
            iconBg: '#F1E7F4',
            value: '160',
            label: 'Reproductive and child health sessions',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/healthawareness/855.png',
            iconBg: '#FFEDCF',
            value: '855',
            label: 'Women in nutrition & anaemia sessions',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/healthawareness/988.png',
            iconBg: '#F1E7F4',
            value: '988',
            label: 'Women reached through hygiene sessions',
          },
          {
            iconUrl: 'https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/healthawareness/34.png',
            iconBg: '#FFEDCF',
            value: '34+',
            label: 'Anganwadi workers trained',
          },
        ],
      },
    },
  },
];

async function seed() {
  await AppDataSource.initialize();
  const categoryRepo = AppDataSource.getRepository(ImpactCategory);
  const initiativeRepo = AppDataSource.getRepository(ImpactInitiative);

  let created = 0;
  let updated = 0;

  for (const def of INITIATIVES) {
    const category = await categoryRepo.findOne({
      where: { slug: def.categorySlug, deletedAt: IsNull() },
    });

    if (!category) {
      // eslint-disable-next-line no-console
      console.warn(
        `[seed] Category "${def.categorySlug}" not found! Skipping initiative "${def.name}".`,
      );
      continue;
    }

    const existing = await initiativeRepo.findOne({
      where: { slug: def.slug, deletedAt: IsNull() },
    });

    if (existing) {
      existing.categoryId = category.id;
      existing.name = def.name;
      existing.displayOrder = def.displayOrder;
      existing.status = ContentStatus.PUBLISHED;
      existing.heroTitle = def.heroTitle;
      existing.heroDescription = def.heroDescription;
      existing.heroImageUrl = def.heroImageUrl;
      existing.heroImageMobileUrl = def.heroImageMobileUrl ?? def.heroImageUrl;
      existing.cardTitle = def.cardTitle;
      existing.cardImageUrl = def.cardImageUrl;
      existing.metaTitle = def.metaTitle;
      existing.metaDescription = def.metaDescription;
      existing.content = def.content;
      await initiativeRepo.save(existing);
      updated++;
      // eslint-disable-next-line no-console
      console.log(
        `[seed] Updated initiative "${def.name}" (${def.slug}) with fresh Figma seed data.`,
      );
      continue;
    }

    const initiative = initiativeRepo.create({
      categoryId: category.id,
      name: def.name,
      slug: def.slug,
      displayOrder: def.displayOrder,
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date(),
      heroTitle: def.heroTitle,
      heroDescription: def.heroDescription,
      heroImageUrl: def.heroImageUrl,
      heroImageMobileUrl: def.heroImageMobileUrl ?? def.heroImageUrl,
      cardTitle: def.cardTitle,
      cardImageUrl: def.cardImageUrl,
      metaTitle: def.metaTitle,
      metaDescription: def.metaDescription,
      content: def.content,
    });

    await initiativeRepo.save(initiative);
    created++;
    // eslint-disable-next-line no-console
    console.log(
      `[seed] Created initiative: "${def.name}" under [${category.name}].`,
    );
  }

  // eslint-disable-next-line no-console
  console.log(
    `[seed] Impact initiatives seeder finished: ${created} created, ${updated} updated with fresh Figma data.`,
  );

  await AppDataSource.destroy();
}

seed().catch(async (err) => {
  // eslint-disable-next-line no-console
  console.error('[seed] Failed:', err);
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
  process.exit(1);
});
