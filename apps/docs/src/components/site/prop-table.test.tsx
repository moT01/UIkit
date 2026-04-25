import { test } from 'vitest';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import { PropTable } from './PropTable.js';

const fixture = {
  displayName: 'Badge',
  description: 'Inline status chip.',
  props: {
    variant: {
      type: 'enum',
      required: false,
      description: 'Color tone.',
      defaultValue: 'default'
    },
    children: {
      type: 'ReactNode',
      required: true,
      description: 'Chip body.',
      defaultValue: null
    }
  }
};

test('PropTable renders one row per prop', () => {
  const html = renderToStaticMarkup(<PropTable entry={fixture} />);
  // 2 props → 2 rows. Header row has <th>; body rows have <td>.
  const bodyRowMatches = html.match(/<tr class="prop-table__row"/g) ?? [];
  assert.equal(
    bodyRowMatches.length,
    2,
    `expected 2 body rows, found ${bodyRowMatches.length}: ${html}`
  );
});

test('PropTable required marker present on required props', () => {
  const html = renderToStaticMarkup(<PropTable entry={fixture} />);
  assert.match(
    html,
    /data-required="true"/,
    'required prop must carry data-required="true"'
  );
});

test('PropTable renders header row with all five columns', () => {
  const html = renderToStaticMarkup(<PropTable entry={fixture} />);
  for (const heading of [
    'Prop',
    'Type',
    'Required',
    'Default',
    'Description'
  ]) {
    assert.match(
      html,
      new RegExp(`<th[^>]*>${heading}</th>`),
      `expected header column: ${heading}`
    );
  }
});

test('PropTable renders fallback note when _extractionFailed', () => {
  const generic = {
    displayName: 'Bag',
    description: '',
    props: {},
    _extractionFailed: true
  };
  const html = renderToStaticMarkup(<PropTable entry={generic} />);
  assert.match(
    html,
    /Prop signature unavailable/,
    'fallback message must render for _extractionFailed entries'
  );
});

test('PropTable renders the prop name verbatim', () => {
  const html = renderToStaticMarkup(<PropTable entry={fixture} />);
  for (const name of ['variant', 'children']) {
    assert.match(
      html,
      new RegExp(`<code[^>]*>${name}</code>`),
      `expected prop name in code element: ${name}`
    );
  }
});
