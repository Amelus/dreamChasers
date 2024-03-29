﻿import {catchError as _observableCatch, mergeMap as _observableMergeMap} from 'rxjs/operators';
import {Observable, of as _observableOf, Subscription, throwError as _observableThrow} from 'rxjs';
import {Inject, Injectable, InjectionToken, Optional} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse, HttpResponseBase} from '@angular/common/http';
import * as moment from 'moment';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');

@Injectable({
    providedIn: 'root'
})
export class Client {
    private http: HttpClient;
    private baseUrl: string; // http://localhost:4200/api
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(@Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
        this.http = http;
        this.baseUrl = baseUrl ? baseUrl : 'http://localhost:8080/api';
    }

    hello(): Observable<void> {
        let url = this.baseUrl + '/root/hello';
        url = url.replace(/[?&]$/, '');

        const options: any = {
            observe: 'response',
            responseType: 'blob',
            headers: new HttpHeaders({})
        };

        return this.http.request('get', url, options).pipe(_observableMergeMap((response: any) => {
            return this.processHello(response);
        })).pipe(_observableCatch((response: any) => {
            if (response instanceof HttpResponseBase) {
                try {
                    return this.processHello(response as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<void>;
                }
            } else {
                return _observableThrow(response) as any as Observable<void>;
            }
        }));
    }

    protected processHello(response: HttpResponseBase): Observable<void> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
                (response as any).error instanceof Blob ? (response as any).error : undefined;

        const headers: any = {};
        if (response.headers) {
            for (const key of response.headers.keys()) {
                headers[key] = response.headers.get(key);
            }
        }

        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(responseText => {
                return _observableOf<void>(null as any);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(responseText => {
                return throwException('An unexpected server error occurred.', status, responseText, headers);
            }));
        }
        return _observableOf<void>(null as any);
    }
}

@Injectable({
    providedIn: 'root'
})
export class UserClient {

    constructor(@Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
        this.http = http;
        this.baseUrl = baseUrl ? baseUrl : 'http://localhost:8080/api';
    }

    private http: HttpClient;
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    private static setSession(loginResponseVm: LoginResponseVm) {
        const expiresAt = moment().add(loginResponseVm.expiresIn, 'second');

        localStorage.setItem('id_token', loginResponseVm.token);
        localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
        localStorage.setItem('user', JSON.stringify(loginResponseVm.user));
    }

    getSessionUser(): UserVm {
        const parsedUser = JSON.parse(localStorage.getItem('user'));
        return UserVm.fromJS(parsedUser);
    }

    updateSessionUserImage(imageUrl: string) {
        const sessionUser: UserVm = this.getSessionUser();
        sessionUser.imageUrl = imageUrl;
        localStorage.setItem('user', JSON.stringify(sessionUser));
    }

    refreshSessionUser(): Subscription {
        return this.getUser().subscribe((user: UserVm) => {
            localStorage.setItem('user', JSON.stringify(user));
        });
    }

