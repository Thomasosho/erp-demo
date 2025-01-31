import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { join } from 'path';
import express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.use('/docs/swagger-ui.css', express.static(
    join(__dirname, '../node_modules/swagger-ui-dist/swagger-ui.css')
  ));
  expressApp.use('/docs/swagger-ui-bundle.js', express.static(
    join(__dirname, '../node_modules/swagger-ui-dist/swagger-ui-bundle.js')
  ));
  expressApp.use('/docs/swagger-ui-standalone-preset.js', express.static(
    join(__dirname, '../node_modules/swagger-ui-dist/swagger-ui-standalone-preset.js')
  ));

  const config = new DocumentBuilder()
    .setTitle('ERP API Documentation')
    .setDescription(
      `
      PLEASE NOTE: This is a demo API for an ERP system. It is not meant for production use.
      I made use of https://console.neon.tech/ POSTGRES database for this project.
      TYPEORM CLI Commands: 
        --Create Migration
        npm run typeorm:cli migration:generate src/database/migrations/v-verison-number
        
        -- Run Migration
        npm run typeorm:cli migration:run

      1. Authentication
        - First time setup automatically creates a SuperAdmin user:
          * Email: superadmin@example.com
          * Password: 12345678
        - Login at POST /authentication/login with these credentials
        - Copy the returned JWT token

        - Login as an Admin User (Note that i have set permission for admin to only create and view/read for User, Roles and Permission. An admin cannot update and  delete.):
          * Email: john.doe@example.com
          * Password: password123

      2. Authorization
        - Use the JWT token in the Authorization header as "Bearer {token}"
        - SuperAdmin has access to all system permissions

      3. User Management
        - Create new users: POST /users
        - View all users: GET /users
        - View specific user: GET /users/{id}
        - Update user: PUT /users/{id}
        - Delete user: DELETE /users/{id}
        - Users can have multiple roles

      4. Role Management
        - Create new roles: POST /roles
        - View all roles: GET /roles
        - View specific role: GET /roles/{id}
        - Update role: PUT /roles/{id}
        - Delete role: DELETE /roles/{id}
        - Roles can have multiple permissions

      5. Permission Management
        - Create new permissions: POST /permissions
        - View all permissions: GET /permissions
        - View specific permission: GET /permissions/{id}
        - Update permission: PUT /permissions/{id}
        - Delete permission: DELETE /permissions/{id}

      6. Available Permissions
        Users:
        - create:users
        - read:users
        - update:users
        - delete:users

        Roles:
        - create:roles
        - read:roles
        - update:roles
        - delete:roles

        Permissions:
        - create:permissions
        - read:permissions
        - update:permissions
        - delete:permissions

      7. Error Handling
        - 400: Bad Request - Invalid input data
        - 401: Unauthorized - Missing or invalid JWT token
        - 403: Forbidden - Missing required permissions
        - 404: Not Found - Resource doesn't exist
        - 500: Internal Server Error - Server-side error

      8. Security Notes
        - All passwords are hashed using bcrypt
        - JWT tokens expire after 1 hour
        - All endpoints except /authentication/login require authentication
        - RBAC (Role-Based Access Control) is implemented using permissions
    `,
    )
    .setVersion('1.0')
    .addTag('ERP')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs/erp', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(process.env.PORT || 8000);
}
bootstrap();
