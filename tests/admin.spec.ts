import { test, expect } from 'playwright-test-coverage';

test('home page', async ({ page }) => {
    await page.goto('/');

    expect(await page.title()).toBe('JWT Pizza');
});

test('about and history', async ({ page }) => {
    await page.goto('/');

    expect(await page.title()).toBe('JWT Pizza');
    await page.getByRole('link', { name: 'History' }).click();
    await page.getByRole('link', { name: 'About' }).click();
});

test('register test', async ({ page }) => {
    await page.goto('/');

    expect(await page.title()).toBe('JWT Pizza');

    await page.route('*/**/api/auth', async (route) => {
        const registerReq = { name: 'Jisu', email: 'k@mail.com', password: '123' };
        const registerRes = { user: { id: 3, name: 'Jisu', email: 'k@mail.com', roles: [{ role: 'franchisee' }] }, token: 'abcdef' };
        expect(route.request().method()).toBe('POST');
        expect(route.request().postDataJSON()).toMatchObject(registerReq);
        await route.fulfill({ json: registerRes });
    });
    
    await page.getByRole('link', { name: 'Register' }).click();
    await page.getByPlaceholder('Full name').fill('Jisu');await page.getByRole('button', { name: 'Register' }).click();
    await page.getByPlaceholder('Email address').fill('k@mail.com');
    await page.getByPlaceholder('Password').fill('123');
    await page.getByRole('button', { name: 'Register' }).click();

    await page.route('*/**/api/auth', async (route) => {
        const deleteRes = { message: 'logout successful' };
        expect(route.request().method()).toBe('DELETE');

        // Mock the response for the DELETE request
        await route.fulfill({
            status: 200, // assuming success
            contentType: 'application/json',
            body: JSON.stringify(deleteRes),
        });

    });
    await page.getByRole('link', { name: 'Logout' }).click();

});