    getUser(): Observable<UserVm> {
        let url = this.baseUrl + '/user';
        url = url.replace(/[?&]$/, '');

        const options: any = {
            observe: 'response',
            responseType: 'blob',
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Accept: 'application/json'
            })
        };

        return this.http.request('get', url, options).pipe(_observableMergeMap((response: any) => {
            return this.processGet(response);
        })).pipe(_observableCatch((response: any) => {
            if (response instanceof HttpResponseBase) {
                try {
                    return this.processRegister(response as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<UserVm>;
                }
            } else {
                return _observableThrow(response) as any as Observable<UserVm>;
            }
        }));
    }

    protected processGet(response: HttpResponseBase): Observable<UserVm> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
                (response as any).error instanceof Blob ? (response as any).error : undefined;

        const headers: any = {};
        if (response.headers) {
            for (const key of response.headers.keys()) {
                headers[key] = response.headers.get(key);
            }
        }

        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(responseText => {
                let result200: any = null;
                const resultData200 = responseText === '' ? null : JSON.parse(responseText, this.jsonParseReviver);
                result200 = resultData200 ? UserVm.fromJS(resultData200) : new UserVm();
                return _observableOf(result200);
            }));
        } else if (status === 400) {
            return blobToText(responseBlob).pipe(_observableMergeMap(responseText => {
                let result400: any = null;
                const resultData400 = responseText === '' ? null : JSON.parse(responseText, this.jsonParseReviver);
                result400 = resultData400 ? ApiException.fromJS(resultData400) : new ApiException();
                return throwException('A server error occurred.', status, responseText, headers, result400);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(responseText => {
                return throwException('An unexpected server error occurred.', status, responseText, headers);
            }));
        }
        return _observableOf<UserVm>(null as any);
    }

    register(registerVm: RegisterVm): Observable<UserVm> {
        let url = this.baseUrl + '/user/register';
        url = url.replace(/[?&]$/, '');

        const content = JSON.stringify(registerVm);

        const options: any = {
            body: content,
            observe: 'response',
            responseType: 'blob',
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Accept: 'application/json'
            })
        };

        return this.http.request('post', url, options).pipe(_observableMergeMap((response: any) => {
            return this.processRegister(response);
        })).pipe(_observableCatch((response: any) => {
            if (response instanceof HttpResponseBase) {
                try {
                    return this.processRegister(response as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<UserVm>;
                }
            } else {
                return _observableThrow(response) as any as Observable<UserVm>;
            }
        }));
    }

    protected processRegister(response: HttpResponseBase): Observable<UserVm> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
                (response as any).error instanceof Blob ? (response as any).error : undefined;

        const headers: any = {};
        if (response.headers) {
            for (const key of response.headers.keys()) {
                headers[key] = response.headers.get(key);
            }
        }

        if (status === 201) {
            return blobToText(responseBlob).pipe(_observableMergeMap(responseText => {
                let result201: any = null;
                const resultData201 = responseText === '' ? null : JSON.parse(responseText, this.jsonParseReviver);
                result201 = resultData201 ? UserVm.fromJS(resultData201) : new UserVm();
                return _observableOf(result201);
            }));
        } else if (status === 400) {
            return blobToText(responseBlob).pipe(_observableMergeMap(responseText => {
                let result400: any = null;
                const resultData400 = responseText === '' ? null : JSON.parse(responseText, this.jsonParseReviver);
                result400 = resultData400 ? ApiException.fromJS(resultData400) : new ApiException();
                return throwException('A server error occurred.', status, responseText, headers, result400);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(responseText => {
                return throwException('An unexpected server error occurred.', status, responseText, headers);
            }));
        }
        return _observableOf<UserVm>(null as any);
    }

    login(loginVm: LoginVm): Observable<LoginResponseVm> {
        let url = this.baseUrl + '/user/login';
        url = url.replace(/[?&]$/, '');

        const content = JSON.stringify(loginVm);

        const options: any = {
            body: content,
            observe: 'response',
            responseType: 'blob',
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Accept: 'application/json'
            })
        };

        return this.http.request('post', url, options).pipe(_observableMergeMap((response: any) => {
            return this.processLogin(response);
        })).pipe(_observableCatch((response: any) => {
            if (response instanceof HttpResponseBase) {
                try {
                    return this.processLogin(response as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<LoginResponseVm>;
                }
            } else {
                return _observableThrow(response) as any as Observable<LoginResponseVm>;
            }
        }));
    }

    protected processLogin(response: HttpResponseBase): Observable<LoginResponseVm> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
                (response as any).error instanceof Blob ? (response as any).error : undefined;

        const headers: any = {};
        if (response.headers) {
            for (const key of response.headers.keys()) {
                headers[key] = response.headers.get(key);
            }
        }

        if (status === 201) {
            return blobToText(responseBlob).pipe(_observableMergeMap(responseText => {
                let result201: any = null;
                const resultData201 = responseText === '' ? null : JSON.parse(responseText, this.jsonParseReviver);
                result201 = resultData201 ? LoginResponseVm.fromJS(resultData201) : new LoginResponseVm();
                UserClient.setSession(result201);
                return _observableOf(result201);
            }));
        } else if (status === 400) {
            return blobToText(responseBlob).pipe(_observableMergeMap(responseText => {
                let result400: any = null;
                const resultData400 = responseText === '' ? null : JSON.parse(responseText, this.jsonParseReviver);
                result400 = resultData400 ? ApiException.fromJS(resultData400) : new ApiException();
                return throwException('A server error occurred.', status, responseText, headers, result400);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(responseText => {
                return throwException('An unexpected server error occurred.', status, responseText, headers);
            }));
        }
        return _observableOf<LoginResponseVm>(null as any);
    }

    update(updateVm: UpdateUserVm): Observable<UpdateUserResponseVm> {
        let url = this.baseUrl + '/user/update';
        url = url.replace(/[?&]$/, '');

        const content = JSON.stringify(updateVm);

        const options: any = {
            body: content,
            observe: 'response',
            responseType: 'blob',
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Accept: 'application/json'
            })
        };

        return this.http.request('put', url, options).pipe(_observableMergeMap((response: any) => {
            return this.processUpdate(response);
        })).pipe(_observableCatch((response: any) => {
            if (response instanceof HttpResponseBase) {
                try {
                    return this.processUpdate(response as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<UpdateUserResponseVm>;
                }
            } else {
                return _observableThrow(response) as any as Observable<UpdateUserResponseVm>;
            }
        }));
    }

    protected processUpdate(response: HttpResponseBase): Observable<UpdateUserResponseVm> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
                (response as any).error instanceof Blob ? (response as any).error : undefined;

        const headers: any = {};
        if (response.headers) {
            for (const key of response.headers.keys()) {
                headers[key] = response.headers.get(key);
            }
        }

        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(responseText => {
                let result200: any = null;
                const resultData200 = responseText === '' ? null : JSON.parse(responseText, this.jsonParseReviver);
                result200 = resultData200 ? UpdateUserResponseVm.fromJS(resultData200) : new UpdateUserResponseVm();
                return _observableOf(result200);
            }));
        } else if (status === 400) {
            return blobToText(responseBlob).pipe(_observableMergeMap(responseText => {
                let result400: any = null;
                const resultData400 = responseText === '' ? null : JSON.parse(responseText, this.jsonParseReviver);
                result400 = resultData400 ? ApiException.fromJS(resultData400) : new ApiException();
                return throwException('A server error occurred.', status, responseText, headers, result400);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(responseText => {
                return throwException('An unexpected server error occurred.', status, responseText, headers);
            }));
        }
        return _observableOf<UpdateUserResponseVm>(null as any);
    }

    getAssignees(): Observable<UserVm[]> {
        let url = this.baseUrl + '/user/assignees';

        url = url.replace(/[?&]$/, '');

        const options: any = {
            observe: 'response',
            responseType: 'blob',
            headers: new HttpHeaders({
                Accept: 'application/json'
            })
        };

        return this.http.request('get', url, options).pipe(_observableMergeMap((response: any) => {
            return this.processGetall(response);
        })).pipe(_observableCatch((response: any) => {
            if (response instanceof HttpResponseBase) {
                try {
                    return this.processGetall(response as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<UserVm[]>;
                }
            } else {
                return _observableThrow(response) as any as Observable<UserVm[]>;
            }
        }));
    }

    protected processGetall(response: HttpResponseBase): Observable<UserVm[]> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
                (response as any).error instanceof Blob ? (response as any).error : undefined;

        const headers: any = {};
        if (response.headers) {
            for (const key of response.headers.keys()) {
                headers[key] = response.headers.get(key);
            }
        }

        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(responseText => {
                let result200: any = null;
                const resultData200 = responseText === '' ? null : JSON.parse(responseText, this.jsonParseReviver);
                if (resultData200 && resultData200.constructor === Array) {
                    result200 = [];
                    for (const item of resultData200) {
                        result200.push(UserVm.fromJS(item));
                    }
                }
                return _observableOf(result200);
            }));
        } else if (status === 400) {
            return blobToText(responseBlob).pipe(_observableMergeMap(responseText => {
                let result400: any = null;
                const resultData400 = responseText === '' ? null : JSON.parse(responseText, this.jsonParseReviver);
                result400 = resultData400 ? ApiException.fromJS(resultData400) : new ApiException();
                return throwException('A server error occurred.', status, responseText, headers, result400);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(responseText => {
                return throwException('An unexpected server error occurred.', status, responseText, headers);
            }));
        }
        return _observableOf<UserVm[]>(null as any);
    }

    logout() {
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
        localStorage.removeItem('user');
    }

    public isLoggedIn() {
        return moment().isBefore(this.getTokenExpiration());
    }

    isLoggedOut() {
        return !this.isLoggedIn();
    }

    getTokenExpiration() {
        const expiration = localStorage.getItem('expires_at');
        const expiresAt = JSON.parse(expiration);
        return moment(expiresAt);
    }
}

