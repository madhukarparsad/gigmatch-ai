export interface FreelancerProfile {
  userId: string;

  title: string;
  bio: string;

  skills: string[];
  experienceYears: number;

  languages: string[];

  hourlyRate: number;

  updatedAt: Date;
}
