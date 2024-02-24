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

Note: Any rought accessed by an unauthenticated user will return status 401, which can be included in if statement checks on all fetches on the front end. If unauthorized, redirect to the login url. 

### **1. AUTHENTICATION ENDPOINTS**

### Endpoint: User Github Authentication
* Description: Authenticates a User via Github Oauth 2.0 and starts a session.
* Notes: User will be redirected (idealy in a new window) to authenticate, once the Oauth dance has finsished, front end can check the status code returned and redirect accordingly (likey to user profile page or back to login screen).
* Path: `/authentication/github`
* Method: GET
* Success Redirect: `/dashboard`
* Failure Redirect: `/login`

### Endpoint: User Logout
* Description: Logs a user out of their current session.
* Path: `/authentication/logout`
* Method: POST
* Success Redirect: `/dashboard`

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
    "createdAt": "2024-02-04" (internal database field),
    "updatedAt": "2024-02-04" (internal database field)
}

```

### **3. INVOICE ENDPOINTS**

### Standard Invoice Object:
```
{
    "id": UUID,
    "userId": UUID,
    "status": string,
    "invoiceNumber": number,
    "billFromStreetAddress": string,
    "billFromCity": string,
    "billFromState": string,
    "billFromPostalCode": string,
    "billFromCountry": string,
    "billToName": string,
    "billToEmail": string,
    "billToStreetAddress": string,
    "billToCity": string,
    "billToState": string,
    "billToPostalCode": string,
    "billToCountry": string,
    "date": string,
    "paymentTerms": string,
    "projectDescription": string,
    "amountDue": number (xxx.xx),
    "createdAt": string ("YYYY-MM-DD")(internal database field),
    "updatedAt": string ("YYYY-MM-DD")(internal database field),
    "invoiceItems": [
        {
            "id": UUID,
            "invoiceId": UUID,
            "userId": UUID,
            "name": string,
            "quantity": number,
            "price": number (xxx.xx),
            "total": number (xxx.xx),
            "createdAt": string ("YYYY-MM-DD")(internal database field),
            "updatedAt": string ("YYYY-MM-DD")(internal database field)
        },
        {
            "id": UUID,
            "invoiceId": UUID,
            "userId": UUID,
            "name": string,
            "quantity": number,
            "price": number (xxx.xx),
            "total": number (xxx.xx),
            "createdAt": string ("YYYY-MM-DD")(internal database field),
            "updatedAt": string ("YYYY-MM-DD")(internal database field)
        }
    ]
}
```

### Endpoint: Get Invoice By Id
* Description: Gets an invoice associated with a logged in user by id.
* Path: `/invoices/:id`
* Method: GET
* Response Success Code: 200
* Response: JSON Object
* Sample Response: 
```
invoiceObject
```

### Endpoint: Get All Invoices
* Description: Gets all invoices associated with a logged in user.
* Path: `/invoices/all`
* Method: GET
* Response Success Code: 200
* Response: JSON Object
* Sample Response: 
```
[
    invoiceObject,
    invoiceObject,
    invoiceObject
]
```

### Endpoint: Get Draft Invoices
* Description: Gets all draft invoices associated with a logged in user.
* Notes: The property "invoice.status" must be set to "draft" to populate.
* Path: `/invoices/draft`
* Method: GET
* Response Success Code: 200
* Response: JSON Object
* Sample Response: 
```
[
    invoiceObject,
    invoiceObject,
    invoiceObject
]
```

### Endpoint: Get Pending Invoices
* Description: Gets all pending invoices associated with a logged in user.
* Notes: The property "invoice.status" must be set to "pending" to populate.
* Path: `/invoices/pending`
* Method: GET
* Response Success Code: 200
* Response: JSON Object
* Sample Response: 
```
[
    invoiceObject,
    invoiceObject,
    invoiceObject
]
```

### Endpoint: Get Paid Invoices
* Description: Gets all paid invoices associated with a logged in user.
* Notes: The property "invoice.status" must be set to "paid" to populate.
* Path: `/invoices/paid`
* Method: GET
* Response Success Code: 200
* Response: JSON Object
* Sample Response: 
```
[
    invoiceObject,
    invoiceObject,
    invoiceObject
]
```

### Endpoint: Get Paginated Invoices
* Description: Gets a specified page of invoices associated with a logged in user.
* Path: `/invoices/all/:pageNumber/:resultsPerPage`
* Method: GET
* Response Success Code: 200
* Response: JSON Object
* Sample Response:

```
{
     "metadata": {
        "page": 1,
        "totalPages": 2,
        "totalInvoices": 3
    },
    page:[
        invoiceObject,
        invoiceObject,
        invoiceObject,
    ]
}
```

### Endpoint: Get Paginated Draft Invoices
* Description: Gets a specified page of invoices associated with a logged in user.
* Notes: The property "invoice.status" must be set to "draft" to populate.
* Path: `/invoices/draft/:pageNumber/:resultsPerPage`
* Method: GET
* Response Success Code: 200
* Response: JSON Object
* Sample Response:

```
{
     "metadata": {
        "page": 1,
        "totalPages": 2,
        "totalInvoices": 3
    },
    page:[
        invoiceObject,
        invoiceObject,
        invoiceObject,
    ]
}
```

### Endpoint: Get Paginated Pending Invoices
* Description: Gets a specified page of invoices associated with a logged in user.
* Notes: The property "invoice.status" must be set to "pending" to populate.
* Path: `/invoices/pending/:pageNumber/:resultsPerPage`
* Method: GET
* Response Success Code: 200
* Response: JSON Object
* Sample Response:

* Sample Response:

```
{
     "metadata": {
        "page": 1,
        "totalPages": 2,
        "totalInvoices": 3
    },
    page:[
        invoiceObject,
        invoiceObject,
        invoiceObject,
    ]
}
```

### Endpoint: Get Paginated Paid Invoices
* Description: Gets a specified page of invoices associated with a logged in user.
* Notes: The property "invoice.status" must be set to "paid" to populate.
* Path: `/invoices/paid/:pageNumber/:resultsPerPage`
* Method: GET
* Response Success Code: 200
* Response: JSON Object
* Sample Response:

```
{
     "metadata": {
        "page": 1,
        "totalPages": 2,
        "totalInvoices": 3
    },
    page:[
        invoiceObject,
        invoiceObject,
        invoiceObject,
    ]
}
```

### Endpoint: Add New Invoice
* Description: Adds a new invoice associated with a logged in user.
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
    "createdAt": "YYYY-MM-DD"(internal database field),
    "updatedAt": "YYYY-MM-DD"(internal database field),
    "invoiceItems": [
        {
            "name": null,
            "quantity": null,
            "price": null,
            "total": null,
            "createdAt": "YYYY-MM-DD"(internal database field),
            "updatedAt": "YYYY-MM-DD"(internal database field)
        },
        {
            "name": null,
            "quantity": null,
            "price": null,
            "total": null,
            "createdAt": "YYYY-MM-DD"(internal database field),
            "updatedAt": "YYYY-MM-DD"(internal database field)
        }
    ]
}
```