@Injectable({
    providedIn: 'root'
})
export class TodoClient {
    private http: HttpClient;
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(@Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
        this.http = http;
        this.baseUrl = baseUrl ? baseUrl : 'http://localhost:8080/api';
    }

    create(todoParams: TodoParams): Observable<TodoVm> {
        let url = this.baseUrl + '/todos';
        url = url.replace(/[?&]$/, '');

        const content = JSON.stringify(todoParams);

        const options: any = {
            body: content,
            observe: 'response',
            responseType: 'blob',
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Accept: 'application/json'
            })
        };

        return this.http.request('post', url, options).pipe(_observableMergeMap((response: any) => {
            return this.processCreate(response);
        })).pipe(_observableCatch((response: any) => {
            if (response instanceof HttpResponseBase) {
                try {
                    return this.processCreate(response as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<TodoVm>;
                }
            } else {
                return _observableThrow(response) as any as Observable<TodoVm>;
            }
        }));
    }

    protected processCreate(response: HttpResponseBase): Observable<TodoVm> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
                (response as any).error instanceof Blob ? (response as any).error : undefined;

        const headers: any = {};
        if (response.headers) {
            for (const key of response.headers.keys()) {
                headers[key] = response.headers.get(key);
            }
        }

        if (status === 201) {
            return blobToText(responseBlob).pipe(_observableMergeMap(responseText => {
                let result201: any = null;
                const resultData201 = responseText === '' ? null : JSON.parse(responseText, this.jsonParseReviver);
                result201 = resultData201 ? TodoVm.fromJS(resultData201) : new TodoVm();
                return _observableOf(result201);
            }));
        } else if (status === 400) {
            return blobToText(responseBlob).pipe(_observableMergeMap(responseText => {
                let result400: any = null;
                const resultData400 = responseText === '' ? null : JSON.parse(responseText, this.jsonParseReviver);
                result400 = resultData400 ? ApiException.fromJS(resultData400) : new ApiException();
                return throwException('A server error occurred.', status, responseText, headers, result400);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(responseText => {
                return throwException('An unexpected server error occurred.', status, responseText, headers);
            }));
        }
        return _observableOf<TodoVm>(null as any);
    }

    getAssigned(): Observable<TodoVm[]> {
        let url = this.baseUrl + '/todos/assigned';

        url = url.replace(/[?&]$/, '');

        const options: any = {
            observe: 'response',
            responseType: 'blob',
            headers: new HttpHeaders({
                Accept: 'application/json'
            })
        };

        return this.http.request('get', url, options).pipe(_observableMergeMap((response: any) => {
            return this.processGetall(response);
        })).pipe(_observableCatch((response: any) => {
            if (response instanceof HttpResponseBase) {
                try {
                    return this.processGetall(response as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<TodoVm[]>;
                }
            } else {
                return _observableThrow(response) as any as Observable<TodoVm[]>;
            }
        }));
    }

    getCreated(): Observable<TodoVm[]> {
        let url = this.baseUrl + '/todos/created';

        url = url.replace(/[?&]$/, '');

        const options: any = {
            observe: 'response',
            responseType: 'blob',
            headers: new HttpHeaders({
                Accept: 'application/json'
            })
        };

        return this.http.request('get', url, options).pipe(_observableMergeMap((response: any) => {
            return this.processGetall(response);
        })).pipe(_observableCatch((response: any) => {
            if (response instanceof HttpResponseBase) {
                try {
                    return this.processGetall(response as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<TodoVm[]>;
                }
            } else {
                return _observableThrow(response) as any as Observable<TodoVm[]>;
            }
        }));
    }

    protected processGetall(response: HttpResponseBase): Observable<TodoVm[]> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
                (response as any).error instanceof Blob ? (response as any).error : undefined;

        const headers: any = {};
        if (response.headers) {
            for (const key of response.headers.keys()) {
                headers[key] = response.headers.get(key);
            }
        }

        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(responseText => {
                let result200: any = null;
                const resultData200 = responseText === '' ? null : JSON.parse(responseText, this.jsonParseReviver);
                if (resultData200 && resultData200.constructor === Array) {
                    result200 = [];
                    for (const item of resultData200) {
                        result200.push(TodoVm.fromJS(item));
                    }
                }
                return _observableOf(result200);
            }));
        } else if (status === 400) {
            return blobToText(responseBlob).pipe(_observableMergeMap(responseText => {
                let result400: any = null;
                const resultData400 = responseText === '' ? null : JSON.parse(responseText, this.jsonParseReviver);
                result400 = resultData400 ? ApiException.fromJS(resultData400) : new ApiException();
                return throwException('A server error occurred.', status, responseText, headers, result400);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(responseText => {
                return throwException('An unexpected server error occurred.', status, responseText, headers);
            }));
        }
        return _observableOf<TodoVm[]>(null as any);
    }

    update(todoVm: TodoVm): Observable<TodoVm> {
        let url = this.baseUrl + '/todos';
        url = url.replace(/[?&]$/, '');

        const content = JSON.stringify(todoVm);

        const options: any = {
            body: content,
            observe: 'response',
            responseType: 'blob',
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Accept: 'application/json'
            })
        };

        return this.http.request('put', url, options).pipe(_observableMergeMap((response: any) => {
            return this.processUpdate(response);
        })).pipe(_observableCatch((response: any) => {
            if (response instanceof HttpResponseBase) {
                try {
                    return this.processUpdate(response as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<TodoVm>;
                }
            } else {
                return _observableThrow(response) as any as Observable<TodoVm>;
            }
        }));
    }

    protected processUpdate(response: HttpResponseBase): Observable<TodoVm> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
                (response as any).error instanceof Blob ? (response as any).error : undefined;

        const headers: any = {};
        if (response.headers) {
            for (const key of response.headers.keys()) {
                headers[key] = response.headers.get(key);
            }
        }

        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(responseText => {
                let result200: any = null;
                const resultData200 = responseText === '' ? null : JSON.parse(responseText, this.jsonParseReviver);
                result200 = resultData200 ? TodoVm.fromJS(resultData200) : new TodoVm();
                return _observableOf(result200);
            }));
        } else if (status === 400) {
            return blobToText(responseBlob).pipe(_observableMergeMap(responseText => {
                let result400: any = null;
                const resultData400 = responseText === '' ? null : JSON.parse(responseText, this.jsonParseReviver);
                result400 = resultData400 ? ApiException.fromJS(resultData400) : new ApiException();
                return throwException('A server error occurred.', status, responseText, headers, result400);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(responseText => {
                return throwException('An unexpected server error occurred.', status, responseText, headers);
            }));
        }
        return _observableOf<TodoVm>(null as any);
    }

    delete(ids: string[]): Observable<TodoVm> {
        let url = this.baseUrl + '/todos/delete';

        if (ids === undefined || ids === null || ids.length <= 0) {
            throw new Error('The parameter \'ids\' must be defined.');
        }
        url = url.replace(/[?&]$/, '');

        const options: any = {
            body: ids,
            observe: 'response',
            responseType: 'blob',
            headers: new HttpHeaders({
                Accept: 'application/json'
            })
        };

        return this.http.request('delete', url, options).pipe(_observableMergeMap((response: any) => {
            return this.processDelete(response);
        })).pipe(_observableCatch((response: any) => {
            if (response instanceof HttpResponseBase) {
                try {
                    return this.processDelete(response as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<TodoVm>;
                }
            } else {
                return _observableThrow(response) as any as Observable<TodoVm>;
            }
        }));
    }

    protected processDelete(response: HttpResponseBase): Observable<TodoVm> {
        return this.processUpdate(response);
    }
}

@Injectable({
    providedIn: 'root'
})
export class AppointmentClient {
    private http: HttpClient;
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(@Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
        this.http = http;
        this.baseUrl = baseUrl ? baseUrl : 'http://localhost:8080/api';
    }

    create(appointmentParams: AppointmentParams): Observable<AppointmentVm> {
        let url = this.baseUrl + '/appointment';
        url = url.replace(/[?&]$/, '');

        const content = JSON.stringify(appointmentParams);

        const options: any = {
            body: content,
            observe: 'response',
            responseType: 'blob',
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Accept: 'application/json'
            })
        };

        return this.http.request('post', url, options).pipe(_observableMergeMap((response: any) => {
            return this.processCreate(response);
        })).pipe(_observableCatch((response: any) => {
            if (response instanceof HttpResponseBase) {
                try {
                    return this.processCreate(response as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<AppointmentVm>;
                }
            } else {
                return _observableThrow(response) as any as Observable<AppointmentVm>;
            }
        }));
    }

    protected processCreate(response: HttpResponseBase): Observable<AppointmentVm> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
                (response as any).error instanceof Blob ? (response as any).error : undefined;

        const headers: any = {};
        if (response.headers) {
            for (const key of response.headers.keys()) {
                headers[key] = response.headers.get(key);
            }
        }

        if (status === 201) {
            return blobToText(responseBlob).pipe(_observableMergeMap(responseText => {
                let result201: any = null;
                const resultData201 = responseText === '' ? null : JSON.parse(responseText, this.jsonParseReviver);
                result201 = resultData201 ? AppointmentVm.fromJS(resultData201) : new AppointmentVm();
                return _observableOf(result201);
            }));
        } else if (status === 400) {
            return blobToText(responseBlob).pipe(_observableMergeMap(responseText => {
                let result400: any = null;
                const resultData400 = responseText === '' ? null : JSON.parse(responseText, this.jsonParseReviver);
                result400 = resultData400 ? ApiException.fromJS(resultData400) : new ApiException();
                return throwException('A server error occurred.', status, responseText, headers, result400);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(responseText => {
                return throwException('An unexpected server error occurred.', status, responseText, headers);
            }));
        }
        return _observableOf<AppointmentVm>(null as any);
    }

    getAll(): Observable<AppointmentVm[]> {
        let url = this.baseUrl + '/appointment';

        url = url.replace(/[?&]$/, '');

        const options: any = {
            observe: 'response',
            responseType: 'blob',
            headers: new HttpHeaders({
                Accept: 'application/json'
            })
        };

        return this.http.request('get', url, options).pipe(_observableMergeMap((response: any) => {
            return this.processGetall(response);
        })).pipe(_observableCatch((response: any) => {
            if (response instanceof HttpResponseBase) {
                try {
                    return this.processGetall(response as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<AppointmentVm[]>;
                }
            } else {
                return _observableThrow(response) as any as Observable<AppointmentVm[]>;
            }
        }));
    }


    protected processGetall(response: HttpResponseBase): Observable<AppointmentVm[]> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
                (response as any).error instanceof Blob ? (response as any).error : undefined;

        const headers: any = {};
        if (response.headers) {
            for (const key of response.headers.keys()) {
                headers[key] = response.headers.get(key);
            }
        }

        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(responseText => {
                let result200: any = null;
                const resultData200 = responseText === '' ? null : JSON.parse(responseText, this.jsonParseReviver);
                if (resultData200 && resultData200.constructor === Array) {
                    result200 = [];
                    for (const item of resultData200) {
                        result200.push(AppointmentVm.fromJS(item));
                    }
                }
                return _observableOf(result200);
            }));
        } else if (status === 400) {
            return blobToText(responseBlob).pipe(_observableMergeMap(responseText => {
                let result400: any = null;
                const resultData400 = responseText === '' ? null : JSON.parse(responseText, this.jsonParseReviver);
                result400 = resultData400 ? ApiException.fromJS(resultData400) : new ApiException();
                return throwException('A server error occurred.', status, responseText, headers, result400);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(responseText => {
                return throwException('An unexpected server error occurred.', status, responseText, headers);
            }));
        }
        return _observableOf<AppointmentVm[]>(null as any);
    }

    update(appointmentVm: AppointmentVm): Observable<AppointmentVm> {
        let url = this.baseUrl + '/appointment';
        url = url.replace(/[?&]$/, '');

        const content = JSON.stringify(appointmentVm);

        const options: any = {
            body: content,
            observe: 'response',
            responseType: 'blob',
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Accept: 'application/json'
            })
        };

        return this.http.request('put', url, options).pipe(_observableMergeMap((response: any) => {
            return this.processUpdate(response);
        })).pipe(_observableCatch((response: any) => {
            if (response instanceof HttpResponseBase) {
                try {
                    return this.processUpdate(response as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<AppointmentVm>;
                }
            } else {
                return _observableThrow(response) as any as Observable<AppointmentVm>;
            }
        }));
    }

    protected processUpdate(response: HttpResponseBase): Observable<AppointmentVm> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
                (response as any).error instanceof Blob ? (response as any).error : undefined;

        const headers: any = {};
        if (response.headers) {
            for (const key of response.headers.keys()) {
                headers[key] = response.headers.get(key);
            }
        }

        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(responseText => {
                let result200: any = null;
                const resultData200 = responseText === '' ? null : JSON.parse(responseText, this.jsonParseReviver);
                result200 = resultData200 ? AppointmentVm.fromJS(resultData200) : new AppointmentVm();
                return _observableOf(result200);
            }));
        } else if (status === 400) {
            return blobToText(responseBlob).pipe(_observableMergeMap(responseText => {
                let result400: any = null;
                const resultData400 = responseText === '' ? null : JSON.parse(responseText, this.jsonParseReviver);
                result400 = resultData400 ? ApiException.fromJS(resultData400) : new ApiException();
                return throwException('A server error occurred.', status, responseText, headers, result400);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(responseText => {
                return throwException('An unexpected server error occurred.', status, responseText, headers);
            }));
        }
        return _observableOf<AppointmentVm>(null as any);
    }

    delete(id: string): Observable<AppointmentVm> {
        let url = this.baseUrl + '/appointment/delete';

        if (id === undefined || id === null) {
            throw new Error('The parameter \'id\' must be defined.');
        }
        url = url.replace(/[?&]$/, '');

        const options: any = {
            body: id,
            observe: 'response',
            responseType: 'blob',
            headers: new HttpHeaders({
                Accept: 'application/json'
            })
        };

        return this.http.request('delete', url, options).pipe(_observableMergeMap((response: any) => {
            return this.processDelete(response);
        })).pipe(_observableCatch((response: any) => {
            if (response instanceof HttpResponseBase) {
                try {
                    return this.processDelete(response as any);
                } catch (e) {
                    return _observableThrow(e) as any as Observable<AppointmentVm>;
                }
            } else {
                return _observableThrow(response) as any as Observable<AppointmentVm>;
            }
        }));
    }

    protected processDelete(response: HttpResponseBase): Observable<AppointmentVm> {
        return this.processUpdate(response);
    }
}

