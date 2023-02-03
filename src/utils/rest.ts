import axios, { AxiosPromise } from 'axios';

export const rest = (method: 'get' | 'post', url: string | undefined, body?: { [key: string]: any }) => {
    const options = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${process.env.REPLICATE_API_KEY}`
        }
    };

    const param_one = method === 'post' ? body : options;
    const param_two = method === 'post' ? options : undefined;

    return axios[method](url ?? 'https://api.replicate.com/v1/predictions', param_one, param_two)
        .catch((err): AxiosPromise => err?.response)
        .then(res => res?.data);
};