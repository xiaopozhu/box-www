import { request } from "@/utils/request";
import { message } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Callback() {
  const router = useRouter();

  const query = router.asPath.split("?")[1];
  const idp = router.query.idp;
  useEffect(() => {
    if (idp && query) {
      request(`/api/v1/oauth/${idp}/callback?${query}`, {
        credentials: "include",
      }).then((resp) => {
        if (resp.code === 0) {
          router.push("/");
        } else {
          message.error(`${resp.error}`);
        }
      });
    }
  }, [idp, query, router]);
  return <></>;
}
