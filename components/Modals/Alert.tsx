import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { IconWarning } from 'components/Icons';

import styles from './styles.module.css';

const Alert: React.FC<{
  heading?: string;
  descr?: string;
  warning?: boolean;
  onClose: () => void;
}> = ({ heading = 'Aviso', descr, warning = false, onClose }) => (
  <Modal isOpen={!!descr}>
    <ModalHeader className={styles.confirmDeleteHeader}>{heading}</ModalHeader>
    <ModalBody className={styles.confirmDeleteBody}>
      {warning && <IconWarning />}
      {descr}
    </ModalBody>
    <ModalFooter>
      <Button outline onClick={onClose}>
        Aceptar
      </Button>
    </ModalFooter>
  </Modal>
);

export default Alert;
