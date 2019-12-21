import { renderHook } from '@testing-library/react-hooks';
import { useLoading } from '../src';

const { result } = renderHook(() => useLoading());

test('default values', () => {
  expect(result.current[0].isLoading).toBe(false);
  expect(result.current[0].message).toBeUndefined();
  expect(typeof result.current[1].start).toBe('function');
  expect(typeof result.current[1].stop).toBe('function');
});
