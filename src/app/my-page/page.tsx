"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, PenSquare, Share2 } from "lucide-react";
import { useCurrentUser } from "@/hooks/queries/useAuth";
import { useUpdateUserProfile } from "@/hooks/queries/useUser";
import { LoginRequired } from "@/components/auth/login-required";
import { tokenStorage } from "@/lib/api/auth";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { missionsApi } from "@/lib/api";

type ProfileFormState = {
  nickname: string;
  birthYear: string;
  gender: "male" | "female" | "";
  address: string;
  profileImagePreview: string | null;
  uploadedProfileImageUrl: string | null;
  removeProfileImage: boolean;
};

const createFormStateFromUser = (
  user: ReturnType<typeof useCurrentUser>["data"]
): ProfileFormState => {
  return {
    nickname: user?.nickname ?? "",
    birthYear: user?.birthYear ? String(user.birthYear) : "",
    gender: user?.gender ?? "",
    address: user?.address ?? "",
    profileImagePreview: user?.profileImageUrl ?? null,
    uploadedProfileImageUrl: user?.profileImageUrl ?? null,
    removeProfileImage: false,
  };
};

export default function MyPage() {
  const router = useRouter();
  const { data: currentUser, isLoading: isUserLoading } = useCurrentUser();

  const queryClient = useQueryClient();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formState, setFormState] = useState<ProfileFormState | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const previewObjectUrlRef = useRef<string | null>(null);
  const clearPreviewObjectUrl = useCallback(() => {
    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(previewObjectUrlRef.current);
      previewObjectUrlRef.current = null;
    }
  }, []);
  const setPreviewObjectUrl = useCallback((nextUrl: string | null) => {
    if (
      previewObjectUrlRef.current &&
      previewObjectUrlRef.current !== nextUrl
    ) {
      URL.revokeObjectURL(previewObjectUrlRef.current);
    }
    previewObjectUrlRef.current = nextUrl;
  }, []);

  useEffect(() => {
    const syncAuthState = () => {
      setIsAuthenticated(tokenStorage.isAuthenticated());
    };

    syncAuthState();
    setHasCheckedAuth(true);

    window.addEventListener("storage", syncAuthState);
    return () => window.removeEventListener("storage", syncAuthState);
  }, []);

  useEffect(() => {
    return () => {
      clearPreviewObjectUrl();
    };
  }, [clearPreviewObjectUrl]);

  const updateProfile = useUpdateUserProfile({
    onSuccess: () => {
      setIsEditOpen(false);
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
      clearPreviewObjectUrl();
      setFormState(null);
      setImageError(null);
    },
  });

  const primaryBadge = useMemo(() => {
    return currentUser?.badges?.find((badge) => badge.unlocked) ?? null;
  }, [currentUser?.badges]);

  const levelLabel = currentUser?.level
    ? `Lv.${currentUser.level}`
    : "새싹 회원";

  const handleOpenEdit = () => {
    if (!currentUser) return;
    clearPreviewObjectUrl();
    setImageError(null);
    setIsUploadingImage(false);
    setFormState(createFormStateFromUser(currentUser));
    setIsEditOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
    setFormState(null);
    clearPreviewObjectUrl();
    setImageError(null);
    setIsUploadingImage(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleGenderChange = (value: string) => {
    const mappedValue =
      value === "none" ? "" : (value as "male" | "female" | "");
    setFormState((prev) => (prev ? { ...prev, gender: mappedValue } : prev));
  };

  const handleProfileImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    console.log("Selected file:", file);
    if (!file) {
      return;
    }

    setImageError(null);

    const baseState = createFormStateFromUser(currentUser);
    const previousState = formState ?? baseState;
    const objectUrl = URL.createObjectURL(file);
    setPreviewObjectUrl(objectUrl);

    setFormState((prev) =>
      prev
        ? {
            ...prev,
            profileImagePreview: objectUrl,
            uploadedProfileImageUrl: prev.uploadedProfileImageUrl,
            removeProfileImage: false,
          }
        : {
            ...baseState,
            profileImagePreview: objectUrl,
            removeProfileImage: false,
          }
    );
    console.log("objectUrl", objectUrl);

    setIsUploadingImage(true);

    try {
      const presignedResponse = await missionsApi.getUploadPresignedUrl({
        fileName: file.name,
        fileType: file.type || "image/jpeg",
      });

      console.log("presignedResponse", presignedResponse);

      clearPreviewObjectUrl();
      setFormState((prev) =>
        prev
          ? {
              ...prev,
              profileImagePreview: presignedResponse.data.fileUrl,
              uploadedProfileImageUrl: presignedResponse.data.uploadUrl,
              removeProfileImage: false,
            }
          : prev
      );
    } catch (error) {
      console.error("Failed to upload profile image", error);
      setImageError(
        error instanceof Error
          ? error.message
          : "이미지를 업로드하지 못했습니다."
      );
      clearPreviewObjectUrl();
      setFormState({ ...previousState });
    } finally {
      setIsUploadingImage(false);
      event.currentTarget.value = "";
    }
  };

  console.log("formState", formState);

  const handleRemoveProfileImage = () => {
    clearPreviewObjectUrl();
    setImageError(null);
    setFormState((prev) =>
      prev
        ? {
            ...prev,
            profileImagePreview: null,
            uploadedProfileImageUrl: null,
            removeProfileImage: true,
          }
        : prev
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formState) return;

    if (isUploadingImage) {
      setImageError(
        "이미지 업로드가 진행 중입니다. 잠시 후 다시 시도해주세요."
      );
      return;
    }

    setImageError(null);

    const profileImageUrl = formState.removeProfileImage
      ? undefined
      : formState.uploadedProfileImageUrl ??
        currentUser?.profileImageUrl ??
        undefined;

    try {
      await updateProfile.mutateAsync({
        nickname: formState.nickname.trim() || currentUser?.nickname || "",
        birthYear:
          Number(formState.birthYear) ||
          currentUser?.birthYear ||
          new Date().getFullYear(),
        gender: (formState.gender || currentUser?.gender || "female") as
          | "male"
          | "female",
        address: formState.address || currentUser?.address || "",
        profileImageUrl,
      });
    } catch (error) {
      console.error("Failed to update profile", error);
      setImageError(
        error instanceof Error
          ? error.message
          : "프로필 정보를 업데이트하지 못했습니다."
      );
    }
  };

  if (!hasCheckedAuth || isUserLoading) {
    return (
      <div className="space-y-6 pb-10">
        <AppHeader
          showBackButton
          title="마이 페이지"
          onBackClick={() => router.back()}
        />
        <div className="flex min-h-[200px] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="space-y-6 pb-10">
        <AppHeader
          showBackButton
          title="마이 페이지"
          onBackClick={() => router.back()}
        />
        <LoginRequired className="mx-auto max-w-md" redirectTo="/my-page" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="space-y-6 pb-10">
        <AppHeader
          showBackButton
          title="마이 페이지"
          onBackClick={() => router.back()}
        />
        <div className="rounded-md border border-dashed bg-muted/20 p-6 text-sm text-muted-foreground">
          사용자 정보를 불러오지 못했습니다.
        </div>
      </div>
    );
  }

  const displayName = currentUser.nickname || "친환경 여행자";
  const displayAddress = currentUser.address || "등록된 주소가 없습니다.";
  const displayLevel = levelLabel;
  const profileImagePreview = formState
    ? formState.removeProfileImage
      ? null
      : formState.profileImagePreview ?? currentUser.profileImageUrl ?? null
    : currentUser.profileImageUrl ?? null;

  return (
    <div className="space-y-6 pb-10">
      <AppHeader
        showBackButton
        title="마이 페이지"
        onBackClick={() => router.back()}
      />

      <Card>
        <CardContent className="space-y-6 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <ProfileAvatar
                name={displayName}
                profileImageUrl={profileImagePreview}
              />
              <div className="space-y-1">
                <p className="text-lg font-semibold text-gray-900">
                  {displayName}
                </p>
                <p className="text-sm text-muted-foreground">{displayLevel}</p>
                {primaryBadge ? (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{primaryBadge.icon}</span>
                    <span>대표 배지</span>
                  </div>
                ) : null}
                <p className="text-xs text-muted-foreground">
                  {displayAddress}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleOpenEdit}
                aria-label="프로필 편집"
              >
                <PenSquare className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/my-page/share-history")}
                aria-label="공유 페이지로 이동"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button
            className="w-full"
            variant="secondary"
            onClick={() => router.push("/my-page/histories")}
          >
            나의 인증 조회
          </Button>
        </CardContent>
      </Card>

      <Dialog
        open={isEditOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleCloseEdit();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>프로필 정보 수정</DialogTitle>
            <DialogDescription>
              기본 정보를 업데이트하면 나의 활동 카드에도 반영됩니다.
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="nickname">닉네임</Label>
              <Input
                id="nickname"
                name="nickname"
                value={formState?.nickname ?? ""}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="birthYear">출생년도</Label>
                <Input
                  id="birthYear"
                  name="birthYear"
                  inputMode="numeric"
                  value={formState?.birthYear ?? ""}
                  onChange={handleInputChange}
                  placeholder="예: 1995"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">성별</Label>
                <Select
                  value={
                    formState
                      ? formState.gender
                        ? formState.gender
                        : "none"
                      : "none"
                  }
                  onValueChange={handleGenderChange}
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">여성</SelectItem>
                    <SelectItem value="male">남성</SelectItem>
                    <SelectItem value="none">선택 없음</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">거주 지역</Label>
              <Input
                id="address"
                name="address"
                value={formState?.address ?? ""}
                onChange={handleInputChange}
                placeholder="예: 서울특별시"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profileImageUpload">프로필 이미지</Label>
              <div className="flex items-center gap-4">
                <ProfileAvatar
                  name={formState?.nickname || displayName}
                  profileImageUrl={profileImagePreview}
                />
                <div className="space-y-2 text-xs text-muted-foreground">
                  <Input
                    id="profileImageUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    disabled={isUploadingImage}
                  />
                  <p>
                    이미지를 선택하면 미리보기가 업데이트됩니다.
                    {isUploadingImage ? " (업로드 중...)" : ""}
                  </p>
                </div>
              </div>
              {formState &&
              !formState.removeProfileImage &&
              (formState.profileImagePreview || currentUser.profileImageUrl) ? (
                <Button
                  type="button"
                  variant="ghost"
                  className="mt-2 w-full"
                  onClick={handleRemoveProfileImage}
                  disabled={isUploadingImage}
                >
                  이미지 제거
                </Button>
              ) : null}

              {imageError ? (
                <p className="text-xs text-destructive">{imageError}</p>
              ) : null}
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="ghost" onClick={handleCloseEdit}>
                취소
              </Button>
              <Button
                type="submit"
                disabled={updateProfile.isPending || isUploadingImage}
              >
                {updateProfile.isPending || isUploadingImage ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> 저장 중...
                  </span>
                ) : (
                  "변경사항 저장"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ProfileAvatar({
  name,
  profileImageUrl,
}: {
  name: string;
  profileImageUrl?: string | null;
}) {
  const initial = name.trim().charAt(0).toUpperCase() || "U";

  if (profileImageUrl) {
    return (
      <div
        className="h-16 w-16 rounded-full border bg-cover bg-center"
        style={{ backgroundImage: `url(${profileImageUrl})` }}
      />
    );
  }

  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-full border bg-muted text-lg font-semibold">
      {initial}
    </div>
  );
}