export class RegisterVm implements IRegisterVm {

    constructor(data?: IRegisterVm) {
        if (data) {
            for (const property in data) {
                if (data.hasOwnProperty(property)) {
                    (this as any)[property] = (data as any)[property];
                }
            }
        }
    }

    registrationCode!: string;
    username!: string;
    password!: string;
    firstName?: string | null;
    lastName?: string | null;

    static fromJS(data: any): RegisterVm {
        data = typeof data === 'object' ? data : {};
        const result = new RegisterVm();
        result.init(data);
        return result;
    }

    init(data?: any) {
        if (data) {
            this.registrationCode = data.registrationCode !== undefined ? data.registrationCode : null as any;
            this.username = data.username !== undefined ? data.username : null as any;
            this.password = data.password !== undefined ? data.password : null as any;
            this.firstName = data.firstName !== undefined ? data.firstName : null as any;
            this.lastName = data.lastName !== undefined ? data.lastName : null as any;
        }
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data.registrationCode = this.registrationCode !== undefined ? this.registrationCode : null as any;
        data.username = this.username !== undefined ? this.username : null as any;
        data.password = this.password !== undefined ? this.password : null as any;
        data.firstName = this.firstName !== undefined ? this.firstName : null as any;
        data.lastName = this.lastName !== undefined ? this.lastName : null as any;
        return data;
    }
}

