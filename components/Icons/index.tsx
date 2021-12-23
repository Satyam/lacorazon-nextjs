import React from 'react';
import Link from 'next/link';
import { Button, ButtonProps } from 'react-bootstrap';
import classNames from 'classnames/bind';
import {
  FaPlusCircle,
  FaRegTrashAlt,
  FaRegEdit,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaExclamationCircle,
  FaExclamationTriangle,
} from 'react-icons/fa';

import styles from './styles.module.css';
import { IconType } from 'react-icons';

/**
 * The `link` property is like an `href` but it will enclose the button in a NextJS `Link`.
 * For external links, keep using `href`.
 */
export type MyButtonProps = {
  color?: BootstrapColor;
  outline?: boolean;

  link?: string;
} & Omit<ButtonProps, 'variant'>;

const MyButton: React.FC<MyButtonProps> = ({ color, outline, link, ...rest }) =>
  link ? (
    <Link href={link} passHref>
      <Button variant={`${outline ? 'outline-' : ''}${color}`} {...rest} />
    </Link>
  ) : (
    <Button variant={`${outline ? 'outline-' : ''}${color}`} {...rest} />
  );

const cx = classNames.bind(styles);

export const Icon: React.FC<{
  IconComponent: IconType;
  color?: BootstrapColor;
  isButton?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: React.EventHandler<React.MouseEvent>;
}> = ({
  IconComponent,
  color,
  isButton,
  disabled,
  className,
  onClick,
  ...props
}) => (
  <IconComponent
    className={cx(className, {
      'active-icon': isButton && !disabled,
      [`text-${color}`]: color,
      disabled: disabled,
    })}
    onClick={disabled ? undefined : onClick}
    {...props}
  />
);

export const IconAdd: React.FC<{ color?: BootstrapColor }> = (props) => (
  <Icon IconComponent={FaPlusCircle} color="primary" {...props} />
);

export const ButtonIconAdd: React.FC<MyButtonProps> = ({
  children,
  color = 'primary',
  title = 'Agregar',
  ...props
}) => (
  <MyButton color={color} title={title} {...props}>
    <FaPlusCircle />
    <span className={styles.label}>{children}</span>
  </MyButton>
);

export const IconDelete: React.FC<{ color?: BootstrapColor }> = (props) => (
  <Icon IconComponent={FaRegTrashAlt} color="danger" {...props} />
);

export const ButtonIconDelete: React.FC<MyButtonProps> = ({
  children,
  color = 'danger',
  title = 'Borrar',
  ...props
}) => (
  <MyButton color={color} title={title} {...props}>
    <FaRegTrashAlt />
    <span className={styles.label}>{children}</span>
  </MyButton>
);

export const IconEdit: React.FC<{ color?: BootstrapColor }> = (props) => (
  <Icon IconComponent={FaRegEdit} color="secondary" {...props} />
);

export const ButtonIconEdit: React.FC<MyButtonProps> = ({
  children,
  color = 'secondary',
  title = 'Modificar',
  ...props
}) => (
  <MyButton color={color} title={title} {...props}>
    <FaRegEdit />
    <span className={styles.label}>{children}</span>
  </MyButton>
);

export const IconView: React.FC<{ color?: BootstrapColor }> = (props) => (
  <Icon IconComponent={FaEye} color="info" {...props} />
);

export const ButtonIconView: React.FC<MyButtonProps> = ({
  children,
  color = 'info',
  title = 'Ver detalle',
  ...props
}) => (
  <MyButton color={color} title={title} {...props}>
    <FaEye />
    <span className={styles.label}>{children}</span>
  </MyButton>
);

export const IconCheck: React.FC<{ color?: BootstrapColor }> = (props) => (
  <Icon IconComponent={FaCheckCircle} color="success" {...props} />
);

export const ButtonIconCheck: React.FC<MyButtonProps> = ({
  children,
  color = 'success',
  ...props
}) => (
  <MyButton color={color} {...props}>
    <FaCheckCircle />
    <span className={styles.label}>{children}</span>
  </MyButton>
);

export const IconNotCheck: React.FC<{ color?: BootstrapColor }> = (props) => (
  <Icon IconComponent={FaTimesCircle} color="danger" {...props} />
);

export const ButtonIconNotCheck: React.FC<MyButtonProps> = ({
  children,
  color = 'warning',
  ...props
}) => (
  <MyButton color={color} {...props}>
    <FaTimesCircle />
    <span className={styles.label}>{children}</span>
  </MyButton>
);

export const IconCalendar: React.FC<{ color?: BootstrapColor }> = (props) => (
  <Icon IconComponent={FaCalendarAlt} color="secondary" {...props} />
);

export const ButtonIconCalendar: React.FC<MyButtonProps> = ({
  children,
  color = 'secondary',
  title = 'Calendario',
  ...props
}) => (
  <MyButton color={color} title={title} {...props}>
    <FaCalendarAlt />
    <span className={styles.label}>{children}</span>
  </MyButton>
);

export const IconWarning: React.FC<{ color?: BootstrapColor }> = (props) => (
  <Icon IconComponent={FaExclamationTriangle} color="warning" {...props} />
);

export const IconStop: React.FC<{ color?: BootstrapColor }> = (props) => (
  <Icon IconComponent={FaExclamationCircle} color="danger" {...props} />
);

export const ButtonSet: React.FC<{
  className?: string;
  size?: BootstrapSize;
}> = ({ className, children, size, ...rest }) => (
  <div
    className={cx('buttonSet', { [`btn-group-${size}`]: size }, className)}
    {...rest}
  >
    {children}
  </div>
);
