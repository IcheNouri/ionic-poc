import { ComponentFactoryResolver, ComponentRef, Directive, ElementRef, Input, OnInit, ViewContainerRef } from '@angular/core';
import { LoadingManager } from './loading-manager';
import {BoostrapColor} from '../../models/boostrap-color';
import {SpinnerComponent} from '../../components/spinner/spinner.component';

@Directive({
  selector: 'button[mypButtonLoading]',
  exportAs: 'mypButtonLoading',
})
export class ButtonLoadingDirective implements OnInit {
  private readonly BUTTON_LOADING_CLASSNAME = ' button-loading';
  private readonly HIDDEN_ELEMENT_CLASSNAME = ' hidden-element';
  private readonly MYP_SPINNER_BUTTON_CLASSNAME = ' myp-spinner-button';

  @Input('mypButtonLoading') loadingManager!: LoadingManager;
  @Input() spinnerColor?: BoostrapColor;

  public isLoading = false;

  private spinner: ComponentRef<SpinnerComponent> | null = null;
  private isButtonContentHidden = false;

  constructor(private el: ElementRef<HTMLButtonElement>, private viewContainerRef: ViewContainerRef, private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnInit(): void {
    this.loadingManager.loading().subscribe(loading => {
      if (loading) {
        this.isLoading = true;
        this.hideButtonContent();
        this.addSpinner();
      } else {
        this.isLoading = false;
        if (this.isButtonContentHidden) {
          this.showButtonContent();
        }
        this.removeSpinner();
      }
    });
  }

  private addSpinner(): void {
    this.spinner = this.createSpinner();
    this.el.nativeElement.appendChild(this.spinner.location.nativeElement);
    const spinner = this.el.nativeElement.querySelector('myp-spinner');
    if (spinner) {
      spinner.className += this.MYP_SPINNER_BUTTON_CLASSNAME;
    }
  }

  private removeSpinner(): void {
    if (this.spinner) {
      this.spinner.destroy();
    }
  }

  private createSpinner(): ComponentRef<SpinnerComponent> {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(SpinnerComponent);
    const spinner = this.viewContainerRef.createComponent<SpinnerComponent>(componentFactory);
    spinner.instance.size = 'expand';
    if (this.spinnerColor) {
      spinner.instance.color = this.spinnerColor;
    }
    return spinner;
  }

  private hideButtonContent(): void {
    this.el.nativeElement.className += this.BUTTON_LOADING_CLASSNAME;
    this.el.nativeElement.querySelectorAll('*').forEach(child => (child.className += this.HIDDEN_ELEMENT_CLASSNAME));
    this.isButtonContentHidden = true;
  }

  private showButtonContent(): void {
    this.el.nativeElement.className = this.el.nativeElement.className.substr(0, this.el.nativeElement.className.length - this.BUTTON_LOADING_CLASSNAME.length);
    this.el.nativeElement.querySelectorAll('*').forEach(child => (child.className = child.className.substr(0, child.className.length - this.HIDDEN_ELEMENT_CLASSNAME.length)));
    this.isButtonContentHidden = false;
  }
}
