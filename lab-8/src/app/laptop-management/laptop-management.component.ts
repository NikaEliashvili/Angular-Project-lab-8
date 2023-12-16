// laptop-management.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Laptop } from '../models/laptop.model';
import { LaptopService } from '../services/laptop.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-laptop-management',
  templateUrl: './laptop-management.component.html',
  styleUrls: ['./laptop-management.component.css'],
})
export class LaptopManagementComponent implements OnInit {
  laptops: Laptop[] = [];
  newLaptopForm: FormGroup;
  editingLaptopForm: FormGroup;
  editingLaptopId: string | null = null;
  searchForm: FormGroup;
  loadingLaptops: boolean = true;

  constructor(private laptopService: LaptopService, private fb: FormBuilder) {
    this.newLaptopForm = this.fb.group({
      modelName: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
    });
    this.searchForm = this.fb.group({
      search: [''],
    });

    this.editingLaptopForm = this.fb.group({
      modelName: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.loadLaptops();
    this.searchForm
      .get('search')
      ?.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((searchTerm) => this.laptopService.searchLaptops(searchTerm))
      )
      .subscribe((searchResults: Laptop[]) => {
        this.laptops = searchResults;
      });
  }

  loadLaptops(): void {
    this.loadingLaptops = true; // Set loading to true before making the request
    this.laptopService.getLaptops().subscribe(
      (laptops: Laptop[]) => {
        this.laptops = laptops.reverse();
        this.loadingLaptops = false; // Set loading to false after successful loading
      },
      (error) => {
        console.error('Error loading laptops', error);
        this.loadingLaptops = false; // Set loading to false in case of an error
      }
    );
  }

  createLaptop(): void {
    if (this.newLaptopForm.valid) {
      const newLaptop: Laptop = this.newLaptopForm.value;
      this.laptopService.createLaptop(newLaptop).subscribe(() => {
        this.loadLaptops();
        this.newLaptopForm.reset();
      });
    }
  }

  startEditing(id: string): void {
    this.editingLaptopId = id;
    const editingLaptop = this.laptops.find((laptop) => laptop.id === id);
    console.log(editingLaptop);
    if (editingLaptop) {
      this.editingLaptopForm.patchValue({
        modelName: editingLaptop.modelName,
        price: editingLaptop.price,
      });
    }
  }

  saveEditing(laptop: Laptop): void {
    if (this.editingLaptopForm.valid) {
      const updatedLaptop: Laptop = {
        ...laptop,
        ...this.editingLaptopForm.value,
      };
      this.laptopService.updateLaptop(updatedLaptop).subscribe(() => {
        this.editingLaptopId = null;
        this.loadLaptops();
        this.editingLaptopForm.reset();
      });
    }
  }

  cancelEditing(): void {
    this.editingLaptopId = null;
    this.editingLaptopForm.reset();
  }

  deleteLaptop(id: string): void {
    this.laptopService.deleteLaptop(id).subscribe(() => {
      this.loadLaptops();
      this.editingLaptopId = null;
    });
  }

  searchLaptops(searchTerm: string): void {
    this.laptopService
      .searchLaptops(searchTerm)
      .subscribe((searchResults: Laptop[]) => {
        this.laptops = searchResults;
      });
  }

  createRange(number: number) {
    // return new Array(number);
    return new Array(number).fill(0).map((n, index) => index + 1);
  }
}
