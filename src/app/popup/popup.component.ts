/**
 * Created by alex on 6/7/16.
 */

import {
  Component, Input
} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'bdfy-popup',
  providers: [],
  template: require('./popup.html')
})
export class PopupComponent {
  @Input() visible: BehaviorSubject<boolean>;

  close() {
    this.visible.next(false);
  }
}
