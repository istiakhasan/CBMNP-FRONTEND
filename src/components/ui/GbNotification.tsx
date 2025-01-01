import React, { useMemo } from 'react';
import { notification, Button, Space } from 'antd';
import type { NotificationArgsProps } from 'antd';

type NotificationPlacement = NotificationArgsProps['placement'];

type GbNotificationProps = {
  message?: string;
  description?: string;
  placement?: NotificationPlacement;
  type?: 'success' | 'info' | 'warning' | 'error';
  buttonLabel?: string;
  buttonIcon?: React.ReactNode;
  onClick?: () => void;
};

const Context = React.createContext({ name: 'Default' });

const GbNotification: React.FC<GbNotificationProps> = ({
  message = 'Notification Title',
  description = 'Notification description goes here.',
  placement = 'bottomRight',
  type = 'info',
  buttonLabel = 'Show Notification',
  buttonIcon = null,
  onClick,
}) => {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = () => {
    if (onClick) onClick();
    api[type]({
      message,
      description,
      placement,
    });
  };

  const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);

  return (
    <Context.Provider value={contextValue}>
      {contextHolder}
      <Space>
        <Button type="primary" onClick={openNotification} icon={buttonIcon}>
          {buttonLabel}
        </Button>
      </Space>
    </Context.Provider>
  );
};

export default GbNotification;
