import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',  // Update this line
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'My Angular App';

  constructor() { }

  ngOnInit(): void {
  }
}
