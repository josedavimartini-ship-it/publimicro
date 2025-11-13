"use client";
import React, { useState } from 'react';

type UploadResult = { name: string; publicUrl?: string; path?: string; error?: string };

export default function AdminUploadPage() {
  const [propertyId, setPropertyId] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [adminUser, setAdminUser] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [results, setResults] = useState<UploadResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const handleZipFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZipFile(e.target.files?.[0] || null);
  };

  const fileToBase64 = (file: File, onProgress?: (p: number) => void) => {
    return new Promise<{ name: string; mime: string; base64: string }>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const comma = result.indexOf(',');
        const b64 = comma >= 0 ? result.slice(comma + 1) : result;
        resolve({ name: file.name, mime: file.type || 'application/octet-stream', base64: b64 });
      };
      reader.onerror = (err) => reject(err);
      reader.onprogress = (ev) => {
        if (ev.lengthComputable && onProgress) {
          onProgress(Math.round((ev.loaded / ev.total) * 100));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResults([]);
    if (!propertyId) return alert('Enter property_id (UUID or id)');
    if (!adminKey) return alert('Enter ADMIN API key');
    if (!files || files.length === 0) return alert('Select files to upload');

    setLoading(true);
    const arr: any[] = [];
    try {
      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        setProgress(prev => ({ ...prev, [f.name]: 0 }));
        const obj = await fileToBase64(f, (p) => setProgress(prev => ({ ...prev, [f.name]: p })));
        arr.push(obj);
      }

      const body = { property_id: propertyId, files: arr };
      const resp = await fetch('/api/admin/property-media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
          'x-admin-user': adminUser || 'web-admin'
        },
        body: JSON.stringify(body)
      });
      const json = await resp.json();
      if (json && json.uploads) setResults(json.uploads);
      else if (json && json.error) setResults([{ name: 'server', error: json.error }]);
    } catch (err: any) {
      setResults([{ name: 'client', error: err.message || String(err) }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-[#0a0a0a] text-white">
      <div className="max-w-3xl mx-auto bg-[#111111] p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Admin Upload</h1>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm text-[#A8C97F]">Property ID (UUID)</label>
            <input value={propertyId} onChange={e => setPropertyId(e.target.value)} className="w-full p-2 rounded bg-[#0d0d0d] border border-[#222]" placeholder="e.g. 2ab5c902-536d-4693-a255-2de307c54f3d" />
          </div>
          <div>
            <label className="block text-sm text-[#A8C97F]">Admin Key</label>
            <input value={adminKey} onChange={e => setAdminKey(e.target.value)} className="w-full p-2 rounded bg-[#0d0d0d] border border-[#222]" placeholder="Paste your ADMIN_API_KEY" />
          </div>
          <div>
            <label className="block text-sm text-[#A8C97F]">Admin User (optional)</label>
            <input value={adminUser} onChange={e => setAdminUser(e.target.value)} className="w-full p-2 rounded bg-[#0d0d0d] border border-[#222]" placeholder="username for audit logs" />
          </div>
          <div>
            <label className="block text-sm text-[#A8C97F]">Files (images, mp4, kml) — multiple</label>
            <input type="file" multiple onChange={handleFiles} className="w-full mt-2" />
            <div className="text-xs text-[#888] mt-2">Note: ZIP extraction is not available in-browser; upload individual files. Max per-request file size follows server limits.</div>
          </div>
          <div>
            <label className="block text-sm text-[#A8C97F]">Or upload a ZIP (server-side extraction)</label>
            <input type="file" accept=".zip" onChange={handleZipFile} className="w-full mt-2" />
            <div className="flex gap-2 mt-2">
              <button type="button" onClick={async () => {
                if (!zipFile) return alert('Select a zip file');
                if (!propertyId) return alert('Enter property_id');
                if (!adminKey) return alert('Enter ADMIN API key');
                setLoading(true);
                try {
                  const z = await fileToBase64(zipFile);
                  const body = { property_id: propertyId, zip: { name: z.name, base64: z.base64 } };
                  const resp = await fetch('/api/admin/property-media/zip', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey, 'x-admin-user': adminUser || 'web-admin' },
                    body: JSON.stringify(body)
                  });
                  const json = await resp.json();
                  if (json && json.uploads) setResults(json.uploads);
                  else if (json && json.error) setResults([{ name: 'server', error: json.error }]);
                } catch (err: any) {
                  setResults([{ name: 'client', error: err.message || String(err) }]);
                } finally { setLoading(false); }
              }} className="px-4 py-2 bg-[#5F7161] rounded font-bold">Upload ZIP (server extract)</button>
            </div>
          </div>
          <div>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-[#A8C97F] rounded font-bold text-black">
              {loading ? 'Uploading...' : 'Upload Files'}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <h3 className="font-semibold">Progress</h3>
          {Object.keys(progress).length === 0 && <div className="text-sm text-[#888]">No active reads</div>}
          {Object.entries(progress).map(([name, p]) => (
            <div key={name} className="mt-2">
              <div className="text-sm">{name} — {p}%</div>
              <div className="w-full bg-[#222] h-2 rounded mt-1"><div style={{ width: `${p}%` }} className="h-2 bg-[#A8C97F] rounded"></div></div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <h3 className="font-semibold">Results</h3>
          {results.length === 0 && <div className="text-sm text-[#888]">No results yet</div>}
          <ul className="mt-2 space-y-2">
            {results.map((r, i) => (
              <li key={i} className="bg-[#0d0d0d] p-3 rounded">
                <div className="flex justify-between items-center">
                  <div className="text-sm">{r.name}</div>
                  {r.error ? <div className="text-xs text-red-400">{r.error}</div> : <a className="text-xs text-[#A8C97F]" href={r.publicUrl} target="_blank" rel="noreferrer">Open</a>}
                </div>
                {r.path && <div className="text-xs text-[#888] mt-1">{r.path}</div>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
