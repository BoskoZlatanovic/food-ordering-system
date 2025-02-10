import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import {Dish, Order} from '../models/order.model';
import { Client } from '@stomp/stompjs';
import * as SockJS from "sockjs-client";

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/api/orders';
  private wsUrl = 'http://localhost:8080/ws';
  private stompClient!: Client;

  constructor(private http: HttpClient) {
    this.initializeWebSocket();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  private initializeWebSocket() {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(this.wsUrl),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => {
        console.log('STOMP:', str);
      }
    });

    this.stompClient.onConnect = () => {
      console.log('Connected to WebSocket');
    };

    this.stompClient.onWebSocketError = (error) => {
      console.error('WebSocket Error:', error);
    };

    this.stompClient.onStompError = (frame) => {
      console.error('STOMP Error:', frame);
    };

    this.stompClient.activate();
  }

  subscribeToOrderUpdates(orderId: number, callback: (update: any) => void) {
    return this.stompClient.subscribe(`/topic/orders/${orderId}`, (message) => {
      callback(JSON.parse(message.body));
    });
  }

  getOrders(page: number = 0, size: number = 10, filters?: any): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filters) {
      if (filters.status) params = params.set('status', filters.status);
      if (filters.dateFrom) params = params.set('dateFrom', filters.dateFrom);
      if (filters.dateTo) params = params.set('dateTo', filters.dateTo);
      if (filters.userId) params = params.set('userId', filters.userId);
    }

    return this.http.get<any>(this.apiUrl, { params, headers: this.getHeaders() });
  }

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, order, { headers: this.getHeaders() });
  }

  cancelOrder(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/cancel`, {}, { headers: this.getHeaders() });
  }

  // trackOrder(id: number): Observable<Order> {
  //   return this.http.get<Order>(`${this.apiUrl}/${id}/track`, { headers: this.getHeaders() });
  // }

  scheduleOrder(items: Dish[], scheduledTime: Date): Observable<Order> {
    const request = {
      items: items
    };
    const params = new HttpParams().set('scheduledTime', scheduledTime.toISOString());
    return this.http.post<Order>(`${this.apiUrl}/schedule`, request, {
      params,
      headers: this.getHeaders()
    });
  }
}
