export interface Player {
  name: string;
  role: string;
  playerId:number
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
  matchStatus: string;
}

export interface MatchData {
  matchNo: string;
  status: string;
  venue: string;
  city: string;
  date: string;
  teams: Team[];
}

export interface Teams {
  teamId: number;
  shortName: string;
  logo?: string;
}
export interface updateMatch {
  matchNo: string;
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
