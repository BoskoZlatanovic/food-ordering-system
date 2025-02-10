import {Component, OnDestroy, OnInit} from "@angular/core";
import {Order, OrderStatus} from "../../../models/order.model";
import {FormControl, FormGroup} from "@angular/forms";
import {OrderService} from "../../../services/order.service";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html'
})
export class OrderListComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;
  private subscriptions: { [key: number]: any } = {};

  // Filter form
  filterForm = new FormGroup({
    status: new FormControl(''),
    dateFrom: new FormControl(''),
    dateTo: new FormControl(''),
    userId: new FormControl('')
  });

  isAdmin = false;

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {
    this.isAdmin = this.authService.getCurrentUserEmail() === 'admin@example.com';
  }

  ngOnInit() {
    this.loadOrders();
  }

  ngOnDestroy() {
    Object.values(this.subscriptions).forEach(sub => sub.unsubscribe());
  }

  loadOrders() {
    const filters: any = {};
    const formValues = this.filterForm.value;

    if (formValues.status) {
      filters.status = formValues.status;
    }

    if (formValues.dateFrom && formValues.dateTo) {
      // Konvertujemo string datume u ISO format
      filters.dateFrom = new Date(formValues.dateFrom + 'T00:00:00').toISOString();
      filters.dateTo = new Date(formValues.dateTo + 'T23:59:59').toISOString();
    }

    if (this.isAdmin && formValues.userId) {
      filters.userId = formValues.userId;
    }

    this.orderService.getOrders(this.currentPage, this.pageSize, filters).subscribe(response => {
      this.orders = response.content;
      this.totalElements = response.totalElements;
      this.totalPages = response.totalPages;

      this.orders.forEach(order => this.subscribeToOrderUpdates(order.id!));
    });
  }
  private subscribeToOrderUpdates(orderId: number) {
    if (this.subscriptions[orderId]) {
      this.subscriptions[orderId].unsubscribe();
    }

    this.subscriptions[orderId] = this.orderService.subscribeToOrderUpdates(
      orderId,
      (update) => {
        const orderIndex = this.orders.findIndex(o => o.id === orderId);
        if (orderIndex !== -1) {
          this.orders[orderIndex].status = update.status;
        }
      }
    );
  }

  onFilter() {
    this.currentPage = 0;
    this.loadOrders();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadOrders();
  }

  cancelOrder(orderId: number) {
    this.orderService.cancelOrder(orderId).subscribe(() => {
      this.loadOrders();
    });
  }

  getStatusClass(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.ORDERED: return 'badge bg-warning';
      case OrderStatus.PREPARING: return 'badge bg-info';
      case OrderStatus.IN_DELIVERY: return 'badge bg-primary';
      case OrderStatus.DELIVERED: return 'badge bg-success';
      case OrderStatus.CANCELED: return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  }

  protected readonly OrderStatus = OrderStatus;
}
