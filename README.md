# Invoice App
## **Desctiption**


## **Technologies**
1. JavaScript
2. Node.js 
3. Express.js
4. PostgresSql
5. Sequelize ORM
6. Passport.js
7. Dokku
8. Digital Ocean Droplets
9. Github Actions

## **Summary of API Specification**

Location: `https://api.invoice-app.naughty-cat.com`
Useage: In order to test routes in browser, make sure to visit the authentication [URL](https://api.invoice-app.naughty-cat.com/authentication/github). Once you have authenticated a cookie will be stored in your browser and sent on subsequent requests. If you want to test routes with postman, visit a route in browser click inspect => application => cookies and copy the sid string. Then in postman click headers and add "cookie" as the key and "connect.sid=some-long-string" which you copied in the previous step.

### **1. AUTHENTICATION ENDPOINTS**

### Endpoint: Github User Authentication
* Description: Authenticates a User via Github Oauth 2.0 and starts a session
* Notes: User will be redirected (idealy in a new window) to authenticate, once the Oauth dance has finsished, front end can check the status code returned and redirect accordingly (likey to user profile page or back to login screen)
* Path: `/authentication/github`
* Method: GET
* Failure Response Code: 401
* Success Response Code: 200
* Success Response: JSON Object
* Sample Success Response: 
```
{
    "id": "ed8fdd40-b807-4e51-b1f5-90fb5b7f6e73",
    "provider": "github",
    "remoteId": 10082638,
    "photoUrl": null,
    "email": null,
    "roles": "80b0de9d-3dd2-487a-8b9c-e81770417fb0",
    "createdAt": "2024-02-04",
    "updatedAt": "2024-02-04"
}
```

### Endpoint: User Logout
* Description: Logs a user out of their current session
* Path: `/logout`
* Method: POST
* Response: Redirect to homepage

### **2. USER ENDPOINTS**

### Endpoint: Get User Data
* Description: Gets a logged in user's data
* Path: `/user`
* Method: GET
* Response Success Code: 200
* Response: JSON Object
* Sample Response:

```
{
    "id": "ed8fdd40-b807-4e51-b1f5-90fb5b7f6e73",
    "provider": "github",
    "remoteId": 10082638,
    "photoUrl": null,
    "email": null,
    "roles": "80b0de9d-3dd2-487a-8b9c-e81770417fb0",
    "createdAt": "2024-02-04",
    "updatedAt": "2024-02-04"
}

```

### **3. INVOICE ENDPOINTS**

### Endpoint: Get All User Invoices
* Description: Gets all invoices associated with a logged in user
* Path: `/invoices/all`
* Method: GET
* Response Success Code: 200
* Response: JSON Object
* Sample Response:

```
[
    {
        "id": null,
        "userId": null,
        "status": null,
        "invoiceNumber": null,
        "billFromStreetAddress": null,
        "billFromCity": null,
        "billFromPostalCode": null,
        "billFromCountry": null,
        "billToName": null,
        "billToEmail": null,
        "billToStreetAddress": null,
        "billToCity": null,
        "billToPostalCode": null,
        "billToCountry": null,
        "date": null,
        "paymentTerms": null,
        "projectDescription": null,
        "amountDue": null,
        "createdAt": "YYYY-MM-DD",
        "UpdatedAt": "YYYY-MM-DD",
        "updatedAt": "YYYY-MM-DD",
        "invoiceItems": [
            {
                "id": null,
                "invoiceId": null,
                "userId": null,
                "name": null,
                "quantity": null,
                "price": null,
                "total": null,
                "createdAt": "YYYY-MM-DD",
                "updatedAt": "YYYY-MM-DD"
            },
            {
                "id": null,
                "invoiceId": null,
                "userId": null,
                "name": null,
                "quantity": null,
                "price": null,
                "total": null,
                "createdAt": "YYYY-MM-DD",
                "updatedAt": "YYYY-MM-DD"
            }
        ]
    },
    {
        "id": null,
        "userId": null,
        "status": null,
        "invoiceNumber": null,
        "billFromStreetAddress": null,
        "billFromCity": null,
        "billFromPostalCode": null,
        "billFromCountry": null,
        "billToName": null,
        "billToEmail": null,
        "billToStreetAddress": null,
        "billToCity": null,
        "billToPostalCode": null,
        "billToCountry": null,
        "date": null,
        "paymentTerms": null,
        "projectDescription": null,
        "amountDue": null,
        "createdAt": "YYYY-MM-DD",
        "UpdatedAt": "YYYY-MM-DD",
        "updatedAt": "YYYY-MM-DD",
        "invoiceItems": [
            {
                "id": null,
                "invoiceId": null,
                "userId": null,
                "name": null,
                "quantity": null,
                "price": null,
                "total": null,
                "createdAt": "YYYY-MM-DD",
                "updatedAt": "YYYY-MM-DD"
            },
            {
                "id": null,
                "invoiceId": null,
                "userId": null,
                "name": null,
                "quantity": null,
                "price": null,
                "total": null,
                "createdAt": "YYYY-MM-DD",
                "updatedAt": "YYYY-MM-DD"
            }
        ]
    }
]
```

### Endpoint: Get User Draft Invoices
* Description: Gets all draft invoices associated with a logged in user
* Notes: The property "invoice.status" must be set to "draft" to populate.
* Path: `/invoices/draft`
* Method: GET
* Response Success Code: 200
* Response: JSON Object
* Sample Response:

```
[
    {
        "id": null,
        "userId": null,
        "status": "draft",
        "invoiceNumber": null,
        "billFromStreetAddress": null,
        "billFromCity": null,
        "billFromPostalCode": null,
        "billFromCountry": null,
        "billToName": null,
        "billToEmail": null,
        "billToStreetAddress": null,
        "billToCity": null,
        "billToPostalCode": null,
        "billToCountry": null,
        "date": null,
        "paymentTerms": null,
        "projectDescription": null,
        "amountDue": null,
        "createdAt": "YYYY-MM-DD",
        "UpdatedAt": "YYYY-MM-DD",
        "updatedAt": "YYYY-MM-DD",
        "invoiceItems": [
            {
                "id": null,
                "invoiceId": null,
                "userId": null,
                "name": null,
                "quantity": null,
                "price": null,
                "total": null,
                "createdAt": "YYYY-MM-DD",
                "updatedAt": "YYYY-MM-DD"
            },
            {
                "id": null,
                "invoiceId": null,
                "userId": null,
                "name": null,
                "quantity": null,
                "price": null,
                "total": null,
                "createdAt": "YYYY-MM-DD",
                "updatedAt": "YYYY-MM-DD"
            }
        ]
    },
    {
        "id": null,
        "userId": null,
        "status": "draft",
        "invoiceNumber": null,
        "billFromStreetAddress": null,
        "billFromCity": null,
        "billFromPostalCode": null,
        "billFromCountry": null,
        "billToName": null,
        "billToEmail": null,
        "billToStreetAddress": null,
        "billToCity": null,
        "billToPostalCode": null,
        "billToCountry": null,
        "date": null,
        "paymentTerms": null,
        "projectDescription": null,
        "amountDue": null,
        "createdAt": "YYYY-MM-DD",
        "UpdatedAt": "YYYY-MM-DD",
        "updatedAt": "YYYY-MM-DD",
        "invoiceItems": [
            {
                "id": null,
                "invoiceId": null,
                "userId": null,
                "name": null,
                "quantity": null,
                "price": null,
                "total": null,
                "createdAt": "YYYY-MM-DD",
                "updatedAt": "YYYY-MM-DD"
            },
            {
                "id": null,
                "invoiceId": null,
                "userId": null,
                "name": null,
                "quantity": null,
                "price": null,
                "total": null,
                "createdAt": "YYYY-MM-DD",
                "updatedAt": "YYYY-MM-DD"
            }
        ]
    }
]
```

### Endpoint: Get User Pending Invoices
* Description: Gets all pending invoices associated with a logged in user
* Notes: The property "invoice.status" must be set to "pending" to populate.
* Path: `/invoices/pending`
* Method: GET
* Response Success Code: 200
* Response: JSON Object
* Sample Response:

```
[
    {
        "id": null,
        "userId": null,
        "status": pending,
        "invoiceNumber": null,
        "billFromStreetAddress": null,
        "billFromCity": null,
        "billFromPostalCode": null,
        "billFromCountry": null,
        "billToName": null,
        "billToEmail": null,
        "billToStreetAddress": null,
        "billToCity": null,
        "billToPostalCode": null,
        "billToCountry": null,
        "date": null,
        "paymentTerms": null,
        "projectDescription": null,
        "amountDue": null,
        "createdAt": "YYYY-MM-DD",
        "UpdatedAt": "YYYY-MM-DD",
        "updatedAt": "YYYY-MM-DD",
        "invoiceItems": [
            {
                "id": null,
                "invoiceId": null,
                "userId": null,
                "name": null,
                "quantity": null,
                "price": null,
                "total": null,
                "createdAt": "YYYY-MM-DD",
                "updatedAt": "YYYY-MM-DD"
            },
            {
                "id": null,
                "invoiceId": null,
                "userId": null,
                "name": null,
                "quantity": null,
                "price": null,
                "total": null,
                "createdAt": "YYYY-MM-DD",
                "updatedAt": "YYYY-MM-DD"
            }
        ]
    },
    {
        "id": null,
        "userId": null,
        "status": pending,
        "invoiceNumber": null,
        "billFromStreetAddress": null,
        "billFromCity": null,
        "billFromPostalCode": null,
        "billFromCountry": null,
        "billToName": null,
        "billToEmail": null,
        "billToStreetAddress": null,
        "billToCity": null,
        "billToPostalCode": null,
        "billToCountry": null,
        "date": null,
        "paymentTerms": null,
        "projectDescription": null,
        "amountDue": null,
        "createdAt": "YYYY-MM-DD",
        "UpdatedAt": "YYYY-MM-DD",
        "updatedAt": "YYYY-MM-DD",
        "invoiceItems": [
            {
                "id": null,
                "invoiceId": null,
                "userId": null,
                "name": null,
                "quantity": null,
                "price": null,
                "total": null,
                "createdAt": "YYYY-MM-DD",
                "updatedAt": "YYYY-MM-DD"
            },
            {
                "id": null,
                "invoiceId": null,
                "userId": null,
                "name": null,
                "quantity": null,
                "price": null,
                "total": null,
                "createdAt": "YYYY-MM-DD",
                "updatedAt": "YYYY-MM-DD"
            }
        ]
    }
]
```


### Endpoint: Get User Paid Invoices
* Description: Gets all paid invoices associated with a logged in user
* Notes: The property "invoice.status" must be set to "paid" to populate.
* Path: `/invoices/paid`
* Method: GET
* Response Success Code: 200
* Response: JSON Object
* Sample Response:

```
[
    {
        "id": null,
        "userId": null,
        "status": paid,
        "invoiceNumber": null,
        "billFromStreetAddress": null,
        "billFromCity": null,
        "billFromPostalCode": null,
        "billFromCountry": null,
        "billToName": null,
        "billToEmail": null,
        "billToStreetAddress": null,
        "billToCity": null,
        "billToPostalCode": null,
        "billToCountry": null,
        "date": null,
        "paymentTerms": null,
        "projectDescription": null,
        "amountDue": null,
        "createdAt": "YYYY-MM-DD",
        "UpdatedAt": "YYYY-MM-DD",
        "updatedAt": "YYYY-MM-DD",
        "invoiceItems": [
            {
                "id": null,
                "invoiceId": null,
                "userId": null,
                "name": null,
                "quantity": null,
                "price": null,
                "total": null,
                "createdAt": "YYYY-MM-DD",
                "updatedAt": "YYYY-MM-DD"
            },
            {
                "id": null,
                "invoiceId": null,
                "userId": null,
                "name": null,
                "quantity": null,
                "price": null,
                "total": null,
                "createdAt": "YYYY-MM-DD",
                "updatedAt": "YYYY-MM-DD"
            }
        ]
    },
    {
        "id": null,
        "userId": null,
        "status": paid,
        "invoiceNumber": null,
        "billFromStreetAddress": null,
        "billFromCity": null,
        "billFromPostalCode": null,
        "billFromCountry": null,
        "billToName": null,
        "billToEmail": null,
        "billToStreetAddress": null,
        "billToCity": null,
        "billToPostalCode": null,
        "billToCountry": null,
        "date": null,
        "paymentTerms": null,
        "projectDescription": null,
        "amountDue": null,
        "createdAt": "YYYY-MM-DD",
        "UpdatedAt": "YYYY-MM-DD",
        "updatedAt": "YYYY-MM-DD",
        "invoiceItems": [
            {
                "id": null,
                "invoiceId": null,
                "userId": null,
                "name": null,
                "quantity": null,
                "price": null,
                "total": null,
                "createdAt": "YYYY-MM-DD",
                "updatedAt": "YYYY-MM-DD"
            },
            {
                "id": null,
                "invoiceId": null,
                "userId": null,
                "name": null,
                "quantity": null,
                "price": null,
                "total": null,
                "createdAt": "YYYY-MM-DD",
                "updatedAt": "YYYY-MM-DD"
            }
        ]
    }
]
```

### Endpoint: Get User Invoice By Id
* Description: Gets an invoice associated with a logged in user by id
* Path: `/invoices/:id`
* Method: GET
* Response Success Code: 200
* Response: JSON Object
* Sample Response:

```
{
    "id": null,
    "userId": null,
    "status": null,
    "invoiceNumber": null,
    "billFromStreetAddress": null,
    "billFromCity": null,
    "billFromPostalCode": null,
    "billFromCountry": null,
    "billToName": null,
    "billToEmail": null,
    "billToStreetAddress": null,
    "billToCity": null,
    "billToPostalCode": null,
    "billToCountry": null,
    "date": null,
    "paymentTerms": null,
    "projectDescription": null,
    "amountDue": null,
    "createdAt": "YYYY-MM-DD",
    "UpdatedAt": "YYYY-MM-DD",
    "updatedAt": "YYYY-MM-DD",
    "invoiceItems": [
        {
            "id": null,
            "invoiceId": null,
            "userId": null,
            "name": null,
            "quantity": null,
            "price": null,
            "total": null,
            "createdAt": "YYYY-MM-DD",
            "updatedAt": "YYYY-MM-DD"
        },
        {
            "id": null,
            "invoiceId": null,
            "userId": null,
            "name": null,
            "quantity": null,
            "price": null,
            "total": null,
            "createdAt": "YYYY-MM-DD",
            "updatedAt": "YYYY-MM-DD"
        }
    ]
}
```
### Endpoint: Add New Invoice
* Description: Adds a new invoice associated with a logged in user
* Notes: Invoice objects sent to add do not need to include an id properties.
* Path: `/invoices/:id`
* Method: POST
* Response Success Code: 201
* Response: JSON of the newly created resource including assigned ids
* Payload: JSON
* Example Payload:
```
{
    "status": null,
    "invoiceNumber": null,
    "billFromStreetAddress": null,
    "billFromCity": null,
    "billFromPostalCode": null,
    "billFromCountry": null,
    "billToName": null,
    "billToEmail": null,
    "billToStreetAddress": null,
    "billToCity": null,
    "billToPostalCode": null,
    "billToCountry": null,
    "date": null,
    "paymentTerms": null,
    "projectDescription": null,
    "amountDue": null,
    "createdAt": "YYYY-MM-DD",
    "UpdatedAt": "YYYY-MM-DD",
    "updatedAt": "YYYY-MM-DD",
    "invoiceItems": [
        {
            "id": null,
            "name": null,
            "quantity": null,
            "price": null,
            "total": null,
            "createdAt": "YYYY-MM-DD",
            "updatedAt": "YYYY-MM-DD"
        },
        {
            "id": null,
            "name": null,
            "quantity": null,
            "price": null,
            "total": null,
            "createdAt": "YYYY-MM-DD",
            "updatedAt": "YYYY-MM-DD"
        }
    ]
}
```

### Endpoint: Update User Invoice By Id
* Description: Updates an invoice associated with a logged in user by id
* Notes: Invoice objects sent to add can, but do not need to include userId or invoiceId properties. The id property for any existing invoice items however should be included in order to help keep a clean audit history (new items will not have an id).
* Path: `/invoices/:id`
* Method: PUT
* Response Success Code: 201
* Response: none
* Payload: JSON
* Example Payload:
```
{
    "status": null,
    "invoiceNumber": null,
    "billFromStreetAddress": null,
    "billFromCity": null,
    "billFromPostalCode": null,
    "billFromCountry": null,
    "billToName": null,
    "billToEmail": null,
    "billToStreetAddress": null,
    "billToCity": null,
    "billToPostalCode": null,
    "billToCountry": null,
    "date": null,
    "paymentTerms": null,
    "projectDescription": null,
    "amountDue": null,
    "createdAt": "YYYY-MM-DD",
    "UpdatedAt": "YYYY-MM-DD",
    "updatedAt": "YYYY-MM-DD",
    "invoiceItems": [
        {
            "id": null,
            "invoiceId": null,
            "userId": null,
            "name": null,
            "quantity": null,
            "price": null,
            "total": null,
            "createdAt": "YYYY-MM-DD",
            "updatedAt": "YYYY-MM-DD"
        },
        {
            "id": null,
            "invoiceId": null,
            "userId": null,
            "name": null,
            "quantity": null,
            "price": null,
            "total": null,
            "createdAt": "YYYY-MM-DD",
            "updatedAt": "YYYY-MM-DD"
        }
    ]
}
```
### Endpoint: Delete User Invoice By Id
* Description: Deletes an invoice associated with a logged in user by id
* Path: `/invoices/:id`
* Method: DELETE
* Response Success Code: 200
* Response: none

## **Acknowledgement**
Thanks to my super smart and pretty wife [Thu Smiley](https://github.com/thusmiley) for providing the awesome React built [frontend](https://invoice-app.naughty-cat.com)!