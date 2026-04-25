// Wave 7 P5 — Toast showcase island. Renders all four variants
// inline (no auto-dismiss timer) so the showcase reads as a
// reference of the visual states.
import { Toast } from '@freecodecamp/uikit';

export function ToastDemo(): JSX.Element {
  return (
    <div style={{ display: 'grid', gap: 12, maxWidth: 420, margin: '0 auto' }}>
      <Toast
        variant='success'
        title='Saved'
        description='Your code passed all tests.'
        dismissible={false}
      />
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
