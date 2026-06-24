export interface Batting {
  id: number;
  name: string;
  role: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  status: string;
}

export interface Bowling {
  id: number;
  name: string;
  role: string;
  overs: string;
  maidens: number;
  runsConceded: number;
  wickets: number;
  economy: number;
}

export interface Team {
  teamId: number;
  fullName: string;
  shortName: string;
  logo: string;
  scores: string;
  runs: number;
  extras: number;
  wickets: number;
  overs: string;
  batting: Batting[];
  bowling: Bowling[];
  matchStatus: boolean[];
}

export interface Match {
  matchNo: number;
  venue: string;
  city: string;
  date: string;
  tossWinner: string;
  tossDecision: string;
  result: string;
  playerOfTheMatch: string;
  status: string;
  teams: Team[];
}

export interface Blog {
  id: number;
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
