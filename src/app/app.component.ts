import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { RemoteConfigService } from './services/remote-config.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(private remoteConfigService: RemoteConfigService) { }

  async ngOnInit() {
    await this.remoteConfigService.init();
  }

}


