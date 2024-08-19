import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Game } from '../api/game';
import { Observable } from 'rxjs';
import { Team } from '../api/team';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private readonly baseUrl = environment.baseUrlApi + '/games';

  constructor(private http: HttpClient) { }

  create(data: Game): Observable<Game> {
    return this.http.post<Game>(`${this.baseUrl}`, data);
  }

  update(data: Game, id: number): Observable<Game> {
    return this.http.put<Game>(`${this.baseUrl}/${id}`, data);
  }

  get (id: number): Observable<Game> {
    return this.http.get<Game>(`${this.baseUrl}/${id}`);
  }

  list (): Observable<Game[]> {
    return this.http.get<Game[]>(`${this.baseUrl}`);
  }

  delete (id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  listTeams(id: number): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.baseUrl}/${id}/teams`);
  }

  drawTeams (id: number): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/draw-teams`, null);
  }
}
