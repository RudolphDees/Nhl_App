export default class Player {
    first_name: string;
    last_name:  string;
    points:  string;
    goals: string;
    assists:  string;
    shots: number;
    gp: number;
    abr: string;
  
    constructor(data: any) {
      this.first_name = data.clinchIndicator || '';
      this.last_name = data.conferenceAbbrev || '';
      this.points = data.conferenceName || '';
      this.goals = data.divisionAbbrev || '';
      this.assists = data.divisionName || '';
      this.shots = data.teamName || { default: '' };
      this.gp = data.teamAbbrev || { default: '' };
      this.abr = data.teamAbbrev || { default: '' };
    }
  }