export interface Goal {
  period: number;
  periodDescriptor: {
    number: number;
    periodType: string;
    maxRegulationPeriods: number;
  };
  timeInPeriod: string;
  playerId: number;
  name: { default: string };
  firstName: { default: string; cs?: string; de?: string; es?: string; fi?: string; sk?: string };
  lastName: { default: string; cs?: string; de?: string; es?: string; fi?: string; sk?: string };
  goalModifier: string;
  assists: { playerId: number; name: { default: string }; assistsToDate: number }[];
  mugshot: string;
  teamAbbrev: string;
  goalsToDate: number;
  awayScore: number;
  homeScore: number;
  strength: string;
  highlightClipSharingUrl: string;
  highlightClipSharingUrlFr?: string;
  highlightClip?: number;
  highlightClipFr?: number;
  discreteClip?: number;
  discreteClipFr?: number;
}


export default class Game {
  id: number;
  season: number;
  gameType: number;
  gameDate: string;
  venue: { default: string };
  startTimeUTC: string;
  easternUTCOffset: string;
  venueUTCOffset: string;
  tvBroadcasts: { id: number; market: string; countryCode: string; network: string; sequenceNumber: number }[];
  gameState: string;
  gameScheduleState: string;
  time: string = '';
  awayTeam: {
    id: number;
    name: { default: string };
    abbrev: string;
    record: string;
    logo: string;
    odds: { providerId: number; value: string }[];
    score: number;
  };
  homeTeam: {
    id: number;
    name: { default: string };
    abbrev: string;
    record: string;
    logo: string;
    odds: { providerId: number; value: string }[];
    score: number;
  };
  seriesStatus: {
    round: number;
    seriesAbbrev: string;
    seriesTitle: string;
    seriesLetter: string;
    neededToWin: number;
    topSeedTeamAbbrev: string;
    topSeedWins: number;
    bottomSeedTeamAbbrev: string;
    bottomSeedWins: number;
    gameNumberOfSeries: number;
  };
  gameCenterLink: string;
  seriesUrl: string;
  neutralSite: boolean;
  venueTimezone: string;
  ticketsLink: string;
  ticketsLinkFr: string;
  teamLeaders: {
    id: number;
    firstName: { default: string; cs?: string; sk?: string; fi?: string };
    lastName: { default: string; cs?: string; sk?: string; fi?: string };
    headshot: string;
    teamAbbrev: string;
    sweaterNumber: number;
    position: string;
    category: string;
    value: number;
  }[];
  goals: Goal[] = [];
  period: number = 0;
  

  constructor(data: any) {
    this.id = data.id;
    this.season = data.season;
    this.gameType = data.gameType;
    this.gameDate = data.gameDate;
    this.venue = data.venue;
    this.startTimeUTC = data.startTimeUTC;
    this.easternUTCOffset = data.easternUTCOffset;
    this.venueUTCOffset = data.venueUTCOffset;
    this.tvBroadcasts = data.tvBroadcasts || [];
    this.gameState = data.gameState;
    this.gameScheduleState = data.gameScheduleState;
    this.awayTeam = data.awayTeam;
    this.homeTeam = data.homeTeam;
    this.seriesStatus = data.seriesStatus;
    this.gameCenterLink = data.gameCenterLink;
    this.seriesUrl = data.seriesUrl;
    this.neutralSite = data.neutralSite;
    this.venueTimezone = data.venueTimezone;
    this.ticketsLink = data.ticketsLink;
    this.ticketsLinkFr = data.ticketsLinkFr;
    this.teamLeaders = data.teamLeaders || [];
  }
}