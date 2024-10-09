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
        const registerRes = { user: { id: 3, name: 'Jisu', email: 'k@mail.com', roles: [{ role: 'diner' }] }, token: 'abcdef' };
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

    await page.route('*/**/api/auth', async (route) => {
        const loginReq = { email: 'd@admin.com', password: 'a' };
        const loginRes = { user: { id: 3, name: 'Kai Chen', email: 'd@admin.com', roles: [{ role: 'admin' }] }, token: 'abcdef' };
        expect(route.request().method()).toBe('PUT');
        expect(route.request().postDataJSON()).toMatchObject(loginReq);
        await route.fulfill({ json: loginRes });
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
            
            const creatFranReq = { name: 'pizzaPocket', admins: [{ email: 'd@admin.com' }] };
            const creatFranRes = { name: 'pizzaPocket', admins: [{ email: 'd@admin.com', id: 4, name: 'Kai Chen' }], id: 1 , stores: []};
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
                { id: 1, name: 'pizzaPocket', stores: [], admins: [{ email: 'd@admin.com', id: 4, name: 'Kai Chen' }] }, 
            ];
            expect(route.request().method()).toBe('GET');
            await route.fulfill({ status: 200, contentType: 'application/json', json: franchiseRes });
        }
    });
    

    await page.getByRole('link', { name: 'Admin' }).click();
    await page.getByRole('button', { name: 'Add Franchise' }).click();
    await page.getByPlaceholder('franchise name').click();
    await page.getByPlaceholder('franchise name').fill('pizzaPocket');
    await page.getByPlaceholder('franchisee admin email').click();
    await page.getByPlaceholder('franchisee admin email').fill('d@admin.com');
    await page.getByRole('button', { name: 'Create' }).click();

    

    


    
    
});