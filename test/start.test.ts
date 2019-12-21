import { renderHook, act } from '@testing-library/react-hooks';
import { useLoading } from '../src';

const { result } = renderHook(() => useLoading(false, 'hello'));

test('start function', () => {
  let [{ isLoading, message }, { start, stop }] = result.current;
  expect(isLoading).toBe(false);
  expect(message).toBe('hello');

  act(() => start());

  [{ isLoading, message }] = result.current;
  expect(isLoading).toBe(true);
  expect(message).toBe(undefined);

  act(() => start('world'));

  [{ isLoading, message }] = result.current;
  expect(isLoading).toBe(true);
  expect(message).toBe('world');

  act(() => {
    stop();
    start('testing');
  });

  [{ isLoading, message }] = result.current;
  expect(isLoading).toBe(true);
  expect(message).toBe('testing');
});
