"use client";

import { useState } from "react";
import { useAuth } from "@/lib/authContext";
import { supabase } from "@/lib/supabaseClient";
import { Tabs, Tab } from "@publimicro/ui";
import ProfileTab from "./account/ProfileTab";
import ListingsTab from "./account/ListingsTab";
import PostTab from "./account/PostTab";
import ChatTab from "./account/ChatTab";

export default function AccountDashboard({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user, profile } = useAuth();
  const [tab, setTab] = useState("profile");
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[1000] bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white max-w-2xl w-full rounded-2xl shadow-2xl p-0 overflow-hidden relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 z-10" aria-label="Fechar">✕</button>
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <Tab value="profile" label="Perfil">
            <ProfileTab user={user} profile={profile} />
          </Tab>
          <Tab value="listings" label="Meus Anúncios">
            <ListingsTab user={user} />
          </Tab>
          <Tab value="post" label="Postar Novo">
            <PostTab user={user} />
          </Tab>
          <Tab value="chat" label="Chat">
            <ChatTab user={user} />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
