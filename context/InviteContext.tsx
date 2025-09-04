"use client";

import React, { createContext, useContext } from "react";

export type InviteNames = {
  inviterFirstName: string;
  inviterLastName: string;
  invitedFirstName: string;
  invitedLastName: string;
  inviterFullName: string;
  invitedFullName: string;
};

const defaultNames: InviteNames = {
  inviterFirstName: "",
  inviterLastName: "",
  invitedFirstName: "",
  invitedLastName: "",
  inviterFullName: "",
  invitedFullName: "",
};

const InviteContext = createContext<InviteNames>(defaultNames);

export function InviteProvider({ value, children }: { value: InviteNames; children: React.ReactNode }) {
  // Normalize to avoid undefined
  const safeValue: InviteNames = {
    inviterFirstName: value?.inviterFirstName ?? "",
    inviterLastName: value?.inviterLastName ?? "",
    invitedFirstName: value?.invitedFirstName ?? "",
    invitedLastName: value?.invitedLastName ?? "",
    inviterFullName: value?.inviterFullName ?? "",
    invitedFullName: value?.invitedFullName ?? "",
  };
  return <InviteContext.Provider value={safeValue}>{children}</InviteContext.Provider>;
}

export function useInvite() {
  return useContext(InviteContext);
}
