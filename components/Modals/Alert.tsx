import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { IconWarning } from 'components/Icons';

import styles from './styles.module.css';

const Alert: React.FC<{
  heading?: string;
  warning?: boolean;
  onClose: () => void;
}> = ({ heading = 'Aviso', children, warning = false, onClose }) => (
  <Modal isOpen={!!children}>
    <ModalHeader className={styles.alertHeader}>{heading}</ModalHeader>
    <ModalBody className={styles.alertBody}>
      {warning && <IconWarning />}
      {children}
    </ModalBody>
    <ModalFooter>
      <Button color="primary" outline onClick={onClose}>
        Aceptar
      </Button>
    </ModalFooter>
  </Modal>
);

export default Alert;
