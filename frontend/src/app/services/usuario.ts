import { Injectable, inject } from '@angular/core';
import { Usuario as UsuarioModel } from '../models/usuario';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

interface UsuariosResponse {
    result: UsuarioModel[];
}

// The UsuarioService is responsible for fetching user data from the backend API.
@Injectable({
    providedIn: 'root'
})
// This service is responsible for fetching user data from the backend API.
export class UsuarioService {


    // Injecting the HttpClient to make HTTP requests to the backend API.
    private http = inject(HttpClient);

    // The base URL for the backend API that provides user data.
    private apiUrl = 'http://localhost:3000/api/users';

    // This method fetches the list of users from the backend API.
    getUsuarios(): Observable<UsuarioModel[]> {
        // Making a GET request to the backend API to retrieve user data.
        return this.http.get<UsuariosResponse>(this.apiUrl).pipe(
            // Mapping the response to extract the 'result' property, which contains the array of users.
            map((response) => response.result),
        );
    }
}