export interface IRegisterVm {
    registrationCode: string;
    username: string;
    password: string;
    firstName?: string | null;
    lastName?: string | null;
}

export class UpdateUserVm implements IUpdateUserVm {

    constructor(data?: IUpdateUserVm) {
        if (data) {
            for (const property in data) {
                if (data.hasOwnProperty(property)) {
                    (this as any)[property] = (data as any)[property];
                }
            }
        }
    }

    oldPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
    imageUrl?: string | null;
    upgradeCode?: string | null;

    static fromJS(data: any): UpdateUserVm {
        data = typeof data === 'object' ? data : {};
        const result = new UpdateUserVm();
        result.init(data);
        return result;
    }

    init(data?: any) {
        if (data) {
            this.oldPassword = data.oldPassword !== undefined ? data.oldPassword : null as any;
            this.newPassword = data.newPassword !== undefined ? data.newPassword : null as any;
            this.confirmPassword = data.confirmPassword !== undefined ? data.confirmPassword : null as any;
            this.imageUrl = data.imageUrl !== undefined ? data.imageUrl : null as any;
            this.upgradeCode = data.upgradeCode !== undefined ? data.upgradeCode : null as any;
        }
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data.oldPassword = this.oldPassword !== undefined ? this.oldPassword : null as any;
        data.newPassword = this.newPassword !== undefined ? this.newPassword : null as any;
        data.confirmPassword = this.confirmPassword !== undefined ? this.confirmPassword : null as any;
        data.imageUrl = this.imageUrl !== undefined ? this.imageUrl : null as any;
        data.upgradeCode = this.upgradeCode !== undefined ? this.upgradeCode : null as any;
        return data;
    }
}

export interface IUpdateUserVm {
    oldPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
    imageUrl?: string | null;
    upgradeCode?: string | null;
}

export class UpdateUserResponseVm implements IUpdateUserResponseVm {

    constructor(data?: IUpdateUserVm) {
        if (data) {
            for (const property in data) {
                if (data.hasOwnProperty(property)) {
                    (this as any)[property] = (data as any)[property];
                }
            }
        }
    }

    imageUrl?: string | null;
    role?: UserVmRole | null;
    status!: UpdateUserStatus;

    static fromJS(data: any): UpdateUserResponseVm {
        data = typeof data === 'object' ? data : {};
        const result = new UpdateUserResponseVm();
        result.init(data);
        return result;
    }

    init(data?: any) {
        if (data) {
            this.imageUrl = data.imageUrl !== undefined ? data.imageUrl : null as any;
            this.role = data.role !== undefined ? data.role : null as any;
            this.status = data.status !== undefined ? data.status : null as any;
        }
    }

    toJSON(data?: any) {
        data.imageUrl = this.imageUrl !== undefined ? this.imageUrl : null as any;
        data.role = this.role !== undefined ? this.role : null as any;
        data.status = this.status !== undefined ? this.status : null as any;
        return data;
    }
}

export interface IUpdateUserResponseVm {
    imageUrl?: string | null;
    role?: UserVmRole | null;
    status: UpdateUserStatus;
}

export class UserVm implements IUserVm {

    constructor(data?: IUserVm) {
        if (data) {
            for (const property in data) {
                if (data.hasOwnProperty(property)) {
                    (this as any)[property] = (data as any)[property];
                }
            }
        }
    }

    createdAt?: Date | null;
    updatedAt?: Date | null;
    id?: string | null;
    username!: string;
    firstName?: string | null;
    lastName?: string | null;
    fullName?: string | null;
    role?: UserVmRole | null;
    imageUrl?: string | null;

