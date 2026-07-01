export interface Player {
  id: number;
  name: string;
  role: string;
}

export interface Team {
  teamId: number;
  fullName: string;
  shortName: string;
  logo: string;
  winCount: number;
  lossCount: number;
  totalMatch: number;
  players: Player[];
  matchStatus: boolean[];
}

export interface MatchData {
  id: number;
  matchNo: number;
  status: string;
  venue: string;
  city: string;
  date: string;
  teams: Team[];
  matchStatus: boolean[];
}

export interface Teams {
  teamId: number;
  shortName: string;
  logo?: string;
}
export interface updateMatch {
  id: string;
  matchNo: number;
  venue: string;
  city: string;
  date: string;
  status: string;
  teams: Team[];
}

export interface stadium {
  venue: string;
  city: string;
}
