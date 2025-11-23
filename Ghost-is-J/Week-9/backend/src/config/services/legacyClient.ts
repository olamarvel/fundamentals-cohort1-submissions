import axios from 'axios';
import axiosRetry from 'axios-retry';
import { LEGACY_API_URL } from '../config';


const client = axios.create({
baseURL: LEGACY_API_URL,
timeout: 5000,
});


axiosRetry(client, {
retries: 2,
retryDelay: axiosRetry.exponentialDelay,
retryCondition: (error) => {
// retry on network errors or 5xx
return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response?.status >= 500;
}
});


export async function fetchLegacyPayments(): Promise<any[]> {
const resp = await client.get('/payments');
return resp.data;
}


export async function fetchLegacyCustomers(): Promise<any[]> {
const resp = await client.get('/customers');
return resp.data;
}