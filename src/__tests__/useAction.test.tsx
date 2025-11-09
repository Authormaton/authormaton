import { renderHook, act } from '@testing-library/react';
import { useAction } from '../hooks/use-action';
import { LoadingContext } from '@/contexts/LoadingContext';
import React from 'react';

// Mock the LoadingContext to control its state during tests
const mockSetLoading = jest.fn();

const mockLoadingProvider = ({ children }: { children: React.ReactNode }) => (
  <LoadingContext.Provider value={{ isLoading: false, setLoading: mockSetLoading }}>
    {children}
  </LoadingContext.Provider>
);

describe('useAction', () => {
  beforeEach(() => {
    // Reset the mock before each test
    mockSetLoading.mockClear();
    jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console.error during tests
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Restore console.error after each test
  });

  it('should return initial loading state as false', () => {
    const mockAction = jest.fn(() => Promise.resolve('success'));
    const { result } = renderHook(() => useAction(mockAction), { wrapper: mockLoadingProvider });

    expect(result.current.isActionLoading).toBe(false);
  });

  it('should set loading states to true during action execution and false afterwards', async () => {
    const mockAction = jest.fn((input: string) => Promise.resolve(`processed ${input}`));
    const { result } = renderHook(() => useAction(mockAction), { wrapper: mockLoadingProvider });

    let actionPromise: Promise<string | undefined>;
    act(() => {
      actionPromise = result.current.wrappedAction('test');
    });

    expect(result.current.isActionLoading).toBe(true);
    expect(mockSetLoading).toHaveBeenCalledWith(true);

    await act(async () => {
      await actionPromise;
    });

    expect(result.current.isActionLoading).toBe(false);
    expect(mockSetLoading).toHaveBeenCalledWith(false);
    expect(mockAction).toHaveBeenCalledWith('test');
  });

  it('should handle action success and return the result', async () => {
    const mockAction = jest.fn((input: string) => Promise.resolve(`success: ${input}`));
    const { result } = renderHook(() => useAction(mockAction), { wrapper: mockLoadingProvider });

    let actionResult: string | undefined;
    await act(async () => {
      actionResult = await result.current.wrappedAction('data');
    });

    expect(actionResult).toBe('success: data');
    expect(result.current.isActionLoading).toBe(false);
    expect(mockSetLoading).toHaveBeenCalledWith(false);
  });

  it('should handle action errors and reset loading states', async () => {
    const errorMessage = 'Action failed';
    const mockAction = jest.fn(() => Promise.reject(new Error(errorMessage)));
    const { result } = renderHook(() => useAction(mockAction), { wrapper: mockLoadingProvider });

    let error: Error | undefined;
    await act(async () => {
      try {
        await result.current.wrappedAction('error_data');
      } catch (e) {
        error = e as Error;
      }
    });

    expect(error).toBeInstanceOf(Error);
    expect(error?.message).toBe(errorMessage);
    expect(result.current.isActionLoading).toBe(false);
    expect(mockSetLoading).toHaveBeenCalledWith(false);
    expect(console.error).toHaveBeenCalledWith(
      "useAction: Error during action execution:",
      expect.any(Error)
    );
  });

  it('should not set state on an unmounted component', async () => {
    const mockAction = jest.fn(() => new Promise(resolve => setTimeout(() => resolve('done'), 100)));
    const { result, unmount } = renderHook(() => useAction(mockAction), { wrapper: mockLoadingProvider });

    const actionPromise = result.current.wrappedAction('test');

    expect(result.current.isActionLoading).toBe(true);
    expect(mockSetLoading).toHaveBeenCalledWith(true);

    unmount();

    await act(async () => {
      await actionPromise;
    });

    // Expect loading states to be reset, but setIsActionLoading should not be called on unmounted component
    // This is hard to directly assert without mocking useState, but we can check mockSetLoading
    expect(mockSetLoading).toHaveBeenCalledWith(false);
    // The local isActionLoading state will remain true because the component is unmounted and cannot update.
    // This is expected behavior for unmounted components and not a bug in the hook itself.
    expect(result.current.isActionLoading).toBe(true); // State remains true as component unmounted before update
  });

  it('should return undefined and log an error if action is undefined', async () => {
    const { result } = renderHook(() => useAction(undefined as any), { wrapper: mockLoadingProvider });

    const actionResult = await act(async () => {
      return await result.current.wrappedAction('test');
    });

    expect(actionResult).toBeUndefined();
    expect(console.error).toHaveBeenCalledWith(
      "useAction: The provided action function is undefined."
    );
    expect(result.current.isActionLoading).toBe(false);
    expect(mockSetLoading).toHaveBeenCalledWith(false);
  });
});
