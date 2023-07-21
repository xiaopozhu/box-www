import { Modal, Button } from "antd";
import { GithubOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

export default function Login(props: any) {
  const { show, setShow } = props;

  const router = useRouter();

  const handleLoginAuthURL = (idp: string) => {
    router.push(`${process.env.API_HOST}/api/v1/oauth/${idp}/auth-url`);
  };
  return (
    <Modal
      title="登录/注册"
      open={show}
      footer={false}
      onCancel={() => setShow(false)}
      width={360}
      bodyStyle={{
        height: "300px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Button
        style={{ width: "100%" }}
        size="large"
        icon={<GithubOutlined />}
        onClick={() => handleLoginAuthURL("github")}
      >
        Github
      </Button>
      {/* <Button
        style={{ width: "100%", marginTop: "8px" }}
        size="large"
        icon={<GithubOutlined />}
      >
        Github
      </Button> */}
    </Modal>
  );
}
