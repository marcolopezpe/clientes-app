import {Component, OnInit} from '@angular/core';
import {Cliente} from "../cliente";
import {ClienteService} from "../cliente.service";
import {ActivatedRoute} from "@angular/router";
import Swal from "sweetalert2";

@Component({
    selector: 'detalle-cliente',
    templateUrl: './detalle.component.html',
    styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

    cliente: Cliente;
    titulo: string = "Detale del Cliente";
    private fotoSeleccionada: File;

    constructor(private clienteService: ClienteService, private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
        this.activatedRoute.paramMap.subscribe(params => {
            let id: number = +params.get('id');
            if (id) {
                this.clienteService.getCliente(id).subscribe(cliente => {
                    this.cliente = cliente;
                });
            }
        })
    }

    seleccionarFoto(event) {
        this.fotoSeleccionada = event.target.files[0];
        console.log(this.fotoSeleccionada);
    }

    subirFoto() {
        this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id)
            .subscribe(cliente => {
                this.cliente = cliente;
                Swal.fire({
                    title: 'La foto se ha subido completamente!',
                    text: `La foto se ha subido con exito ${cliente.foto}`,
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });
            });
    }
}
