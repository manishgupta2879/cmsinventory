import { ChangeDetectorRef, Component, Input, OnChanges, OnInit } from '@angular/core';
import { NavItem } from './nav-item';
import { Router } from '@angular/router';
import { NavService } from '../../../../services/nav.service';

@Component({
  selector: 'app-nav-item',
  templateUrl: './nav-item.component.html',
  styleUrls: [],
})
export class AppNavItemComponent implements OnChanges,OnInit {
  @Input() item: NavItem | any;
  @Input() depth: any;
  isExpanded: boolean = false;


  ngOnInit(): void {


  }

  constructor(public navService: NavService, public router: Router,
    private cdr: ChangeDetectorRef

  ) {
    if (this.depth === undefined) {
      this.depth = 0;
    }
  }

  ngOnChanges() {

    this.navService.currentUrl.subscribe((url: string) => {
      if (this.item.route && url) {
      }
    });
  }

  onItemSelected(item: NavItem) {
    if (!item.children || !item.children.length) {
      this.router.navigate([item.route]);
    }

    // scroll
    document.querySelector('.page-wrapper')?.scroll({
      top: 0,
      left: 0,
    });
  }

  toggleExpand(item:any) {
    this.isExpanded = !this.isExpanded;
    this.cdr.detectChanges();
  }
}