test('admin login', async ({ page }) => {
    await page.goto('/');

    expect(await page.title()).toBe('JWT Pizza');

    let admin: boolean = true;

    
        await page.route('*/**/api/auth', async (route) => {

            if (route.request().method() === 'PUT' && admin){
                const loginReq = { email: 'd@admin.com', password: 'a' };
                const loginRes = { user: { id: 1, name: 'Kai Chen', email: 'd@admin.com', roles: [{ role: 'admin' }] }, token: 'abcdef' };
                expect(route.request().method()).toBe('PUT');
                expect(route.request().postDataJSON()).toMatchObject(loginReq);
                await route.fulfill({ json: loginRes });
                admin = false;
            }
            else if (route.request().method() === 'PUT' && !admin){
                const loginReq = { email: 'k@mail.com', password: '123' };
                const loginRes = { user: { id: 2, name: 'Jisu', email: 'k@mail.com', roles: [{ role: 'franchisee' }] }, token: 'abcdef!' };
                expect(route.request().method()).toBe('PUT');
                expect(route.request().postDataJSON()).toMatchObject(loginReq);
                await route.fulfill({ json: loginRes });
            }
            else if (route.request().method() === 'POST'){
                const registerReq = { name: 'Jisu', email: 'k@mail.com', password: '123' };
                const registerRes = { user: { id: 2, name: 'Jisu', email: 'k@mail.com', roles: [{ role: 'franchisee' }] }, token: 'abcdef!' };
                expect(route.request().method()).toBe('POST');
                expect(route.request().postDataJSON()).toMatchObject(registerReq);
                await route.fulfill({ json: registerRes });  
            } 
            else if (route.request().method() === 'DELETE'){
                const deleteRes = { message: 'logout successful' };
                expect(route.request().method()).toBe('DELETE');
                await route.fulfill({
                    status: 200, // assuming success
                    contentType: 'application/json',
                    body: JSON.stringify(deleteRes),
                });
            }
            
        });

    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByPlaceholder('Email address').click();
    await page.getByPlaceholder('Email address').fill('d@admin.com');
    await page.getByPlaceholder('Email address').press('Tab');
    await page.getByPlaceholder('Password').fill('a');
    await page.getByRole('button', { name: 'Login' }).click();
    
    let franchiseCount = 1;
    await page.route('*/**/api/franchise', async (route) => {

        if (route.request().method() == 'POST'){
            //creating franchise.
            const creatFranReq = { name: 'pizzaPocket', admins: [{ email: 'k@mail.com' }] };
            const creatFranRes = { name: 'pizzaPocket', admins: [{ email: 'k@mail.com', id: 2, name: 'Jisu' }], id: 1 , stores: []};
            expect(route.request().method()).toBe('POST');
            expect(route.request().postDataJSON()).toMatchObject(creatFranReq);
            await route.fulfill({ json: creatFranRes });
        }
        else if (route.request().method() == 'GET' && franchiseCount === 1) {
            //Getting franchise
            const franchiseRes = [];
            expect(route.request().method()).toBe('GET');
            await route.fulfill({ status: 200, contentType: 'application/json', json: franchiseRes });
            franchiseCount++;
        } else if (route.request().method() == 'GET' && franchiseCount === 2) {
            //Getting franchise
            const franchiseRes = [
                { id: 1, name: 'pizzaPocket', stores: [], admins: [{ email: 'k@mail.com', id: 2, name: 'Jisu' }] }, 
            ];
            expect(route.request().method()).toBe('GET');
            await route.fulfill({ status: 200, contentType: 'application/json', json: franchiseRes });
        }
    });
    let userID = 2;
    let createStore = 1;
    await page.route(`*/**/api/franchise/${userID}`, async (route) => {
        if (createStore === 1){
            console.log("working");
            const userFranchisee = [{ id: 1, name: 'pizzaPocket', admins: [{ id: 2, name: 'Jisu', email: 'k@mail.com' }], stores: [] }];
            expect(route.request().method()).toBe('GET');
            await route.fulfill({ json: userFranchisee });
        }else if(createStore === 2){
            const userFranchisee = [{ id: 1, name: 'pizzaPocket', admins: [{ id: 2, name: 'Jisu', email: 'k@mail.com' }], stores: [{ id: 1, franchiseId: 1, name: 'SLC', totalRevenue: 44.22 }] }];
            expect(route.request().method()).toBe('GET');
            await route.fulfill({ json: userFranchisee });
        }
        
    });

    let franchiseID = 1;
    await page.route(`*/**/api/franchise/${franchiseID}/store`, async (route) => {
        const storeRes = {id: 1, franchiseId: 1, name: 'SLC'};
        expect(route.request().method()).toBe('POST');
        await route.fulfill({ json: storeRes });
        createStore ++;
    });

    

    await page.getByRole('link', { name: 'Admin' }).click();
    await page.getByRole('button', { name: 'Add Franchise' }).click();
    await page.getByPlaceholder('franchise name').click();
    await page.getByPlaceholder('franchise name').fill('pizzaPocket');
    await page.getByPlaceholder('franchisee admin email').click();
    await page.getByPlaceholder('franchisee admin email').fill('k@mail.com');
    await page.getByRole('button', { name: 'Create' }).click();
    await page.getByRole('link', { name: 'Logout' }).click();

    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByPlaceholder('Email address').click();
    await page.getByPlaceholder('Email address').fill('k@mail.com');
    await page.getByPlaceholder('Email address').press('Tab');
    await page.getByPlaceholder('Password').fill('123');
    await page.getByRole('button', { name: 'Login' }).click();

    await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
    await page.getByRole('button', { name: 'Create store' }).click();
    await page.getByPlaceholder('store name').click();
    await page.getByPlaceholder('store name').fill('ppp');
    await page.getByRole('button', { name: 'Create' }).click();

    let storeID = 1;
    await page.route(`*/**/api/franchise/${franchiseID}/store/${storeID}`, async (route) => {
        const delStoreRes = { message: 'store deleted' };
        expect(route.request().method()).toBe('DELETE');
        await route.fulfill({
            status: 200, // assuming success
            contentType: 'application/json',
            body: JSON.stringify(delStoreRes),
        });
        createStore--;
    });
    await page.getByRole('button', { name: 'Close' }).click();
    await page.getByRole('button', { name: 'Close' }).click();

    
    
});

test('docs page', async ({ page }) => {
    // Go to home page
    await page.goto('/');

    // Intercept the API route and fulfill with a mock response
    await page.route('*/**/api/docs', async (route) => {
        const docsRes = {
            "version": "20240518.154317",
            "endpoints": [
                {
                    "method": "POST",
                    "path": "/api/auth",
                    "description": "Register a new user",
                    "example": "curl -X POST localhost:3000/api/auth -d '{\"name\":\"pizza diner\", \"email\":\"d@jwt.com\", \"password\":\"diner\"}' -H 'Content-Type: application/json'",
                    "response": {
                        "user": {
                            "id": 2,
                            "name": "pizza diner",
                            "email": "d@jwt.com",
                            "roles": [
                                {
                                    "role": "diner"
                                }
                            ]
                        },
                        "token": "tttttt"
                    }
                },
                {
                    "method": "POST",
                    "path": "/api/auth",
                    "description": "Register a new user",
                    "example": "curl -X POST localhost:3000/api/auth -d '{\"name\":\"pizza diner\", \"email\":\"d@jwt.com\", \"password\":\"diner\"}' -H 'Content-Type: application/json'",
                    "response": {
                        "user": {
                            "id": 2,
                            "name": "pizza diner",
                            "email": "d@jwt.com",
                            "roles": [
                                {
                                    "role": "diner"
                                }
                            ]
                        },
                        "token": "tttttt"
                    }
                }
                
            ]
        };
        expect(route.request().method()).toBe('GET');  // Expect GET request
        await route.fulfill
            ({ body: JSON.stringify(docsRes) });
    });

    // Navigate to /docs after route is set
    await page.goto('/docs');
});
   