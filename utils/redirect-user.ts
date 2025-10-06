import { GetServerSidePropsContext } from "next";
import { verifyJWT } from "../lib/utils";

const redirectReturn = () => {
  return {
    props: {},
    redirect: {
      destination: "/login",
      permanent: false,
    },
  };
};

const redirectUser = (context: GetServerSidePropsContext) => {
  const token = context.req.cookies.token;
  if (!token) return redirectReturn();

  const user = verifyJWT(token);
  console.log("Verify JWT function: ", user);

  if (!user) return redirectReturn();

  return {
    token,
    user,
  };
};

export default redirectUser;
