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
