import { redirect } from "react-router";
import type { Route } from "../+types/root";

export function meta({}: Route.MetaArgs) {
  return [{ title: "To do App" }];
}

export function loader() {
  return redirect("/todos");
}
