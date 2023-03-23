import { useQuery, gql } from "@apollo/client";

const LOGIN_QUERY = gql`
  query Query($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

export const App = () => {
  const { data } = useQuery(LOGIN_QUERY, {
    variables: {
      email: "lnfernandobr@gmail.com",
      password: "123456",
    },
  });

  console.log("data: ", data);

  return <h1>app</h1>;
};
