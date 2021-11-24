import React from 'react';
import { Modal, Button } from 'react-bootstrap';

import styles from './styles.module.css';

const ConfirmDelete: React.FC<{
  descr?: string;
  onClose: (result: boolean) => void;
}> = ({ descr, onClose }) => (
  <Modal show={!!descr}>
    <Modal.Header className={styles.confirmDeleteHeader}>
      Confirmación borrado
    </Modal.Header>
    <Modal.Body className={styles.confirmDeleteBody}>
      {`¿Está seguro que desea borrar ${descr} ?`}
    </Modal.Body>
    <Modal.Footer>
      <Button
        variant="outline-danger"
        onClick={() => {
          onClose(true);
        }}
      >
        Sí
      </Button>
      <Button variant="outline-secondary" onClick={() => onClose(false)}>
        No
      </Button>
    </Modal.Footer>
  </Modal>
);

export default ConfirmDelete;