    static fromJS(data: any): UserVm {
        data = typeof data === 'object' ? data : {};
        const result = new UserVm();
        result.init(data);
        return result;
    }

    init(data?: any) {
        if (data) {
            this.createdAt = data.createdAt ? new Date(data.createdAt.toString()) : null as any;
            this.updatedAt = data.updatedAt ? new Date(data.updatedAt.toString()) : null as any;
            this.id = data.id !== undefined ? data.id : null as any;
            this.username = data.username !== undefined ? data.username : null as any;
            this.firstName = data.firstName !== undefined ? data.firstName : null as any;
            this.lastName = data.lastName !== undefined ? data.lastName : null as any;
            this.fullName = data.fullName !== undefined ? data.fullName : null as any;
            this.role = data.role !== undefined ? data.role : null as any;
            this.imageUrl = data.imageUrl !== undefined ? data.imageUrl : null as any;
        }
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data.createdAt = this.createdAt ? this.createdAt.toISOString() : null as any;
        data.updatedAt = this.updatedAt ? this.updatedAt.toISOString() : null as any;
        data.id = this.id !== undefined ? this.id : null as any;
        data.username = this.username !== undefined ? this.username : null as any;
        data.firstName = this.firstName !== undefined ? this.firstName : null as any;
        data.lastName = this.lastName !== undefined ? this.lastName : null as any;
        data.fullName = this.fullName !== undefined ? this.fullName : null as any;
        data.role = this.role !== undefined ? this.role : null as any;
        data.imageUrl = this.imageUrl !== undefined ? this.imageUrl : null as any;
        return data;
    }
}

export interface IUserVm {
    createdAt?: Date | null;
    updatedAt?: Date | null;
    id?: string | null;
    username: string;
    firstName?: string | null;
    lastName?: string | null;
    fullName?: string | null;
    role?: UserVmRole | null;
    imageUrl?: string | null;
}

export class ApiException implements IApiException {

    constructor(data?: IApiException) {
        if (data) {
            for (const property in data) {
                if (data.hasOwnProperty(property)) {
                    (this as any)[property] = (data as any)[property];
                }
            }
        }
    }

    statusCode?: number | null;
    message?: string | null;
    status?: string | null;
    error?: string | null;
    errors?: any | null;
    timestamp?: string | null;
    path?: string | null;

    static fromJS(data: any): ApiException {
        data = typeof data === 'object' ? data : {};
        const result = new ApiException();
        result.init(data);
        return result;
    }

    init(data?: any) {
        if (data) {
            this.statusCode = data.statusCode !== undefined ? data.statusCode : null as any;
            this.message = data.message !== undefined ? data.message : null as any;
            this.status = data.status !== undefined ? data.status : null as any;
            this.error = data.error !== undefined ? data.error : null as any;
            this.errors = data.errors !== undefined ? data.errors : null as any;
            this.timestamp = data.timestamp !== undefined ? data.timestamp : null as any;
            this.path = data.path !== undefined ? data.path : null as any;
        }
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data.statusCode = this.statusCode !== undefined ? this.statusCode : null as any;
        data.message = this.message !== undefined ? this.message : null as any;
        data.status = this.status !== undefined ? this.status : null as any;
        data.error = this.error !== undefined ? this.error : null as any;
        data.errors = this.errors !== undefined ? this.errors : null as any;
        data.timestamp = this.timestamp !== undefined ? this.timestamp : null as any;
        data.path = this.path !== undefined ? this.path : null as any;
        return data;
    }
}

export interface IApiException {
    statusCode?: number | null;
    message?: string | null;
    status?: string | null;
    error?: string | null;
    errors?: any | null;
    timestamp?: string | null;
    path?: string | null;
}

export class LoginVm implements ILoginVm {

    constructor(data?: ILoginVm) {
        if (data) {
            for (const property in data) {
                if (data.hasOwnProperty(property)) {
                    (this as any)[property] = (data as any)[property];
                }
            }
        }
    }

    username!: string;
    password!: string;

    static fromJS(data: any): LoginVm {
        data = typeof data === 'object' ? data : {};
        const result = new LoginVm();
        result.init(data);
        return result;
    }

    init(data?: any) {
        if (data) {
            this.username = data.username !== undefined ? data.username : null as any;
            this.password = data.password !== undefined ? data.password : null as any;
        }
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data.username = this.username !== undefined ? this.username : null as any;
        data.password = this.password !== undefined ? this.password : null as any;
        return data;
    }
}

export interface ILoginVm {
    username: string;
    password: string;
}

export class LoginResponseVm implements ILoginResponseVm {

    constructor(data?: ILoginResponseVm) {
        if (data) {
            for (const property in data) {
                if (data.hasOwnProperty(property)) {
                    (this as any)[property] = (data as any)[property];
                }
            }
        }
        if (!data) {
            this.user = new UserVm();
        }
    }

    token!: string;
    expiresIn!: string;
    user!: UserVm;

    static fromJS(data: any): LoginResponseVm {
        data = typeof data === 'object' ? data : {};
        const result = new LoginResponseVm();
        result.init(data);
        return result;
    }

    init(data?: any) {
        if (data) {
            this.token = data.token !== undefined ? data.token : null as any;
            this.expiresIn = data.expiresIn !== undefined ? data.expiresIn : null as any;
            this.user = data.user ? UserVm.fromJS(data.user) : new UserVm();
        }
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data.token = this.token !== undefined ? this.token : null as any;
        data.expiresIn = this.expiresIn !== undefined ? this.expiresIn : null as any;
        data.user = this.user ? this.user.toJSON() : null as any;
        return data;
    }
}

export interface ILoginResponseVm {
    token: string;
    expiresIn: string;
    user: UserVm;
}

export class TodoParams implements ITodoParams {

    constructor(data?: ITodoParams) {
        if (data) {
            for (const property in data) {
                if (data.hasOwnProperty(property)) {
                    (this as any)[property] = (data as any)[property];
                }
            }
        }
    }

    creator?: string;
    assignee: string;
    title: string;
    content!: string;
    status?: TodoParamsStatus | null;
    dueDate: Date;

    static fromJS(data: any): TodoParams {
        data = typeof data === 'object' ? data : {};
        const result = new TodoParams();
        result.init(data);
        return result;
    }

