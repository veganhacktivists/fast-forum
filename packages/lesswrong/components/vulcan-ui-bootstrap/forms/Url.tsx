import React from "react";
import Form from "react-bootstrap/Form";
import { Components, registerComponent } from "../../../lib/vulcan-lib";

const UrlComponent = ({ refFunction, inputProperties, itemProperties }: AnyBecauseTodo) => (
  <Components.FormItem path={inputProperties.path} label={inputProperties.label} {...itemProperties}>
    <Form.Control ref={refFunction} {...inputProperties} {...itemProperties} type="url" />
  </Components.FormItem>
);

const FormComponentUrlComponent = registerComponent("FormComponentUrl", UrlComponent);

declare global {
  interface ComponentTypes {
    FormComponentUrl: typeof FormComponentUrlComponent;
  }
}
