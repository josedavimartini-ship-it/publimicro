import { useState } from "react";

export default function ProfileTab({ user, profile }: { user: any; profile: any }) {
  const [editing, setEditing] = useState(false);
  // ...fields and handlers for editing profile...
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Meu Perfil</h2>
      <div className="mb-2"><b>Email:</b> {user?.email}</div>
      <div className="mb-2"><b>Nome:</b> {profile?.full_name || "-"}</div>
      <div className="mb-2"><b>Telefone:</b> {profile?.phone || "-"}</div>
      {/* Add more fields as needed */}
      <button className="mt-4 px-4 py-2 bg-[#FFD700] text-black rounded font-bold" onClick={() => setEditing(!editing)}>
        {editing ? "Salvar" : "Editar Perfil"}
      </button>
      {/* If editing, show editable fields */}
    </div>
  );
}
