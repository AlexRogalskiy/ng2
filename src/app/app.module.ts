import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from "@angular/http";
import { MaterialModule } from "@angular/material";
//import { MdAutocompleteModule } from '@angular/material/autocomplete';
import { NgModule, ApplicationRef } from "@angular/core";
import { removeNgStyles, createNewHosts, createInputTransfer } from "@angularclass/hmr"; //TODO Discuss the necessity
import { RouterModule, PreloadAllModules } from "@angular/router";

//3rd party
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
import { CustomFormsModule } from 'ng2-validation'
import { NouisliderModule } from 'ng2-nouislider';
import { Ng2Webstorage } from 'ng2-webstorage'; //LocalStorageService, SessionStorageService,
import { Ng2PageScrollModule } from 'ng2-page-scroll';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal';
import { Md2DatepickerModule }  from 'md2-datepicker';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';

import { AUTH_PROVIDERS } from 'angular2-jwt';
const APP_AUTH_PROVIDERS =
    [
        AuthGuard, ...AUTH_PROVIDERS, AuthService,
    ];

/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from "./environment";
import { ROUTES } from "./app.routes";
import { VENUE_DI_CONFIG } from './app.config';
import { AppComponent } from "./app.component";
import { AppState, InternalStateType } from "./app.service";

//Auth
import { AuthService } from './auth/service/auth.service';
import { AuthGuard } from './auth/service/auth-guard.service';
import { MainAuthComponent } from './auth/main/main.component';
import { LoginDialog } from './auth/login-dialog/login-dialog.component';
import { RegisterDialog } from './auth/register-dialog/register-dialog.component';

//Common
import { ErrorHandler } from "./common/service/error-handler.service";
import { Logger } from "./common/service/logger.service";
import { NotificationService } from './common/notification/notification.service';
import { NotificationComponent } from './common/notification/notification.component';

//Events
import { Events } from "./events/events.component";
import { Event } from "./events/event/event.component";
import { EventModel } from "./events/model/event.model";
import { EventCard } from "./events/event-card/event-card.component";
import { EventsService } from "./events/events.service";
import { EventSearch } from "./events/event-search/event-search.component";
import { ScrollButton } from "./events/event-scroll/event-scroll.component";
import { TicketCounter } from './events/event/ticket-counter/ticket-counter.component';
import { EventCardIconList } from "./events/event-card/icon-list/event-card-icon-list.component";
import { DatePicker } from './events/event-datepicker/event-datepicker.component';
import { OrderBy } from './events/order-by-pipe.component';

//404 No content
import { NoContentComponent } from "./no-content";

//Shopping cart
import { ShoppingCart } from './shopping-cart/shopping-cart.component';
import { ShoppingCartItem } from './shopping-cart/item/shopping-cart-item.component';
import { TicketsService } from './tickets/tickets.service';
import { ShoppingCartDialog } from './shopping-cart/dialog/shopping-cart-dialog.component';

//Order
import { OrderDialog } from './order/order-dialog.component';
import { OrderDialogService } from './order/order-dialog.service';
import { OrderTariffs } from './order/tariffs/tariffs.component';
import { OrderProducts } from './order/products/products.component';
import { OrderPersonal } from './order/personal/personal.component';

import { NavigateStepsComponent } from './order/navigate-steps/navigate-steps.component';

//Ticket storage
import { TicketStorage } from './tickets/model/ticket-storage.component';

//Toolbar
import { WidgetToolbar } from './toolbar/widget-toolbar/widget-toolbar.component';
import { MenuBar } from './toolbar/menu/menubar.component';
import { IconListService } from "./toolbar/icon-list.service";

type StoreType =
{
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent,
    Events,
    Event,
    NoContentComponent,
    EventSearch,
    EventCard,
    TicketCounter,
    ShoppingCart,
    ShoppingCartItem,
    MenuBar,
    DatePicker,
    ScrollButton,
    ShoppingCartDialog,
    WidgetToolbar,
    EventCardIconList,
    OrderBy,
    NotificationComponent,
    MainAuthComponent,
    LoginDialog,
    RegisterDialog,
    OrderDialog,
    OrderTariffs,
    OrderProducts,
    OrderPersonal,
    NavigateStepsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    CustomFormsModule,
    HttpModule,
    MaterialModule.forRoot(),
    RouterModule.forRoot(ROUTES, { useHash: false, preloadingStrategy: PreloadAllModules }),
    Ng2PageScrollModule.forRoot(),
    InfiniteScrollModule,
    Ng2Bs3ModalModule,
    NouisliderModule,
	Ng2AutoCompleteModule,
    Md2DatepickerModule.forRoot(),
	//MdAutocompleteModule.forRoot(),
    Ng2Webstorage.forRoot({ prefix: 'kassir-widget', separator: '.' }),
  ],
  providers: [
    ENV_PROVIDERS,
    AppState,
    APP_AUTH_PROVIDERS,
    EventModel,
    Logger,
    ErrorHandler,
    NotificationService,
    OrderDialogService,
    { provide: IconListService, useClass: IconListService },
    { provide: EventsService, useClass: EventsService },
    { provide: TicketsService, useClass: TicketsService },
    { provide: TicketStorage, useClass: TicketStorage },
    { provide: 'APP_CONFIG', useValue: VENUE_DI_CONFIG }
  ],
})

export class AppModule {
    constructor(public appRef: ApplicationRef, public appState: AppState) {}

    public hmrOnInit(store: StoreType) {
        if (!store || !store.state) {
            return;
        }
        console.log('HMR store', JSON.stringify(store, null, 2));
        // set state
        this.appState._state = store.state;
        // set input values
        if ('restoreInputValues' in store) {
            let restoreInputValues = store.restoreInputValues;
            setTimeout(restoreInputValues);
        }

        this.appRef.tick();
        delete store.state;
        delete store.restoreInputValues;
    }

    public hmrOnDestroy(store: StoreType) {
        const cmpLocation = this.appRef.components.map((cmp) => cmp.location.nativeElement);
        // save state
        const state = this.appState._state;
        store.state = state;
        // recreate root elements
        store.disposeOldHosts = createNewHosts(cmpLocation);
        // save input values
        store.restoreInputValues = createInputTransfer();
        // remove styles
        removeNgStyles();
    }

    public hmrAfterDestroy(store: StoreType) {
        // display new elements
        store.disposeOldHosts();
        delete store.disposeOldHosts;
    }
}