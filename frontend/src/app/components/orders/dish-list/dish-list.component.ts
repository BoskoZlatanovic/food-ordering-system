import {Component, OnInit} from "@angular/core";
import {Dish} from "../../../models/order.model";
import {DishService} from "../../../services/dish.service";

@Component({
  selector: 'app-dish-list',
  templateUrl: './dish-list.component.html'
})
export class DishListComponent implements OnInit {
  dishes: Dish[] = [];
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

  constructor(private dishService: DishService) { }

  ngOnInit() {
    this.loadDishes();
  }

  loadDishes() {
    this.dishService.getAllDishes(this.currentPage, this.pageSize)
      .subscribe(response => {
        this.dishes = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
      });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadDishes();
  }
}
