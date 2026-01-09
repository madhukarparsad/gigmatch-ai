export interface PortfolioItem {
  userId: string;

  projects: {
    title: string;
    description: string;
    techStack: string[];
    link?: string;
  }[];

  aiTags?: string[];
  aiScore?: number;

  updatedAt: Date;
}
