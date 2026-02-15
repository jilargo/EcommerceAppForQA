// import { request } from '@playwright/test';
// import path from 'path';
// import fs from 'fs';

export async function createUserViaApi(request, user) {

    const response = await request.post('/signup', {
        data: {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            password: user.password,
            image: user.image   // just filename
        }
    });

    if (!response.ok()) {
        const body = await response.text();
        throw new Error(`API error ${response.status()} - ${body}`);
    }
}


module.exports = {
    createUserViaApi
}