import { Component, OnInit, inject, signal } from '@angular/core';
import { Usuario } from './models/usuario';
import { UsuarioService } from './services/usuario';

@Component({
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements OnInit {
  protected readonly title = signal('frontend');

  private readonly usuarioService = inject(UsuarioService);
  protected readonly usuarios = signal<Usuario[]>([]);

  ngOnInit(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios.set(usuarios);
      },
      error: () => {
        this.usuarios.set([]);
      },
    });
  }
}
