// Wave 7 P5 — Modal showcase island. Renders an open-trigger button
// + the real <Modal> from @freecodecamp/uikit. State lives in the
// island so the showcase stays self-contained — Astro's island
// boundary won't leak into other showcases.
import { useState } from 'react';
import { Modal, Button } from '@freecodecamp/uikit';

export function ModalDemo(): JSX.Element {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant='danger' onClick={() => setOpen(true)}>
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
