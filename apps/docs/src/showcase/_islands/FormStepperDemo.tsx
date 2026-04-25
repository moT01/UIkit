// Wave 7 P5 — FormStepper showcase island. 4-step demo with state.
import { useState } from 'react';
import { FormStepper } from '@freecodecamp/uikit';

const STEPS = [
  { id: 'account', label: 'Account', description: 'Email + password' },
  { id: 'profile', label: 'Profile', description: 'Display name' },
  { id: 'goals', label: 'Goals', description: 'Why you joined' },
  { id: 'review', label: 'Review', description: 'Confirm + submit' }
];

export function FormStepperDemo(): JSX.Element {
  const [current, setCurrent] = useState('profile');
  return (
    <FormStepper
      steps={STEPS}
      current={current}
      onStepChange={setCurrent}
      ariaLabel='Onboarding progress'
    />
  );
}

export default FormStepperDemo;
