import * as React from "react";
import { useUIStore } from "../../store/uiStore";
import { useToast } from "../../components/ui";
import { Input } from "../../components/forms";
import { Settings as SettingsIcon, UploadCloud, RefreshCw, Save, Info } from "lucide-react";

export const Settings = () => {
  const { systemName, systemLogo, setSystemName, setSystemLogo } = useUIStore();
  const { toast } = useToast();

  const [nameInput, setNameInput] = React.useState(systemName);
  const [logoInput, setLogoInput] = React.useState<string | null>(systemLogo);

  // Sync state with store updates
  React.useEffect(() => {
    setNameInput(systemName);
    setLogoInput(systemLogo);
  }, [systemName, systemLogo]);

  // Handle Logo Upload and conversion to base64
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File size too large",
          description: "Please select an image smaller than 2MB.",
        } as any);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoInput(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!nameInput.trim()) {
      toast({
        variant: "destructive",
        title: "Validation error",
        description: "Portal name cannot be empty.",
      } as any);
      return;
    }

    setSystemName(nameInput.trim());
    setSystemLogo(logoInput);

    toast({
      title: "Settings saved",
      description: "System brand name and logo updated successfully.",
    } as any);
  };

  const handleReset = () => {
    setSystemName("HRIS MANAGEMENT");
    setSystemLogo(null);
    setNameInput("HRIS MANAGEMENT");
    setLogoInput(null);

    toast({
      title: "Reset to defaults",
      description: "System name and logo reverted to standard values.",
    } as any);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-zinc-800 text-[#282d8d] dark:text-indigo-400">
          <SettingsIcon className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white">Settings</h1>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">Configure your global system preferences</p>
        </div>
      </div>

      {/* Main Settings Panel */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl p-6 shadow-sm space-y-6">
        <div>
          <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Branding & Identity</h2>
          <p className="text-[10px] text-zinc-400">Customize the title and logo displayed in the portal sidebar.</p>
        </div>

        <div className="space-y-5">
          {/* System Name Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
              Portal Name
            </label>
            <Input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="e.g. HRIS MANAGEMENT"
              className="h-12 border-zinc-200 dark:border-zinc-800 focus-visible:ring-indigo-500 rounded-xl font-medium text-sm"
            />
          </div>

          {/* Logo Upload */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
              Portal Logo
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-6 p-5 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/30 dark:bg-zinc-900/30">
              
              {/* Preview Circle */}
              <div className="flex flex-col items-center gap-1">
                <span className="text-[9px] font-bold text-zinc-400 uppercase mb-1">Preview</span>
                {logoInput ? (
                  <img
                    src={logoInput}
                    alt="Logo preview"
                    className="h-20 w-20 rounded-full object-cover border-2 border-indigo-100 dark:border-zinc-800 shadow-sm"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 dark:bg-zinc-800 text-[#282d8d] dark:text-indigo-400 font-bold border-2 border-dashed border-indigo-200/50">
                    No Logo
                  </div>
                )}
              </div>

              {/* Upload Action */}
              <div className="flex-1 space-y-2 text-center sm:text-left w-full">
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Upload a custom logo image (PNG, JPG, SVG). Recommendation: Square aspect ratio, under 2MB.
                </p>
                <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                  <label className="flex items-center gap-2 text-xs bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-350 font-bold px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-xl cursor-pointer shadow-sm transition-colors">
                    <UploadCloud className="h-4 w-4" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                  </label>
                  {logoInput && (
                    <button
                      onClick={() => setLogoInput(null)}
                      className="text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 font-bold px-3 py-2 rounded-xl transition-colors"
                    >
                      Remove Logo
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="flex gap-2.5 p-4 rounded-xl bg-blue-50/40 dark:bg-zinc-800/30 border border-blue-100/50 dark:border-zinc-800">
          <Info className="h-4.5 w-4.5 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
            These updates are saved locally in your browser storage and will be immediately reflected in your sidebar header.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 font-bold px-4 py-2 rounded-xl transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Reset Defaults</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 text-xs bg-[#282d8d] hover:bg-indigo-900 text-white font-bold px-5 py-2.5 rounded-xl shadow-md shadow-indigo-950/10 transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </button>
        </div>

      </div>

    </div>
  );
};
