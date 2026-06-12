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
}

export interface MatchData {
  id: number;
  matchNo: number;
  status: string;
  venue: string;
  city: string;
  date: string;
  teams: Team[];
}
