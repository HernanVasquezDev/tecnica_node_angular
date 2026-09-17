import {Injectable, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Usuario} from '../models/usuario';
// This service provides methods to interact with the backend API for managing Usuario objects. It uses Angular's HttpClient to perform HTTP requests and returns Observables for asynchronous operations.
@Injectable({
  providedIn: 'root'
})
// The UsuarioService class is responsible for fetching Usuario data from the backend API. It defines a method getUsuarios() that returns an Observable of an array of Usuario objects.
export class UsuarioService {

    // The HttpClient is injected into the service to enable HTTP communication with the backend API. The apiUrl property defines the endpoint for fetching Usuario data.
  private http = inject(HttpClient);

  // The apiUrl property holds the URL of the backend API endpoint for fetching Usuario data. It is set to 'http://localhost:3000/api/users', which is the local server address for the API.
  private apiUrl = 'http://localhost:3000/api/users';

  // The getUsuarios() method sends an HTTP GET request to the backend API to retrieve an array of Usuario objects. It returns an Observable that emits the fetched data, allowing components to subscribe and react to the data when it becomes available.
  getUsuarios(): Observable<Usuario[]> {
    // The getUsuarios() method sends an HTTP GET request to the backend API to retrieve an array of Usuario objects. It returns an Observable that emits the fetched data, allowing components to subscribe and react to the data when it becomes available.
    return this.http.get<Usuario[]>(this.apiUrl);
  }
}; 