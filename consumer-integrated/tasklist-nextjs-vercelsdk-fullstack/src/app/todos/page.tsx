"use client";

import Todos from "@/components/Todos";
import { Logout } from "@/components/Auth";

export default function TodoPage() {
  return (
    <>
      <Todos />
      <Logout />
    </>
  );
}