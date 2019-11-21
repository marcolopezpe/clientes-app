import {Component, OnInit} from '@angular/core';
import {Cliente} from "./cliente";
import {ClienteService} from "./cliente.service";
import Swal from "sweetalert2";
import {tap} from "rxjs/operators";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-clientes',
    templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

    clientes: Cliente[];

    constructor(private clienteService: ClienteService, private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
        this.activatedRoute.paramMap.subscribe(params => {
            let page = params.get('page');

            this.clienteService.getClientes(page).pipe(
                tap((response: any) => {
                    //console.log('ClienteComponent: tap 3');
                    (response.content as Cliente[]).forEach(cliente => {
                        console.log(cliente.nombre);
                    })
                })
            ).subscribe(response => this.clientes = response.content as Cliente[]);
        });
    }

    delete(cliente: Cliente): void {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger mr-2'
            },
            buttonsStyling: false,
            confirmButtonText: 'Aceptar'
        });

        swalWithBootstrapButtons.fire({
            title: 'Estas seguro?',
            text: `¿Seguro que desea eliminar al cliente ${cliente.nombre} ${cliente.apellido}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, eliminar!',
            cancelButtonText: 'No, cancelar!',
            reverseButtons: true
        }).then((result) => {
            if (result.value) {
                this.clienteService.delete(cliente.id).subscribe(
                    response => {
                        this.clientes = this.clientes.filter(cli => cli !== cliente);

                        swalWithBootstrapButtons.fire(
                            'Eliminado!',
                            'Cliente eliminado con exito..',
                            'success'
                        )
                    }
                );
            }
        })
    }
}
