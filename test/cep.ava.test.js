import test from 'ava';
import axios from 'axios';
import cep from '../cep';

test('cep test', async t => {
    const result = await cep();

    t.is(result, 'CEP');
})

test('axios', async t => {
    let response = await axios.get('http://localhost:3000/becual/bye');

    t.is(response.status, 200);
    t.is(response.data.cep, 'CEP');
});