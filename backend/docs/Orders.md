# Menu Orders API Documentation

This document provides details about the menu order endpoints available in the Uruburger backend system.

## Endpoints

| Method | Endpoint                | Description                    |
| ------ | ----------------------- | ------------------------------ |
| GET    | /menu-orders            | Retrieve all menu orders       |
| GET    | /menu-orders/:id        | Retrieve a specific menu order |
| POST   | /menu-orders            | Create a new menu order        |
| PATCH  | /menu-orders/:id/status | Update order status            |
| DELETE | /menu-orders/:id        | Delete a menu order            |

## Order Status Events

Orders maintain an event log that tracks status changes. Known status types include:

- `ORDER_CREATED`: Initial state when the order is created
- `PREPARING`: Order is being prepared in the kitchen

## Data Models

### Menu Order

```typescript
{
  id: number;
  qrCodeLink: string;
  items: MenuItem[];
  total: number;
  eventLog: [
    {
      timestamp: Date;
      event: string;
      details: object;
    }
  ]
}
```

### Create Menu Order DTO

```typescript
{
  qrCodeLink: string;
  itemIds: number[];
}
```

## QR Code Integration

Orders are accessible via URLs following the format:

- `https://menu.uruburger.com/order/{id}`
