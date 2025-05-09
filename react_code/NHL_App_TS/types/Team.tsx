export default class Team {
    clinchIndicator: string;
    conferenceAbbrev: string;
    conferenceName: string;
    divisionAbbrev: string;
    divisionName: string;
    teamName: { default: string; fr?: string };
    teamAbbrev: { default: string };
    teamLogo: string;
    gamesPlayed: number;
    wins: number;
    losses: number;
    otLosses: number;
    points: number;
    goalDifferential: number;
    id: number = 0;
  
    constructor(data: any) {
      this.clinchIndicator = data.clinchIndicator || '';
      this.conferenceAbbrev = data.conferenceAbbrev || '';
      this.conferenceName = data.conferenceName || '';
      this.divisionAbbrev = data.divisionAbbrev || '';
      this.divisionName = data.divisionName || '';
      this.teamName = data.teamName || { default: '' };
      this.teamAbbrev = data.teamAbbrev || { default: '' };
      this.teamLogo = data.teamLogo || '';
      this.gamesPlayed = data.gamesPlayed || 0;
      this.wins = data.wins || 0;
      this.losses = data.losses || 0;
      this.otLosses = data.otLosses || 0;
      this.points = data.points || 0;
      this.goalDifferential = data.goalDifferential || 0;
    }
  }