import { useState } from "react";
import { Divider, Form, Input, Button, Radio } from "antd";

const { TextArea } = Input;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

export default function SHA1() {
  const [form] = Form.useForm();

  return (
    <>
      <div style={{ marginBottom: "24px" }}>
        <h1>SHA1</h1>
      </div>
      <Form {...formItemLayout} form={form} layout="vertical">
        <Form.Item label="待计算" required>
          <TextArea placeholder="请输入待计算字符串" rows={4} />
        </Form.Item>
        <Form.Item
          label="字符格式"
          name="format"
          required
          initialValue={"plain"}
        >
          <Radio.Group>
            <Radio value="plain">明文</Radio>
            <Radio value="hex">Hex</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="计算结果">
          <TextArea placeholder="十六进制结果 (Hex)" rows={4} />
          <div style={{ marginTop: "8px" }}>中间值：</div>
        </Form.Item>
        <Form.Item>
          <Button type="primary">SHA1</Button>
        </Form.Item>
      </Form>
      <Divider />
    </>
  );
}
