import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { IconWarning } from 'components/Icons';

import styles from './styles.module.css';

const Alert: React.FC<{
  heading?: string;
  warning?: boolean;
  onClose: () => void;
}> = ({ heading = 'Aviso', children, warning = false, onClose }) => (
  <Modal isOpen={!!children}>
    <Modal.Header className={styles.alertHeader}>{heading}</Modal.Header>
    <Modal.Body className={styles.alertBody}>
      {warning && <IconWarning />}
      {children}
    </Modal.Body>
    <Modal.Footer>
      <Button variant="outline-primary" onClick={onClose}>
        Aceptar
      </Button>
    </Modal.Footer>
  </Modal>
);

export default Alert;
