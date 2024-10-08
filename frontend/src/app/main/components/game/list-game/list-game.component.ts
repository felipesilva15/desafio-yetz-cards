import { CustomDynamicDialogService } from './../../../service/custom-dynamic-dialog.service';
import { Component, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { Game } from 'src/app/main/api/game';
import { GameService } from 'src/app/main/service/game.service';
import { ListTeamComponent } from '../../team/list-team/list-team.component';
import { ListGamePlayerComponent } from '../../game-player/list-game-player/list-game-player.component';

@Component({
  selector: 'app-list-game',
  templateUrl: './list-game.component.html',
  styleUrl: './list-game.component.scss'
})
export class ListGameComponent {
  records: Game[] = [];
  selectedRecords: Game[] = [];
  selectedRecord!: Game;
  cols: any[] = [];
  isLoading: boolean = true;
  deleteConfirmed: boolean = false;
  isLoadingMenuItem: boolean = false;
  recordMenuItems!: MenuItem[];
  @ViewChild('recordMenu') recordMenu: Menu;

  constructor(private gameService: GameService, private messageService: MessageService, private confirmationService: ConfirmationService, private customDynamicDialogService: CustomDynamicDialogService) {}

  ngOnInit() {
    this.loadData();

    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'date', header: 'Data' },
      { field: 'players_per_team', header: 'Jogadores por time' }
    ];

    this.recordMenuItems = [
      {
        label: 'Times', 
        icon: 'pi pi-fw pi-flag-fill',
        command: () => {
          this.openTeamsDialog();
        }
      },
      {
        label: 'Jogadores', 
        icon: 'pi pi-fw pi-users',
        command: (event) => {
          this.openPlayersDialog();
        }
      },
      {
        separator: true
      },
      {
        label: 'Sortear times', 
        icon: 'pi pi-fw pi-megaphone',
        command: (event) => {
          this.drawTeams();
        }
      }
    ];
  }

  openRecordMenu(event: Event, record: Game) {
    this.selectedRecord = record;
    this.recordMenu.toggle(event);
  }

  loadData(): void {
    this.gameService.list().subscribe(
      (data: Game[]) => {
        this.records = data;

        this.records.forEach((record) => {
          record.date = new Date(<Date>record.date);
        });

        this.isLoading = false;
      }
    );
  }

  deleteSelectedRecords(event: Event): void {
    this.confirmationService.confirm({
      key: 'confirmDeleteDialog',
      target: event.target || new EventTarget,
      message: `Deseja mesmo deletar os registros selecionados?`,
      icon: 'pi pi-exclamation-triangle',
      header: 'Atenção',
      acceptIcon:"none",
      rejectIcon:"none",
      rejectButtonStyleClass:"p-button-text",
      accept: () => {
        this.selectedRecords.forEach(record => {
          this.gameService.delete(record.id).subscribe(
            () => {
              this.records = this.records.filter(val => val.id !== record.id);
            }
          );
        });

        this.messageService.add({
          severity: 'success', 
          summary: 'Sucesso', 
          detail: 'Registros deletados.', 
          life: 5000 
        });
      }
    });
  }

  deleteRecord(event: Event, record: any): void {
    this.confirmationService.confirm({
      key: 'confirmDeleteDialog',
      target: event.target || new EventTarget,
      message: `Deseja mesmo deletar o registro de ID <b>${record.id}</b>?`,
      icon: 'pi pi-exclamation-triangle',
      header: 'Atenção',
      acceptIcon:"none",
      rejectIcon:"none",
      rejectButtonStyleClass:"p-button-text",
      accept: () => {
        this.gameService.delete(record.id).subscribe(
          () => {
            this.records = this.records.filter(val => val.id !== record.id);
            this.messageService.add({
              severity: 'success', 
              summary: 'Sucesso', 
              detail: 'Registro deletado.', 
              life: 5000 
            });
          }
        );
      }
    });
  }

  openTeamsDialog(): void {
    this.customDynamicDialogService.openDialog<void>(ListTeamComponent, 'Times', {gameId: this.selectedRecord.id}, 'md');
  }

  openPlayersDialog(): void {
    this.customDynamicDialogService.openDialog<void>(ListGamePlayerComponent, 'Jogadores', {gameId: this.selectedRecord.id}, 'md');
  }

  drawTeams(): void {
    this.isLoadingMenuItem = true;

    this.gameService.drawTeams(this.selectedRecord.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success', 
          summary: 'Sucesso', 
          detail: 'Sorteio realizado!.', 
          life: 5000 
        });

        this.isLoadingMenuItem = false;
      },
      error: () => {
        this.isLoadingMenuItem = false;
      }
    });
  }
}
