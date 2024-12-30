import React from 'react';
import { Form, Input, Button, Select, Upload } from 'antd';
import { Templates } from '../../../../models/templates';

interface TemplateDetailsInt {
  templateData: {
    title: string;
    description: string;
    category: string;
    isPublic: boolean;
  };
  updateTemplateData: (key: keyof Templates, value: string | boolean) => void;
  handleImageUpload: (file: File) => boolean;
  handleSubmit: () => void;
  loading: boolean;
}

const TemplateDetails: React.FC<TemplateDetailsInt> = ({
  templateData,
  updateTemplateData,
  handleImageUpload,
  handleSubmit,
  loading,
}) => (
  <Form layout="vertical">
    <Form.Item label="Title">
      <Input
        value={templateData.title}
        onChange={(e) => updateTemplateData('title', e.target.value)}
      />
    </Form.Item>
    <Form.Item label="Description">
      <Input.TextArea
        value={templateData.description}
        onChange={(e) => updateTemplateData('description', e.target.value)}
      />
    </Form.Item>
    <Form.Item label="Category">
      <Select
        value={templateData.category}
        onChange={(value) => updateTemplateData('category', value)}
      >
        <Select.Option value="mathematics">Mathematics</Select.Option>
        <Select.Option value="physics">Physics</Select.Option>
        <Select.Option value="chemistry">Chemistry</Select.Option>
        <Select.Option value="biology">Biology</Select.Option>
        <Select.Option value="history">History</Select.Option>
        <Select.Option value="geography">Geography</Select.Option>
        <Select.Option value="literature">Literature</Select.Option>
        <Select.Option value="computer_science">Computer Science</Select.Option>
        <Select.Option value="foreign_languages">
          Foreign Languages
        </Select.Option>
        <Select.Option value="art">Art</Select.Option>
        <Select.Option value="music">Music</Select.Option>
        <Select.Option value="philosophy">Philosophy</Select.Option>
        <Select.Option value="economics">Economics</Select.Option>
        <Select.Option value="psychology">Psychology</Select.Option>
        <Select.Option value="travel">Travel</Select.Option>
        <Select.Option value="cars">Cars</Select.Option>
        <Select.Option value="sports">Sports</Select.Option>
        <Select.Option value="health">Health</Select.Option>
        <Select.Option value="technology">Technology</Select.Option>
        <Select.Option value="programming">Programming</Select.Option>
        <Select.Option value="fashion">Fashion</Select.Option>
        <Select.Option value="cooking">Cooking</Select.Option>
        <Select.Option value="gaming">Gaming</Select.Option>
        <Select.Option value="science_fiction">Science Fiction</Select.Option>
        <Select.Option value="environment">Environment</Select.Option>
      </Select>
    </Form.Item>
    <Form.Item label="Image">
      <Upload beforeUpload={handleImageUpload} maxCount={1} name="image">
        <Button loading={loading}>Upload Image</Button>
      </Upload>
    </Form.Item>
    <Form.Item label="Make its Public templates?">
      <Select
        value={templateData.isPublic ? 'Yes' : 'No'}
        onChange={(value) => updateTemplateData('isPublic', value === 'Yes')}
      >
        <Select.Option value="Yes">Yes</Select.Option>
        <Select.Option value="No">No</Select.Option>
      </Select>
    </Form.Item>
    <Button type="primary" onClick={handleSubmit}>
      Next
    </Button>
  </Form>
);

export default TemplateDetails;
