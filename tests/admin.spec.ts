import { test, expect } from 'playwright-test-coverage';

test('home page', async ({ page }) => {
    await page.goto('/');

    expect(await page.title()).toBe('JWT Pizza');
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

});

test('admin login', async ({ page }) => {
    await page.goto('/');

    expect(await page.title()).toBe('JWT Pizza');

    await page.route('*/**/api/auth', async (route) => {
        const loginReq = { email: 'd@admin.com', password: 'a' };
        const loginRes = { user: { id: 3, name: 'Kai Chen', email: 'd@jwt.com', roles: [{ role: 'admin' }] }, token: 'abcdef' };
        expect(route.request().method()).toBe('PUT');
        expect(route.request().postDataJSON()).toMatchObject(loginReq);
        await route.fulfill({ json: loginRes });
    });
    
});