    init(data?: any) {
        if (data) {
            this.creator = data.creator !== undefined ? data.creator : null as any;
            this.assignee = data.assignee !== undefined ? data.assignee : null as any;
            this.title = data.title !== undefined ? data.title : null as any;
            this.content = data.content !== undefined ? data.content : null as any;
            this.dueDate = data.dueDate ? new Date(data.dueDate.toString()) : null as any;
            this.status = data.status !== undefined ? data.status : null as any;
        }
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data.creator = this.creator !== undefined ? this.creator : null as any;
        data.assignee = this.assignee !== undefined ? this.assignee : null as any;
        data.title = this.title !== undefined ? this.title : null as any;
        data.content = this.content !== undefined ? this.content : null as any;
        data.status = this.status !== undefined ? this.status : null as any;
        data.dueDate = this.dueDate ? this.dueDate : null as any;
        return data;
    }
}

export interface ITodoParams {
    creator?: string;
    assignee: string;
    title: string;
    content: string;
    dueDate: Date;
    status?: TodoParamsStatus | null;
}

export class TodoVm implements ITodoVm {

    constructor(data?: ITodoVm) {
        if (data) {
            for (const property in data) {
                if (data.hasOwnProperty(property)) {
                    (this as any)[property] = (data as any)[property];
                }
            }
        }
    }

    createdAt?: Date | null;
    updatedAt?: Date | null;
    id?: string | null;
    creator!: string;
    assignee!: string;
    title!: string;
    content!: string;
    dueDate!: Date;
    status!: TodoVmStatus;
    isCompleted?: boolean | false;
    isChecked?: boolean | false;

    static fromJS(data: any): TodoVm {
        data = typeof data === 'object' ? data : {};
        const result = new TodoVm();
        result.init(data);
        return result;
    }

    init(data?: any) {
        if (data) {
            this.createdAt = data.createdAt ? new Date(data.createdAt.toString()) : null as any;
            this.updatedAt = data.updatedAt ? new Date(data.updatedAt.toString()) : null as any;
            this.id = data.id !== undefined ? data.id : null as any;
            this.creator = data.creator !== undefined ? data.creator : null as any;
            this.assignee = data.assignee !== undefined ? data.assignee : null as any;
            this.title = data.title !== undefined ? data.title : null as any;
            this.content = data.content !== undefined ? data.content : null as any;
            this.dueDate = data.dueDate ? new Date(data.dueDate.toString()) : null as any;
            this.status = data.status !== undefined ? data.status : null as any;
            this.isCompleted = data.isCompleted !== undefined ? data.isCompleted : null as any;
        }
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data.createdAt = this.createdAt ? this.createdAt.toISOString() : null as any;
        data.updatedAt = this.updatedAt ? this.updatedAt.toISOString() : null as any;
        data.id = this.id !== undefined ? this.id : null as any;
        data.creator = this.creator !== undefined ? this.creator : null as any;
        data.assignee = this.assignee !== undefined ? this.assignee : null as any;
        data.title = this.title !== undefined ? this.title : null as any;
        data.content = this.content !== undefined ? this.content : null as any;
        data.status = this.status !== undefined ? this.status : null as any;
        data.dueDate = this.dueDate ? this.dueDate.toISOString() : null as any;
        data.isCompleted = this.isCompleted !== undefined ? this.isCompleted : null as any;
        return data;
    }
}

export interface ITodoVm {
    createdAt?: Date | null;
    updatedAt?: Date | null;
    id?: string | null;
    creator: string;
    assignee: string;
    title: string;
    content: string;
    status: TodoVmStatus;
    dueDate: Date;
    isCompleted?: boolean | false;
    isChecked?: boolean | false;
}

export class AppointmentParams implements IAppointmentParams {

    constructor(data?: IAppointmentParams) {
        if (data) {
            for (const property in data) {
                if (data.hasOwnProperty(property)) {
                    (this as any)[property] = (data as any)[property];
                }
            }
        }
    }

    title: string;
    content?: string | null;
    global: boolean | false;
    allDay: boolean | false;
    start?: Date | null;
    end?: Date | null;
    daysOfWeek?: number[] | null;
    startTime?: string | null;
    endTime?: string | null;
    backgroundColor?: string | null;

    /*
        static fromJS(data: any): AppointmentParams {
            data = typeof data === 'object' ? data : {};
            const result = new AppointmentParams();
            result.init(data);
            return result;
        }

        init(data?: any) {
            if (data) {
                this.title = data.title !== undefined ? data.title : null as any;
                this.content = data.content !== undefined ? data.content : null as any;
                this.global = data.global !== undefined ? data.global : null as any;
                this.allDay = data.allDay !== undefined ? data.allDay : null as any;
                this.backgroundColor = data.backgroundColor !== undefined ? data.backgroundColor : null as any;

                this.start = data.start ? new Date(data.start.toString()) : null as any;
                this.end = data.end ? new Date(data.end.toString()) : null as any;

                this.daysOfWeek = data.daysOfWeek !== undefined ? data.daysOfWeek : null as any;
                this.startTime = data.startTime !== undefined ? data.startTime : null as any;
                this.endTime = data.endTime !== undefined ? data.endTime : null as any;
                this.startRecur = data.startRecur ? new Date(data.startRecur.toString()) : null as any;
                this.endRecur = data.endRecur ? new Date(data.endRecur.toString()) : null as any;
            }
    }*/

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data.title = this.title !== undefined ? this.title : null as any;
        data.content = this.content !== undefined ? this.content : null as any;
        data.global = this.global !== undefined ? this.global : null as any;
        data.allDay = this.allDay !== undefined ? this.allDay : null as any;
        data.backgroundColor = this.backgroundColor !== undefined ? this.backgroundColor : null as any;
        this.setTimes(data);
        return data;
    }

    private setTimes(data: any) {
        if (this.start !== undefined && this.end !== undefined) {
            const startDate = moment(this.start);
            let dateComponent = startDate.utc().format('YYYY-MM-DD');

            const endDate = moment(this.end);
            let dateEndComponent = endDate.utc().format('YYYY-MM-DD');

            let timeComponent = '';
            let timeEndComponent = '';

            if (this.startTime !== undefined && this.endTime !== undefined) {
                const timeStart = moment(this.startTime);
                timeComponent = timeStart.utc().format('HH:mm:ss');

                const timeEnd = moment(this.endTime);
                timeEndComponent = timeEnd.utc().format('HH:mm:ss');
            }

            if (this.daysOfWeek === undefined || this.daysOfWeek.length <= 0) {

                if (this.allDay !== undefined) {
                    // Mega hack
                    dateComponent = dateComponent + 'T' +  timeComponent + '.211+01:00';
                    dateEndComponent = dateEndComponent + 'T' + timeEndComponent + '.211+01:00';
                }

                data.start = this.start ? new Date(dateComponent) : null as any;
                data.end = this.end ? new Date(dateEndComponent) : null as any;
                data.daysOfWeek = null as any;

            } else {
                data.daysOfWeek = this.daysOfWeek;

                data.startTime = timeComponent !== '' ? timeComponent : null as any;
                data.endTime = timeEndComponent !== '' ? timeEndComponent : null as any;

                data.startRecur = dateComponent ? new Date(dateComponent) : null as any;
                data.endRecur = dateEndComponent ? new Date(dateEndComponent) : null as any;
            }
        }
    }
}

