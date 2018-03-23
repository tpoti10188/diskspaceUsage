import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import { Checkout } from './checkout';
import { Owner } from './owner';

@Injectable()
export class CheckoutService {

    private baseUrl = 'api/checkouts';
    constructor(private http: Http) {
     }

    getCheckoutsByServer(server: string): Observable<Checkout[]> {
        return this.http.get(this.baseUrl + '/' + server)
        .map(this.extractData)
        .do(data => console.log('getCheckoutsbyServer: ' + JSON.stringify(data)))
        .catch(this.handleError);
 }
    getAllCheckouts(): Observable<Checkout[]> {
        return this.http.get(this.baseUrl)
        .map(this.extractData)
        .do(data => console.log('getAllCheckouts: ' + JSON.stringify(data)))
        .catch(this.handleError);
 }
 getCheckout(id: string): Observable<Checkout> {
    if (id === '0') {
    return Observable.of(this.initializeCheckout());
    }
    const url = this.baseUrl + '/' + id;
    return this.http.get(url)
        .map(this.extractData)
        .do(data => console.log('getCheckout: ' + JSON.stringify(data)))
        .catch(this.handleError);
}

deleteCheckout(id: number): Observable<Response> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });

    const url = `${this.baseUrl}/${id}`;
    return this.http.delete(url, options)
        .do(data => console.log('deleteCheckout: ' + JSON.stringify(data)))
        .catch(this.handleError);
}

saveCheckout(checkout: Checkout): Observable<Checkout> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });

    if (checkout.id === 0) {
        return this.createCheckout(checkout, options);
    }
    return this.updateCheckout(checkout, options);
}

private createCheckout(checkout: Checkout, options: RequestOptions): Observable<Checkout> {
    checkout.id = undefined;
    return this.http.post(this.baseUrl, checkout, options)
        .map(this.extractData)
        .do(data => console.log('createCheckout: ' + JSON.stringify(data)))
        .catch(this.handleError);
}

private updateCheckout(checkout: Checkout, options: RequestOptions): Observable<Checkout> {
    const url = `${this.baseUrl}/${checkout.id}`;
    return this.http.put(url, checkout, options)
        .map(() => checkout)
        .do(data => console.log('updateCheckout: ' + JSON.stringify(data)))
        .catch(this.handleError);
}
 private extractData(response: Response) {
    // tslint:disable-next-line:prefer-const
    let body = response.json();
    return body.data || {};
}
private handleError(error: Response): Observable<any> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
}
initializeCheckout(): Checkout {
    // Return an initialized object
    return {
        id: 0,
        server: null,
        clientCode: null,
        startDate: null,
        endDate: null,
        permanent: false,
        jira: null,
        hdEvent: null,
        notes: null,
        owners: []
    };
}
}
