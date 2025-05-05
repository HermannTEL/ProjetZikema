import { useState, useEffect, forwardRef } from "react";
import PropTypes from "prop-types";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
  Quote
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Input,
  Label
} from "../ui";

/**
 * A rich text editor component for enhanced content editing
 */
const Editor = forwardRef(({ value, onChange, placeholder = "Commencez à écrire..." }, ref) => {
  const [editorHtml, setEditorHtml] = useState("");
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [selection, setSelection] = useState(null);
  
  // Sync the internal state with the provided value
  useEffect(() => {
    if (value !== undefined) {
      setEditorHtml(value);
    }
  }, [value]);

  // Update the parent form when editor content changes
  const handleChange = (html) => {
    setEditorHtml(html);
    onChange && onChange(html);
  };

  // Capture the current selection before opening the link dialog
  const saveSelection = () => {
    if (window.getSelection) {
      const sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        setSelection(sel.getRangeAt(0));
        setLinkText(sel.toString());
      }
    }
    return null;
  };

  // Restore the saved selection
  const restoreSelection = () => {
    if (selection) {
      if (window.getSelection) {
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(selection);
      }
    }
  };

  // Execute a formatting command on the editor
  const execCommand = (command, value = null) => {
    document.execCommand('styleWithCSS', false, true);
    document.execCommand(command, false, value);
    handleChange(document.getElementById('rich-editor').innerHTML);
  };

  // Handle the insertion of a link
  const handleInsertLink = () => {
    restoreSelection();
    if (linkUrl) {
      execCommand('createLink', linkUrl);
      setShowLinkDialog(false);
      setLinkUrl("");
      setLinkText("");
    }
  };

  // Format buttons with tooltips
  const FormatButton = ({ command, icon: Icon, tooltip, value }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => execCommand(command, value)}
            className="h-8 w-8"
          >
            <Icon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="bg-muted/50 p-1 border-b flex flex-wrap gap-1">
        <FormatButton command="bold" icon={Bold} tooltip="Gras" />
        <FormatButton command="italic" icon={Italic} tooltip="Italique" />
        <FormatButton command="underline" icon={Underline} tooltip="Souligné" />
        
        <div className="w-px h-6 bg-border mx-1 my-auto" />
        
        <FormatButton command="formatBlock" icon={Heading1} tooltip="Titre 1" value="<h1>" />
        <FormatButton command="formatBlock" icon={Heading2} tooltip="Titre 2" value="<h2>" />
        <FormatButton command="formatBlock" icon={Heading3} tooltip="Titre 3" value="<h3>" />
        <FormatButton command="formatBlock" icon={Quote} tooltip="Citation" value="<blockquote>" />
        
        <div className="w-px h-6 bg-border mx-1 my-auto" />
        
        <FormatButton command="insertUnorderedList" icon={List} tooltip="Liste à puces" />
        <FormatButton command="insertOrderedList" icon={ListOrdered} tooltip="Liste numérotée" />
        
        <div className="w-px h-6 bg-border mx-1 my-auto" />
        
        <FormatButton command="justifyLeft" icon={AlignLeft} tooltip="Aligner à gauche" />
        <FormatButton command="justifyCenter" icon={AlignCenter} tooltip="Centrer" />
        <FormatButton command="justifyRight" icon={AlignRight} tooltip="Aligner à droite" />
        
        <div className="w-px h-6 bg-border mx-1 my-auto" />
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  saveSelection();
                  setShowLinkDialog(true);
                }}
              >
                <Link className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Insérer un lien</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div
        id="rich-editor"
        ref={ref}
        contentEditable
        className="min-h-[200px] p-3 focus:outline-none"
        onInput={(e) => handleChange(e.target.innerHTML)}
        dangerouslySetInnerHTML={{ __html: editorHtml }}
        placeholder={placeholder}
      />

      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Insérer un lien</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="link-text" className="text-right">
                Texte
              </Label>
              <Input
                id="link-text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="link-url" className="text-right">
                URL
              </Label>
              <Input
                id="link-url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://..."
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setShowLinkDialog(false)}>
              Annuler
            </Button>
            <Button type="button" onClick={handleInsertLink}>Insérer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
});

Editor.displayName = "Editor";

Editor.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string
};

export { Editor };