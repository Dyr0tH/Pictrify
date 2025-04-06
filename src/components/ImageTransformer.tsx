"use client";
import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Upload, Download, Image as ImageIcon, AlertCircle } from "lucide-react";
import { supabase } from "@/utils/supabase/supabase-client";

interface ImageTransformerProps {
  userCredits: number;
  onCreditsUpdate: () => Promise<void>;
}

const artStyles = [
    {
        id: "studio-ghibli",
        name: "Studio Ghibli",
        description: "Transform your image into a magical Studio Ghibli style artwork"
    },
    {
        id: "anime",
        name: "Anime",
        description: "Convert your photo into an anime-style illustration"
    },
    {
        id: "genshin",
        name: "Genshin Impact",
        description: "Apply the stunning art style of Genshin Impact"
    },
    {
        id: "gta",
        name: "GTA V",
        description: "Transform your image into the Grand Theft Auto V art style"
    }
];

export default function ImageTransformer({ userCredits, onCreditsUpdate }: ImageTransformerProps) {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [selectedStyle, setSelectedStyle] = useState<string>("");
    const [transformedImage, setTransformedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [userPrompt, setUserPrompt] = useState<string>("");

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserId(user.id);
            }
        };
        getUser();
    }, []);

    // Clean up preview URL when component unmounts
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            // Revoke previous URL if it exists
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            
            const file = acceptedFiles[0];
            
            // Check file size - Vercel has a 4.5MB limit on Hobby plan
            const fileSizeMB = file.size / (1024 * 1024);
            if (fileSizeMB > 4) {
                setError(`Image size (${fileSizeMB.toFixed(2)}MB) exceeds the 4MB limit. Please upload a smaller image.`);
                return;
            }
            
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            setTransformedImage(null);
            setError(null);
        }
    }, [previewUrl]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp']
        },
        maxFiles: 1,
        maxSize: 4 * 1024 * 1024, // 4MB limit
        onDropRejected: (fileRejections) => {
            const error = fileRejections[0]?.errors[0];
            if (error?.code === 'file-too-large') {
                setError('Image exceeds the 4MB size limit. Please upload a smaller image or compress it first.');
            } else {
                setError('Invalid file. Please upload a valid image file.');
            }
        }
    });

    const handleTransform = async () => {
        if (!selectedImage || !selectedStyle || !userId) {
            setError("Please select both an image and a style");
            return;
        }

        if (userCredits < 2) {
            setError("Insufficient credits. Please purchase more credits to continue.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("image", selectedImage);
            formData.append("style", selectedStyle);
            formData.append("userId", userId);
            formData.append("userPrompt", userPrompt);

            const response = await fetch("/api/transform", {
                method: "POST",
                body: formData
            });

            // First check if the response is ok before trying to parse JSON
            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error response:", errorText);
                throw new Error(`API error (${response.status}): ${errorText.substring(0, 100)}`);
            }

            let data;
            try {
                data = await response.json();
            } catch (jsonError) {
                console.error("JSON parsing error:", jsonError);
                throw new Error("Failed to parse API response. The server may be experiencing issues.");
            }

            setTransformedImage(data.imageUrl);
            
            // Call the onCreditsUpdate callback to update credits in parent component
            await onCreditsUpdate();
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred while transforming the image");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = async () => {
        if (!transformedImage) return;
        
        try {
            const response = await fetch(`/api/downloadImage?url=${encodeURIComponent(transformedImage)}`);
            if (!response.ok) {
                throw new Error("Failed to download image");
            }
    
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
    
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = "download.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error("Download error:", error);
        }


        // try {
        //     // Fetch the image
        //     const response = await fetch(transformedImage);
            
        //     if (!response.ok) {
        //         throw new Error('Failed to fetch the image');
        //     }
            
        //     const blob = await response.blob();
            
        //     // Create a blob URL
        //     const blobUrl = URL.createObjectURL(blob);
            
        //     // Create a download link
        //     const link = document.createElement("a");
            
        //     // Generate a unique filename with timestamp
        //     const timestamp = new Date().getTime();
        //     const filename = `transformed-${timestamp}.png`;
            
        //     // Set download attributes
        //     link.href = blobUrl;
        //     link.download = filename;
            
        //     // Trigger download
        //     document.body.appendChild(link);
        //     link.click();
            
        //     // Clean up
        //     document.body.removeChild(link);
        //     setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
        // } catch (err) {
        //     console.error('Download error:', err);
        //     setError("Failed to download image. Please try again.");
        // }
    };

    return (
        <div className="space-y-6">
            {/* Image Upload Section */}
            <Card className="bg-[#0A0A0A] border border-[#FF3366]/20 shadow-lg neon-glow-red">
                <CardHeader>
                    <CardTitle className="text-white text-lg flex items-center justify-between">
                        <span>Upload Your Image</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                            ${isDragActive 
                                ? "border-[#FF3366] bg-[#FF3366]/10" 
                                : "border-[#FF3366]/20 hover:border-[#FF3366] hover:bg-[#FF3366]/5"}`}
                    >
                        <input {...getInputProps()} />
                        
                        {selectedImage && previewUrl ? (
                            <div className="space-y-4">
                                <img
                                    src={previewUrl}
                                    alt="Selected"
                                    className="max-h-64 mx-auto rounded-lg"
                                />
                                <div className="relative group">
                                    <p className="text-[#94A3B8] max-w-full truncate px-2" title={selectedImage.name}>
                                        {selectedImage.name}
                                    </p>
                                    <div className="absolute left-0 right-0 -bottom-8 hidden group-hover:block bg-[#0A0A0A] border border-[#334155]/50 p-1 rounded-md z-10 text-xs text-[#94A3B8] break-all">
                                        {selectedImage.name}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <Upload className="h-12 w-12 mx-auto text-[#FF3366]" />
                                <div>
                                    <p className="text-white font-medium">Drag and drop your image here</p>
                                    <p className="text-[#94A3B8] text-sm mt-1">or click to browse</p>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Style Selection Section */}
            <Card className="bg-[#0A0A0A] border border-[#FF3366]/20 shadow-lg neon-glow-red">
                <CardHeader>
                    <CardTitle className="text-white text-lg">Choose Your Style</CardTitle>
                </CardHeader>
                <CardContent>
                    <RadioGroup
                        value={selectedStyle}
                        onValueChange={setSelectedStyle}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                        {artStyles.map((style) => (
                            <div
                                key={style.id}
                                className={`relative flex cursor-pointer rounded-lg border p-4 transition-all
                                    ${selectedStyle === style.id
                                        ? "border-[#FF3366] bg-[#FF3366]/10"
                                        : "border-[#FF3366]/20 hover:border-[#FF3366] hover:bg-[#FF3366]/5"}`}
                                onClick={() => setSelectedStyle(style.id)}
                            >
                                <RadioGroupItem
                                    value={style.id}
                                    id={style.id}
                                    className="sr-only"
                                />
                                <div className="flex w-full items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="text-sm">
                                            <label
                                                htmlFor={style.id}
                                                className="font-medium text-white cursor-pointer"
                                            >
                                                {style.name}
                                            </label>
                                            <p className="text-[#94A3B8]">{style.description}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </RadioGroup>
                </CardContent>
            </Card>

            {/* Custom Prompt Section */}
            <Card className="bg-[#0A0A0A] border border-[#FF3366]/20 shadow-lg neon-glow-red">
                <CardHeader>
                    <CardTitle className="text-white text-lg">Custom Prompt (Optional)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <p className="text-[#94A3B8] text-sm">Add custom instructions to guide the AI transformation</p>
                        <textarea
                            value={userPrompt}
                            onChange={(e) => setUserPrompt(e.target.value)}
                            placeholder="Example: 'Add cherry blossoms in the background' or 'Make it look like sunset'"
                            className="w-full h-24 p-3 rounded-lg bg-[#0A0A0A] border border-[#FF3366]/20 text-white focus:border-[#FF3366] focus:ring-1 focus:ring-[#FF3366] transition-colors resize-none placeholder:text-[#94A3B8]/60"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Transform Button */}
            <div className="flex justify-center">
                <Button
                    onClick={handleTransform}
                    disabled={!selectedImage || !selectedStyle || isLoading || userCredits < 2}
                    className={`w-full md:w-auto px-8 py-6 text-lg font-medium transition-all duration-300
                        ${!selectedImage || !selectedStyle || isLoading || userCredits < 2
                            ? "bg-[#FF3366]/20 text-[#94A3B8] cursor-not-allowed"
                            : "bg-gradient-to-r from-[#FF3366] to-[#FF33A8] text-white hover:shadow-lg hover:shadow-[#FF3366]/20"}`}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Transforming...
                        </>
                    ) : (
                        "Transform Image"
                    )}
                </Button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg">
                    <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 mr-2" />
                        <span>{error}</span>
                    </div>
                </div>
            )}

            {/* Transformed Image Section */}
            {transformedImage && (
                <Card className="bg-[#0A0A0A] border border-[#FF3366]/20 shadow-lg neon-glow-red">
                    <CardHeader>
                        <CardTitle className="text-white text-lg">Transformed Image</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="relative w-full max-w-2xl mx-auto">
                            <img
                                src={transformedImage}
                                alt="Transformed"
                                className="rounded-lg w-full h-full object-contain"
                            />
                        </div>
                        
                        <div className="flex justify-center mt-6">
                            <Button
                                onClick={handleDownload}
                                className="bg-gradient-to-r from-[#FF3366] to-[#FF33A8] text-white hover:shadow-lg hover:shadow-[#FF3366]/20 hover:from-[#FF33A8] hover:to-[#FF3366] transition-all duration-300 px-8 py-3 text-lg font-medium"
                            >
                                Download Image
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
} 