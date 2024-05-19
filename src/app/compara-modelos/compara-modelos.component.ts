import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import ReactComponent from 'app/ReactComponent';
import React from 'react';
import ReactDOM from 'react-dom';

@Component({
  selector: 'app-compara-modelos',
  templateUrl: './compara-modelos.component.html',
  styleUrls: ['./compara-modelos.component.css']
})


export class ComparaModelosComponent implements OnInit, AfterViewInit {
  @ViewChild('reactComponentPlaceholder') reactComponentPlaceholder!:ElementRef;
  //@ViewChild('reactComponentRandom') reactComponentRandom!:ElementRef;
  constructor() { }
  ngOnInit() {




  }




ngAfterViewInit(){
  ReactDOM.render(React.createElement(ReactComponent), this.reactComponentPlaceholder.nativeElement);
  //ReactDOM.render(React.createElement(RandomComponent), this.reactComponentRandom.nativeElement);


}

}



