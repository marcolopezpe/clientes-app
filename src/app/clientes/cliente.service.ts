import {Injectable} from '@angular/core';
import {Cliente} from "./cliente";
import {Observable, throwError} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map, catchError, tap} from "rxjs/operators";
import Swal from "sweetalert2";
import {Router} from "@angular/router";
import {DatePipe, formatDate} from "@angular/common";

@Injectable()
export class ClienteService {

    private urlEndPoint: string = "http://localhost:8888/api/clientes";
    private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

    constructor(private http: HttpClient, private router: Router) {
    }

    getClientes(page: number): Observable<Cliente[]> {
        return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
            tap((response: any) => {
                (response.content as Cliente[]).forEach(cliente => {
                    console.log(cliente.nombre);
                });
            }),
            map((response: any) => {
                (response.content as Cliente[]).map(cliente => {
                    cliente.nombre = cliente.nombre.toUpperCase();

                    //let datePipe = new DatePipe('es-PE');
                    //cliente.createAt = datePipe.transform(cliente.createAt, 'EEEE dd, MMMM yyyy');
                    return cliente;
                });

                return response;
            }),
            tap(response => {
                (response.content as Cliente[]).forEach(cliente => {
                    console.log(cliente.nombre);
                })
            })
        );
    }

    create(cliente: Cliente): Observable<any> {
        return this.http.post<any>(this.urlEndPoint, cliente, {headers: this.httpHeaders}).pipe(
            map((response: any) => response.cliente as Cliente),
            catchError(e => {
                if (e.status == 400) {
                    return throwError(e);
                }

                console.error(e.error.mensaje);

                Swal.fire({
                    title: e.error.mensaje,
                    text: e.error.error,
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });

                return throwError(e);
            })
        );
    }

    getCliente(id): Observable<Cliente> {
        return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
            catchError(e => {
                this.router.navigate(['/clientes']);

                console.error(e.error.mensaje);

                Swal.fire({
                    title: 'Error al editar',
                    text: e.error.mensaje,
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });

                return throwError(e);
            })
        );
    }

    update(cliente: Cliente): Observable<any> {
        return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers: this.httpHeaders}).pipe(
            catchError(e => {
                console.error(e.error.mensaje);

                Swal.fire({
                    title: e.error.mensaje,
                    text: e.error.error,
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });

                return throwError(e);
            })
        );
    }

    delete(id: number): Observable<any> {
        return this.http.delete<any>(`${this.urlEndPoint}/${id}`, {headers: this.httpHeaders}).pipe(
            catchError(e => {
                if (e.status == 400) {
                    return throwError(e);
                }

                console.error(e.error.mensaje);

                Swal.fire({
                    title: e.error.mensaje,
                    text: e.error.error,
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });

                return throwError(e);
            })
        );
    }
}
