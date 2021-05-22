import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Validators } from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-cadastro-ofertas',
  templateUrl: './cadastro-ofertas.component.html',
  styleUrls: ['./cadastro-ofertas.component.scss']
})
export class CadastroOfertasComponent implements OnInit {

  ofertaSelected;
  ofertasCadastradas;
  idUrl: Number;
  editing: Boolean;
  descontoError: Boolean;
  loading: Boolean;

  id = new FormControl('');
  titulo = new FormControl('', [Validators.required]);
  preco = new FormControl('', [Validators.required, Validators.min(1)]);
  precoDesconto = new FormControl('', [Validators.required, Validators.min(1)]);
  loja = new FormControl('', [Validators.required, Validators.min(1)]);
  descricao = new FormControl('');
    

  lojas = [
    { id: 1, nome: 'Epic' },
    { id: 2, nome: 'Origin' },
    { id: 3, nome: 'Steam' },
  ];

  constructor(
    private route: ActivatedRoute,
    private _router: Router,
    private snackBar: MatSnackBar,
  ) { 
    this.editing = false;
    this.loading = false;
    this.descontoError = false;
  }

  getFormData() {
    if(this.ofertaSelected){
      this.id.setValue(this.ofertaSelected.id)
      this.titulo.setValue(this.ofertaSelected.titulo)
      this.preco.setValue(parseFloat(this.ofertaSelected.preco.replace(',','.')).toFixed(2))
      this.precoDesconto.setValue(parseFloat(this.ofertaSelected.precoDesconto.replace(',','.')).toFixed(2))
      this.loja.setValue(this.ofertaSelected.loja)
      this.descricao.setValue(this.ofertaSelected.descricao)
      this.editing = true
    }else {
      this.editing = false
    }
  }

  formValid() {
    console.log(this.ofertasCadastradas)
    console.log(this.ofertasCadastradas.some(game => game.id == this.id.value))
    if(!this.editing){
      if(this.ofertasCadastradas.some(game => game.id == this.id.value)){
        this.showError('Uma oferta com o mesmo id já foi cadastrada.')
        return false
      }
    }
    if(this.titulo.invalid) {
      this.showError('O campo titulo é obrigatório.')
      return false
    }
    if(this.preco.invalid) {
      this.showError('O campo preço deve ser maior que 0,00')
      return false
    }
    if(this.precoDesconto.invalid){
      this.showError('O campo preço com desconto deve ser maior que 0,00')
      return false
    } 
    if(this.loja.invalid){
      this.showError('O campo loja é obrigatório.')
      return false
    }
    if( this.descontoError){
      this.showError('O preço do desconto não pode ser maior que o preço normal.')
      return false
    }
    return true
  }

  cadastrarOferta() {
    if(this.formValid()){
      let ofertas = JSON.parse(window.localStorage.getItem("ofertas-game-tracker"));
      ofertas.push(this.getFormObjToSend());
      window.localStorage.setItem("ofertas-game-tracker", JSON.stringify(ofertas));
      this.ofertasCadastradas = JSON.parse(window.localStorage.getItem("ofertas-game-tracker"))
      this.showConfirmMessage('Nova oferta cadastrada.')
      this.loading = true;
    }
  }

  editarOferta() {
    let ofertas = JSON.parse(window.localStorage.getItem("ofertas-game-tracker"));
    let index = ofertas.findIndex(p => p.id == this.id.value);
    if(this.formValid()){
      ofertas[index] = this.getFormObjToSend();
      window.localStorage.setItem("ofertas-game-tracker", JSON.stringify(ofertas));
      this.ofertasCadastradas = JSON.parse(window.localStorage.getItem("ofertas-game-tracker"))
      this.showConfirmMessage('Oferta editada com sucesso.')
      this.loading = true;
    }
  }

  showConfirmMessage(message) {
    let snackBarRef = this.snackBar.open(message, 'Fechar');
    snackBarRef.afterDismissed().subscribe(() => {
      this.goToOfertas();
    });
  }

  goToOfertas() {
    this._router.navigateByUrl(`/nossasofertas`)
  }

  parseMoneyValues(value) {
    return parseFloat(value).toFixed(2).toString().replace('.', ',')
  }

  getFormObjToSend() {
    return  {
      id: this.id.value,
      titulo: this.titulo.value,
      preco: this.parseMoneyValues(this.preco.value),
      precoDesconto: this.parseMoneyValues(this.precoDesconto.value),
      loja: this.loja.value,
      descricao: this.descricao.value,
    }
  }

  getDescontoError() {
    if(parseFloat(this.precoDesconto.value) > parseFloat(this.preco.value)){
      this.descontoError = true
      return true
    }
    this.descontoError = false
    return false
  }

  showError(message) {
    this.snackBar.open(message, 'Ok');
  }

  ngOnInit(): void {
    this.ofertasCadastradas = JSON.parse(window.localStorage.getItem("ofertas-game-tracker"));

    this.route.params.subscribe(params => {
      this.idUrl = params['id'];
    });

    if(this.idUrl) {
      this.ofertaSelected = JSON.parse(window.localStorage.getItem("oferta-selected"));
      this.getFormData()
    }else {
      window.localStorage.removeItem("oferta-selected")
      this.id.setValue(this.ofertasCadastradas.length + 1)
    }

  }

}
