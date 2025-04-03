# Menu Items API Documentation

This document provides details about the menu items endpoints available in the Uruburger backend system.

## Endpoints

| Method | Endpoint        | Description                   |
| ------ | --------------- | ----------------------------- |
| GET    | /menu-items     | Retrieve all menu items       |
| GET    | /menu-items/:id | Retrieve a specific menu item |
| POST   | /menu-items     | Create a new menu item        |
| PUT    | /menu-items/:id | Update a menu item            |
| DELETE | /menu-items/:id | Delete a menu item            |

## Data Model

```typescript
{
  id: number;
  qrCodeLink: string;
  name: string;
  value: number;
  description: string;
  imageLink: string;
}
```

## QR Code Integration

Menu items are accessible via URLs following the format:

- `https://menu.uruburger.com/item/{id}`
