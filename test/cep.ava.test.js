import test from 'ava';
import cep from '../cep';

test('cep test', async t => {
    const result = await cep();

    t.is(result, 'CEP');
})