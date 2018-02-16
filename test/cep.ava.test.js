import test from 'ava';
import cep from '../chupaelpico';

test('cep test', async t => {
    const result = await cep();

    t.is(result, 'chupa la tula');
})