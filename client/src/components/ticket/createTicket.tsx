import React, { useContext, useState } from 'react';
import { Modal, Input, Select, Button, notification } from 'antd';
import Context from '../..';
import $api from '../../http';

const { Option } = Select;
interface CreateTicketModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const CreateTicketModal: React.FC<CreateTicketModalProps> = ({
  isVisible,
  onClose,
}) => {
  const { store } = useContext(Context);
  const [summary, setSummary] = useState('');
  const [priority, setPriority] = useState('Low');
  const [status, setStatus] = useState('Opened');
  const emailMain = store.user.email;
  const [ticketLink, setTicketLink] = useState(null);
  const [templateTitle, setTemplateTitle] = useState('');

  const handleTicketCreation = async () => {
    try {
      const ticketData = {
        summary,
        priority,
        status,
        reportedBy: emailMain,
        template: templateTitle,
        link: window.location.href,
      };

      const response = await $api.post('/create-jira-ticket', ticketData);
      setTicketLink(response.data.ticketLink);

      notification.success({
        message: 'Ticket Created',
        description: 'Your ticket has been created successfully.',
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      title="Create a Support Ticket"
      visible={isVisible}
      onCancel={onClose}
      footer={[
        ticketLink ? (
          <Button key="view" type="link" href={ticketLink} target="_blank">
            View Ticket
          </Button>
        ) : (
          <>
            <Button key="cancel" onClick={onClose}>
              Cancel
            </Button>
            <Button key="submit" type="primary" onClick={handleTicketCreation}>
              Create Ticket
            </Button>
          </>
        ),
      ]}
    >
      <Input
        type="email"
        value={emailMain}
        disabled
        placeholder="Enter your email"
        style={{ marginBottom: '10px' }}
      />
      <Input
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        placeholder="Enter ticket summary"
        style={{ marginBottom: '10px' }}
      />
      <Select
        value={priority}
        onChange={(value) => setPriority(value)}
        style={{ width: '100%', marginBottom: '10px' }}
      >
        <Option value="High">High</Option>
        <Option value="Average">Average</Option>
        <Option value="Low">Low</Option>
      </Select>
      <Select
        value={status}
        onChange={(value) => setStatus(value)}
        style={{ width: '100%', marginBottom: '10px' }}
      >
        <Option value="Opened">Opened</Option>
        <Option value="In progress">In progress</Option>
        <Option value="Rejected">Rejected</Option>
        <Option value="Fixed">Fixed</Option>
      </Select>
      <Input
        value={templateTitle}
        onChange={(e) => setTemplateTitle(e.target.value)}
        style={{ marginBottom: '10px' }}
      />
    </Modal>
  );
};

export default CreateTicketModal;
