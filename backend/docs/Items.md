# Menu Items API Documentation

This document provides details about the menu items endpoints available in the Uruburger backend system.

## Endpoints

| Method | Endpoint        | Description                   |
| ------ | --------------- | ----------------------------- |
| GET    | /menu-items     | Retrieve all menu items       |
| GET    | /menu-items/:id | Retrieve a specific menu item |
| POST   | /menu-items     | Create a new menu item        |
| PATCH  | /menu-items/:id | Update a menu item partially  |
| PUT    | /menu-items/:id | Update a menu item completely |
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

## Error Handling

The API uses standard HTTP status codes for menu items:

- `404 Not Found`: When the requested menu item doesn't exist
- `400 Bad Request`: When the request body fails validation
- `200 OK`: For successful operations (GET, PATCH, PUT, DELETE)
- `201 Created`: When a new menu item is successfully created

## QR Code Integration

Menu items are accessible via URLs following the format:

- `https://menu.uruburger.com/item/{id}`
