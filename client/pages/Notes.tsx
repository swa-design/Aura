import { useState, useMemo } from "react";
import { useNotesStore } from "@/lib/store";
import {
  Plus,
  Trash2,
  Search,
  Pin,
  PinOff,
  FolderOpen,
} from "lucide-react";

export default function NotesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    folder: "Personal",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const notes = useNotesStore((state) => state.notes);
  const addNote = useNotesStore((state) => state.addNote);
  const updateNote = useNotesStore((state) => state.updateNote);
  const deleteNote = useNotesStore((state) => state.deleteNote);
  const togglePin = useNotesStore((state) => state.togglePin);
  const searchNotes = useNotesStore((state) => state.searchNotes);

  const folders = useMemo(() => {
    const folderSet = new Set(notes.map((n) => n.folder).filter(Boolean));
    return Array.from(folderSet) as string[];
  }, [notes]);

  const displayedNotes = useMemo(() => {
    let filtered = searchQuery ? searchNotes(searchQuery) : notes;

    if (selectedFolder) {
      filtered = filtered.filter((n) => n.folder === selectedFolder);
    }

    return filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    });
  }, [notes, searchQuery, selectedFolder, searchNotes]);

  const handleAddNote = () => {
    if (newNote.title.trim()) {
      if (editingId) {
        updateNote(editingId, {
          title: newNote.title,
          content: newNote.content,
          folder: newNote.folder,
        });
        setEditingId(null);
      } else {
        addNote({
          title: newNote.title,
          content: newNote.content,
          folder: newNote.folder,
        });
      }
      setNewNote({ title: "", content: "", folder: "Personal" });
    }
  };

  const handleEditNote = (id: string) => {
    const note = notes.find((n) => n.id === id);
    if (note) {
      setNewNote({
        title: note.title,
        content: note.content,
        folder: note.folder || "Personal",
      });
      setEditingId(id);
      setExpandedId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewNote({ title: "", content: "", folder: "Personal" });
  };

  return (
    <div className="flex-1 w-full flex flex-col min-h-0">
      {/* Header */}
      <div className="glass border-b border-white/10 shrink-0">
        <div className="px-4 md:px-6 py-4 md:py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-bold">Notes</h1>
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes..."
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>
        </div>
        
        {/* Folders Navigation (Horizontal) */}
        <div className="px-4 md:px-6 pb-4 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            <button
              onClick={() => setSelectedFolder(null)}
              className={`px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                selectedFolder === null
                  ? "bg-primary text-white"
                  : "bg-white/5 hover:bg-white/10"
              }`}
            >
              All Notes
            </button>
            {folders.map((folder) => (
              <button
                key={folder}
                onClick={() => setSelectedFolder(folder)}
                className={`px-4 py-2 rounded-lg transition-all text-sm font-medium flex items-center gap-2 ${
                  selectedFolder === folder
                    ? "bg-primary text-white"
                    : "bg-white/5 hover:bg-white/10"
                }`}
              >
                <FolderOpen className="w-4 h-4" />
                {folder}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6 overflow-y-auto flex-1">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* New/Edit Note Form */}
          <div className="glass rounded-xl p-4 md:p-6 glow-border">
            <h3 className="text-lg font-semibold mb-4">
              {editingId ? "Edit Note" : "New Note"}
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                value={newNote.title}
                onChange={(e) =>
                  setNewNote({ ...newNote, title: e.target.value })
                }
                placeholder="Note title..."
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-foreground/50 focus:border-primary/50 focus:outline-none transition-all text-base md:text-lg font-semibold"
              />

              <textarea
                value={newNote.content}
                onChange={(e) =>
                  setNewNote({ ...newNote, content: e.target.value })
                }
                placeholder="Write your note here..."
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-foreground/50 focus:border-primary/50 focus:outline-none transition-all min-h-[128px] resize-y"
              />

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <select
                  value={newNote.folder}
                  onChange={(e) =>
                    setNewNote({ ...newNote, folder: e.target.value })
                  }
                  className="w-full sm:w-auto px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-all cursor-pointer"
                >
                  <option>Personal</option>
                  <option>Work</option>
                  <option>Ideas</option>
                  <option>Learning</option>
                  <option>Other</option>
                </select>

                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleAddNote}
                    className="flex-1 sm:flex-none px-6 py-2 rounded-lg bg-primary hover:bg-primary/90 transition-all font-medium flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    {editingId ? "Update" : "Add"} Note
                  </button>

                  {editingId && (
                    <button
                      onClick={handleCancelEdit}
                      className="flex-1 sm:flex-none px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all font-medium"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Notes List */}
          <div className="space-y-3">
            {displayedNotes.length === 0 ? (
              <div className="text-center py-12 text-foreground/60">
                <p>
                  {searchQuery
                    ? "No notes found"
                    : "No notes yet. Create one to get started!"}
                </p>
              </div>
            ) : (
              displayedNotes.map((note) => (
                <div
                  key={note.id}
                  className="glass rounded-lg p-4 md:p-6 hover:bg-white/10 transition-all group cursor-pointer"
                  onClick={() =>
                    expandedId === note.id
                      ? setExpandedId(null)
                      : setExpandedId(note.id)
                  }
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 md:gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base md:text-lg font-semibold">
                          {note.title}
                        </h4>
                        {note.isPinned && (
                          <Pin className="w-4 h-4 text-accent" />
                        )}
                      </div>
                      <p className="text-[10px] md:text-xs text-foreground/60 mt-1">
                        {note.folder} •{" "}
                        {note.updatedAt.toLocaleDateString()}
                      </p>
                    </div>

                    <div
                      className="flex items-center gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity justify-end"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => togglePin(note.id)}
                        className="p-2 hover:bg-primary/20 rounded transition-all"
                      >
                        {note.isPinned ? (
                          <PinOff className="w-4 h-4 text-accent" />
                        ) : (
                          <Pin className="w-4 h-4 text-foreground/60" />
                        )}
                      </button>
                      <button
                        onClick={() => handleEditNote(note.id)}
                        className="px-3 py-1.5 text-sm bg-primary/20 hover:bg-primary/30 rounded transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="p-2 hover:bg-red-500/20 rounded transition-all"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>

                  {expandedId === note.id && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-sm md:text-base text-foreground/80 whitespace-pre-wrap">
                        {note.content}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
