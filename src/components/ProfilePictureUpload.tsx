import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Loader2 } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { db, auth } from '../config/firebase';
import { toast } from 'sonner';
import { createPortal } from 'react-dom';

interface ProfilePictureUploadProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhotoURL: string | null;
}

// Add image compression function
const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions while maintaining aspect ratio
        const maxDimension = 500;
        if (width > height && width > maxDimension) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        } else if (height > maxDimension) {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }

        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Compress to JPEG with 0.8 quality
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

export function ProfilePictureUpload({ isOpen, onClose, currentPhotoURL }: ProfilePictureUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update handleFileSelect to use compression
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      const compressedImage = await compressImage(file);
      setPreviewUrl(compressedImage);
    }
  };

  const handleUpload = async () => {
    if (!previewUrl || !auth.currentUser) return;

    try {
      setIsUploading(true);
      
      // Store the base64 image in Firestore
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await setDoc(userRef, {
        fullPhotoURL: previewUrl,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      // Create a shorter URL for Auth profile
      const shortPhotoURL = `https://firestore.googleapis.com/v1/projects/fortniteshop-site/databases/(default)/documents/users/${auth.currentUser.uid}`;
      
      // Update auth profile with the shorter URL
      await updateProfile(auth.currentUser, { photoURL: shortPhotoURL });
      
      toast.success('Profile picture updated successfully');
      onClose();
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast.error('Failed to update profile picture');
    } finally {
      setIsUploading(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-black/5 dark:border-white/5">
              <h2 className="text-xl font-bold text-black/90 dark:text-white">Update Profile Picture</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5 text-black/70 dark:text-white/70" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex justify-center">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-black/5 dark:bg-white/5">
                    <img 
                      src={previewUrl || currentPhotoURL || ''}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <label 
                    className="absolute inset-0 flex items-center justify-center bg-black/50 
                             opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full"
                  >
                    <Camera className="w-8 h-8 text-white" />
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 p-3 rounded-xl border border-black/10 dark:border-white/10 
                           hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!previewUrl || isUploading}
                  className="flex-1 p-3 rounded-xl bg-blue-500 text-white 
                           disabled:opacity-50 disabled:cursor-not-allowed
                           hover:bg-blue-600 transition-colors"
                >
                  {isUploading ? (
                    <Loader2 className="w-5 h-5 mx-auto animate-spin" />
                  ) : (
                    'Upload'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
} 