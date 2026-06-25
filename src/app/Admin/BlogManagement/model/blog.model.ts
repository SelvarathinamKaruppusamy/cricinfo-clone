export interface Blog {
  id: string;
  matchId: number;
  title: string;
  slug: string;
  image: string;
  shortDescription: string;
  category: string;
  author: string;
  content: string[];
  publishedDate: string;
  readTime: string;
  featured: boolean;
  tags: string[];
}
