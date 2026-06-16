export interface LiveModel {
  id: string;
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
export interface Team {
  teamId: number;
  fullName: string;
  shortName: string;
  scores: number;
  wickets: number;
  extras: number;
  overs: number;
  winCount: number;
  lossCount: number;
  totalMatch: number;
  logo: string;
  matchStatus: boolean[];
  players: Player[];
}
export interface Player {
  id: number;
  name: string;
  role: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  status: string;
  maidens: number;
  runsConceded: number;
  wickets: number;
  overs: number;
  economy: number;
}
export interface IplNews {
  image: string;
  title: string;
  description: string;
}
export const commentary = {
  '0': [
    '🛑 Dot ball! Solid defensive shot, no run.',
    "🔒 Good line and length, the batter can't score.",
    '🧤 Straight to the fielder. No run taken.',
    '🎯 Excellent bowling, pressure building with another dot.',
  ],

  '1': [
    '🏃 Tapped into the gap for a quick single.',
    '✅ Easy single taken, strike rotated.',
    '🏏 Worked away for one run.',
    '⚡ The batters comfortably collect a single.',
  ],

  '2': [
    '🏃‍♂️🏃‍♂️ Nicely placed, they come back for two.',
    '💨 Good running between the wickets earns a couple.',
    '➕ Two runs added to the total.',
    '🏏 Driven into the deep for a comfortable two.',
  ],

  '3': [
    '⚡ Excellent placement! The batters sprint back for three.',
    '🏃‍♂️🏃‍♂️🏃‍♂️ Three runs taken with some energetic running.',
    '🌪️ The ball races to the deep and they collect three.',
    '🤝 Great awareness between the wickets, three runs.',
  ],

  '4': [
    '🔥 FOUR! Cracking shot through the covers.',
    '🚀 Beautiful timing and the ball races to the boundary.',
    '💥 Driven powerfully for four runs.',
    "✨ That's a classy boundary from the batter.",
  ],

  '6': [
    '🔥🔥🔥 SIX! Launched high 🚀 and handsome into the stands.',
    '💥 🔍 What a hit! Maximum runs.',
    '🏏 The batter clears the ropes with ease 🪢🚡.',
    '6️⃣ A huge six and the crowd erupts. 🙌',
  ],

  Wd: [
    '↔️ 😔 Wide ball! Extra run awarded.',
    '🦵 The bowler strays down the leg side, called wide.',
    '🤹 Too far outside off, the umpire signals wide.',
    '➕ An extra added to the total via a wide.',
  ],

  Nb: [
    '🚫👟 No ball! The bowler has overstepped.',
    '🎁 Free hit coming up after that no-ball.',
    '🚨 The umpire signals no-ball, extra run awarded.',
    "⚠️ Over the line from the bowler, it's a no-ball.",
  ],

  W: [
    '❌ OUT! The batter has to depart.',
    '🎯 WICKET! A massive breakthrough for the bowling side.',
    "🧤 Caught! The batter's innings comes to an end.",
    '💥 Bowled him! The stumps are shattered.',
    "🚨 That's a huge wicket at this stage of the game.",
  ],
};
