import { type APIGatewayProxyHandlerV2 } from "aws-lambda";

export const webhook: APIGatewayProxyHandlerV2 = async (event, ctx) => {
  console.log(event);
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      msg: "ok",
    }),
  };
};
