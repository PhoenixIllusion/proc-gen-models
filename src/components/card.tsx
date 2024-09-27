import type { Component, JSXElement } from "solid-js";

interface CardProps {
  children: JSXElement[];
  parentClass?: string;
  class?: string;
  classList?: {
    [k: string]: boolean | undefined;
  }
}

const Card: Component<CardProps> = (props) => {
  const { children, classList } = props;
  return <div class={"card " + (props.parentClass || '')}><div class={"card-body " + (props.class || '')} classList={classList} >{children}</div></div>
}
export default Card;