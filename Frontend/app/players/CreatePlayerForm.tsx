"use client";

import { useActionState } from "react";
import { createPlayerAction, type CreatePlayerState } from "./actions";

const input =
  "border border-[#2a2f37] bg-[#0d1014] px-2.5 py-1.5 text-[11px] tracking-[0.1em] text-[#d4d7dd] outline-none placeholder:text-[#4b5563] focus:border-[#35c9d8]";

export default function CreatePlayerForm() {
  const [state, action, pending] = useActionState<CreatePlayerState, FormData>(createPlayerAction, {});

  return (
    <form action={action} aria-label="Cadastrar player" className="flex flex-wrap items-start gap-2">
      <input name="email" type="email" required placeholder="EMAIL" aria-label="E-mail" className={input} />
      <input
        name="password"
        type="password"
        required
        minLength={6}
        placeholder="SENHA (MIN. 6)"
        aria-label="Senha"
        className={input}
      />
      <button
        type="submit"
        disabled={pending}
        className="border border-[#a5811f] bg-[#d4a72c] px-3 py-1.5 text-[10px] font-bold tracking-[0.15em] text-[#0a0b0d] disabled:opacity-50"
      >
        {pending ? "SALVANDO..." : "CADASTRAR"}
      </button>
      {state.error ? (
        <p role="alert" className="w-full text-[11px] tracking-[0.1em] text-[#e05d5d]">
          {state.error}
        </p>
      ) : null}
      {state.created ? (
        <p role="status" className="w-full text-[11px] tracking-[0.1em] text-[#4ecb71]">
          PLAYER {state.created} CADASTRADO
        </p>
      ) : null}
    </form>
  );
}
