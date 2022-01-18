export class BottomDrawerEvent {
  constructor(public isOpen: boolean) {}
}

export class NavbarResizeEvent {
  constructor(public height: number) {}
}

export type NavbarEvent = BottomDrawerEvent | NavbarResizeEvent;
