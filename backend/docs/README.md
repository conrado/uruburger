# Uruburger API Documentation

This document provides an overview of the API features available in the Uruburger backend system.

## API Documentation

For detailed documentation on specific API resources, see:

- [Menu Orders Documentation](./Orders.md)
- [Menu Items Documentation](./Items.md)

## Swagger API

The Uruburger API includes Swagger documentation that can be accessed when the server is running:

- **URL**: `/api/docs`
- **Development**: http://localhost:3000/api/docs

The Swagger UI provides an interactive interface where you can:

- Explore all available endpoints
- Test API calls directly from your browser
- View request/response models
- Download OpenAPI specification

## Error Handling

The API uses standard HTTP status codes:

- `404 Not Found`: When requested resources don't exist (e.g., order or menu item not found)
- `201 Created`: When a new resource is successfully created
- `200 OK`: For successful operations

## QR Code System

The system uses QR codes for both menu items and orders, accessible via URLs following the format:

- Items: `https://menu.uruburger.com/item/{id}`
- Orders: `https://menu.uruburger.com/order/{id}`
