import { Body, Head, Html, Preview, Text } from "@react-email/components";
import * as React from "react";

export const EmailTemplateFixture = () => {
  return (
    <Html>
      <Head />
      <Preview>Test Email Fixture</Preview>
      <Body>
        <Text>Hello!</Text>
      </Body>
    </Html>
  );
};
