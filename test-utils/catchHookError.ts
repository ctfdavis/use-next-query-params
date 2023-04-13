import { renderHook } from '@testing-library/react'; // v14.0.0

type RenderHookArgs = Parameters<typeof renderHook>;

let consoleErrorSpy: jest.SpyInstance;

const mockConsoleError = () => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
};

const restoreConsoleError = () => {
    if (consoleErrorSpy) {
        consoleErrorSpy.mockRestore?.();
    }
};

export const catchHookError = (...args: any) => {
    let error: unknown;
    mockConsoleError();

    try {
        renderHook(...(args as RenderHookArgs));
    } catch (e: unknown) {
        error = e;
    }

    restoreConsoleError();
    return error;
};