### Endpoint: Update Invoice By Id
* Description: Updates an invoice associated with a logged in user by id.
* Notes: Invoice objects sent to add can, but do not need to include userId or invoiceId properties. The id property for any existing invoice items however should be included in order to help keep a clean audit history (new items will not have an id).
* Path: `/invoices/:id`
* Method: PUT
* Response Success Code: 201
* Response: none
* Payload: JSON
* Example Payload:

```
{
    "id": UUID (optional),
    "userId": UUID (optional),
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
    "createdAt": "YYYY-MM-DD"(internal database field),
    "updatedAt": "YYYY-MM-DD"(internal database field),
    "invoiceItems": [
        {
            "id": (required if existing),
            "invoiceId": null (optional),
            "userId": null (optional),
            "name": null,
            "quantity": null,
            "price": null,
            "total": null,
            "createdAt": "YYYY-MM-DD"(internal database field),
            "updatedAt": "YYYY-MM-DD"(internal database field)
        },
        {
            "id": (required if existing),
            "invoiceId": (optional),
            "userId": (optional),
            "name": null,
            "quantity": null,
            "price": null,
            "total": null,
            "createdAt": "YYYY-MM-DD"(internal database field),
            "updatedAt": "YYYY-MM-DD"(internal database field)
        }
    ]
}
```

### Endpoint: Delete Invoice By Id
* Description: Deletes an invoice associated with a logged in user by id.
* Path: `/invoices/:id`
* Method: DELETE
* Response Success Code: 200
* Response: none

## **Acknowledgement**
Thanks to my super smart and pretty wife [Thu Smiley](https://github.com/thusmiley) for providing the awesome React built [frontend](https://invoice-app.naughty-cat.com)!