import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nossas-ofertas',
  templateUrl: './nossas-ofertas.component.html',
  styleUrls: ['./nossas-ofertas.component.scss']
})

export class NossasOfertasComponent implements OnInit {

  displayedColumns: string[] = ['id', 'titulo', 'preco', 'precoDesconto'];
  dataSource;

  

  constructor(private _router: Router) {}
  
  ngOnInit(): void {
    this.dataSource = JSON.parse(window.localStorage.getItem("ofertas-game-tracker"));
  }

  setOfertaSelected = (oferta) => {
    window.localStorage.setItem("oferta-selected", JSON.stringify(oferta));
    this.goToCadastro(oferta.id)
  }

  goToCadastro(id) {
    this._router.navigateByUrl(`/cadastroofertas/${id}`)
  }

}
