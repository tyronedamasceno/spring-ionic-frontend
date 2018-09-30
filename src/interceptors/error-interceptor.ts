import { FieldMessage } from './../models/fildmessage';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Observable } from 'rxjs/Rx';
import { StorageService } from '../services/storage.service';
import { AlertController } from 'ionic-angular';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    
    constructor(public storage: StorageService, public alertController: AlertController) {

    }
 
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
            .catch((error, caught) => {

                let errorObj = error;
                if (errorObj.error) {
                    errorObj = errorObj.error;
                }
                if (!errorObj.status) {
                    errorObj = JSON.parse(errorObj);
                }

                console.log("Erro detectado pelo interceptor");
                console.log(errorObj);

                switch(errorObj.status) {
                    case 401:
                        this.handle401();
                        break;
                    
                    case 403:
                        this.handle403();
                        break;

                    case 422:
                        this.handle422(errorObj);
                        break;

                    default:
                        this.handleDefaultError(errorObj);
                        break;
                }


                return Observable.throw(errorObj);
            }) as any;
    }

    handle401() {
        let alert = this.alertController.create({
            title: 'Erro 401: falha de autenticação',
            message: 'Email e/ou senha incorretos',
            enableBackdropDismiss: false,
            buttons: [
                {text: 'Ok'}
            ]
        })
        alert.present();
    }

    handle403() {
        this.storage.setLocalUser(null);
    }

    handle422(errorObj) {
        let alert = this.alertController.create({
            title: "Erro 422: Validação",
            message: this.listErrors(errorObj.errors),
            enableBackdropDismiss: false,
            buttons: [
                {text: 'Ok'}
            ]
        });
        alert.present();
    }

    handleDefaultError(err) {
        let alert = this.alertController.create({
            title: `Erro ${err.status}: ${err.error}`,
            message: err.message,
            enableBackdropDismiss: false,
            buttons: [
                {text: 'Ok'}
            ]
        })
        alert.present();
    }

    listErrors(messages : FieldMessage[]) {
        let s : string = '';
        for (var i = 0; i < messages.length; i++) {
            s = s + '<p><strong>' + messages[i].fieldName + "</strong>: " + messages[i].message + '</p>';
        }
        return s;
    }

}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true,
};