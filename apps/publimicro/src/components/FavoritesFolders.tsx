"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Folder, FolderOpen, Heart, Plus, Trash2, Edit2, Check, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "./ToastNotification";

interface FavoriteFolder {
  id: string;
  name: string;
  color: string;
  propertyIds: string[];
  createdAt: number;
}

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  area_total: number;
  fotos: string[];
}

export default function FavoritesFolders() {
  const { showToast } = useToast();
  
  const [folders, setFolders] = useState<FavoriteFolder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState("");

  useEffect(() => {
    loadFolders();
  }, []);

  useEffect(() => {
    if (selectedFolder) {
      loadFolderProperties(selectedFolder);
    }
  }, [selectedFolder]);

  const loadFolders = () => {
    try {
      const stored = localStorage.getItem("favoriteFolders");
      if (stored) {
        const parsedFolders = JSON.parse(stored);
        setFolders(parsedFolders);
        
        // Select first folder by default
        if (parsedFolders.length > 0 && !selectedFolder) {
          setSelectedFolder(parsedFolders[0].id);
        }
      } else {
        // Create default folders
        const defaultFolders: FavoriteFolder[] = [
          { id: "urgent", name: "Urgente", color: "#B7791F", propertyIds: [], createdAt: Date.now() },
          { id: "maybe", name: "Talvez", color: "#E6C98B", propertyIds: [], createdAt: Date.now() },
          { id: "family", name: "Para a Família", color: "#A8C97F", propertyIds: [], createdAt: Date.now() }
        ];
        setFolders(defaultFolders);
        setSelectedFolder("urgent");
        localStorage.setItem("favoriteFolders", JSON.stringify(defaultFolders));
      }
    } catch (error) {
      console.error("Error loading folders:", error);
    }
  };

  const loadFolderProperties = async (folderId: string) => {
    const folder = folders.find(f => f.id === folderId);
    if (!folder || folder.propertyIds.length === 0) {
      setProperties([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("properties")
        .select("id, title, location, price, area_total, fotos")
        .in("id", folder.propertyIds);

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error("Error loading properties:", error);
      showToast({
        type: "error",
        title: "Erro ao carregar propriedades",
        message: "Tente novamente mais tarde"
      });
    }
  };

  const createFolder = () => {
    if (!newFolderName.trim()) return;

    const colors = ["#A8C97F", "#E6C98B", "#B7791F", "#0D7377"];
    const newFolder: FavoriteFolder = {
      id: Math.random().toString(36).substring(7),
      name: newFolderName,
      color: colors[Math.floor(Math.random() * colors.length)],
      propertyIds: [],
      createdAt: Date.now()
    };

    const updatedFolders = [...folders, newFolder];
    setFolders(updatedFolders);
    localStorage.setItem("favoriteFolders", JSON.stringify(updatedFolders));
    
    setNewFolderName("");
    setIsCreating(false);
    setSelectedFolder(newFolder.id);
    
    showToast({
      type: "success",
      title: "Pasta criada!",
      message: `Pasta "${newFolder.name}" criada com sucesso`
    });
  };

  const renameFolder = (folderId: string, newName: string) => {
    if (!newName.trim()) return;

    const updatedFolders = folders.map(f =>
      f.id === folderId ? { ...f, name: newName } : f
    );
    setFolders(updatedFolders);
    localStorage.setItem("favoriteFolders", JSON.stringify(updatedFolders));
    setEditingId(null);
    
    showToast({
      type: "success",
      title: "Pasta renomeada"
    });
  };

  const deleteFolder = (folderId: string) => {
    const folder = folders.find(f => f.id === folderId);
    if (!folder) return;

    if (folder.propertyIds.length > 0) {
      if (!confirm(`A pasta "${folder.name}" contém ${folder.propertyIds.length} propriedade(s). Deseja realmente excluir?`)) {
        return;
      }
    }

    const updatedFolders = folders.filter(f => f.id !== folderId);
    setFolders(updatedFolders);
    localStorage.setItem("favoriteFolders", JSON.stringify(updatedFolders));
    
    if (selectedFolder === folderId) {
      setSelectedFolder(updatedFolders[0]?.id || null);
    }
    
    showToast({
      type: "success",
      title: "Pasta excluída"
    });
  };

  const removeFromFolder = (propertyId: string) => {
    const folder = folders.find(f => f.id === selectedFolder);
    if (!folder) return;

    const updatedPropertyIds = folder.propertyIds.filter(id => id !== propertyId);
    const updatedFolders = folders.map(f =>
      f.id === selectedFolder ? { ...f, propertyIds: updatedPropertyIds } : f
    );

    setFolders(updatedFolders);
    localStorage.setItem("favoriteFolders", JSON.stringify(updatedFolders));
    setProperties(prev => prev.filter(p => p.id !== propertyId));
    
    showToast({
      type: "info",
      title: "Removido da pasta"
    });
  };

  const currentFolder = folders.find(f => f.id === selectedFolder);

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-[#B7791F] fill-current" />
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E6C98B] to-[#B7791F]">
              Meus Favoritos
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-[300px_1fr] gap-6">
          {/* Folders Sidebar */}
          <div className="space-y-3">
            {folders.map((folder) => (
              <div key={folder.id}>
                {editingId === folder.id ? (
                  <div className="flex items-center gap-2 px-4 py-3 bg-[#1a1a1a] border-2 border-[#A8C97F] rounded-xl">
                    <input
                      type="text"
                      defaultValue={folder.name}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") renameFolder(folder.id, e.currentTarget.value);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      className="flex-1 bg-transparent text-[#D4A574] outline-none"
                    />
                    <button
                      onClick={(e) => {
                        const input = e.currentTarget.previousSibling as HTMLInputElement;
                        renameFolder(folder.id, input.value);
                      }}
                      className="text-[#A8C97F] hover:text-[#E6C98B]"
                      aria-label="Confirmar renomeação"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-[#959595] hover:text-[#E6C98B]"
                      aria-label="Cancelar renomeação"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    className={`flex items-center justify-between px-4 py-3 border-2 rounded-xl cursor-pointer transition-all group ${
                      selectedFolder === folder.id
                        ? "bg-gradient-to-r from-[#1a1a1a] to-[#0d0d0d] border-[#A8C97F]"
                        : "bg-[#1a1a1a] border-[#2a2a1a] hover:border-[#E6C98B]"
                    }`}
                    onClick={() => setSelectedFolder(folder.id)}
                  >
                    <div className="flex items-center gap-3">
                      {selectedFolder === folder.id ? (
                        <FolderOpen className="w-5 h-5" style={{ color: folder.color }} />
                      ) : (
                        <Folder className="w-5 h-5" style={{ color: folder.color }} />
                      )}
                      <div>
                        <span className="text-[#D4A574] font-semibold">{folder.name}</span>
                        <span className="text-[#676767] text-sm ml-2">
                          ({folder.propertyIds.length})
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingId(folder.id);
                        }}
                        className="text-[#959595] hover:text-[#E6C98B]"
                        aria-label={`Renomear pasta ${folder.name}`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteFolder(folder.id);
                        }}
                        className="text-[#959595] hover:text-red-500"
                        aria-label={`Excluir pasta ${folder.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Create New Folder */}
            {isCreating ? (
              <div className="flex items-center gap-2 px-4 py-3 bg-[#1a1a1a] border-2 border-[#A8C97F] rounded-xl">
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Nome da pasta"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") createFolder();
                    if (e.key === "Escape") setIsCreating(false);
                  }}
                  className="flex-1 bg-transparent text-[#D4A574] outline-none placeholder:text-[#676767]"
                />
                <button
                  onClick={createFolder}
                  className="text-[#8B9B6E] hover:text-[#D4A574]"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsCreating(false)}
                  className="text-[#676767] hover:text-[#D4A574]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsCreating(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#1a1a1a] border-2 border-dashed border-[#2a2a1a] rounded-xl hover:border-[#A8C97F] transition-all group"
              >
                <Plus className="w-5 h-5 text-[#676767] group-hover:text-[#A8C97F]" />
                <span className="text-[#676767] group-hover:text-[#E6C98B]">Nova Pasta</span>
              </button>
            )}
          </div>

          {/* Properties Grid */}
          <div>
            {currentFolder && (
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-[#E6C98B]">
                  {currentFolder.name}
                </h3>
                <p className="text-[#8B9B6E]">
                  {properties.length} propriedade{properties.length !== 1 ? "s" : ""}
                </p>
              </div>
            )}

            {properties.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Folder className="w-20 h-20 text-[#2a2a1a] mb-4" />
                <p className="text-[#676767] text-lg mb-2">Pasta vazia</p>
                <p className="text-[#676767] text-sm">
                  Adicione propriedades aos seus favoritos para organizar aqui
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <div
                    key={property.id}
                    className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#2a2a1a] rounded-2xl overflow-hidden hover:border-[#A8C97F] transition-all group"
                  >
                    <Link href={`/imoveis/${property.id}`}>
                      <div className="relative w-full h-48 bg-[#2a2a1a]">
                        {property.fotos && property.fotos[0] ? (
                          <Image
                            src={property.fotos[0]}
                            alt={property.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Heart className="w-16 h-16 text-[#959595]" />
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="p-6">
                      <Link href={`/imoveis/${property.id}`}>
                        <h4 className="text-xl font-bold text-[#E6C98B] mb-2 group-hover:text-[#A8C97F] transition-colors">
                          {property.title}
                        </h4>
                      </Link>
                      <p className="text-[#8B9B6E] text-sm mb-4">{property.location}</p>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          {property.price && (
                            <p className="text-[#B7791F] font-bold text-lg">
                              R$ {property.price.toLocaleString("pt-BR")}
                            </p>
                          )}
                          {property.area_total && (
                            <p className="text-[#676767] text-sm">{property.area_total} ha</p>
                          )}
                        </div>
                        
                        <button
                          onClick={() => removeFromFolder(property.id)}
                          className="p-2 text-[#676767] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                          title="Remover da pasta"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to add property to a folder
export function addToFolder(propertyId: string, folderId: string) {
  try {
    const stored = localStorage.getItem("favoriteFolders");
    if (!stored) return;

    const folders: FavoriteFolder[] = JSON.parse(stored);
    const updatedFolders = folders.map(folder =>
      folder.id === folderId && !folder.propertyIds.includes(propertyId)
        ? { ...folder, propertyIds: [...folder.propertyIds, propertyId] }
        : folder
    );

    localStorage.setItem("favoriteFolders", JSON.stringify(updatedFolders));
  } catch (error) {
    console.error("Error adding to folder:", error);
  }
}
