import {Component, OnInit} from '@angular/core';
import {Cliente} from "./cliente";
import {ClienteService} from "./cliente.service";
import {Router, ActivatedRoute} from "@angular/router";
import Swal from "sweetalert2";

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

    private cliente: Cliente = new Cliente();
    private titulo: string = "Crear Cliente";
    private errores: string[];

    constructor(private clienteService: ClienteService,
                private router: Router,
                private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
        this.cargarCliente();
    }

    cargarCliente(): void {
        this.activatedRoute.params.subscribe(params => {
            let id = params['id'];
            if (id) {
                this.clienteService.getCliente(id).subscribe((cliente) => this.cliente = cliente);
            }
        })
    }

    create(): void {
        this.clienteService.create(this.cliente).subscribe(
            cliente => {
                this.router.navigate(['/clientes']);

                Swal.fire({
                    title: 'Nuevo Cliente',
                    text: `${cliente.nombre} ha sido creado con exito`,
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });
            },
            err => {
                this.errores = err.error.errors as string[];
                console.error('Codigo del error desde el back: ' + err.status);
                console.error(err.error.errors);
            }
        )
    }

    update(): void {
        this.clienteService.update(this.cliente).subscribe(
            response => {
                this.router.navigate(['/clientes']);

                Swal.fire({
                    title: 'Actualizar Cliente',
                    text: `${response.mensaje}: ${response.cliente.nombre}`,
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });
            },
            err => {
                this.errores = err.error.errors as string[];
                console.error('Codigo del error desde el back: ' + err.status);
                console.error(err.error.errors);
            }
        )
    }
}
