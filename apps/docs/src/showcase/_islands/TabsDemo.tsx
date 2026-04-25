// Wave 7 P9 hot-fix — Tabs showcase island. Astro client:* islands
// hydrate by re-running the React component with the SERIALIZED
// `props` attribute on `<astro-island>` — children authored in the
// .astro template only render once at SSR; after hydration they are
// gone. Tabs uses `Children.toArray(children).filter(...)` to find
// its `<Tab>` config shells, so empty children == empty tabs__list.
// Wrapping the demo in a real React component lets us pass children
// at React level, so hydration finds the same tree the SSR pass did.
import { Tabs, Tab } from '@freecodecamp/uikit';

export function TabsDemo(): JSX.Element {
  return (
    <Tabs
      defaultActiveKey='instructions'
      style={{ width: '100%', maxWidth: 520, margin: '0 auto' }}
    >
      <Tab eventKey='instructions' title='Instructions'>
        <p style={{ margin: 0, fontSize: 17 }}>
          Build a function that returns the sum of all odd Fibonacci numbers up
          to <code>n</code>.
        </p>
      </Tab>
      <Tab eventKey='tests' title='Tests'>
        <ul
          style={{
            margin: 0,
            paddingLeft: 18,
            fontSize: 16,
            lineHeight: 1.6
          }}
        >
          <li>sumFibs(1000) returns 1785</li>
          <li>sumFibs(4000000) returns 4613732</li>
        </ul>
      </Tab>
      <Tab eventKey='console' title='Console'>
        <pre
          style={{
            margin: 0,
            padding: 0,
            background: 'transparent',
            fontSize: 14,
            color: 'var(--foreground-tertiary)'
          }}
        >
          {'// No output yet. Run tests to populate.'}
        </pre>
      </Tab>
    </Tabs>
  );
}

export default TabsDemo;
