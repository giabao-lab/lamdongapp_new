"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "./button"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import { Alert, AlertDescription } from "./alert"

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  disabled?: boolean
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [preview, setPreview] = useState<string>(value || "")
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")

  // Cloudinary config
  const CLOUDINARY_CLOUD_NAME = "dqh2axlbb"
  const CLOUDINARY_UPLOAD_PRESET = "lamdongapp"

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    setError("")
    setUploading(true)

    try {
      // Create preview
      const reader = new FileReader()
      reader.onload = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Upload to Cloudinary
      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      )

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      onChange(data.secure_url)
      setPreview(data.secure_url)
    } catch (err) {
      console.error("Upload error:", err)
      setError("Không thể upload hình ảnh. Vui lòng thử lại.")
    } finally {
      setUploading(false)
    }
  }, [onChange, CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    },
    maxFiles: 1,
    disabled: disabled || uploading,
  })

  const handleRemove = () => {
    setPreview("")
    onChange("")
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {preview ? (
        <div className="relative">
          <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-border bg-muted">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-colors
            ${isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/25"}
            ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-primary"}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            {uploading ? (
              <>
                <Upload className="h-10 w-10 text-muted-foreground animate-pulse" />
                <p className="text-sm text-muted-foreground">Đang upload...</p>
              </>
            ) : (
              <>
                <ImageIcon className="h-10 w-10 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    {isDragActive ? "Thả hình ảnh vào đây" : "Kéo thả hình ảnh vào đây"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    hoặc click để chọn file
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, GIF tối đa 10MB
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
