import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth, useMissionCompletion } from "@/hooks/queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { DaumPostCodeButton } from "./daum-post-code";
import { MissionFormData, missionSchema } from "../_type";
import { toast } from "sonner";
import { missionsApi } from "@/lib/api";
import { uploadFileToPresignedUrl } from "@/lib/presigned-upload";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface MissionSubmitDialogProps {
  missionId: number;
  missionTitle?: string;
}
export const MissionSubmitDialog = (props: MissionSubmitDialogProps) => {
  const { missionId, missionTitle } = props;

  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const form = useForm<MissionFormData>({
    resolver: zodResolver(missionSchema),
    mode: "onChange",
    defaultValues: {
      imageUrls: [],
    },
  });

  const uploadedImageUrls = form.watch("imageUrls") ?? [];

  const [previewImageUrls, setPreviewImageUrls] = useState<string[]>([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const completionMutation = useMissionCompletion({
    onSuccess: (data) => {
      toast.success("미션 인증을 성공했습니다!");
      setIsDialogOpen(false);
      router.push(`/missions/${data.missionHistoryId}`);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "미션 인증에 실패했습니다. 잠시 후 다시 시도해주세요."
      );
    },
  });

  const handleResetImages = (options?: { markDirty?: boolean }) => {
    previewImageUrls.forEach((url) => URL.revokeObjectURL(url));
    setPreviewImageUrls([]);
    form.setValue("imageUrls", [], {
      shouldDirty: options?.markDirty ?? true,
      shouldValidate: options?.markDirty ?? true,
    });
    setImageUploadError(null);
  };

  const handleRemoveImage = (previewUrl: string) => {
    const index = previewImageUrls.findIndex((url) => url === previewUrl);
    if (index === -1) {
      return;
    }

    URL.revokeObjectURL(previewUrl);

    const nextPreviewUrls = previewImageUrls.filter((_, i) => i !== index);
    setPreviewImageUrls(nextPreviewUrls);

    const imageUrls = form.getValues("imageUrls") ?? [];
    const nextImageUrls = imageUrls.filter((_, i) => i !== index);
    form.setValue("imageUrls", nextImageUrls, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setImageUploadError(null);
  };

  const handleFormChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name !== "images" || !e.target.files) {
      return;
    }

    const existingUrls = form.getValues("imageUrls") ?? [];

    if (existingUrls.length >= 3) {
      toast.error("이미지는 최대 3장까지 업로드할 수 있습니다.");
      e.target.value = "";
      return;
    }

    const remainingSlots = Math.max(0, 3 - existingUrls.length);
    const incomingFiles = Array.from(e.target.files);
    const filesArray = incomingFiles.slice(0, remainingSlots);

    if (incomingFiles.length > remainingSlots) {
      toast.warning(
        `이미 ${existingUrls.length}장의 이미지를 업로드했습니다. 추가로 ${remainingSlots}장만 업로드할 수 있습니다.`
      );
    }

    if (filesArray.length === 0) {
      return;
    }

    setImageUploadError(null);
    setIsUploadingImages(true);

    const newPreviewUrls: string[] = [];

    try {
      const uploadedUrls: string[] = [];

      for (const file of filesArray) {
        const objectUrl = URL.createObjectURL(file);
        newPreviewUrls.push(objectUrl);
        setPreviewImageUrls((prev) => [...prev, objectUrl]);

        const presignedResponse = await missionsApi.getUploadPresignedUrl({
          fileName: file.name,
          fileType: file.type || "image/jpeg",
        });

        await uploadFileToPresignedUrl({
          uploadUrl: presignedResponse.data.uploadUrl,
          file,
          contentType: file.type || "image/jpeg",
        });

        uploadedUrls.push(presignedResponse.data.fileUrl);
      }

      form.setValue("imageUrls", [...existingUrls, ...uploadedUrls], {
        shouldDirty: true,
        shouldValidate: true,
      });
      toast.success("이미지가 업로드되었습니다.");
    } catch (error) {
      console.error("Failed to upload mission images", error);
      setImageUploadError(
        error instanceof Error
          ? error.message
          : "이미지를 업로드하지 못했습니다."
      );
      newPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
      setPreviewImageUrls((prev) =>
        prev.filter((url) => !newPreviewUrls.includes(url))
      );
    } finally {
      setIsUploadingImages(false);
      e.target.value = "";
    }
  };

  const handleSubmit = (data: MissionFormData) => {
    if (!isLoggedIn) {
      toast.error("미션 인증을 위해 로그인해주세요.");
      return;
    }

    if (isUploadingImages) {
      toast.error("이미지 업로드가 진행 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    setImageUploadError(null);

    completionMutation.mutate({
      missionId,
      formData: {
        content: data.content,
        latitude: data.latitude!,
        longitude: data.longitude!,
        imageUrls: data.imageUrls,
      },
    });
    form.reset();
    handleResetImages({ markDirty: false });
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
      handleResetImages({ markDirty: false });
      setIsUploadingImages(false);
      setImageUploadError(null);
    } else {
      setImageUploadError(null);
    }
    setIsDialogOpen(open);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
      {isLoggedIn ? (
        <DialogTrigger asChild>
          <Button
            variant="secondary"
            className="w-full flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            미션 인증하기
          </Button>
        </DialogTrigger>
      ) : (
        <Button
          variant="secondary"
          className="w-full flex items-center gap-2"
          onClick={() => {
            if (!isLoggedIn) {
              toast.error("미션 인증을 위해 로그인해주세요.");
              return;
            }
          }}
        >
          <Upload className="h-4 w-4" />
          미션 인증하기
        </Button>
      )}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{missionTitle ? `${missionTitle} 미션 제출` : '미션 제출'}</DialogTitle>
          <DialogDescription>
            미션을 제출하시겠습니까? 제출 후에는 수정할 수 없습니다.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-gray-700"
                htmlFor="content"
              >
                활동 내용
              </label>
              <Textarea
                id="content"
                placeholder="오늘 실천한 친환경 활동을 기록해보세요."
                minLength={5}
                rows={4}
                required
                {...form.register("content")}
              />
            </div>

            <div>
              <label
                className="text-sm font-medium text-gray-700"
                htmlFor="content"
              >
                인증 주소
              </label>
              <DaumPostCodeButton form={form} />
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-gray-700"
                htmlFor="images"
              >
                인증 사진 업로드 (최대 3장)
              </label>
              <Input
                id="images"
                name="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFormChange}
                disabled={isUploadingImages}
              />
              <div className="mt-2 flex gap-2">
                {previewImageUrls.map((url, index) => (
                  <div
                    key={url}
                    className="relative h-20 w-20 overflow-hidden rounded-md border"
                  >
                    <X
                      className="absolute right-1 top-1 h-4 w-4 cursor-pointer rounded-full bg-white text-gray-600 hover:bg-gray-100"
                      onClick={() => handleRemoveImage(url)}
                    />
                    <Image
                      width={80}
                      height={80}
                      src={url}
                      alt={`업로드된 이미지 ${index + 1}`}
                      className="h-full w-full object-cover"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
              {uploadedImageUrls.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {uploadedImageUrls.length}개의 사진이 업로드되었습니다.
                </p>
              )}
              {isUploadingImages && (
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  이미지 업로드 중입니다...
                </p>
              )}
              {imageUploadError ? (
                <p className="text-xs text-destructive">{imageUploadError}</p>
              ) : null}
              {uploadedImageUrls.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => handleResetImages()}
                  disabled={isUploadingImages}
                >
                  업로드 초기화
                </Button>
              )}
              {form.formState.errors.imageUrls && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.imageUrls.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Button
                type="submit"
                disabled={completionMutation.isPending || isUploadingImages}
                className="flex items-center gap-2"
              >
                {(completionMutation.isPending || isUploadingImages) && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                미션 인증 올리기
              </Button>
              <Link
                href="/missions"
                className="text-sm text-emerald-700 hover:underline"
              >
                다른 사용자 인증 보러 가기 →
              </Link>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
