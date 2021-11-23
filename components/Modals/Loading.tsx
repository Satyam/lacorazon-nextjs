import React from 'react';
import icon from './loading.gif';
import { Modal } from 'react-bootstrap';
import Image from 'next/image';
import styles from './styles.module.css';

const Loading: React.FC<{
  title?: string;
  noIcon?: boolean;
  isOpen?: boolean;
}> = ({
  title = 'Cargando ....',
  children,
  noIcon,
  isOpen = true,
  ...props
}) => (
  <Modal isOpen={isOpen} {...props}>
    <Modal.Header className={styles.loadingHeader}>{title}</Modal.Header>
    <Modal.Body className={styles.loadingContainer}>
      {children}
      {!noIcon && (
        <Image className={styles.loadingImg} src={icon} alt="loading..." />
      )}
    </Modal.Body>
  </Modal>
);

export default Loading;
