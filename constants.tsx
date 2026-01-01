
import { Company, RecruitmentType, ApplicationStatus } from './types';

export const MOCK_COMPANIES: Company[] = [
  {
    id: '1',
    name: 'Google',
    logo: 'https://picsum.photos/seed/google/100/100',
    role: 'Software Engineer',
    type: RecruitmentType.FULL_TIME,
    deadline: '2024-12-01T23:59:59Z',
    status: ApplicationStatus.VISITING_SOON,
    minCGPA: 8.5,
    eligibleBranches: ['cse', 'it', 'ece'],
    description: 'We are looking for exceptional engineers to build the next generation of computing platforms.',
    interviewStories: [
      {
        id: 's1',
        studentName: 'Rahul S.',
        branch: 'cse',
        year: 2023,
        rating: 5,
        content: 'Focus heavily on Graph algorithms and System Design. The recruiters were very friendly but the technical rounds were intense.'
      }
    ]
  },
  {
    id: '2',
    name: 'Microsoft',
    logo: 'https://picsum.photos/seed/microsoft/100/100',
    role: 'Product Management Intern',
    type: RecruitmentType.INTERNSHIP,
    deadline: '2024-11-20T23:59:59Z',
    status: ApplicationStatus.ONGOING,
    minCGPA: 8.0,
    eligibleBranches: ['cse', 'it', 'ece', 'me'],
    description: 'Empower every person and every organization on the planet to achieve more through impactful product decisions.',
    interviewStories: [
      {
        id: 's2',
        studentName: 'Priya K.',
        branch: 'it',
        year: 2023,
        rating: 4,
        content: 'Product estimation questions are key. Prepare for guesstimates and case studies.'
      }
    ]
  },
  {
    id: '3',
    name: 'J.P. Morgan Chase',
    logo: 'https://picsum.photos/seed/jpmc/100/100',
    role: 'FinTech Analyst',
    type: RecruitmentType.FULL_TIME,
    deadline: '2024-11-15T23:59:59Z',
    status: ApplicationStatus.COMPLETED,
    minCGPA: 7.5,
    eligibleBranches: ['cse', 'ee', 'ece', 'eie'],
    description: 'Leverage technology to drive global financial markets.',
    interviewStories: []
  },
  {
    id: '4',
    name: 'Adobe',
    logo: 'https://picsum.photos/seed/adobe/100/100',
    role: 'UI/UX Designer',
    type: RecruitmentType.FULL_TIME,
    deadline: '2024-12-10T23:59:59Z',
    status: ApplicationStatus.VISITING_SOON,
    minCGPA: 7.0,
    eligibleBranches: ['cse', 'others', 'ece'],
    description: 'Design the future of creative tools for millions of creators worldwide.',
    interviewStories: [
      {
        id: 's4',
        studentName: 'Ananya M.',
        branch: 'others',
        year: 2024,
        rating: 5,
        content: 'Portfolio is everything. They asked deep questions about my design process and user testing methods.'
      }
    ]
  },
  {
    id: '5',
    name: 'Amazon',
    logo: 'https://picsum.photos/seed/amazon/100/100',
    role: 'SDE Intern',
    type: RecruitmentType.INTERNSHIP,
    deadline: '2024-11-25T23:59:59Z',
    status: ApplicationStatus.ONGOING,
    minCGPA: 8.2,
    eligibleBranches: ['cse', 'it', 'ece', 'ee'],
    description: 'Build earth-scale systems. Work on AWS, Alexa, or Kindle.',
    interviewStories: []
  },
  {
    id: '6',
    name: 'Goldman Sachs',
    logo: 'https://picsum.photos/seed/goldman/100/100',
    role: 'Quantitative Research',
    type: RecruitmentType.FULL_TIME,
    deadline: '2024-11-30T23:59:59Z',
    status: ApplicationStatus.VISITING_SOON,
    minCGPA: 9.0,
    eligibleBranches: ['cse', 'ee', 'eie'],
    description: 'Apply advanced mathematical and statistical techniques to solve complex financial problems.',
    interviewStories: []
  },
  {
    id: '7',
    name: 'Tesla',
    logo: 'https://picsum.photos/seed/tesla/100/100',
    role: 'Hardware Engineer',
    type: RecruitmentType.FULL_TIME,
    deadline: '2024-12-05T23:59:59Z',
    status: ApplicationStatus.ONGOING,
    minCGPA: 8.0,
    eligibleBranches: ['me', 'ee', 'ece', 'chem'],
    description: 'Join the team accelerating the world\'s transition to sustainable energy.',
    interviewStories: []
  },
  {
    id: '8',
    name: 'Zomato',
    logo: 'https://picsum.photos/seed/zomato/100/100',
    role: 'Product Analyst',
    type: RecruitmentType.INTERNSHIP,
    deadline: '2024-11-18T23:59:59Z',
    status: ApplicationStatus.COMPLETED,
    minCGPA: 7.5,
    eligibleBranches: ['cse', 'me', 'ce', 'others'],
    description: 'Solve real-world delivery and food-tech problems using data-driven insights.',
    interviewStories: []
  }
];

export const ALL_BRANCHES = ['cse', 'ece', 'ee', 'eie', 'me', 'ce', 'chem', 'be', 'others'];
