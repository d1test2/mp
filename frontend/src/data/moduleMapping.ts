export type ModuleResourceLinks = {
  transcript?: string;
  worksheet?: string;
  handout?: string;
  exercise?: string;
};

export type ModuleConfig = {
  id: string;
  title: string;
  description?: string;
  videoSlugs: string[];
  resources?: ModuleResourceLinks;
  /** optional: next modules can be gated until this module is complete */
  requiresComplete?: string;
};

export type CourseModuleMapping = {
  modules: ModuleConfig[];
};

// TEMPORARY mapping until DB module tables exist.
// Keys must match backend course.slug.
export const moduleMapping: Record<string, CourseModuleMapping> = {
  'getting-started': {
    modules: [
      {
        id: 'mod1',
        title: 'Module 1: Getting Started',
        description: 'Build your foundation: goals, mindset, and deal basics.',
        videoSlugs: ['intro', 'welcome', 'what-is-btl', 'setting-goals'],
        resources: {
          transcript: '/transcripts/getting-started/mod1-transcript.pdf',
          worksheet: '/worksheets/getting-started/mod1-worksheet.pdf',
        },
      },
      {
        id: 'mod2',
        title: 'Module 2: Market & Mindset',
        description: 'Understand why investors win—and how to think like one.',
        videoSlugs: ['mindset', 'how-to-think-like-an-investor', 'risk-basics'],
        resources: {
          transcript: '/transcripts/getting-started/mod2-transcript.pdf',
          worksheet: '/worksheets/getting-started/mod2-worksheet.pdf',
        },
        requiresComplete: 'mod1',
      },
      {
        id: 'mod3',
        title: 'Module 3: Deal Readiness',
        description: 'Turn your interest into a repeatable deal pipeline.',
        videoSlugs: ['deal-readiness', 'deal-checklist', 'next-steps'],
        resources: {
          transcript: '/transcripts/getting-started/mod3-transcript.pdf',
          worksheet: '/worksheets/getting-started/mod3-worksheet.pdf',
        },
        requiresComplete: 'mod2',
      },
    ],
  },

  sourcing: {
    modules: [
      {
        id: 'mod1',
        title: 'Module 1: Property Sourcing Fundamentals',
        videoSlugs: ['sourcing', 'sourcing-101', 'where-to-find-deals'],
        resources: {
          transcript: '/transcripts/sourcing/mod1-transcript.pdf',
          worksheet: '/worksheets/sourcing/mod1-worksheet.pdf',
        },
      },
      {
        id: 'mod2',
        title: 'Module 2: Outreach & Relationship Building',
        videoSlugs: ['outreach', 'vendor-conversations', 'follow-ups'],
        resources: {
          transcript: '/transcripts/sourcing/mod2-transcript.pdf',
          worksheet: '/worksheets/sourcing/mod2-worksheet.pdf',
        },
        requiresComplete: 'mod1',
      },
      {
        id: 'mod3',
        title: 'Module 3: Deal Qualification',
        videoSlugs: ['deal-qualifying', 'numbers-first', 'red-flags'],
        resources: {
          transcript: '/transcripts/sourcing/mod3-transcript.pdf',
          worksheet: '/worksheets/sourcing/mod3-worksheet.pdf',
        },
        requiresComplete: 'mod2',
      },
    ],
  },

  financing: {
    modules: [
      {
        id: 'mod1',
        title: 'Module 1: Financing Overview',
        videoSlugs: ['financing', 'mortgages-101', 'lenders-basics'],
        resources: {
          transcript: '/transcripts/financing/mod1-transcript.pdf',
          worksheet: '/worksheets/financing/mod1-worksheet.pdf',
        },
      },
      {
        id: 'mod2',
        title: 'Module 2: Strategy & Risk Management',
        videoSlugs: ['financing-strategy', 'risk-management', 'scenario-planning'],
        resources: {
          transcript: '/transcripts/financing/mod2-transcript.pdf',
          worksheet: '/worksheets/financing/mod2-worksheet.pdf',
        },
        requiresComplete: 'mod1',
      },
    ],
  },

  legal: {
    modules: [
      {
        id: 'mod1',
        title: 'Module 1: Legal Essentials',
        videoSlugs: ['legal', 'contracts-101', 'documents'],
        resources: {
          transcript: '/transcripts/legal/mod1-transcript.pdf',
          worksheet: '/worksheets/legal/mod1-worksheet.pdf',
        },
      },
    ],
  },

  management: {
    modules: [
      {
        id: 'mod1',
        title: 'Module 1: Property Management',
        videoSlugs: ['management', 'property-operations', 'systems'],
        resources: {
          transcript: '/transcripts/management/mod1-transcript.pdf',
          worksheet: '/worksheets/management/mod1-worksheet.pdf',
        },
      },
    ],
  },

  advanced: {
    modules: [
      {
        id: 'mod1',
        title: 'Module 1: Advanced Strategies',
        videoSlugs: ['advanced', 'analysis', 'tactics'],
        resources: {
          transcript: '/transcripts/advanced/mod1-transcript.pdf',
          worksheet: '/worksheets/advanced/mod1-worksheet.pdf',
        },
      },
    ],
  },
};

