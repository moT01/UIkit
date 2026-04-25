// Wave 7 P5 / Wave 8 P7 — Modal showcase island. Renders an open-
// trigger button + the real <Modal> from @freecodecamp/uikit. State
// lives in the island so the showcase stays self-contained —
// Astro's island boundary won't leak into other showcases.
//
// Wave 8 P7 (W8-6) flipped the trigger button from the destructive
// variant to the call-to-action variant. The trigger is the
// affordance that opens the modal; rendering it with the
// destructive variant on `/` implied the click destroys progress,
// when it actually just opens a confirm dialog. The footer
// "Reset progress" button keeps the destructive variant because
// that one IS destructive.
import { useState } from 'react';
import { Modal, Button } from '@freecodecamp/uikit';

export function ModalDemo(): JSX.Element {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant='cta' onClick={() => setOpen(true)}>
        Open modal
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title='Reset progress?'>
        <Modal.Body>
          You completed 17 of 32 steps in <strong>Responsive Web Design</strong>
          . Resetting removes your local code for every one.
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant='danger' onClick={() => setOpen(false)}>
            Reset progress
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalDemo;
