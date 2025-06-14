"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, AlertCircle, Plus } from "lucide-react";
import { toast } from "sonner";

// Color options with their hex codes
const colorOptions = [
  {
    name: "Primary",
    value: "#2b7fff",
    bgClass: "bg-primary",
    ringClass: "ring-primary",
  },
  {
    name: "Red",
    value: "#EF4444",
    bgClass: "bg-red-500",
    ringClass: "ring-red-500",
  },
  {
    name: "Pink",
    value: "#EC4899",
    bgClass: "bg-pink-500",
    ringClass: "ring-pink-500",
  },
  {
    name: "Yellow",
    value: "#F59E0B",
    bgClass: "bg-amber-500",
    ringClass: "ring-amber-500",
  },
];

function AddStickyNoteForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [isOpen, setIsOpen] = useState(false);

  const handleAddStickyNote = async (formData: FormData) => {
    const content = formData.get("content") as string;

    if (!content?.trim()) {
      setError("Please enter some content for your sticky note");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/sticky-notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: content.trim(),
          color: selectedColor.value,
        }),
      });

      if (res.ok) {
        toast.success("Sticky note added");
        setSelectedColor(colorOptions[0]);
        setIsOpen(false);
        window.location.reload();
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create sticky note");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedColor(colorOptions[0]);
    setError(null);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button className="gap-2 text-white">
          <Plus className="h-4 w-4" />
          Add Note
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">
            Create Sticky Note
          </DialogTitle>
        </DialogHeader>

        <form className="space-y-4 pt-2" action={handleAddStickyNote}>
          {error && (
            <Alert variant="destructive" className="py-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="content" className="text-sm font-medium">
              Content
            </Label>
            <Textarea
              name="content"
              id="content"
              placeholder="Write your note here..."
              className="min-h-[100px] resize-none"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Color</Label>
            <div className="flex gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  disabled={loading}
                  className={`
                    w-8 h-8 rounded-full border-2 transition-all duration-200 
                    ${color.bgClass} 
                    ${
                      selectedColor.value === color.value
                        ? `ring-2 ${color.ringClass} ring-offset-2 border-white dark:border-gray-800`
                        : "border-gray-300 dark:border-gray-600 hover:scale-110"
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                  title={color.name}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Selected: {selectedColor.name}
            </p>
          </div>

          <Button
            onClick={() => {
              const formData = new FormData();
              const textarea = document.getElementById(
                "content"
              ) as HTMLTextAreaElement;
              formData.append("content", textarea.value);
              handleAddStickyNote(formData);
            }}
            disabled={loading}
            className="flex-1 text-white w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Note"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddStickyNoteForm;
