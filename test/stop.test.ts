import { renderHook, act } from '@testing-library/react-hooks';
import { useLoading } from '../src';

const { result } = renderHook(() => useLoading(true, 'hello'));

test('stop function', () => {
  let [{ isLoading, message }, { stop }] = result.current;
  expect(isLoading).toBe(true);
  expect(message).toBe('hello');

  act(() => stop());

  [{ isLoading, message }] = result.current;
  expect(isLoading).toBe(false);
  expect(message).toBe(undefined);
});
