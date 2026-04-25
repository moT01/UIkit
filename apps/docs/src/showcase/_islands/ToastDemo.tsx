import { useState } from 'react';
import { Toast, Button } from '@freecodecamp/uikit';

export function ToastDemo(): JSX.Element {
  const [visible, setVisible] = useState(false);
  return (
    <div style={{ display: 'grid', gap: 12, maxWidth: 420, margin: '0 auto' }}>
      <Button onClick={() => setVisible(true)}>Trigger toast</Button>
      {visible && (
        <Toast
          variant='success'
          title='Saved'
          description='Your code passed all tests.'
          onDismiss={() => setVisible(false)}
        />
      )}
      <Toast
        variant='warning'
        title='Heads up'
        description='Two failing tests since last run.'
        dismissible={false}
      />
      <Toast
        variant='danger'
        title='Build broken'
        description='Linter rejected your last commit.'
        dismissible={false}
      />
      <Toast
        variant='info'
        title='New cert available'
        description='Backend Development is now public.'
        dismissible={false}
      />
    </div>
  );
}

export default ToastDemo;
