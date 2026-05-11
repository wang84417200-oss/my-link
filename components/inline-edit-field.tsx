"use client";

import { useState, useEffect, useRef } from "react";
import { RiPencilLine, RiCheckLine, RiCloseLine, RiLoader4Line } from "@remixicon/react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface InlineEditFieldProps {
  value: string;
  onSave: (newValue: string) => Promise<void>;
  label?: string;
  placeholder?: string;
  className?: string;
  textClassName?: string;
  prefix?: string;
  validate?: (value: string) => string | null | Promise<string | null>;
  multiline?: boolean;
}

export function InlineEditField({
  value,
  onSave,
  label,
  placeholder,
  className,
  textClassName,
  prefix,
  validate,
  multiline = false,
}: InlineEditFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleStartEdit = () => {
    setEditValue(value);
    setError(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(value);
    setError(null);
  };

  const handleSave = async () => {
    if (editValue === value) {
      setIsEditing(false);
      return;
    }

    if (validate) {
      const validationError = await validate(editValue);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    setIsSaving(true);
    try {
      // 서버 응답을 기다리지 않고 즉시 편집 모드를 닫아 낙관적 업데이트 효과를 극대화합니다.
      onSave(editValue).catch((err) => {
        // 에러 발생 시 필요하다면 여기서 추가 처리를 할 수 있지만, 
        // TanStack Query 훅에서 이미 롤백 처리를 하고 있습니다.
        console.error("Inline edit save error:", err);
      });
      
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError("저장 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className={cn("flex flex-col gap-1 w-full animate-in fade-in zoom-in-95 duration-200", className)}>
        {label && <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">{label}</label>}
        <div className="relative flex items-center group">
          {prefix && (
            <span className="absolute left-3 text-muted-foreground/60 font-bold pointer-events-none">
              {prefix}
            </span>
          )}
          <Input
            ref={inputRef}
            value={editValue}
            onChange={(e) => {
              setEditValue(e.target.value);
              setError(null);
            }}
            onKeyDown={handleKeyDown}
            onBlur={(e) => {
              // RelatedTarget check to prevent blur when clicking save/cancel buttons
              if (!e.relatedTarget?.getAttribute("data-edit-button")) {
                handleSave();
              }
            }}
            placeholder={placeholder}
            className={cn(
              "h-10 bg-muted/30 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-semibold rounded-lg",
              prefix && "pl-8",
              error && "border-destructive focus:border-destructive focus:ring-destructive/10"
            )}
            disabled={isSaving}
          />
          <div className="absolute right-1 flex items-center gap-0.5">
            <button
              data-edit-button="true"
              onClick={handleSave}
              disabled={isSaving}
              className="p-1.5 text-primary hover:bg-primary/10 rounded-md transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <RiLoader4Line className="h-4 w-4 animate-spin" />
              ) : (
                <RiCheckLine className="h-4 w-4" />
              )}
            </button>
            <button
              data-edit-button="true"
              onClick={handleCancel}
              disabled={isSaving}
              className="p-1.5 text-muted-foreground hover:bg-muted rounded-md transition-colors disabled:opacity-50"
            >
              <RiCloseLine className="h-4 w-4" />
            </button>
          </div>
        </div>
        {error && (
          <p className="text-[11px] font-bold text-destructive px-1 animate-reveal">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "group relative flex items-center justify-center cursor-pointer transition-all rounded-lg hover:bg-primary/5 px-2 -mx-2 py-1",
        className
      )}
      onClick={handleStartEdit}
    >
      <div className={cn("relative flex items-center gap-1.5", textClassName)}>
        {prefix && <span className="text-muted-foreground/60 font-bold">{prefix}</span>}
        <span>{value || placeholder}</span>
        <RiPencilLine className="h-3.5 w-3.5 opacity-0 group-hover:opacity-40 transition-opacity text-primary shrink-0" />
      </div>
    </div>
  );
}
