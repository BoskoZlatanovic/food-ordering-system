import {Component, OnInit} from '@angular/core';
import {Dish, Order} from "../../../models/order.model";
import {FormControl, FormGroup} from "@angular/forms";
import {DishService} from "../../../services/dish.service";
import {OrderService} from "../../../services/order.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-order-create',
  templateUrl: './order-create.component.html'
})
export class OrderCreateComponent implements OnInit {
  dishes: Dish[] = [];
  selectedDishes: { dish: Dish, quantity: number }[] = [];
  scheduledTime: string = '';

  orderForm = new FormGroup({
    scheduledFor: new FormControl(''),
    isScheduled: new FormControl(false)
  });

  constructor(
    private dishService: DishService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadDishes();
  }

  loadDishes() {
    this.dishService.getAllDishes().subscribe(response => {
      this.dishes = response.content;
    });
  }

  addDish(dish: Dish) {
    const existing = this.selectedDishes.find(item => item.dish.id === dish.id);
    if (existing) {
      existing.quantity++;
    } else {
      this.selectedDishes.push({ dish: dish, quantity: 1 });
    }
  }

  removeDish(index: number) {
    this.selectedDishes.splice(index, 1);
  }

  updateQuantity(index: number, value: string) {
    const quantity = parseInt(value);
    if (quantity > 0) {
      this.selectedDishes[index].quantity = quantity;
    } else {
      this.selectedDishes.splice(index, 1);
    }
  }

  getTotalPrice(): number {
    return this.selectedDishes.reduce((total, item) =>
      total + (item.dish.price * item.quantity), 0);
  }

  onSubmit() {
    if (this.selectedDishes.length === 0) {
      alert('Please select at least one dish');
      return;
    }

    const order: Partial<Order> = {
      items: this.selectedDishes.reduce((items, item) => {
        for (let i = 0; i < item.quantity; i++) {
          items.push(item.dish);
        }
        return items;
      }, [] as Dish[])
    };

    if (this.orderForm.get('isScheduled')?.value && this.orderForm.get('scheduledFor')?.value) {
      const scheduledDate = this.orderForm.get('scheduledFor')?.value;
      if (scheduledDate) {
        this.orderService.scheduleOrder(this.selectedDishes.map(item => item.dish), new Date(scheduledDate))
          .subscribe({
            next: () => {
              this.router.navigate(['/orders']);
            },
            error: (error) => {
              alert('Error creating scheduled order: ' + error.message);
            }
          });
      }
    } else {
      this.orderService.createOrder(order as Order)
        .subscribe({
          next: () => {
            this.router.navigate(['/orders']);
          },
          error: (error) => {
            alert('Error creating order: ' + error.message);
          }
        });
    }
  }

}
