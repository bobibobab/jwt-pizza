import { sleep, check, group, fail } from 'k6'
import http from 'k6/http'
import jsonpath from 'https://jslib.k6.io/jsonpath/1.0.2/index.js'

export const options = {
    cloud: {
        distribution: { 'amazon:us:ashburn': { loadZone: 'amazon:us:ashburn', percent: 100 } },
        apm: [],
    },
    thresholds: {},
    scenarios: {
        Scenario_1: {
            executor: 'ramping-vus',
            gracefulStop: '30s',
            stages: [
                { target: 5, duration: '30s' },
                { target: 15, duration: '1m' },
                { target: 10, duration: '30s' },
                { target: 0, duration: '30s' },
            ],
            gracefulRampDown: '30s',
            exec: 'scenario_1',
        },
    },
}

export function scenario_1() {
    let response

    const vars = {}

    group('page_1 - https://pizza.byucs329pizza.click/', function () {
        // Homepage
        response = http.get('https://pizza.byucs329pizza.click/', {
            headers: {
                accept:
                    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'accept-encoding': 'gzip, deflate, br, zstd',
                'accept-language': 'en-US,en;q=0.9,ko;q=0.8',
                'cache-control': 'max-age=0',
                'if-modified-since': 'Thu, 31 Oct 2024 21:30:12 GMT',
                'if-none-match': '"8c1ed246a001f8df9153282639d9a4f0"',
                priority: 'u=0, i',
                'sec-ch-ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'document',
                'sec-fetch-mode': 'navigate',
                'sec-fetch-site': 'same-origin',
                'sec-fetch-user': '?1',
                'upgrade-insecure-requests': '1',
            },
        })
        sleep(6)

        // Login
        response = http.put(
            'https://pizza-service.byucs329pizza.click/api/auth',
            '{"email":"d@jwt.com","password":"diner"}',
            {
                headers: {
                    accept: '*/*',
                    'accept-encoding': 'gzip, deflate, br, zstd',
                    'accept-language': 'en-US,en;q=0.9,ko;q=0.8',
                    'content-type': 'application/json',
                    origin: 'https://pizza.byucs329pizza.click',
                    priority: 'u=1, i',
                    'sec-ch-ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Windows"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-site',
                },
            }
        )
        if (!check(response, { 'status equals 200': response => response.status.toString() === '200' })) {
            console.log(response.body);
            fail('Login was *not* 200');
        }

        vars['token1'] = jsonpath.query(response.json(), '$.token')[0]

        sleep(3.2)

        // Get Menu
        response = http.get('https://pizza-service.byucs329pizza.click/api/order/menu', {
            headers: {
                accept: '*/*',
                'accept-encoding': 'gzip, deflate, br, zstd',
                'accept-language': 'en-US,en;q=0.9,ko;q=0.8',
                authorization: `Bearer ${vars['token1']}`,
                'content-type': 'application/json',
                'if-none-match': 'W/"1fc-cgG/aqJmHhElGCplQPSmgl2Gwk0"',
                origin: 'https://pizza.byucs329pizza.click',
                priority: 'u=1, i',
                'sec-ch-ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-site',
            },
        })
        sleep(0.9)

        // Get franchise
        response = http.get('https://pizza-service.byucs329pizza.click/api/franchise', {
            headers: {
                accept: '*/*',
                'accept-encoding': 'gzip, deflate, br, zstd',
                'accept-language': 'en-US,en;q=0.9,ko;q=0.8',
                authorization: `Bearer ${vars['token1']}`,
                'content-type': 'application/json',
                'if-none-match': 'W/"40-EPPawbPn0KtYVCL5qBynMCqA1xo"',
                origin: 'https://pizza.byucs329pizza.click',
                priority: 'u=1, i',
                'sec-ch-ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-site',
            },
        })
        sleep(5.5)

        // Purchase pizza
        response = http.post(
            'https://pizza-service.byucs329pizza.click/api/order',
            '{"items":[{"menuId":1,"description":"Veggie","price":0.0038}],"storeId":"1","franchiseId":1}',
            {
                headers: {
                    accept: '*/*',
                    'accept-encoding': 'gzip, deflate, br, zstd',
                    'accept-language': 'en-US,en;q=0.9,ko;q=0.8',
                    authorization: `Bearer ${vars['token1']}`,
                    'content-type': 'application/json',
                    origin: 'https://pizza.byucs329pizza.click',
                    priority: 'u=1, i',
                    'sec-ch-ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Windows"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-site',
                },
            }
        )
    })
}