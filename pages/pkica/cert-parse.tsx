import Head from "next/head";
import { Form, Input, Button, Divider, Upload, message, List } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import { request } from "@/utils/request";

const { TextArea } = Input;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

interface certInfo {
  sha256: string;
  sha1: string;
  pinsha256: string;
  serialNumber: string;
  issuer: string;
  subject: string;
  notBefore: string;
  notAfter: string;
  signatureAlgo: string;
  publicKeyAlgo: string;
  basicConstraintsValid: boolean;
  isCA: boolean;
  ocspServer: string[];
  issuingCertificateURL: string[];
  crlDistributionPoints: string[];
  dnsNames: string[];
  emailAddresses: string[];
  ipAddresses: string[];
}

export default function CertParse() {
  const [form] = Form.useForm();

  const [paste, setPaste] = useState("");
  const [file, setFile] = useState<any>(null);
  const [info, setInfo] = useState<certInfo>();

  const onFinish = (e: any) => {
    e.preventDefault();

    if (!paste && !file) {
      message.error("请粘贴证书内容或上传文件");
      return;
    }
    console.log(file);
    if (file) {
      return onUploadFile();
    }
    request("/api/v1/pkica/cert-parse", {
      method: "POST",
      body: JSON.stringify({ paste }),
    })
      .then((resp) => {
        if (resp.code !== 0) return message.error(resp.error);
        setInfo(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onUploadFile = () => {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      request("/api/v1/pkica/cert-parse", {
        method: "POST",
        headers: { "Content-Type": "application/octet-stream" },
        body: e.target.result,
      })
        .then((resp) => {
          if (resp.code !== 0) return message.error(resp.error);
          setInfo(resp.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <>
      <Head>
        <title>CERT解析 - CryptoBox密码工具箱</title>
      </Head>
      <div style={{ marginBottom: "24px" }}>
        <h1>CERT解析</h1>
      </div>
      <Form {...formItemLayout} form={form} layout="vertical">
        <Form.Item
          label="待处理值"
          rules={[{ required: true }, { type: "string", min: 1 }]}
        >
          <TextArea
            placeholder="粘贴文件"
            value={paste}
            onChange={(e) => setPaste(e.target.value)}
            rows={8}
          />
          <div
            style={{
              position: "absolute",
              transform: "translate(-50%, -50%)",
              top: "50%",
              left: "50%",
            }}
          >
            <Upload
              onChange={(info) => {
                if (!info.file.status) setFile(info.file);
              }}
              beforeUpload={() => false}
              maxCount={1}
              onRemove={() => setFile(undefined)}
            >
              <Button icon={<UploadOutlined />}>上传文件</Button>
            </Upload>
          </div>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={(e) => onFinish(e)}>
            CERT解析
          </Button>
        </Form.Item>
        <Form.Item label="处理结果">
          {info && (
            <List size="small">
              {Object.keys(info).map((k) => (
                <List.Item key={k}>
                  <small
                    style={{
                      display: "inline-block",
                      minWidth: "100px",
                      textAlign: "right",
                    }}
                  >
                    {k.toUpperCase()}
                  </small>
                  {" : "}
                  {(info as any)[k]}
                </List.Item>
              ))}
            </List>
          )}
        </Form.Item>
      </Form>
      <Divider />
    </>
  );
}
