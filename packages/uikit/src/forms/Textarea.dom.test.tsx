// Wave 9 P5.1 — DOM-side coverage for <Textarea>.
//
// The pure SSR tests (Textarea.test.ts) already lock the static
// markup contract. The autoResize behaviour requires real DOM
// (jsdom) plus measurable scrollHeight, plus the `useEffect` hook
// + `onInput` handler. These tests cover lines 17-19 (`fit()`),
// 37-38 (effect), and 54-55 (onInput resize) of Textarea.tsx.
import { test, expect, afterEach } from 'vitest';
import { cleanup, render, fireEvent } from '@testing-library/react';
import { useRef } from 'react';
import { Textarea } from './Textarea';

afterEach(cleanup);

test('autoResize sets style.height on initial mount via the effect hook', () => {
  // jsdom returns scrollHeight = 0 unless we stub it. Stub the
  // prototype's getter so `el.scrollHeight` returns a known value.
  const original = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'scrollHeight'
  );
  Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
    configurable: true,
    get() {
      return 96;
    }
  });
  try {
    const { container } = render(<Textarea autoResize defaultValue='hello' />);
    const ta = container.querySelector('textarea')!;
    // Effect runs synchronously after mount → height set to scrollHeight.
    expect(ta.style.height).toBe('96px');
  } finally {
    if (original) {
      Object.defineProperty(HTMLElement.prototype, 'scrollHeight', original);
    }
  }
});

test('autoResize re-fits the textarea on input', () => {
  let scrollH = 50;
  const original = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'scrollHeight'
  );
  Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
    configurable: true,
    get() {
      return scrollH;
    }
  });
  try {
    const { container } = render(<Textarea autoResize />);
    const ta = container.querySelector('textarea')!;
    expect(ta.style.height).toBe('50px');
    scrollH = 140;
    fireEvent.input(ta, { target: { value: 'multi\nline\nlong' } });
    expect(ta.style.height).toBe('140px');
  } finally {
    if (original) {
      Object.defineProperty(HTMLElement.prototype, 'scrollHeight', original);
    }
  }
});

test('autoResize off — no height style is written, onInput consumer still fires', () => {
  let consumerCalled = 0;
  const { container } = render(
    <Textarea
      onInput={() => {
        consumerCalled += 1;
      }}
    />
  );
  const ta = container.querySelector('textarea')!;
  fireEvent.input(ta, { target: { value: 'x' } });
  expect(ta.style.height).toBe('');
  expect(consumerCalled).toBe(1);
});

test('autoResize forwards consumer onInput callback alongside the resize', () => {
  let value = '';
  const original = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'scrollHeight'
  );
  Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
    configurable: true,
    get() {
      return 72;
    }
  });
  try {
    const { container } = render(
      <Textarea
        autoResize
        onInput={e => {
          value = e.currentTarget.value;
        }}
      />
    );
    const ta = container.querySelector('textarea')!;
    fireEvent.input(ta, { target: { value: 'typed' } });
    expect(value).toBe('typed');
    expect(ta.style.height).toBe('72px');
  } finally {
    if (original) {
      Object.defineProperty(HTMLElement.prototype, 'scrollHeight', original);
    }
  }
});

test('forwarded ref points to the underlying <textarea>', () => {
  let captured: HTMLTextAreaElement | null = null;
  function Probe(): JSX.Element {
    const ref = useRef<HTMLTextAreaElement | null>(null);
    return (
      <Textarea
        ref={node => {
          ref.current = node;
          captured = node;
        }}
      />
    );
  }
  render(<Probe />);
  expect(captured).toBeInstanceOf(HTMLTextAreaElement);
});
