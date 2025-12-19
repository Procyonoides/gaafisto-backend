import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';

export interface OrderItem {
  product: string;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
}

export interface Order {
  _id?: string;
  user?: any;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  shippingAddress: ShippingAddress;
  createdAt?: Date;
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  createOrder(orderData: { items: OrderItem[], shippingAddress: ShippingAddress }): Observable<Order> {
    return this.http.post<Order>(`${environment.apiUrl}/orders`, orderData);
  }

  getUserOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${environment.apiUrl}/orders/my-orders`);
  }

  getAllOrders(page: number = 1, limit: number = 10, status?: string): Observable<OrdersResponse> {
    let url = `${environment.apiUrl}/orders?page=${page}&limit=${limit}`;
    if (status) url += `&status=${status}`;
    return this.http.get<OrdersResponse>(url);
  }

  getOrderById(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${environment.apiUrl}/orders/${orderId}`);
  }

  updateOrderStatus(orderId: string, status: string): Observable<Order> {
    return this.http.put<Order>(`${environment.apiUrl}/orders/${orderId}/status`, { status });
  }

  cancelOrder(orderId: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/orders/${orderId}/cancel`, {});
  }
}