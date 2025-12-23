import type { Route } from "./+types";

export function meta({}: Route.MetaArgs) {
  return [{ title: "To do App" }];
}

export default function Home() {
  return <>test</>;
}
