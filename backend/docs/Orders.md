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

Orders maintain an event log that tracks status changes. Available status types are defined in the `OrderStatus` enum:

- `ORDER_CREATED`: Initial state when the order is created
- `ITEMS_ADDED`: When new items are added to an existing order
- `ITEMS_CANCELLED`: When items are cancelled from an order
- `PREPARING`: Order is being prepared in the kitchen
- `READY_FOR_PICKUP`: Order is ready to be picked up by server or customer
- `DELIVERED`: Order has been delivered to the customer
- `COMPLETED`: Order has been completed and paid for
- `CANCELLED`: Order has been cancelled

## Data Models

### Menu Order

```typescript
{
  id: number;
  qrCodeLink: string;
  customerId: string;  // Customer identifier (e.g., "Table42-John")
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
  customerId?: string;  // Optional customer identifier
  items: [
    {
      id: number;
      quantity: number;
    }
  ];
  observation?: string;
}
```

## QR Code Integration

Orders are accessible via URLs following the format:

- `https://menu.uruburger.com/order/{id}`
