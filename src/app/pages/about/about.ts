import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  values = [
    {
      number: '1',
      title: 'Quality First',
      description:
        'Every piece in our collection is carefully selected for exceptional craftsmanship and lasting durability.',
    },
    {
      number: '2',
      title: 'Timeless Design',
      description:
        'We believe in style that transcends seasons — curated pieces that remain relevant year after year.',
    },
    {
      number: '3',
      title: 'Customer Focus',
      description:
        'Your satisfaction drives everything we do, from our selection process to our after-sales support.',
    },
  ];

  stats = [
    { value: '5+', label: 'Years of Excellence' },
    { value: '12K+', label: 'Happy Customers' },
    { value: '500+', label: 'Curated Products' },
    { value: '40+', label: 'Global Brands' },
  ];
}