export interface IAppointmentParams {
    title: string;
    content?: string | null;
    global?: boolean | false;
    start?: Date | null;
    end?: Date | null;
    allDay: boolean | false;
    daysOfWeek?: number[] | null;
    startTime?: string | null;
    endTime?: string | null;
}

export class AppointmentVm implements IAppointmentVm {

    constructor(data?: IAppointmentVm) {
        if (data) {
            for (const property in data) {
                if (data.hasOwnProperty(property)) {
                    (this as any)[property] = (data as any)[property];
                }
            }
        }
    }

    createdAt?: Date | null;
    updatedAt?: Date | null;
    id?: string | null;
    extendedProps: {
        creator: string,
        content?: string | null,
        global: boolean,
    };
    title: string;
    start?: Date | null;
    end?: Date | null;
    allDay: boolean;
    daysOfWeek?: number[] | null;
    startTime?: string | null;
    endTime?: string | null;
    startRecur?: Date | null;
    endRecur?: Date | null;
    backgroundColor?: string | null;
    borderColor?: string | null;

    static fromJS(data: any): AppointmentVm {
        data = typeof data === 'object' ? data : {};
        const result = new AppointmentVm();
        result.init(data);
        return result;
    }

    init(data?: any) {
        if (data) {
            this.createdAt = data.createdAt ? new Date(data.createdAt.toString()) : null as any;
            this.updatedAt = data.updatedAt ? new Date(data.updatedAt.toString()) : null as any;
            this.id = data.id !== undefined ? data.id : null as any;
            this.extendedProps = data.extendedProps !== undefined ? data.extendedProps : null as any;
            this.title = data.title !== undefined ? data.title : null as any;
            this.allDay = data.allDay !== undefined ? data.allDay : null as any;
            this.backgroundColor = data.backgroundColor !== undefined ? data.backgroundColor : null as any;
            this.borderColor = data.backgroundColor !== undefined ? data.backgroundColor : null as any;

            this.start = data.start ? new Date(data.start.toString()) : null as any;
            this.end = data.end ? new Date(data.end.toString()) : null as any;

            this.daysOfWeek = data.daysOfWeek !== undefined ? data.daysOfWeek : null as any;
            this.startTime = data.startTime !== undefined ? data.startTime : null as any;
            this.endTime = data.endTime !== undefined ? data.endTime : null as any;
            this.startRecur = data.startRecur ? new Date(data.startRecur.toString()) : null as any;
            this.endRecur = data.endRecur ? new Date(data.endRecur.toString()) : null as any;
        }
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data.createdAt = this.createdAt ? this.createdAt.toISOString() : null as any;
        data.updatedAt = this.updatedAt ? this.updatedAt.toISOString() : null as any;
        data.id = this.id !== undefined ? this.id : null as any;
        data.extendedProps = data.extendedProps !== undefined ? data.extendedProps : null as any;
        data.title = data.title !== undefined ? data.title : null as any;
        data.allDay = data.allDay !== undefined ? data.allDay : null as any;
        data.backgroundColor = data.backgroundColor !== undefined ? data.backgroundColor : null as any;
        data.borderColor = data.backgroundColor !== undefined ? data.backgroundColor : null as any;

        data.start = data.start ? data.start.toISOString() : null as any;
        data.end = data.end ? data.end.toISOString() : null as any;

        data.daysOfWeek = data.daysOfWeek !== undefined ? data.daysOfWeek : null as any;
        data.startTime = data.startTime !== undefined ? data.startTime : null as any;
        data.endTime = data.endTime !== undefined ? data.endTime : null as any;
        data.startRecur = data.startRecur ? data.startRecur.toISOString() : null as any;
        data.endRecur = data.endRecur ? data.endRecur.toISOString() : null as any;
        return data;
    }
}

export interface IAppointmentVm {
    createdAt?: Date | null;
    updatedAt?: Date | null;
    id?: string | null;
    extendedProps: {
        creator: string,
        content?: string | null,
        global: boolean,
    };
    title: string;
    start?: Date | null;
    end?: Date | null;
    allDay: boolean;
    daysOfWeek?: number[] | null;
    startTime?: string | null;
    endTime?: string | null;
    startRecur?: Date | null;
    endRecur?: Date | null;
}

export enum UpdateUserStatus {
    Success = 'Success',
    Failed = 'Failed',
    Needless = 'Needless',
}

export enum UserVmRole {
    Admin = 'Admin',
    Leader = 'Leader',
    User = 'User',
}

export enum TodoParamsStatus {
    Finished = 'Finished',
    Pending = 'Pending',
}

export enum TodoVmStatus {
    Finished = 'Finished',
    Pending = 'Pending',
}

export class SwaggerException extends Error {
    message: string;
    status: number;
    response: string;
    headers: { [key: string]: any; };
    result: any;

    constructor(message: string, status: number, response: string, headers: { [key: string]: any; }, result: any) {
        super();

        this.message = message;
        this.status = status;
        this.response = response;
        this.headers = headers;
        this.result = result;
    }

    protected isSwaggerException = true;

    static isSwaggerException(obj: any): obj is SwaggerException {
        return obj.isSwaggerException === true;
    }
}

function throwException(message: string, status: number, response: string, headers: { [key: string]: any; },
                        result?: any): Observable<any> {
    if (result !== null && result !== undefined) {
        return _observableThrow(result);
    } else {
        return _observableThrow(new SwaggerException(message, status, response, headers, null));
    }
}

function blobToText(blob: any): Observable<string> {
    return new Observable<string>((observer: any) => {
        if (!blob) {
            observer.next('');
            observer.complete();
        } else {
            const reader = new FileReader();
            reader.onload = event => {
                observer.next((event.target as any).result);
                observer.complete();
            };
            reader.readAsText(blob);
        }
    });
}
