import React, { useRef, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from './button';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { Input } from './input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog';
import { Label } from './label';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  height?: string;
  enableImageUpload?: boolean;
  onImageUpload?: (file: File) => Promise<string>; // Returns image URL
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Saisissez votre texte ici...",
  className = "",
  height = "300px",
  enableImageUpload = true,
  onImageUpload
}: RichTextEditorProps) {
  const quillRef = useRef<ReactQuill>(null);
  const [imageUrl, setImageUrl] = React.useState('');
  const [showImageDialog, setShowImageDialog] = React.useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Gestionnaire pour le clic sur le bouton image de la toolbar
  const handleImageClick = () => {
    setShowImageDialog(true);
  };

  // Configuration des modules Quill
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'align': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        ['blockquote', 'code-block'],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: handleImageClick
      }
    },
    clipboard: {
      matchVisual: false,
    }
  }), [handleImageClick]);

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'color', 'background',
    'align', 'code-block'
  ];



  // Upload de fichier image
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérifier que c'est une image
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image');
      return;
    }

    try {
      let imageUrl: string;
      
      if (onImageUpload) {
        // Utiliser la fonction d'upload personnalisée
        imageUrl = await onImageUpload(file);
      } else {
        // Convertir en base64 par défaut
        imageUrl = await fileToBase64(file);
      }

      insertImageIntoEditor(imageUrl);
      setShowImageDialog(false);
    } catch (error) {
      console.error('Erreur lors de l\'upload de l\'image:', error);
      alert('Erreur lors de l\'upload de l\'image');
    }
  };

  // Insertion d'image par URL
  const handleImageUrlInsert = () => {
    if (!imageUrl.trim()) {
      alert('Veuillez saisir une URL d\'image');
      return;
    }

    insertImageIntoEditor(imageUrl);
    setImageUrl('');
    setShowImageDialog(false);
  };

  // Insérer l'image dans l'éditeur
  const insertImageIntoEditor = (url: string) => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const range = quill.getSelection();
      const index = range ? range.index : quill.getLength();
      quill.insertEmbed(index, 'image', url);
      quill.setSelection(index + 1);
    }
  };

  // Convertir un fichier en base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className={`rich-text-editor ${className}`}>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        modules={modules}
        formats={formats}
        style={{ height }}
      />

      {/* Dialog pour l'insertion d'images */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Insérer une image</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Upload de fichier */}
            <div className="space-y-2">
              <Label>Uploader un fichier</Label>
              <div className="flex items-center gap-2">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choisir un fichier
                </Button>
              </div>
            </div>

            {/* Séparateur */}
            <div className="flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-3 text-sm text-gray-500">ou</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* URL d'image */}
            <div className="space-y-2">
              <Label htmlFor="image-url">URL de l'image</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="image-url"
                  type="url"
                  placeholder="https://exemple.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={handleImageUrlInsert}
                  disabled={!imageUrl.trim()}
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Insérer
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <style dangerouslySetInnerHTML={{
        __html: `
          .rich-text-editor .ql-editor {
            min-height: ${height};
            font-family: inherit;
          }
          
          .rich-text-editor .ql-toolbar {
            border-top: 1px solid #ccc;
            border-left: 1px solid #ccc;
            border-right: 1px solid #ccc;
            border-radius: 8px 8px 0 0;
          }
          
          .rich-text-editor .ql-container {
            border-bottom: 1px solid #ccc;
            border-left: 1px solid #ccc;
            border-right: 1px solid #ccc;
            border-radius: 0 0 8px 8px;
          }
          
          .rich-text-editor .ql-editor img {
            max-width: 100%;
            height: auto;
            border-radius: 4px;
          }
          
          .rich-text-editor .ql-editor.ql-blank::before {
            font-style: normal;
            color: #9ca3af;
          }
        `
      }} />
    </div>
  );
} 